import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLoginState } from '../utils/auth'
import { getMyFriends } from '../utils/friends'
import {
  getFriendFeed,
  postFeed,
  toggleLike,
  addComment,
  deleteFeed,
} from '../utils/feed'

export default function FeedPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [feeds, setFeeds] = useState([])
  const [friendIds, setFriendIds] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [commentMap, setCommentMap] = useState({}) // feedId -> input value
  const [showComments, setShowComments] = useState({}) // feedId -> true/false

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

  const handlePost = async () => {
    if (!postContent.trim()) return
    setLoading(true)
    try {
      // 从本地取今日记录作为分享内容
      const records = getTodayRecords()
      await postFeed(
        currentUser.userId,
        currentUser.username,
        postContent.trim(),
        records,
      )
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

  const getTodayRecords = () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const key = `diet_records_${today}`
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch {
      return []
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
      await deleteFeed(feedId, currentUser.userId)
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
        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2 bg-white text-amber-500 rounded-xl font-medium shadow-lg"
        >
          ✏️ 分享
        </button>
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
            const isLiked = (feed.likes || []).some(l => l.userId === currentUser?.userId)
            const isMine = feed.userId === currentUser?.userId
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

                {/* 饮食记录 */}
                {feed.records && feed.records.length > 0 && (
                  <div className="mx-4 mb-3 bg-amber-50 rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-amber-600 font-medium">今日饮食</span>
                      <span className="text-xs text-gray-500">
                        共 {feed.records.length} 餐 · {feed.summary?.totalCalories || 0} kcal
                      </span>
                    </div>
                    <div className="space-y-1">
                      {feed.records.slice(0, 5).map((r, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600">{r.name}</span>
                          <span className="text-amber-600 font-medium">{r.calories} kcal</span>
                        </div>
                      ))}
                      {feed.records.length > 5 && (
                        <div className="text-xs text-gray-400 text-center pt-1">
                          还有 {feed.records.length - 5} 条...
                        </div>
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
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none resize-none"
              />
              <div className="text-sm text-gray-500">
                📋 今日记录：{getTodayRecords().length} 条 ·
                约 {getTodayRecords().reduce((s, r) => s + (r.calories || 0), 0)} kcal
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
    </div>
  )
}
