// ============================================================
// 动态墙：饮食记录分享、点赞、评论
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 发布饮食动态
// ============================================================
export const postFeed = async (userId, username, content, records = [], shareType = 'friends') => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 汇总今日热量
  const totalCalories = records.reduce((sum, r) => sum + (r.calories || 0), 0)
  const totalProtein = records.reduce((sum, r) => sum + (r.protein || 0), 0)

  const result = await db.collection('feed_records').add({
    userId,
    username,
    content,
    records: records.map(r => ({
      name: r.name,
      calories: r.calories,
      protein: r.protein,
      quantity: r.quantity,
      mealType: r.mealType,
    })),
    summary: {
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein),
      mealCount: records.length,
    },
    shareType, // friends | public
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  })
  return result.id
}

// ============================================================
// 获取好友动态（含自己的）
// ============================================================
export const getFriendFeed = async (myUserId, friendIds = []) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const allUserIds = [myUserId, ...friendIds]

  // 先取最近 50 条，再过滤
  const result = await db.collection('feed_records')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()

  if (!result.data) return []

  return result.data
    .filter(f => allUserIds.includes(f.userId))
    .map(f => ({
      id: f._id,
      ...f,
    }))
}

// ============================================================
// 点赞/取消点赞
// ============================================================
export const toggleLike = async (feedId, userId, username) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const feed = await db.collection('feed_records').doc(feedId).get()
  if (!feed.data) throw new Error('动态不存在')

  const likes = feed.data.likes || []
  const idx = likes.findIndex(l => l.userId === userId)

  if (idx >= 0) {
    likes.splice(idx, 1)
  } else {
    likes.push({ userId, username, at: new Date().toISOString() })
  }

  await db.collection('feed_records').doc(feedId).update({ likes })
  return likes.length
}

// ============================================================
// 添加评论
// ============================================================
export const addComment = async (feedId, userId, username, text) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const feed = await db.collection('feed_records').doc(feedId).get()
  if (!feed.data) throw new Error('动态不存在')

  const comments = feed.data.comments || []
  comments.push({
    userId,
    username,
    text,
    at: new Date().toISOString(),
  })

  await db.collection('feed_records').doc(feedId).update({ comments })
  return comments
}

// ============================================================
// 删除动态
// ============================================================
export const deleteFeed = async (feedId, userId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const feed = await db.collection('feed_records').doc(feedId).get()
  if (!feed.data || feed.data.userId !== userId) {
    throw new Error('没有权限删除')
  }

  await db.collection('feed_records').doc(feedId).remove()
  return true
}

// ============================================================
// 获取好友每日统计（用于对比）
// ============================================================
export const getFriendDailyStats = async (friendIds, date) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 从动态中找当日发布的内容
  const dateStr = date || new Date().toISOString().slice(0, 10)
  const result = await db.collection('feed_records')
    .orderBy('createdAt', 'desc')
    .limit(100)
    .get()

  if (!result.data) return []

  return result.data
    .filter(f =>
      friendIds.includes(f.userId) &&
      f.createdAt &&
      f.createdAt.startsWith(dateStr)
    )
    .map(f => ({
      userId: f.userId,
      username: f.username,
      totalCalories: f.summary?.totalCalories || 0,
      totalProtein: f.summary?.totalProtein || 0,
      mealCount: f.summary?.mealCount || 0,
    }))
}
