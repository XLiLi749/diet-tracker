import { NavLink } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/feed', label: '动态', icon: '🥗' },
  { path: '/log', label: '记录', icon: '📸' },
  { path: '/friends', label: '好友', icon: '👥' },
  { path: '/stats', label: '统计', icon: '📊' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 z-50 max-w-md mx-auto rounded-t-3xl shadow-[0_-4px_20px_rgba(255,182,193,0.15)]">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-primary-600 bg-gradient-to-br from-usagi-cream to-usagi-pinkLight scale-105'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-bold">{tab.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
