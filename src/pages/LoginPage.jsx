import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser, saveLoginState, getLoginState } from '../utils/auth'
import { initCloudBase } from '../utils/cloudbase'
import useStore from '../store'

export default function LoginPage() {
  const navigate = useNavigate()
  const syncCloudUser = useStore(s => s.syncCloudUser)
  const [mode, setMode] = useState('login') // login | register
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 注册需要的身体数据
  const [height, setHeight] = useState(165)
  const [weight, setWeight] = useState(55)
  const [age, setAge] = useState(20)
  const [gender, setGender] = useState('女')
  const [goal, setGoal] = useState('maintain')

  useEffect(() => {
    // 如果已经登录了，直接跳首页
    const saved = getLoginState()
    if (saved) navigate('/')
    // 初始化云开发
    initCloudBase()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!username.trim()) throw new Error('请输入昵称')
      if (!password) throw new Error('请输入密码')
      if (password.length < 4) throw new Error('密码至少4位')

      if (mode === 'register') {
        if (password !== confirmPwd) throw new Error('两次密码不一致')
        const user = await registerUser(username.trim(), password, {
          height: Number(height),
          weight: Number(weight),
          age: Number(age),
          gender,
          goal,
          targetWeight: goal === 'gain' ? Number(weight) + 5 : goal === 'lose' ? Number(weight) - 5 : Number(weight),
        })
        saveLoginState(user)
        syncCloudUser(user)
      } else {
        const user = await loginUser(username.trim(), password)
        saveLoginState(user)
        syncCloudUser(user)
      }
      navigate('/')
    } catch (e) {
      setError(e.message || '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-8 text-center">
          <div className="text-6xl mb-2">🥗</div>
          <h1 className="text-2xl font-bold text-white">饮食工作台</h1>
          <p className="text-amber-100 text-sm mt-1">和好友一起健康吃饭</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex border-b">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-4 font-medium transition-colors ${
              mode === 'login'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-4 font-medium transition-colors ${
              mode === 'register'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              昵称
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="给自己起个可爱的名字"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少4位"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="再输一次密码"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">身高 cm</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">体重 kg</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">年龄</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">性别</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-amber-400 outline-none bg-white"
                  >
                    <option value="女">女</option>
                    <option value="男">男</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">饮食目标</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: 'lose', label: '🥗 减重' },
                    { v: 'maintain', label: '⚖️ 维持' },
                    { v: 'gain', label: '💪 增重' },
                  ].map(o => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setGoal(o.v)}
                      className={`py-2 px-2 rounded-lg text-sm transition-all ${
                        goal === o.v
                          ? 'bg-amber-400 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? '处理中...' : mode === 'register' ? '创建账号' : '登录'}
          </button>

          <p className="text-center text-xs text-gray-400">
            登录即表示同意保存你的饮食记录用于好友分享
          </p>
        </form>
      </div>
    </div>
  )
}
