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

  const fromUid = String(fromUserId)
  const toUid = String(toUserId)

  // 检查是否已经是好友或已有请求（拉取全量数据，客户端判断，避免类型不匹配）
  let all = []
  try {
    const r = await db.collection('friendships').get()
    all = r.data || []
  } catch (e) {
    console.warn('查询好友关系失败:', e)
  }

  const existing = all.find(fs =>
    (String(fs.fromUserId) === fromUid && String(fs.toUserId) === toUid) ||
    (String(fs.fromUserId) === toUid && String(fs.toUserId) === fromUid)
  )

  if (existing) {
    if (existing.status === 'accepted') throw new Error('你们已经是好友了')
    if (existing.status === 'pending') {
      if (String(existing.fromUserId) === fromUid) {
        throw new Error('已发送过好友请求，等待对方同意')
      } else {
        throw new Error('对方已向你发送好友请求，请去「请求」中处理')
      }
    }
  }

  const result = await db.collection('friendships').add({
    fromUserId: fromUid,
    fromUsername,
    toUserId: toUid,
    toUsername,
    status: 'pending',
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

  console.log('[处理好友请求] friendshipId=' + friendshipId + ', accept=' + accept)
  try {
    await db.collection('friendships').doc(friendshipId).update({
      status: accept ? 'accepted' : 'rejected',
      handledAt: new Date().toISOString(),
    })
    console.log('[处理好友请求] 成功')
    return true
  } catch (e) {
    console.error('[处理好友请求] 失败:', e)
    console.error('[处理好友请求] 请检查腾讯云控制台 friendships 集合权限：应设置为「所有用户可读，仅创建者可写」或「所有用户可读写」')
    throw new Error('操作失败：' + (e.message || '权限不足，请检查数据库权限设置'))
  }
}

// ============================================================
// 获取我的好友列表
// ============================================================
export const getMyFriends = async (userId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')
  const uid = String(userId)

  // 拉取全量好友关系，客户端过滤（避免where查询类型不匹配）
  let allFriendships = []
  try {
    const r = await db.collection('friendships').get()
    allFriendships = r.data || []
  } catch (e) {
    console.warn('查询好友关系失败:', e)
  }

  // 客户端过滤：accepted 状态，且当前用户是其中一方
  const friends = []
  const seenIds = new Set()
  for (const fs of allFriendships) {
    if (fs.status !== 'accepted') continue
    const fromMatch = String(fs.fromUserId) === uid
    const toMatch = String(fs.toUserId) === uid
    if (!fromMatch && !toMatch) continue

    const friendId = fromMatch ? fs.toUserId : fs.fromUserId
    if (seenIds.has(String(friendId))) continue
    seenIds.add(String(friendId))

    try {
      const userResult = await db.collection('users').where({ userId: String(friendId) }).get()
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
  const uid = String(userId)

  // 拉取全量数据，客户端过滤（避免where查询类型不匹配）
  let all = []
  try {
    const r = await db.collection('friendships').get()
    all = r.data || []
  } catch (e) {
    console.warn('查询好友请求失败:', e)
  }

  return all.filter(r =>
    r.status === 'pending' && String(r.toUserId) === uid
  )
}

// ============================================================
// 解除好友关系
// ============================================================
export const removeFriend = async (userId, friendId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')
  const uid = String(userId)
  const fid = String(friendId)

  // 拉取全量数据，客户端找目标
  let all = []
  try {
    const r = await db.collection('friendships').get()
    all = r.data || []
  } catch (e) {
    console.warn('查询好友关系失败:', e)
  }

  const target = all.find(fs =>
    (String(fs.fromUserId) === uid && String(fs.toUserId) === fid) ||
    (String(fs.fromUserId) === fid && String(fs.toUserId) === uid)
  )

  if (target) {
    await db.collection('friendships').doc(target._id).remove()
  }
  return true
}
