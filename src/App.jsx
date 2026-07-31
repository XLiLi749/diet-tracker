import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import FoodLog from './pages/FoodLog'
import Recommendation from './pages/Recommendation'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import Journal from './pages/Journal'
import JournalCreate from './pages/JournalCreate'
import JournalDetail from './pages/JournalDetail'
import BottomNav from './components/BottomNav'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<FoodLog />} />
        <Route path="/recommend" element={<Recommendation />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/create" element={<JournalCreate />} />
        <Route path="/journal/:id/edit" element={<JournalCreate />} />
        <Route path="/journal/:id" element={<JournalDetail />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
