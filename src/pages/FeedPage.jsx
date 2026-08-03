import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { getLoginState } from '../utils/auth'
import { getMyFriends } from '../utils/friends'
import {
  getFriendFeed,
  postFeed,
  toggleLike,
  addComment,
  deleteFeed,
} from '../utils/feed'
import { checkGoalAchieved, calcGoalStreak } from '../utils/goalCheck'
import useStore from '../store'

export default function FeedPage() {
  const navigate = useNavigate()
  const profile = useStore(s => s.profile)
  const targets = useStore(s => s.targets)
  const [currentUser, setCurrentUser] = useState(null)
  const [feeds, setFeeds] = useState([])
  const [friendIds, setFriendIds] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [showGoalStatus, setShowGoalStatus] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [commentMap, setCommentMap] = useState({}) // feedId -> input value
  const [showComments, setShowComments] = useState({}) // feedId -> true/false
  const [expandedFeeds, setExpandedFeeds] = useState({}) // feedId -> true/false

  // 分享弹窗状态
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareType, setShareType] = useState('diet') // diet | goal | both
  const [shareDate, setShareDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [shareWithGoal, setShareWithGoal] = useState(true)
  const [shareWithStreak, setShareWithStreak] = useState(true)
  const [shareContent, setShareContent] = useState('')
  const [hasEditedShareContent, setHasEditedShareContent] = useState(false)

  // 生成自动分享文案
  const generateAutoShareContent = () => {
    const goalInfo = getGoalInfoByDate(shareDate)
    const records = getRecordsByDate(shareDate)
    const streak = getStreakDays()
    const isToday = shareDate === dayjs().format('YYYY-MM-DD')
    const isYesterday = shareDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    const dateLabel = isToday ? '今天' : isYesterday ? '昨天' : shareDate

    if (shareType === 'goal') {
      return goalInfo.achieved
        ? `${dateLabel}完美达成${goalInfo.goalLabel}目标！🔥 已连续 ${streak} 天达成，继续保持！`
        : `${dateLabel}的${goalInfo.goalLabel}目标还未达成，明天继续加油～💪`
    }
    let base = `${dateLabel}吃了 ${records.length} 餐，共 ${goalInfo.totalCalories} kcal`
    if (shareWithGoal) {
      base += goalInfo.achieved
        ? `，完美达成${goalInfo.goalLabel}目标！🔥`
        : `，继续向${goalInfo.goalLabel}目标迈进～💪`
    } else {
      base += '，吃得很满足～'
    }
    if (shareWithStreak && streak > 0) {
      base += ` 已连续 ${streak} 天达成目标！`
    }
    return base
  }

  // 当分享选项变化时，如果用户没有手动编辑过，自动更新文案
  useEffect(() => {
    if (!hasEditedShareContent) {
      setShareContent(generateAutoShareContent())
    }
  }, [shareType, shareDate, shareWithGoal, shareWithStreak, showShareModal])

  // 打开分享弹窗时重置编辑状态
  const openShareModal = () => {
    setHasEditedShareContent(false)
    setShareContent('')
    setShowShareModal(true)
  }

  useEffect(() => {
    const user = getLoginState()
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    loadFeed(user.userId)
  }, [navigate])

  const loadFeed = async (userId) => {
    try {
      const friends = await getMyFriends(userId)
      const ids = friends.map(f => f.userId)
      setFriendIds(ids)
      const feedData = await getFriendFeed(userId, ids)
      setFeeds(feedData)
    } catch (e) {
      console.error('加载动态失败:', e)
    }
  }

  const getTodayRecords = () => getRecordsByDate(dayjs().format('YYYY-MM-DD'))

  // 按日期获取饮食记录
  const getRecordsByDate = (dateStr) => {
    try {
      const dayLogs = useStore.getState().foodLogs[dateStr] || []
      const records = []
      dayLogs.forEach(log => {
        (log.items || []).forEach(item => {
          records.push({
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            quantity: item.quantity,
            mealType: log.mealType,
          })
        })
      })
      return records
    } catch {
      return []
    }
  }

  // 计算指定日期的目标达成情况
  const getGoalInfoByDate = (dateStr) => {
    const records = getRecordsByDate(dateStr)
    const totalCalories = records.reduce((s, r) => s + (r.calories || 0), 0)
    const targetCalories = targets?.calorieTarget || 2000
    const goalType = profile?.dietGoal?.type || 'maintain'
    return checkGoalAchieved(totalCalories, targetCalories, goalType, records)
  }

  // 获取连续达成天数
  const getStreakDays = () => {
    const foodLogs = useStore.getState().foodLogs
    const targetCalories = targets?.calorieTarget || 2000
    const goalType = profile?.dietGoal?.type || 'maintain'
    return calcGoalStreak(foodLogs, targetCalories, goalType)
  }

  // 计算今日目标达成情况
  const getTodayGoalInfo = () => {
    const records = getTodayRecords()
    const totalCalories = records.reduce((s, r) => s + (r.calories || 0), 0)
    const targetCalories = targets?.dailyCalories || 2000
    const goalType = profile?.dietGoal?.type || 'maintain'
    return checkGoalAchieved(totalCalories, targetCalories, goalType, records)
  }

  // 通用发布逻辑
  const doPost = async (content, withGoal = showGoalStatus) => {
    const records = getTodayRecords()
    const goalInfo = withGoal ? getTodayGoalInfo() : null
    await postFeed(
      currentUser.userId,
      currentUser.username,
      content,
      records,
      'friends',
      withGoal ? {
        goalReached: goalInfo.achieved,
        targetCalories: goalInfo.targetCalories,
      } : {},
    )
  }

  const handlePost = async () => {
    if (!postContent.trim()) return
    setLoading(true)
    try {
      await doPost(postContent.trim(), showGoalStatus)
      setPostContent('')
      setShowPostModal(false)
      loadFeed(currentUser.userId)
      setMessage('发布成功！')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage('发布失败：' + e.message)
    } finally {
      setLoading(false)
    }
  }

  // 一键分享 → 打开分享选择弹窗
  const handleQuickPost = () => {
    setShareDate(dayjs().format('YYYY-MM-DD'))
    setShareType('diet')
    setShareWithGoal(true)
    setShareWithStreak(true)
    openShareModal()
  }

  // 执行分享发布
  const doSharePost = async () => {
    setLoading(true)
    try {
      const records = getRecordsByDate(shareDate)
      const goalInfo = getGoalInfoByDate(shareDate)
      const streak = getStreakDays()
      const isToday = shareDate === dayjs().format('YYYY-MM-DD')
      const isYesterday = shareDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      const dateLabel = isToday ? '今天' : isYesterday ? '昨天' : shareDate

      let content = shareContent.trim()
      if (!content) {
        if (shareType === 'goal') {
          // 只分享目标达成
          content = goalInfo.achieved
            ? `${dateLabel}完美达成${goalInfo.goalLabel}目标！🔥 已连续 ${streak} 天达成，继续保持！`
            : `${dateLabel}的${goalInfo.goalLabel}目标还未达成，明天继续加油～💪`
        } else {
          // 分享饮食（+ 目标达成）
          const totalCals = goalInfo.totalCalories
          let base = `${dateLabel}吃了 ${records.length} 餐，共 ${totalCals} kcal`
          if (shareWithGoal) {
            base += goalInfo.achieved
              ? `，完美达成${goalInfo.goalLabel}目标！🔥`
              : `，继续向${goalInfo.goalLabel}目标迈进～💪`
          } else {
            base += '，吃得很满足～'
          }
          if (shareWithStreak && streak > 0) {
            base += ` 已连续 ${streak} 天达成目标！`
          }
          content = base
        }
      }

      await postFeed(
        currentUser.userId,
        currentUser.username,
        content,
        records,
        'friends',
        shareWithGoal ? {
          goalReached: goalInfo.achieved,
          targetCalories: goalInfo.targetCalories,
          streakDays: streak,
          shareDate,
        } : { shareDate },
      )

      setShowShareModal(false)
      loadFeed(currentUser.userId)
      setMessage('分享成功！')
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage('发布失败：' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (feedId) => {
    try {
      await toggleLike(feedId, currentUser.userId, currentUser.username)
      loadFeed(currentUser.userId)
    } catch (e) {
      setMessage(e.message)
    }
  }

  const handleAddComment = async (feedId) => {
    const text = commentMap[feedId]
    if (!text || !text.trim()) return
    try {
      await addComment(feedId, currentUser.userId, currentUser.username, text.trim())
      setCommentMap({ ...commentMap, [feedId]: '' })
      loadFeed(currentUser.userId)
    } catch (e) {
      setMessage(e.message)
    }
  }

  const handleDelete = async (feedId) => {
    if (!confirm('确定删除这条动态吗？')) return
    try {
      await deleteFeed(feedId, currentUser.userId, currentUser.username)
      loadFeed(currentUser.userId)
    } catch (e) {
      setMessage(e.message)
    }
  }

  const formatTime = (isoStr) => {
    if (!isoStr) return ''
    const d = new Date(isoStr)
    const now = new Date()
    const diff = (now - d) / 1000
    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    return d.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pb-24">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-6 text-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🥗 好友动态</h1>
          <p className="text-amber-100 text-sm mt-1">看看好友们今天都吃了啥</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleQuickPost}
            disabled={loading}
            className="px-4 py-2 bg-white text-amber-500 rounded-xl font-medium shadow-lg disabled:opacity-50"
          >
            🚀 一键分享
          </button>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-3 py-2 bg-white/20 text-white rounded-xl font-medium"
          >
            ✏️
          </button>
        </div>
      </div>

      {/* 消息 */}
      {message && (
        <div className="mx-4 mt-4 bg-amber-100 text-amber-700 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      {/* 动态列表 */}
      <div className="p-4 space-y-4">
        {feeds.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-lg">还没有动态</p>
            <p className="text-sm mt-2">点右上角「分享」发布第一条动态吧</p>
            <p className="text-xs mt-4 text-gray-300">或者先去「好友」页面加几个好友</p>
          </div>
        ) : (
          feeds.map(feed => {
            const isLiked = (feed.likes || []).some(l => String(l.userId) === String(currentUser?.userId))
            // 双重判断：优先 userId，其次 username（兼容老数据）
            const isMineByUserId = feed.userId && String(feed.userId) === String(currentUser?.userId)
            const isMineByUsername = feed.username && currentUser?.username && feed.username === currentUser.username
            const isMine = isMineByUserId || isMineByUsername
            return (
              <div key={feed.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* 用户信息 */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center text-white font-bold">
                      {feed.username?.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium">{feed.username}</div>
                      <div className="text-xs text-gray-400">{formatTime(feed.createdAt)}</div>
                    </div>
                  </div>
                  {isMine && (
                    <button
                      onClick={() => handleDelete(feed.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      删除
                    </button>
                  )}
                </div>

                {/* 内容 */}
                <div className="px-4 pb-3">
                  <p className="text-gray-700">{feed.content}</p>
                </div>

                {/* 目标达成标识 + 连续天数 */}
                {feed.goalReached !== null && feed.goalReached !== undefined && (
                  <div className={`mx-4 mb-2 px-3 py-2 rounded-xl text-sm flex items-center gap-2 ${
                  feed.goalReached ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                }`}>
                  <span className="text-lg">{feed.goalReached ? '🏆' : '💪'}</span>
                  <div className="flex-1">
                    <span>
                      {feed.goalReached ? '热量目标已达成！' : '继续加油，向目标迈进'}
                      {feed.targetCalories && <span className="opacity-70 ml-1">（目标 {feed.targetCalories} kcal）</span>}
                    </span>
                    {feed.streakDays > 0 && (
                      <div className="text-[11px] mt-0.5 text-amber-600">
                        🔥 已连续 {feed.streakDays} 天达成目标
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* 饮食记录（支持展开/收起） */}
                {feed.records && feed.records.length > 0 && (
                  <div className="mx-4 mb-3 bg-amber-50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-amber-600 font-medium">
                        {feed.shareDate && feed.shareDate !== dayjs().format('YYYY-MM-DD')
                          ? `${feed.shareDate} 饮食`
                          : '今日饮食'}
                      </span>
                      <span className="text-xs text-gray-500">
                        共 {feed.records.length} 餐 · {feed.summary?.totalCalories || 0} kcal
                      </span>
                    </div>
                    <div className="space-y-1">
                      {(expandedFeeds[feed.id] ? feed.records : feed.records.slice(0, 5)).map((r, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{r.name}</span>
                          <span className="text-amber-600 font-medium">{r.calories} kcal</span>
                        </div>
                      ))}
                      {feed.records.length > 5 && (
                        <button
                          onClick={() => setExpandedFeeds({ ...expandedFeeds, [feed.id]: !expandedFeeds[feed.id] })}
                          className="w-full text-xs text-amber-600 text-center pt-2 font-medium hover:text-amber-700"
                        >
                          {expandedFeeds[feed.id]
                            ? '▲ 收起'
                            : `▼ 展开查看剩余 ${feed.records.length - 5} 道菜`}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* 操作栏 */}
                <div className="flex border-t">
                  <button
                    onClick={() => handleLike(feed.id)}
                    className={`flex-1 py-3 flex items-center justify-center gap-1 text-sm ${
                      isLiked ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    {isLiked ? '❤️' : '🤍'} {(feed.likes || []).length}
                  </button>
                  <button
                    onClick={() => setShowComments({ ...showComments, [feed.id]: !showComments[feed.id] })}
                    className="flex-1 py-3 flex items-center justify-center gap-1 text-sm text-gray-500"
                  >
                    💬 {(feed.comments || []).length}
                  </button>
                </div>

                {/* 评论区 */}
                {showComments[feed.id] && (
                  <div className="border-t bg-gray-50 p-3 space-y-2">
                    {(feed.comments || []).map((c, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-amber-600">{c.username}：</span>
                        <span className="text-gray-700">{c.text}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        value={commentMap[feed.id] || ''}
                        onChange={(e) => setCommentMap({ ...commentMap, [feed.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(feed.id)}
                        placeholder="说点什么..."
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleAddComment(feed.id)}
                        className="px-4 py-2 bg-amber-400 text-white rounded-lg text-sm"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 发布动态弹窗 */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center">
          <div className="w-full max-w-lg mx-auto bg-white rounded-t-3xl overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-lg font-bold">分享今日饮食</h3>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="今天吃了什么好吃的？写点什么分享给好友吧~"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none resize-none"
              />
              <div className="bg-amber-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">📋 今日记录</span>
                  <span className="font-medium text-amber-700">
                    {getTodayRecords().length} 餐 · {getTodayRecords().reduce((s, r) => s + (r.calories || 0), 0)} kcal
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">🎯 目标热量</span>
                  <span className="font-medium">
                    {getTodayGoalInfo().totalCalories} / {getTodayGoalInfo().targetCalories} kcal
                    {getTodayGoalInfo().achieved
                      ? <span className="text-green-500 ml-2">✓ 已达成</span>
                      : <span className="text-gray-400 ml-2">未达成</span>}
                  </span>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-amber-100">
                  <input
                    type="checkbox"
                    checked={showGoalStatus}
                    onChange={(e) => setShowGoalStatus(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  分享时展示是否达成今日热量目标
                </label>
              </div>
              <button
                onClick={handlePost}
                disabled={loading || !postContent.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl disabled:opacity-50"
              >
                {loading ? '发布中...' : '发布动态'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== 分享选择弹窗 ========== */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center">
          <div className="w-full max-w-lg mx-auto bg-white rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col">
            {/* 标题栏：带分享按钮 */}
            <div className="p-4 flex justify-between items-center border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold">📤 分享到好友动态</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={doSharePost}
                  disabled={loading || getRecordsByDate(shareDate).length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold rounded-full disabled:opacity-50 active:scale-95 transition-transform"
                >
                  {loading ? '发布中...' : '🚀 分享'}
                </button>
                <button onClick={() => setShowShareModal(false)} className="text-gray-400 text-2xl w-8 h-8 flex items-center justify-center">×</button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* 分享类型选择 */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">选择分享内容</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShareType('diet')}
                    className={`p-3 rounded-xl text-left transition-all ${
                      shareType === 'diet'
                        ? 'bg-amber-50 border-2 border-amber-400'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-xl mb-1">🍽️</div>
                    <p className="text-sm font-medium">饮食分享</p>
                    <p className="text-[11px] text-gray-500">分享某天吃了什么</p>
                  </button>
                  <button
                    onClick={() => setShareType('goal')}
                    className={`p-3 rounded-xl text-left transition-all ${
                      shareType === 'goal'
                        ? 'bg-amber-50 border-2 border-amber-400'
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="text-xl mb-1">🎯</div>
                    <p className="text-sm font-medium">目标达成</p>
                    <p className="text-[11px] text-gray-500">分享目标达成 & 连续天数</p>
                  </button>
                </div>
              </div>

              {/* 日期选择（饮食分享时） */}
              {shareType === 'diet' && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">选择日期</p>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                      const d = dayjs().subtract(offset, 'day')
                      const dateStr = d.format('YYYY-MM-DD')
                      const label = offset === 0 ? '今天' : offset === 1 ? '昨天' : d.format('MM/DD')
                      const recs = getRecordsByDate(dateStr)
                      return (
                        <button
                          key={offset}
                          onClick={() => setShareDate(dateStr)}
                          className={`px-3 py-2 rounded-xl text-sm transition-all ${
                            shareDate === dateStr
                              ? 'bg-amber-400 text-white'
                              : recs.length > 0
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-50 text-gray-300'
                          }`}
                        >
                          {label}
                          {recs.length > 0 && <span className="ml-1 text-[10px]">({recs.length})</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 附加选项 */}
              <div className="bg-amber-50 rounded-xl p-3 space-y-2">
                {shareType === 'diet' && (
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={shareWithGoal}
                      onChange={(e) => setShareWithGoal(e.target.checked)}
                      className="w-4 h-4 accent-amber-500"
                    />
                    同时展示{shareDate === dayjs().format('YYYY-MM-DD') ? '今日' : shareDate === dayjs().subtract(1, 'day').format('YYYY-MM-DD') ? '昨日' : '当日'}目标达成情况
                  </label>
                )}
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={shareWithStreak}
                    onChange={(e) => setShareWithStreak(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                  展示已连续达成目标天数（{getStreakDays()} 天）
                </label>
              </div>

              {/* 可编辑的预览文案 */}
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-gray-400">
                    📋 {hasEditedShareContent ? '已手动编辑' : '预览文案（可直接修改）'}
                  </p>
                  {hasEditedShareContent && (
                    <button
                      onClick={() => {
                        setHasEditedShareContent(false)
                        setShareContent(generateAutoShareContent())
                      }}
                      className="text-xs text-amber-600 font-medium hover:text-amber-700"
                    >
                      ↺ 重置为自动生成
                    </button>
                  )}
                </div>
                <textarea
                  value={shareContent}
                  onChange={(e) => {
                    setShareContent(e.target.value)
                    setHasEditedShareContent(true)
                  }}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 outline-none resize-none text-sm bg-white"
                  placeholder="写点想分享的内容..."
                />
              </div>

              {getRecordsByDate(shareDate).length === 0 && (
                <p className="text-xs text-gray-400 text-center">这一天还没有饮食记录哦</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
