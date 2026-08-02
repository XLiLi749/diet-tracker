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

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    initCloudBase()
    window.scrollTo(0, 0)

    // 未登录时跳登录页
    const publicPaths = ['/login', '/admin/login', '/admin/dashboard']
    const user = getLoginState()
    if (!user && !publicPaths.some(p => location.pathname.startsWith(p))) {
      navigate('/login')
    }
  }, [location.pathname, navigate])

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
