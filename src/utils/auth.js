// ============================================================
// 用户认证与云端数据操作模块
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 密码哈希（优先 SHA-256，不支持时降级为简单哈希）
// ============================================================
const hashPassword = async (password) => {
  const salted = password + 'diet-tracker-salt-2026'

  // 优先使用浏览器原生 SHA-256
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(salted)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      console.warn('SHA-256 加密失败，使用降级方案:', e)
    }
  }

  // 降级方案：简单的字符串哈希（兼容所有浏览器）
  let hash = 0
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  // 转换成固定长度的十六进制字符串
  return 'fallback_' + Math.abs(hash).toString(16).padStart(16, '0') + '_' + salted.length.toString(16)
}

// ============================================================
// 注册新用户
// ============================================================
export const registerUser = async (username, password, profile = {}) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 检查用户名是否已存在
  let existing
  try {
    existing = await db.collection('users').where({ username }).get()
  } catch (e) {
    console.error('查询用户失败:', e)
    throw new Error('数据库连接失败，请检查腾讯云配置或稍后重试')
  }
  if (existing.data && existing.data.length > 0) {
    throw new Error('该昵称已被使用，请换一个')
  }

  const hashedPwd = await hashPassword(password)
  const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)

  const userDoc = {
    userId,
    username,
    password: hashedPwd,
    profile: {
      height: profile.height || 165,
      weight: profile.weight || 55,
      age: profile.age || 20,
      gender: profile.gender || '女',
      activityLevel: profile.activityLevel || 'light',
      goal: profile.goal || 'maintain',
      targetWeight: profile.targetWeight || profile.weight || 55,
      ...profile,
    },
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }

  const result = await db.collection('users').add(userDoc)
  return { userId, username, profile: userDoc.profile, docId: result.id }
}

// ============================================================
// 登录
// ============================================================
export const loginUser = async (username, password) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  let result
  try {
    result = await db.collection('users').where({ username }).get()
  } catch (e) {
    console.error('登录查询失败:', e)
    throw new Error('数据库连接失败，请检查网络或稍后重试')
  }
  if (!result.data || result.data.length === 0) {
    throw new Error('用户不存在')
  }

  const user = result.data[0]
  const hashedPwd = await hashPassword(password)

  if (user.password !== hashedPwd) {
    throw new Error('密码错误')
  }

  // 更新最后登录时间
  await db.collection('users').doc(user._id).update({
    lastLoginAt: new Date().toISOString(),
  })

  return {
    userId: user.userId,
    username: user.username,
    profile: user.profile,
    docId: user._id,
  }
}

// ============================================================
// 更新用户资料
// ============================================================
export const updateUserProfile = async (userId, profile) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const result = await db.collection('users').where({ userId }).get()
  if (!result.data || result.data.length === 0) throw new Error('用户不存在')

  const docId = result.data[0]._id
  await db.collection('users').doc(docId).update({
    profile,
    updatedAt: new Date().toISOString(),
  })
  return true
}

// ============================================================
// 搜索用户（用于添加好友）
// ============================================================
export const searchUsers = async (keyword) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 模糊搜索用户名
  let result
  try {
    result = await db.collection('users').get()
  } catch (e) {
    console.error('搜索用户失败:', e)
    throw new Error('搜索失败，请检查数据库权限设置（users 集合需允许所有登录用户读取）')
  }
  if (!result.data || result.data.length === 0) return []

  const kw = keyword.toLowerCase().trim()
  return result.data
    .filter(u => u.username.toLowerCase().includes(kw))
    .map(u => ({
      userId: u.userId,
      username: u.username,
      profile: u.profile,
    }))
    .slice(0, 20)
}

// ============================================================
// 本地保存登录状态
// ============================================================
const STORAGE_KEY = 'diet_tracker_current_user'

export const saveLoginState = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const getLoginState = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

export const clearLoginState = () => {
  localStorage.removeItem(STORAGE_KEY)
}
