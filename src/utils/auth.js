// ============================================================
// 用户认证与云端数据操作模块
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 简单密码哈希（SHA-256）
// ============================================================
const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'diet-tracker-salt-2026')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ============================================================
// 注册新用户
// ============================================================
export const registerUser = async (username, password, profile = {}) => {
  const db = getDb()
  if (!db) throw new Error('云开发未初始化')

  // 检查用户名是否已存在
  const existing = await db.collection('users').where({ username }).get()
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
  const db = getDb()
  if (!db) throw new Error('云开发未初始化')

  const result = await db.collection('users').where({ username }).get()
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
  const db = getDb()
  if (!db) throw new Error('云开发未初始化')

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
// 搜索用户（用于添加好友
// ============================================================
export const searchUsers = async (keyword) => {
  const db = getDb()
  if (!db) throw new Error('云开发未初始化')

  // 模糊搜索用户名
  const result = await db.collection('users').get()
  if (!result.data) return []

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


