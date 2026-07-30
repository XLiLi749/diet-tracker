import { useState } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts'
import dayjs from 'dayjs'
import useStore from '../store'

const goalLabels = {
  fat_loss: { label: '减脂', color: '#22c55e' },
  weight_gain: { label: '增重', color: '#f97316' },
  muscle_gain: { label: '增肌', color: '#3b82f6' },
  maintain: { label: '维持体重', color: '#8b5cf6' },
  stomach_care: { label: '养胃', color: '#f59e0b' },
  recovery: { label: '改善体虚', color: '#ec4899' },
}

export default function Stats() {
  const {
    profile,
    targets,
    getWeightTrend,
    getWeeklyStats,
    foodLogs,
  } = useStore()

  const [timeRange, setTimeRange] = useState('week') // week | month

  const weightData = getWeightTrend(timeRange === 'week' ? 7 : 28)
  const weeklyStats = getWeeklyStats()

  // 计算连续打卡天数
  const today = dayjs()
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const date = today.subtract(i, 'day').format('YYYY-MM-DD')
    if (foodLogs[date] && foodLogs[date].length > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  // 周均营养统计
  const weeklyAvg = (() => {
    let cals = 0, protein = 0, carbs = 0, fat = 0, days = 0
    for (let i = 0; i < 7; i++) {
      const date = today.subtract(i, 'day').format('YYYY-MM-DD')
      const logs = foodLogs[date] || []
      if (logs.length > 0) {
        days++
        logs.forEach(l => {
          cals += l.totalNutrition.calories
          protein += l.totalNutrition.protein
          carbs += l.totalNutrition.carbs
          fat += l.totalNutrition.fat
        })
      }
    }
    if (days === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0 }
    return {
      calories: Math.round(cals / days),
      protein: Math.round(protein / days * 10) / 10,
      carbs: Math.round(carbs / days * 10) / 10,
      fat: Math.round(fat / days * 10) / 10,
    }
  })()

  // 体重变化
  const weightChange = (() => {
    if (weightData.length < 2) return 0
    const first = weightData[0].weight
    const last = weightData[weightData.length - 1].weight
    return Math.round((last - first) * 10) / 10
  })()

  // 雷达图数据
  const radarData = [
    { subject: '蛋白质', A: Math.min(100, (weeklyAvg.protein / targets.proteinTarget) * 100), full: 100 },
    { subject: '碳水', A: Math.min(100, (weeklyAvg.carbs / targets.carbsTarget) * 100), full: 100 },
    { subject: '脂肪', A: Math.min(100, (weeklyAvg.fat / targets.fatTarget) * 100), full: 100 },
    { subject: '热量', A: Math.min(100, (weeklyAvg.calories / targets.calorieTarget) * 100), full: 100 },
    { subject: '规律性', A: Math.min(100, (streak / 7) * 100), full: 100 },
  ]

  // 图表数据格式化
  const weightChartData = weightData.map(r => ({
    ...r,
    label: dayjs(r.date).format('MM/DD'),
  }))

  const goal = goalLabels[profile.dietGoal.type] || goalLabels.maintain

  return (
    <div className="pb-4">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-blue-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-xl font-bold">📊 数据统计</h1>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeRange === 'week' ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
            }`}
          >
            本周
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeRange === 'month' ? 'bg-white text-blue-600' : 'bg-white/20 text-white'
            }`}
          >
            本月
          </button>
        </div>
      </div>

      {/* 体重趋势 */}
      <div className="px-4 -mt-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">📈 体重变化趋势</h3>
            <div className="text-right">
              <p className="text-xs text-gray-400">当前 / 目标</p>
              <p className="font-bold text-gray-800">
                {profile.weight} / {profile.dietGoal.targetWeight} kg
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs text-gray-400">饮食目标</p>
                <p className="text-sm font-semibold" style={{ color: goal.color }}>{goal.label}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-400">{timeRange === 'week' ? '本周' : '本月'}变化</p>
              <p className={`text-sm font-bold ${
                weightChange < 0 ? 'text-green-500' : weightChange > 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {weightChange > 0 ? '+' : ''}{weightChange} kg
              </p>
            </div>
          </div>

          <div className="h-48 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} kg`, '体重']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#3b82f6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 本周饮食统计 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">🍽️ 本周日均摄入</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
              <p className="text-xs text-orange-600">热量</p>
              <p className="text-xl font-bold text-orange-700">{weeklyAvg.calories}</p>
              <p className="text-xs text-orange-500">kcal / 目标 {targets.calorieTarget}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
              <p className="text-xs text-blue-600">蛋白质</p>
              <p className="text-xl font-bold text-blue-700">{weeklyAvg.protein}</p>
              <p className="text-xs text-blue-500">g / 目标 {targets.proteinTarget}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3">
              <p className="text-xs text-amber-600">碳水</p>
              <p className="text-xl font-bold text-amber-700">{weeklyAvg.carbs}</p>
              <p className="text-xs text-amber-500">g / 目标 {targets.carbsTarget}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3">
              <p className="text-xs text-red-600">脂肪</p>
              <p className="text-xl font-bold text-red-700">{weeklyAvg.fat}</p>
              <p className="text-xs text-red-500">g / 目标 {targets.fatTarget}</p>
            </div>
          </div>

          <h4 className="text-xs font-semibold text-gray-500 mb-2">每日热量</h4>
          <div className="h-40 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyStats} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="weekday" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} kcal`, '热量']}
                />
                <Bar dataKey="calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 营养均衡雷达图 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🎯 营养均衡分析</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar
                  name="实际摄入"
                  dataKey="A"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 下周展望 */}
      <div className="px-4 mt-4">
        <div className="card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <h3 className="text-sm font-semibold mb-4">🔮 下周展望</h3>

          {/* 预测体重 */}
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-xs opacity-80 mb-1">按当前趋势预测体重</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">
                {(profile.weight + weightChange * 0.8).toFixed(1)}
              </p>
              <p className="text-sm opacity-80 mb-1">kg（7天后）</p>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-3">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0,
                    ((profile.weight + weightChange * 0.8 - (profile.dietGoal.targetWeight - 10)) /
                     (profile.dietGoal.targetWeight + 10 - (profile.dietGoal.targetWeight - 10))) * 100
                  ))}%`
                }}
              />
            </div>
            <p className="text-xs opacity-70 mt-2">
              目标体重 {profile.dietGoal.targetWeight} kg
              {Math.abs(profile.weight - profile.dietGoal.targetWeight) > 0.5 && (
                <span className="ml-1">
                  · 还需 {profile.weight > profile.dietGoal.targetWeight ? '减重' : '增重'}
                  {' '}{Math.abs(profile.weight - profile.dietGoal.targetWeight).toFixed(1)} kg
                </span>
              )}
            </p>
          </div>

          {/* 下周建议 */}
          <div className="space-y-2">
            {weeklyAvg.calories > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-lg">
                  {weeklyAvg.calories < targets.calorieTarget * 0.9 ? '⚠️' :
                   weeklyAvg.calories > targets.calorieTarget * 1.1 ? '⚠️' : '✅'}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {weeklyAvg.calories < targets.calorieTarget * 0.9
                      ? '热量摄入偏低'
                      : weeklyAvg.calories > targets.calorieTarget * 1.1
                        ? '热量摄入偏高'
                        : '热量控制良好'}
                  </p>
                  <p className="text-xs opacity-80">
                    {weeklyAvg.calories < targets.calorieTarget * 0.9
                      ? '下周建议适当增加主食和蛋白质摄入，每餐多吃一口饭'
                      : weeklyAvg.calories > targets.calorieTarget * 1.1
                        ? '下周建议减少油炸和零食，多选择清蒸、水煮菜品'
                        : '继续保持当前的饮食节奏，注意营养均衡'}
                  </p>
                </div>
              </div>
            )}

            {weeklyAvg.protein > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-lg">
                  {weeklyAvg.protein < targets.proteinTarget * 0.8 ? '🥩' : '💪'}
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {weeklyAvg.protein < targets.proteinTarget * 0.8
                      ? '蛋白质不足'
                      : '蛋白质达标'}
                  </p>
                  <p className="text-xs opacity-80">
                    {weeklyAvg.protein < targets.proteinTarget * 0.8
                      ? '建议每餐加一个鸡蛋或一份鸡胸肉/鱼肉，豆浆牛奶喝起来'
                      : '肌肉修复和生长有保障，继续保持'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-sm font-medium">下周小目标</p>
                <p className="text-xs opacity-80">
                  {profile.dietGoal.type === 'fat_loss' && '每天坚持记录饮食，尝试2次少油少盐的食堂菜品'}
                  {profile.dietGoal.type === 'weight_gain' && '每天多吃一餐加餐（牛奶+面包），保证三餐定时定量'}
                  {profile.dietGoal.type === 'muscle_gain' && '健身日保证蛋白质摄入达标，训练后30分钟内补充蛋白质'}
                  {profile.dietGoal.type === 'maintain' && '保持规律三餐，周末不要暴饮暴食'}
                  {profile.dietGoal.type === 'stomach_care' && '避免辛辣刺激食物，每天喝够8杯水，晚餐7分饱'}
                  {!['fat_loss', 'weight_gain', 'muscle_gain', 'maintain', 'stomach_care'].includes(profile.dietGoal.type) && '保持规律饮食，注意营养均衡'}
                </p>
              </div>
            </div>

            {streak >= 3 && (
              <div className="flex items-start gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <p className="text-sm font-medium">状态超棒！</p>
                  <p className="text-xs opacity-80">已连续记录 {streak} 天，下周继续保持，你一定能达成目标！</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 打卡统计 */}
      <div className="px-4 mt-4 mb-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🔥</div>
            <div>
              <p className="text-sm opacity-80">连续记录</p>
              <p className="text-3xl font-bold">{streak} 天</p>
              <p className="text-xs opacity-70 mt-1">继续坚持，你很棒！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
