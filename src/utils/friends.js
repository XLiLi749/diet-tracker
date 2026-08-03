// ============================================================
// 好友系统：添加/同意/拒绝好友
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 发送好友请求
// ============================================================
export const sendFriendRequest = async (fromUserId, fromUsername, toUserId, toUsername) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 检查是否已经是好友或已有请求（双向检查）
  const existing = await db.collection('friendships')
    .where({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    }).get()

  if (existing.data && existing.data.length > 0) {
    const fs = existing.data[0]
    if (fs.status === 'accepted') throw new Error('你们已经是好友了')
    if (fs.status === 'pending') {
      if (fs.fromUserId === fromUserId) {
        throw new Error('已发送过好友请求，等待对方同意')
      } else {
        throw new Error('对方已向你发送好友请求，请去「请求」中处理')
      }
    }
  }

  const result = await db.collection('friendships').add({
    fromUserId,
    fromUsername,
    toUserId,
    toUsername,
    status: 'pending', // pending | accepted | rejected
    createdAt: new Date().toISOString(),
  })
  return result.id
}

// ============================================================
// 处理好友请求（同意/拒绝）
// ============================================================
export const handleFriendRequest = async (friendshipId, accept) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  await db.collection('friendships').doc(friendshipId).update({
    status: accept ? 'accepted' : 'rejected',
    handledAt: new Date().toISOString(),
  })
  return true
}

// ============================================================
// 获取我的好友列表
// ============================================================
export const getMyFriends = async (userId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 腾讯云数据库对 $or 支持有限，改为两次查询再合并
  let result1 = { data: [] }
  let result2 = { data: [] }
  try {
    result1 = await db.collection('friendships')
      .where({ fromUserId: userId, status: 'accepted' })
      .get()
  } catch (e) {
    console.warn('查询发起的好友关系失败:', e)
  }
  try {
    result2 = await db.collection('friendships')
      .where({ toUserId: userId, status: 'accepted' })
      .get()
  } catch (e) {
    console.warn('查询接收的好友关系失败:', e)
  }

  const all = [...(result1.data || []), ...(result2.data || [])]

  const friends = []
  const seenIds = new Set()
  for (const fs of all) {
    // 判断好友是哪一方
    const friendId = String(fs.fromUserId) === String(userId) ? fs.toUserId : fs.fromUserId
    if (seenIds.has(friendId)) continue
    seenIds.add(friendId)
    // 查好友信息
    try {
      const userResult = await db.collection('users').where({ userId: friendId }).get()
      if (userResult.data && userResult.data.length > 0) {
        const u = userResult.data[0]
        friends.push({
          userId: u.userId,
          username: u.username,
          profile: u.profile,
        })
      }
    } catch (e) {
      console.warn('查询好友信息失败:', e)
    }
  }
  return friends
}

// ============================================================
// 获取发给我的好友请求
// ============================================================
export const getIncomingRequests = async (userId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const result = await db.collection('friendships')
    .where({ toUserId: userId, status: 'pending' })
    .get()

  return result.data || []
}

// ============================================================
// 解除好友关系
// ============================================================
export const removeFriend = async (userId, friendId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const result = await db.collection('friendships')
    .where({
      $or: [
        { fromUserId: userId, toUserId: friendId },
        { fromUserId: friendId, toUserId: userId },
      ],
    }).get()

  if (result.data && result.data.length > 0) {
    await db.collection('friendships').doc(result.data[0]._id).remove()
  }
  return true
}
