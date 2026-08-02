// ============================================================
// 动态墙：饮食记录分享、点赞、评论
// 点赞和评论使用独立集合（feed_likes / feed_comments），
// 因为 feed_records 是「仅创建者可修改」，无法给别人点赞
// ============================================================

import { getDb } from './cloudbase'

// ============================================================
// 发布饮食动态
// ============================================================
export const postFeed = async (userId, username, content, records = [], shareType = 'friends', extra = {}) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

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
    shareType,
    goalReached: extra.goalReached || null,     // 是否达成目标
    targetCalories: extra.targetCalories || null, // 目标热量
    createdAt: new Date().toISOString(),
  })
  return result.id
}

// ============================================================
// 获取好友动态（含自己的），聚合点赞数和评论数
// ============================================================
export const getFriendFeed = async (myUserId, friendIds = []) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  const allUserIds = [myUserId, ...friendIds]

  const result = await db.collection('feed_records')
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get()

  if (!result.data) return []

  const feeds = result.data.filter(f => allUserIds.includes(f.userId))

  // 批量获取所有动态的点赞和评论
  const feedIds = feeds.map(f => f._id)
  let allLikes = []
  let allComments = []

  try {
    const likesResult = await db.collection('feed_likes').get()
    if (likesResult.data) allLikes = likesResult.data
  } catch (e) {
    console.warn('获取点赞失败:', e)
  }

  try {
    const commentsResult = await db.collection('feed_comments').get()
    if (commentsResult.data) allComments = commentsResult.data
  } catch (e) {
    console.warn('获取评论失败:', e)
  }

  // 按 feedId 分组
  const likesMap = {}
  allLikes.forEach(l => {
    if (!likesMap[l.feedId]) likesMap[l.feedId] = []
    likesMap[l.feedId].push(l)
  })

  const commentsMap = {}
  allComments.forEach(c => {
    if (!commentsMap[c.feedId]) commentsMap[c.feedId] = []
    commentsMap[c.feedId].push(c)
  })

  return feeds.map(f => ({
    id: f._id,
    ...f,
    likes: likesMap[f._id] || [],
    comments: (commentsMap[f._id] || []).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  }))
}

// ============================================================
// 点赞/取消点赞（使用独立集合 feed_likes
// ============================================================
export const toggleLike = async (feedId, userId, username) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  // 查找是否已点赞
  let existing
  try {
    const result = await db.collection('feed_likes')
      .where({ feedId, userId })
      .get()
    existing = result.data && result.data[0]
  } catch (e) {
    console.warn('查询点赞失败:', e)
  }

  if (existing) {
    // 取消点赞
    try {
      await db.collection('feed_likes').doc(existing._id).remove()
      return (await getLikeCount(feedId))
    } catch (e) {
      console.error('取消点赞失败:', e)
      throw new Error('取消点赞失败，请检查 feed_likes 集合权限')
    }
  } else {
    // 点赞
    try {
      await db.collection('feed_likes').add({
        feedId,
        userId,
        username,
        createdAt: new Date().toISOString(),
      })
      return (await getLikeCount(feedId)) + 1
    } catch (e) {
      console.error('点赞失败:', e)
      throw new Error('点赞失败，请检查 feed_likes 集合权限')
    }
  }
}

const getLikeCount = async (feedId) => {
  const db = await getDb()
  try {
    const result = await db.collection('feed_likes').where({ feedId }).get()
    return result.data ? result.data.length : 0
  } catch {
    return 0
  }
}

// ============================================================
// 添加评论（使用独立集合 feed_comments
// ============================================================
export const addComment = async (feedId, userId, username, text) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  try {
    await db.collection('feed_comments').add({
      feedId,
      userId,
      username,
      text,
      createdAt: new Date().toISOString(),
    })
    // 返回该 feed 的所有评论
    const result = await db.collection('feed_comments').where({ feedId }).get()
    return (result.data || []).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  } catch (e) {
    console.error('评论失败:', e)
    throw new Error('评论失败，请检查 feed_comments 集合权限')
  }
}

// ============================================================
// 删除动态（仅创建者可删除
// ============================================================
export const deleteFeed = async (feedId, userId) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

  let feed
  try {
    feed = await db.collection('feed_records').doc(feedId).get()
  } catch (e) {
    console.error('获取动态失败:', e)
    throw new Error('获取动态失败，请检查 feed_records 集合权限')
  }

  if (!feed.data) {
    throw new Error('动态不存在或已被删除')
  }

  console.log('删除校验：动态userId=' + feed.data.userId + '，当前userId=' + userId)

  if (feed.data.userId !== userId) {
    throw new Error('没有权限删除（这条动态不是你发布的）')
  }

  try {
    await db.collection('feed_records').doc(feedId).remove()
  } catch (e) {
    console.error('删除动态失败:', e)
    throw new Error('删除失败，请检查 feed_records 集合权限')
  }

  // 同时删除相关的点赞和评论
  try {
    const likes = await db.collection('feed_likes').where({ feedId }).get()
    if (likes.data) {
      for (const l of likes.data) {
        await db.collection('feed_likes').doc(l._id).remove()
      }
    }
    const comments = await db.collection('feed_comments').where({ feedId }).get()
    if (comments.data) {
      for (const c of comments.data) {
        await db.collection('feed_comments').doc(c._id).remove()
      }
    }
  } catch (e) {
    console.warn('清理点赞评论失败:', e)
  }
  return true
}

// ============================================================
// 获取好友每日统计（用于对比）
// ============================================================
export const getFriendDailyStats = async (friendIds, date) => {
  const db = await getDb()
  if (!db) throw new Error('云开发未初始化，请检查网络或稍后重试')

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
      goalReached: f.goalReached,
    }))
}
