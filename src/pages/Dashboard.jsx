import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import useStore from '../store'
import ProgressRing from '../components/ProgressRing'
import { checkGoalAchieved, getYesterdayStr, getTodayStr } from '../utils/goalCheck'
import usagiYellow from '../assets/03_黄色背景乌萨奇.jpg'
import usagiEat from '../assets/07_吃东西的乌萨奇.jpg'

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

  const [showGoalReward, setShowGoalReward] = useState(false)
  const [yesterdayGoalInfo, setYesterdayGoalInfo] = useState(null)

  useEffect(() => {
    if (!todayRecommendations) {
      generateTodayRecommendations()
    }
  }, [todayRecommendations, generateTodayRecommendations])

  // 检查昨日目标是否达成（仅在今天第一次打开时弹窗）
  useEffect(() => {
    const yesterday = getYesterdayStr()
    const today = getTodayStr()
    const lastShown = localStorage.getItem('goal_reward_last_shown')

    // 今天已经弹过就不弹了
    if (lastShown === today) return

    try {
      // 取昨日记录
      const key = `diet_records_${yesterday}`
      const data = localStorage.getItem(key)
      const records = data ? JSON.parse(data) : []

      if (records.length > 0) {
        const totalCalories = records.reduce((s, r) => s + (r.calories || 0), 0)
        const targetCalories = targets?.dailyCalories || 2000
        const goalType = profile?.dietGoal?.type || 'maintain'
        const info = checkGoalAchieved(totalCalories, targetCalories, goalType, records)
        setYesterdayGoalInfo(info)

        if (info.achieved) {
          setShowGoalReward(true)
        }
      }
    } catch (e) {
      console.warn('检查昨日目标失败:', e)
    }

    // 标记今天已经检查过（无论是否达成都不重复弹）
    localStorage.setItem('goal_reward_last_shown', today)
  }, [profile, targets])

  const closeGoalReward = () => setShowGoalReward(false)

  // 检查哪些餐次已记录
  const loggedMeals = new Set(todayLogs.map(l => l.mealType))

  return (
    <div className="pb-4">
      {/* 顶部问候栏 - 乌萨奇可爱风格 */}
      <div className="bg-gradient-to-br from-usagi-yellow via-usagi-cream to-usagi-pinkLight px-5 pt-12 pb-10 rounded-b-[2.5rem] relative overflow-hidden">
        {/* 装饰圆点 */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30" />
        <div className="absolute right-16 top-4 w-4 h-4 rounded-full bg-white/50" />
        <div className="absolute -left-4 bottom-4 w-20 h-20 rounded-full bg-white/20" />

        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{greeting()}，{profile.nickname}</h1>
            <p className="text-sm text-gray-600 mt-1">今天也要好好吃饭哦 🍞</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white shadow-cute overflow-hidden border-4 border-white">
            <img src={usagiYellow} alt="乌萨奇" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 今日热量进度 - 可爱卡片 */}
        <div className="bg-white/85 backdrop-blur rounded-3xl p-5 shadow-cute relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">🍞 今日热量摄入</span>
            <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{summary.caloriePct}%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-usagi-yellow to-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${summary.caloriePct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="font-bold text-gray-700">{summary.calories} kcal</span>
            <span className="text-gray-500">目标 {targets.calorieTarget} kcal</span>
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
        <div className="card rounded-3xl">
          <h3 className="text-sm font-bold text-gray-700 mb-3">📸 快捷记录</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(mealLabels).map(([key, meal]) => (
              <Link
                key={key}
                to={`/log?meal=${key}`}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all active:scale-95 ${
                  loggedMeals.has(key)
                    ? 'bg-gradient-to-br from-usagi-mintLight to-usagi-mint/30 border-2 border-usagi-mint'
                    : 'bg-gray-50 hover:bg-usagi-cream/50'
                }`}
              >
                <span className="text-2xl mb-1">{meal.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{meal.label}</span>
                {loggedMeals.has(key) && (
                  <span className="text-[10px] text-green-600 mt-0.5 font-bold">已记 ✓</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 按时间推荐 */}
      {todayRecommendations && (() => {
        const hour = dayjs().hour()
        let period = 'breakfast'
        if (hour >= 10 && hour < 14) period = 'lunch'
        else if (hour >= 14 && hour < 20) period = 'dinner'
        else if (hour >= 20 || hour < 6) period = 'snack'

        const isLateNight = hour >= 20 || hour < 6
        const isOnTrack = summary.caloriePct >= 70 && summary.caloriePct <= 110
        const calorieDeficit = summary.caloriePct < 70

        const meal = todayRecommendations[period]
        const mealInfo = mealLabels[period]

        // 鼓励语
        const encouragementPhrases = [
          '今天吃得很健康，继续保持！🌟',
          '营养摄入刚刚好，身体会感谢你 💪',
          '你今天的饮食管理超棒！✨',
          '距离目标越来越近了，加油！🎯',
          '坚持健康饮食，明天也要元气满满 🌈',
        ]
        const encouragement = encouragementPhrases[Math.floor(Math.random() * encouragementPhrases.length)]

        return (
          <div className="px-4 mt-4">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">
                  {isLateNight ? '🌙 晚间推荐' : `${mealInfo.icon} ${mealInfo.label}推荐`}
                </h3>
                <button
                  onClick={generateTodayRecommendations}
                  className="text-xs text-primary-500 active:text-primary-700"
                >
                  换一批 🔄
                </button>
              </div>

              {/* 深夜场景：达标显示鼓励，未达标显示加餐 */}
              {isLateNight && isOnTrack ? (
                <div className="bg-gradient-to-br from-usagi-mintLight to-usagi-skyLight rounded-2xl p-5 text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white shadow-cute">
                    <img src={usagiEat} alt="乌萨奇吃东西" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-base font-bold text-green-700 mb-2">今日目标已达成！</p>
                  <p className="text-sm text-green-600">{encouragement}</p>
                  <p className="text-xs text-green-500 mt-3 bg-white/50 rounded-full px-3 py-1 inline-block">已摄入 {summary.calories} / {targets.calorieTarget} kcal</p>
                </div>
              ) : meal ? (
                <div>
                  {/* 主推荐大卡片 - 可爱风格 */}
                  <div className="bg-gradient-to-br from-usagi-cream via-usagi-pinkLight to-usagi-skyLight rounded-2xl p-4 mb-3">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-xl bg-white shadow-sm flex items-center justify-center text-4xl flex-shrink-0">
                        {(() => {
                          const mealName = meal.name || ''
                          if (/粉|面|米粉|拌粉|河粉/.test(mealName)) return '🍜'
                          if (/小笼包|包子|饺子|锅贴|馄饨/.test(mealName)) return '🥟'
                          if (/粥|汤|羹/.test(mealName)) return '🍲'
                          if (/饭|盖浇|咖喱/.test(mealName)) return '🍛'
                          if (/沙拉|轻食|蔬菜/.test(mealName)) return '🥗'
                          if (/饼|披萨|汉堡|三明治/.test(mealName)) return '🥪'
                          if (/寿司|刺身|日料|日式/.test(mealName)) return '🍣'
                          if (/火锅|麻辣|串串/.test(mealName)) return '🍲'
                          if (/烧烤|烤肉/.test(mealName)) return '🍖'
                          if (/水果|果切/.test(mealName)) return '🍎'
                          if (period === 'breakfast') return '🍳'
                          if (period === 'lunch') return '🍱'
                          if (period === 'dinner') return '🍲'
                          return '🍎'
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-800 truncate">{meal.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-3 py-1 bg-white/80 text-primary-700 rounded-full font-bold shadow-sm">
                            {meal.totalNutrition.calories} kcal
                          </span>
                          {isLateNight && calorieDeficit && (
                            <span className="text-xs px-3 py-1 bg-usagi-pinkLight text-pink-600 rounded-full font-bold">
                              适合加餐
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 mt-2 text-xs text-gray-600">
                          <span>蛋白 {meal.totalNutrition.protein}g</span>
                          <span>碳水 {meal.totalNutrition.carbs}g</span>
                          <span>脂肪 {meal.totalNutrition.fat}g</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 食材组成 */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">🍴 组成食材</p>
                    {meal.items && meal.items.map((item, idx) => {
                      // 根据食物名猜测类别选图标
                      const name = item.name || ''
                      const getFoodIcon = () => {
                        if (/粉|面|米|饭|粥|饼|包|馒头|年糕/.test(name)) return '🍜'
                        if (/肉|牛|猪|鸡|鸭|鱼|虾|蟹|贝|骨/.test(name)) return '🍖'
                        if (/菜|瓜|茄|豆|萝|卜|笋|菇|葱|蒜|辣/.test(name)) return '🥬'
                        if (/蛋|奶|豆浆|豆腐|酸奶|奶酪/.test(name)) return '🥚'
                        if (/汤|羹|粥/.test(name)) return '🍲'
                        if (/果|桃|梨|苹|蕉|橙|莓|瓜|葡萄/.test(name)) return '🍎'
                        if (/豆|花生|核桃|杏仁|坚果/.test(name)) return '🥜'
                        if (/水|茶|可乐|咖啡|奶茶|饮料/.test(name)) return '🥤'
                        return '🍽️'
                      }
                      return (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                            {getFoodIcon()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{name}</p>
                            <p className="text-xs text-gray-400">
                              {item.quantity}{item.unit || 'g'} · {item.calories || 0} kcal
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            <p>蛋白 {item.protein || 0}g</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {isLateNight && calorieDeficit && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-700">
                        💡 今日热量摄入偏低（{summary.caloriePct}%），可以适量加餐补充能量哦~
                      </p>
                    </div>
                  )}
                </div>
              ) : null}

              <Link
                to="/recommend"
                className="block w-full text-center mt-4 py-2 text-sm text-primary-600 font-medium border-t border-gray-100"
              >
                查看完整推荐方案 →
              </Link>
            </div>
          </div>
        )
      })()}

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

      {/* 昨日目标达成奖励弹窗 */}
      {showGoalReward && yesterdayGoalInfo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden animate-bounce-in">
            <div className="bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 px-6 py-8 text-center text-white">
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-2xl font-bold">恭喜完成目标！</h2>
              <p className="text-amber-100 text-sm mt-1">昨天的你超棒的 🌟</p>
            </div>
            <div className="px-6 py-5 space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                <span className="text-gray-600">昨日摄入</span>
                <span className="font-bold text-green-600 text-lg">{yesterdayGoalInfo.totalCalories} kcal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                <span className="text-gray-600">目标范围</span>
                <span className="font-medium text-amber-700">
                  {yesterdayGoalInfo.minCalories || yesterdayGoalInfo.minCal} ~ {yesterdayGoalInfo.maxCalories || yesterdayGoalInfo.maxCal} kcal
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
                <span>三餐齐全</span>
                <span className={yesterdayGoalInfo.threeMealsDone ? 'text-green-500 font-medium' : 'text-gray-400'}>
                  {yesterdayGoalInfo.threeMealsDone ? '✓ 是' : '✗ 否'}
                </span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={closeGoalReward}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl shadow-lg"
              >
                今天继续加油！💪
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
