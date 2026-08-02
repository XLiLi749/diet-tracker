import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchUsers } from '../utils/auth'
import {
  sendFriendRequest,
  getIncomingRequests,
  getMyFriends,
  handleFriendRequest,
  removeFriend,
} from '../utils/friends'
import { getLoginState } from '../utils/auth'

export default function FriendsPage() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState('friends') // friends | requests | search
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const user = getLoginState()
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    loadData(user.userId)
  }, [navigate])

  const loadData = async (userId) => {
    try {
      const [f, r] = await Promise.all([
        getMyFriends(userId),
        getIncomingRequests(userId),
      ])
      setFriends(f)
      setRequests(r)
    } catch (e) {
      console.error('加载好友数据失败:', e)
    }
  }

  const handleSearch = async () => {
    if (!searchKeyword.trim()) return
    setLoading(true)
    try {
      const results = await searchUsers(searchKeyword.trim())
      setSearchResults(results.filter(r => r.userId !== currentUser.userId))
    } catch (e) {
      setMessage('搜索失败：' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async (user) => {
    try {
      await sendFriendRequest(
        currentUser.userId,
        currentUser.username,
        user.userId,
        user.username,
      )
      setMessage(`已向「${user.username}」发送好友请求`)
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage(e.message)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAccept = async (req, accept) => {
    try {
      await handleFriendRequest(req._id, accept)
      setMessage(accept ? `已同意「${req.fromUsername}」的好友请求` : '已拒绝')
      loadData(currentUser.userId)
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage(e.message)
    }
  }

  const handleRemove = async (friend) => {
    if (!confirm(`确定要和「${friend.username}」解除好友关系吗？`)) return
    try {
      await removeFriend(currentUser.userId, friend.userId)
      setMessage('已解除好友关系')
      loadData(currentUser.userId)
      setTimeout(() => setMessage(''), 3000)
    } catch (e) {
      setMessage(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 pb-24">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-6 text-white">
        <h1 className="text-2xl font-bold">👥 好友</h1>
        <p className="text-amber-100 text-sm mt-1">和好友一起健康吃饭</p>
      </div>

      {/* Tab */}
      <div className="flex bg-white border-b sticky top-0 z-10">
        {[
          { k: 'friends', label: `我的好友 (${friends.length})` },
          { k: 'requests', label: `请求 (${requests.length})` },
          { k: 'search', label: '🔍 添加好友' },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setActiveTab(t.k)}
            className={`flex-1 py-4 font-medium transition-colors ${
              activeTab === t.k
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 消息提示 */}
      {message && (
        <div className="mx-4 mt-4 bg-amber-100 text-amber-700 px-4 py-3 rounded-xl text-sm">
          {message}
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* 我的好友 */}
        {activeTab === 'friends' && (
          friends.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">🐰</div>
              <p>还没有好友呢</p>
              <p className="text-sm">去「添加好友」搜索昵称加好友吧</p>
            </div>
          ) : (
            friends.map(f => (
              <div key={f.userId} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {f.username.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-medium">{f.username}</div>
                    <div className="text-xs text-gray-400">
                      {f.profile?.height}cm · {f.profile?.weight}kg · {f.profile?.goal === 'gain' ? '增重' : f.profile?.goal === 'lose' ? '减重' : '维持'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(f)}
                  className="text-xs text-gray-400 hover:text-red-500 px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  解除
                </button>
              </div>
            ))
          )
        )}

        {/* 好友请求 */}
        {activeTab === 'requests' && (
          requests.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>暂无好友请求</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {req.fromUsername.slice(0, 1)}
                    </div>
                    <div>
                      <div className="font-medium">{req.fromUsername}</div>
                      <div className="text-xs text-gray-400">请求加你为好友</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(req, true)}
                    className="flex-1 py-2 bg-amber-400 text-white rounded-xl font-medium"
                  >
                    同意
                  </button>
                  <button
                    onClick={() => handleAccept(req, false)}
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium"
                  >
                    拒绝
                  </button>
                </div>
              </div>
            ))
          )
        )}

        {/* 搜索添加 */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="输入好友昵称搜索"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 outline-none"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-amber-400 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? '搜索中' : '搜索'}
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>输入好友昵称开始搜索</p>
              </div>
            ) : (
              searchResults.map(u => {
                const isAlreadyFriend = friends.some(f => f.userId === u.userId)
                return (
                  <div key={u.userId} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-teal-300 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {u.username.slice(0, 1)}
                      </div>
                      <div>
                        <div className="font-medium">{u.username}</div>
                        <div className="text-xs text-gray-400">
                          {u.profile?.height}cm · {u.profile?.weight}kg
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFriend(u)}
                      disabled={isAlreadyFriend}
                      className={`px-4 py-2 rounded-xl text-sm font-medium ${
                        isAlreadyFriend
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-amber-400 text-white hover:bg-amber-500'
                      }`}
                    >
                      {isAlreadyFriend ? '已添加' : '＋ 好友'}
                    </button>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
