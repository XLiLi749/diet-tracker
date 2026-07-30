import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import useStore from '../store'
import ProgressRing from '../components/ProgressRing'

const mealLabels = {
  breakfast: { icon: '🌅', label: '早餐', time: '06:00-09:00' },
  lunch: { icon: '🌞', label: '午餐', time: '11:00-13:30' },
  dinner: { icon: '🌙', label: '晚餐', time: '17:00-19:30' },
  snack: { icon: '⏰', label: '加餐', time: '10:00/15:00/20:00' },
}

const greeting = () => {
  const h = dayjs().hour()
  if (h < 6) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

export default function Dashboard() {
  const {
    profile,
    targets,
    getTodaySummary,
    getNutritionAlerts,
    getWeeklyStats,
    todayRecommendations,
    generateTodayRecommendations,
    getLogsByDate,
  } = useStore()

  const summary = getTodaySummary()
  const alerts = getNutritionAlerts()
  const weeklyStats = getWeeklyStats()
  const todayLogs = getLogsByDate(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    if (!todayRecommendations) {
      generateTodayRecommendations()
    }
  }, [todayRecommendations, generateTodayRecommendations])

  // 检查哪些餐次已记录
  const loggedMeals = new Set(todayLogs.map(l => l.mealType))

  return (
    <div className="pb-4">
      {/* 顶部问候栏 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{greeting()}，{profile.nickname}</h1>
            <p className="text-sm opacity-80 mt-1">今天也要好好吃饭哦 💪</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            👋
          </div>
        </div>

        {/* 今日热量进度 */}
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">今日热量摄入</span>
            <span className="text-sm font-bold">{summary.caloriePct}%</span>
          </div>
          <div className="w-full h-3 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${summary.caloriePct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span>{summary.calories} kcal</span>
            <span className="opacity-75">目标 {targets.calorieTarget} kcal</span>
          </div>
        </div>
      </div>

      {/* 三大营养素 */}
      <div className="px-4 -mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">三大营养素</h3>
          <div className="flex items-center justify-around">
            {[
              { label: '蛋白质', current: summary.protein, target: targets.proteinTarget, pct: summary.proteinPct, color: '#3b82f6' },
              { label: '碳水', current: summary.carbs, target: targets.carbsTarget, pct: summary.carbsPct, color: '#f59e0b' },
              { label: '脂肪', current: summary.fat, target: targets.fatTarget, pct: summary.fatPct, color: '#ef4444' },
            ].map((nutrient) => (
              <div key={nutrient.label} className="flex flex-col items-center">
                <div className="relative">
                  <ProgressRing progress={nutrient.pct} size={64} strokeWidth={6} color={nutrient.color} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: nutrient.color }}>{nutrient.pct}%</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{nutrient.label}</span>
                <span className="text-xs font-medium text-gray-700">{nutrient.current}/{nutrient.target}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快捷记录 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📸 快捷记录</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(mealLabels).map(([key, meal]) => (
              <Link
                key={key}
                to={`/log?meal=${key}`}
                className={`flex flex-col items-center p-3 rounded-xl transition-colors ${
                  loggedMeals.has(key)
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mb-1">{meal.icon}</span>
                <span className="text-xs font-medium text-gray-700">{meal.label}</span>
                {loggedMeals.has(key) && (
                  <span className="text-[10px] text-primary-600 mt-0.5">已记录 ✓</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 今日推荐食谱 */}
      {todayRecommendations && (
        <div className="px-4 mt-4">
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">🍽️ 今日推荐食谱</h3>
              <button
                onClick={generateTodayRecommendations}
                className="text-xs text-primary-500 active:text-primary-700"
              >
                换一批 🔄
              </button>
            </div>
            <div className="space-y-3">
              {['breakfast', 'lunch', 'dinner'].map((mealKey) => {
                const meal = mealLabels[mealKey]
                const rec = todayRecommendations[mealKey]
                return (
                  <div key={mealKey} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{meal.icon}</span>
                      <span className="text-sm font-medium text-gray-800">{meal.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">{rec.totalNutrition.calories} kcal</span>
                    </div>
                    <p className="text-sm text-gray-600">{rec.name}</p>
                  </div>
                )
              })}
            </div>
            <Link
              to="/recommend"
              className="block w-full text-center mt-3 py-2 text-sm text-primary-600 font-medium"
            >
              查看完整方案 →
            </Link>
          </div>
        </div>
      )}

      {/* 营养提醒 */}
      {alerts.length > 0 && (
        <div className="px-4 mt-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">⚠️ 营养提醒</h3>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                    alert.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : alert.type === 'danger'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span className="text-base">
                    {alert.type === 'success' ? '✅' : alert.type === 'danger' ? '🔴' : '⚠️'}
                  </span>
                  <span className="flex-1">{alert.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 一周趋势 */}
      <div className="px-4 mt-4 mb-4">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">📈 一周热量趋势</h3>
            <Link to="/stats" className="text-xs text-primary-500">详情 →</Link>
          </div>
          <div className="h-36 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStats} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} kcal`, '热量']}
                />
                <Area type="monotone" dataKey="calories" stroke="#22c55e" strokeWidth={2} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
