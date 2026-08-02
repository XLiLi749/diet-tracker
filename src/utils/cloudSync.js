// ============================================================
// 云端数据同步模块
// 将本地饮食记录、手账、身体数据等同步到腾讯云数据库
// 实现多设备间数据互通
// ============================================================

import { getDb } from './cloudbase'

const COLLECTION = 'user_sync_data'
const SYNC_DEBOUNCE_MS = 2000 // 2秒防抖，避免频繁写入

// 需要同步的字段
export const SYNC_FIELDS = [
  'profile',
  'foodLogs',
  'bodyRecords',
  'tastePreferences',
  'journals',
  'favorites',
  'customFoods',
]

// 防抖定时器
let pushTimer = null
let pendingPush = null

// ============================================================
// 推送本地数据到云端（防抖）
// ============================================================
export const pushToCloud = async (userId, state) => {
  if (!userId) return

  const syncData = {}
  SYNC_FIELDS.forEach(field => {
    syncData[field] = state[field]
  })

  // 防抖：2秒内多次调用只执行最后一次
  pendingPush = { userId, syncData }

  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(async () => {
    if (!pendingPush) return
    const { userId: uid, syncData: data } = pendingPush
    pendingPush = null

    try {
      await doPush(uid, data)
    } catch (e) {
      console.warn('云端同步失败:', e)
    }
  }, SYNC_DEBOUNCE_MS)
}

// 实际执行推送
const doPush = async (userId, syncData) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化')

  const now = new Date().toISOString()

  // 查找用户是否已有同步记录
  let existing
  try {
    existing = await db.collection(COLLECTION).where({ userId }).get()
  } catch (e) {
    // 集合可能还不存在，先尝试创建
    console.warn('查询同步数据失败，尝试新建:', e)
    existing = { data: [] }
  }

  if (existing.data && existing.data.length > 0) {
    // 更新已有记录
    const docId = existing.data[0]._id
    await db.collection(COLLECTION).doc(docId).update({
      ...syncData,
      updatedAt: now,
    })
  } else {
    // 新建记录
    await db.collection(COLLECTION).add({
      userId,
      ...syncData,
      createdAt: now,
      updatedAt: now,
    })
  }

  // 保存最后同步时间
  try {
    localStorage.setItem(`cloud_sync_time_${userId}`, now)
  } catch (e) {}
}

// ============================================================
// 立即推送（用于退出登录等场景）
// ============================================================
export const flushPush = async (userId, state) => {
  if (pushTimer) {
    clearTimeout(pushTimer)
    pushTimer = null
  }
  if (pendingPush) {
    const { userId: uid, syncData } = pendingPush
    pendingPush = null
    try {
      await doPush(uid, syncData)
    } catch (e) {
      console.warn('强制同步失败:', e)
    }
    return
  }
  // 没有待推送的，也推一次最新的
  if (userId && state) {
    const syncData = {}
    SYNC_FIELDS.forEach(field => {
      syncData[field] = state[field]
    })
    try {
      await doPush(userId, syncData)
    } catch (e) {}
  }
}

// ============================================================
// 从云端拉取数据
// ============================================================
export const pullFromCloud = async (userId) => {
  if (!userId) return null

  const db = await getDb()
  if (!db) return null

  try {
    const result = await db.collection(COLLECTION).where({ userId }).get()
    if (result.data && result.data.length > 0) {
      return result.data[0]
    }
  } catch (e) {
    console.warn('拉取云端数据失败:', e)
  }
  return null
}

// ============================================================
// 获取本地最后同步时间
// ============================================================
export const getLastLocalSyncTime = (userId) => {
  try {
    return localStorage.getItem(`cloud_sync_time_${userId}`) || null
  } catch (e) {
    return null
  }
}
