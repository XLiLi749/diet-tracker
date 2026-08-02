import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import Recommendation from './pages/Recommendation'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import Journal from './pages/Journal'
import JournalCreate from './pages/JournalCreate'
import JournalDetail from './pages/JournalDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUserDetail from './pages/AdminUserDetail'
import LoginPage from './pages/LoginPage'
import FeedPage from './pages/FeedPage'
import FriendsPage from './pages/FriendsPage'
import BottomNav from './components/BottomNav'
import { getLoginState } from './utils/auth'
import { initCloudBase } from './utils/cloudbase'
import useStore from './store'

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const restoreCloudLogin = useStore(s => s.restoreCloudLogin)
  const syncFromCloud = useStore(s => s.syncFromCloud)
  const pushDataToCloud = useStore(s => s.pushDataToCloud)

  useEffect(() => {
    initCloudBase()

    // 恢复云端登录态到本地 store
    restoreCloudLogin()

    // 如果已登录，从云端拉取同步数据
    const user = getLoginState()
    if (user && user.username) {
      // 延迟一下，确保云开发初始化完成
      setTimeout(() => {
        syncFromCloud(user.username)
      }, 500)
    }

    // 未登录时跳登录页
    const publicPaths = ['/login', '/admin/login', '/admin/dashboard']
    if (!user && !publicPaths.some(p => location.pathname.startsWith(p))) {
      navigate('/login')
    }

    // 页面关闭前同步一次到云端
    const handleBeforeUnload = () => {
      const currentUser = getLoginState()
      if (currentUser && currentUser.username) {
        // 尝试同步（不等待）
        pushDataToCloud()
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [location.pathname, navigate, restoreCloudLogin, syncFromCloud, pushDataToCloud])

  const showBottomNav =
    !location.pathname.startsWith('/admin') &&
    !location.pathname.startsWith('/login') &&
    getLoginState()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/log" element={<FoodLog />} />
        <Route path="/recommend" element={<Recommendation />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/create" element={<JournalCreate />} />
        <Route path="/journal/:id/edit" element={<JournalCreate />} />
        <Route path="/journal/:id" element={<JournalDetail />} />
        {/* 管理员后台路由（独立布局，不显示底部导航） */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user/:id" element={<AdminUserDetail />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  )
}

export default App
