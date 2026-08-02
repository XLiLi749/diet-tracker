import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'

const GOAL_LABEL = { fat_loss: '减脂', muscle_gain: '增肌', weight_gain: '增重', maintain: '维持' }
const MEAL_LABEL = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }

export default function AdminUserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { adminLoggedIn, ensureMockUsers, logAdminAction } = useStore()
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (!adminLoggedIn) {
      navigate('/admin/login', { replace: true })
    }
  }, [adminLoggedIn, navigate])

  const users = ensureMockUsers() || []
  const userData = users.find(u => u.profile.id === id)

  if (!adminLoggedIn) return null
  if (!userData) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">未找到该用户</p>
          <button onClick={() => navigate('/admin/dashboard')} className="text-primary-600 hover:text-primary-700">返回看板</button>
        </div>
      </div>
    )
  }

  const p = userData.profile
  const targetCals = p.targets?.calorieTarget || 2000

  // 所有有记录的日期
  const allDates = useMemo(() => {
    const set = new Set(userData.logs.map(l => l.date))
    return Array.from(set).sort().reverse()
  }, [userData])

  const activeDate = selectedDate || allDates[0]

  // 当日记录
  const dayLogs = useMemo(() => userData.logs.filter(l => l.date === activeDate), [userData, activeDate])
  const dayTotal = useMemo(() => dayLogs.reduce((s, l) => ({
    calories: s.calories + l.totalNutrition.calories,
    protein: s.protein + l.totalNutrition.protein,
    carbs: s.carbs + l.totalNutrition.carbs,
    fat: s.fat + l.totalNutrition.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }), [dayLogs])

  // 达标判断
  const calDiff = dayTotal.calories - targetCals
  const calDiffRatio = Math.abs(calDiff) / targetCals
  const achieveStatus = calDiffRatio < 0.15 ? { label: '达标', color: 'bg-green-100 text-green-700' } :
    calDiff < 0 ? { label: '摄入不足', color: 'bg-amber-100 text-amber-700' } :
      { label: '摄入超标', color: 'bg-red-100 text-red-700' }

  // 近7天趋势
  const recent7 = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
      const dayCals = userData.logs.filter(l => l.date === d).reduce((s, l) => s + l.totalNutrition.calories, 0)
      days.push({ date: d, calories: dayCals, achieved: dayCals > 0 && Math.abs(dayCals - targetCals) / targetCals < 0.15 })
    }
    return days
  }, [userData, targetCals])

  const achieveDays7 = recent7.filter(d => d.achieved).length
  const maxCal = Math.max(...recent7.map(d => d.calories), targetCals) || 1

  // 体重趋势
  const weightTrend = useMemo(() => {
    const records = userData.bodyRecords.slice().sort((a, b) => a.date.localeCompare(b.date))
    return records.slice(-10)
  }, [userData])

  // 导出单用户数据
  const exportThisUser = () => {
    const rows = [['日期', '餐次', '食物明细', '热量(kcal)', '蛋白质(g)', '碳水(g)', '脂肪(g)', '目标热量', '是否达标']]
    const byDate = {}
    userData.logs.forEach(log => {
      if (!byDate[log.date]) byDate[log.date] = { meals: [], total: { calories: 0, protein: 0, carbs: 0, fat: 0 } }
      byDate[log.date].meals.push(log)
      byDate[log.date].total.calories += log.totalNutrition.calories
      byDate[log.date].total.protein += log.totalNutrition.protein
      byDate[log.date].total.carbs += log.totalNutrition.carbs
      byDate[log.date].total.fat += log.totalNutrition.fat
    })
    Object.keys(byDate).sort().forEach(date => {
      const d = byDate[date]
      const foodNames = d.meals.map(m => m.items.map(i => i.name).join('+')).join(' | ')
      const isAch = Math.abs(d.total.calories - targetCals) / targetCals < 0.15 ? '达标' : (d.total.calories < targetCals ? '摄入不足' : '摄入超标')
      rows.push([date, d.meals.length + '餐', foodNames, d.total.calories, d.total.protein.toFixed(1), d.total.carbs.toFixed(1), d.total.fat.toFixed(1), targetCals, isAch])
    })
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${p.nickname}_饮食记录_${dayjs().format('YYYYMMDD')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    logAdminAction('EXPORT', `导出用户 ${p.nickname} (${p.id}) 的饮食数据`)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部 */}
      <header className="bg-slate-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/dashboard')} className="text-slate-300 hover:text-white">← 返回</button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
              {p.nickname?.[0] || '?'}
            </div>
            <div>
              <h1 className="text-lg font-bold">{p.nickname} 的饮食档案</h1>
              <p className="text-xs text-slate-400">{p.id} · {p.profession}</p>
            </div>
          </div>
          <button onClick={exportThisUser} className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium transition">
            📥 导出此用户数据
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 用户基础档案 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">📋 用户基础档案</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: '身高', value: p.height + ' cm' },
              { label: '体重', value: p.weight + ' kg' },
              { label: 'BMI', value: p.bmi?.toFixed(1) },
              { label: '年龄', value: p.age + ' 岁' },
              { label: '性别', value: p.gender === 'male' ? '男' : '女' },
              { label: '基础代谢', value: (p.targets?.bmr || '-') + ' kcal' },
            ].map((it, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{it.label}</p>
                <p className="text-lg font-semibold text-gray-800 mt-0.5">{it.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="bg-primary-50 rounded-xl p-3">
              <p className="text-xs text-primary-500">饮食目标</p>
              <p className="text-lg font-semibold text-primary-700 mt-0.5">{GOAL_LABEL[p.dietGoal?.type] || '维持'}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs text-amber-600">目标体重</p>
              <p className="text-lg font-semibold text-amber-700 mt-0.5">{p.dietGoal?.targetWeight} kg</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-green-600">每日热量目标</p>
              <p className="text-lg font-semibold text-green-700 mt-0.5">{targetCals} kcal</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600">注册时间</p>
              <p className="text-lg font-semibold text-blue-700 mt-0.5">{p.createdAt}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 近7天热量趋势 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">📈 近7天热量摄入趋势</h3>
            <div className="flex items-end justify-between gap-1 h-40 mb-2">
              {recent7.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div
                      className={`w-full rounded-t transition-all ${d.achieved ? 'bg-primary-500' : 'bg-gray-300'}`}
                      style={{ height: `${(d.calories / maxCal) * 120}px`, minHeight: d.calories > 0 ? '8px' : '0' }}
                      title={`${d.calories} kcal`}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400">{dayjs(d.date).format('MM-DD')}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>目标线: {targetCals} kcal/天</span>
              <span>近7天达标: <span className="font-semibold text-primary-600">{achieveDays7}</span>/7 天</span>
            </div>
          </div>

          {/* 体重变化趋势 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">⚖️ 体重变化记录（最近10次）</h3>
            {weightTrend.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">暂无体重记录</p>
            ) : (
              <>
                <div className="flex items-end justify-between gap-1 h-40 mb-2 px-2">
                  {weightTrend.map((r, i) => {
                    const minW = Math.min(...weightTrend.map(x => x.weight))
                    const maxW = Math.max(...weightTrend.map(x => x.weight))
                    const range = maxW - minW || 1
                    const h = ((r.weight - minW) / range) * 100 + 20
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <p className="text-[10px] text-primary-600 font-medium">{r.weight}</p>
                        <div className="w-full flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t"
                            style={{ height: `${h}px` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400">{dayjs(r.date).format('MM-DD')}</p>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 日期筛选 + 当日详情 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <h3 className="text-base font-semibold text-gray-800">🍽️ 每日饮食记录详情</h3>
            <select
              value={activeDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none"
            >
              {allDates.length === 0 && <option value="">暂无记录</option>}
              {allDates.map(d => (
                <option key={d} value={d}>{d} ({dayjs(d).format('dddd')})</option>
              ))}
            </select>
          </div>

          {activeDate && (
            <>
              {/* 当日汇总 */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">当日总热量</p>
                  <p className="text-xl font-bold text-gray-800 mt-0.5">{dayTotal.calories} kcal</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">蛋白质</p>
                  <p className="text-xl font-bold text-blue-600 mt-0.5">{dayTotal.protein.toFixed(1)} g</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">碳水</p>
                  <p className="text-xl font-bold text-amber-600 mt-0.5">{dayTotal.carbs.toFixed(1)} g</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">脂肪</p>
                  <p className="text-xl font-bold text-green-600 mt-0.5">{dayTotal.fat.toFixed(1)} g</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">目标完成</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${achieveStatus.color}`}>{achieveStatus.label}</span>
                  <p className="text-xs text-gray-400 mt-0.5">{calDiff >= 0 ? '+' : ''}{calDiff} kcal</p>
                </div>
              </div>

              {/* 餐次详情 */}
              <div className="space-y-3">
                {dayLogs.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">当日无饮食记录</p>
                ) : (
                  ['breakfast', 'lunch', 'dinner', 'snack'].map(mealType => {
                    const mealLogs = dayLogs.filter(l => l.mealType === mealType)
                    if (mealLogs.length === 0) return null
                    return (
                      <div key={mealType} className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {MEAL_LABEL[mealType]} · {mealLogs[0].time}
                        </p>
                        <div className="space-y-1.5">
                          {mealLogs.map(log => (
                            <div key={log.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 truncate">
                                  {log.items.map(i => i.name).join('、')}
                                </p>
                                {log.photoUrl && <p className="text-[10px] text-gray-400 mt-0.5">📷 含照片记录</p>}
                              </div>
                              <p className="text-sm font-semibold text-primary-600 ml-2 flex-shrink-0">{log.totalNutrition.calories} kcal</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* 隐私提示 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm text-amber-800 font-medium mb-1">🔒 隐私提示</p>
          <p className="text-xs text-amber-700">
            所有热量数据为估算参考值，实际受烹饪方式影响。管理员查看数据仅用于产品优化，严禁泄露用户隐私。
          </p>
        </div>
      </main>
    </div>
  )
}
