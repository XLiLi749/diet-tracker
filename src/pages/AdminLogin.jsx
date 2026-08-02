import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { adminLogin, adminLoggedIn } = useStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (adminLoggedIn) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const ok = adminLogin(username.trim(), password)
    if (ok) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError('账号或密码错误')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-primary-500 rounded-3xl flex items-center justify-center mb-4 text-white text-3xl font-bold shadow-xl shadow-primary-500/30">
            管
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">管理员后台</h1>
          <p className="text-slate-400 text-sm">饮食工作台 · 管理系统</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 space-y-5 border border-white/10">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">管理员账号</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入管理员账号"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-2 block">登录密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 transition"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition shadow-lg shadow-primary-500/30"
          >
            登录后台
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              ← 返回用户前台
            </button>
          </div>
        </form>

        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-amber-300 text-xs leading-relaxed">
            🔒 隐私提示：管理员查看用户数据仅用于产品优化，<br/>
            严禁私自泄露或传播用户个人隐私信息。
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-4">
          Demo 账号：admin / admin123
        </p>
      </div>
    </div>
  )
}
