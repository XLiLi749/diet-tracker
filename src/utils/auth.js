// ============================================================
// 用户认证与云端数据操作模块
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 密码哈希（统一使用兼容方案，确保手机/电脑都能登录）
// 历史老用户（SHA-256）登录时自动升级为兼容哈希
// ============================================================

// 兼容哈希（所有浏览器/设备都支持）
const fallbackHash = (password) => {
  const salted = password + 'diet-tracker-salt-2026'
  let hash = 0
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return 'fb_' + Math.abs(hash).toString(16).padStart(16, '0') + '_' + salted.length.toString(16)
}

// SHA-256 哈希（仅用于兼容历史老用户）
const sha256Hash = async (password) => {
  const salted = password + 'diet-tracker-salt-2026'
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(salted)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      console.warn('SHA-256 加密失败:', e)
    }
  }
  return null
}

// 注册时：始终使用兼容哈希（确保任何设备都能登录）
const hashPassword = async (password) => {
  return fallbackHash(password)
}

// 登录时：同时尝试兼容哈希 + SHA-256（兼容老用户）
// 返回 { ok: boolean, needUpgrade: boolean }
const verifyPassword = async (password, storedHash) => {
  const fb = fallbackHash(password)
  if (fb === storedHash) return { ok: true, needUpgrade: false }

  const sha = await sha256Hash(password)
  if (sha && sha === storedHash) return { ok: true, needUpgrade: true }

  return { ok: false, needUpgrade: false }
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
  const verifyResult = await verifyPassword(password, user.password)

  if (!verifyResult.ok) {
    throw new Error('密码错误')
  }

  // 如果是老的 SHA-256 用户，自动升级为兼容哈希（确保手机端也能登录）
  if (verifyResult.needUpgrade) {
    try {
      const newHash = await hashPassword(password)
      await db.collection('users').doc(user._id).update({
        password: newHash,
      })
      console.log('密码哈希已升级为兼容方案')
    } catch (e) {
      console.warn('密码哈希升级失败（不影响登录）:', e)
    }
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

// ============================================================
// 管理员：获取所有注册用户
// ============================================================
export const getAllUsersForAdmin = async () => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化')

  let result
  try {
    result = await db.collection('users').limit(1000).get()
  } catch (e) {
    console.error('获取用户列表失败:', e)
    throw new Error('获取用户列表失败，请检查数据库权限')
  }

  const users = result.data || []
  return users.map(u => ({
    userId: u.userId,
    username: u.username,
    profile: u.profile,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
  }))
}
