import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import { getAdminLogs } from '../data/adminMock'

const GOAL_LABEL = { fat_loss: '减脂', muscle_gain: '增肌', weight_gain: '增重', maintain: '维持' }
const GOAL_COLOR = { fat_loss: 'bg-red-100 text-red-700', muscle_gain: 'bg-blue-100 text-blue-700', weight_gain: 'bg-green-100 text-green-700', maintain: 'bg-gray-100 text-gray-700' }

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { adminLoggedIn, adminLogout, ensureMockUsers, logAdminAction } = useStore()
  const [search, setSearch] = useState('')
  const [goalFilter, setGoalFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [showLogs, setShowLogs] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    if (!adminLoggedIn) {
      navigate('/admin/login', { replace: true })
    }
  }, [adminLoggedIn, navigate])

  const users = ensureMockUsers() || []

  // 统计数据
  const stats = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const totalUsers = users.length
    const activeToday = users.filter(u => u.stats.isActiveToday).length
    const newThisWeek = users.filter(u => dayjs(u.profile.createdAt).isAfter(dayjs().subtract(7, 'day'))).length
    const active7Days = users.filter(u => u.stats.activeDays7 >= 3).length

    const goalDist = { fat_loss: 0, muscle_gain: 0, weight_gain: 0, maintain: 0 }
    let totalAchieveRate = 0
    let userWithData = 0

    users.forEach(u => {
      const g = u.profile.dietGoal?.type || 'maintain'
      goalDist[g] = (goalDist[g] || 0) + 1

      const recentLogs = u.logs.filter(l => dayjs(l.date).isAfter(dayjs().subtract(7, 'day')))
      if (recentLogs.length > 0) {
        userWithData++
        const days = [...new Set(recentLogs.map(l => l.date))]
        let achieveDays = 0
        days.forEach(d => {
          const dayTotal = u.logs.filter(l => l.date === d).reduce((s, l) => s + l.totalNutrition.calories, 0)
          const target = u.profile.targets?.calorieTarget || 2000
          if (Math.abs(dayTotal - target) / target < 0.15) achieveDays++
        })
        totalAchieveRate += achieveDays / days.length
      }
    })

    const avgAchieveRate = userWithData > 0 ? Math.round((totalAchieveRate / userWithData) * 100) : 0

    return { totalUsers, activeToday, newThisWeek, active7Days, goalDist, avgAchieveRate }
  }, [users])

  // 筛选用户
  const filteredUsers = useMemo(() => {
    let list = users
    if (search.trim()) {
      const kw = search.trim().toLowerCase()
      list = list.filter(u =>
        u.profile.nickname.toLowerCase().includes(kw) ||
        u.profile.id.toLowerCase().includes(kw) ||
        u.profile.profession?.toLowerCase().includes(kw)
      )
    }
    if (goalFilter !== 'all') {
      list = list.filter(u => u.profile.dietGoal?.type === goalFilter)
    }
    return list
  }, [users, search, goalFilter])

  // 导出用户数据
  const exportUserData = (userData) => {
    const rows = [['日期', '餐次', '食物明细', '热量(kcal)', '蛋白质(g)', '碳水(g)', '脂肪(g)', '目标热量', '是否达标']]
    const target = userData.profile.targets?.calorieTarget || 2000

    // 按日期聚合
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
      const isAch = Math.abs(d.total.calories - target) / target < 0.15 ? '达标' : (d.total.calories < target ? '摄入不足' : '摄入超标')
      rows.push([date, d.meals.length + '餐', foodNames, d.total.calories, d.total.protein.toFixed(1), d.total.carbs.toFixed(1), d.total.fat.toFixed(1), target, isAch])
    })

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${userData.profile.nickname}_饮食记录_${dayjs().format('YYYYMMDD')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    logAdminAction('EXPORT', `导出用户 ${userData.profile.nickname} (${userData.profile.id}) 的饮食数据`)
  }

  // 导出批量统计
  const exportBatchStats = () => {
    const rows = [['用户ID', '昵称', '性别', '年龄', '身高', '体重', 'BMI', '目标类型', '目标体重', '每日热量目标', '注册日期', '活跃天数(近7天)', '总记录天数']]
    users.forEach(u => {
      const p = u.profile
      rows.push([
        p.id, p.nickname, p.gender === 'male' ? '男' : '女', p.age, p.height, p.weight,
        p.bmi?.toFixed(1), GOAL_LABEL[p.dietGoal?.type] || '维持', p.dietGoal?.targetWeight,
        p.targets?.calorieTarget || '-', p.createdAt, u.stats.activeDays7, u.stats.totalLogDays
      ])
    })
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `用户批量统计_${dayjs().format('YYYYMMDD')}.csv`
    a.click()
    URL.revokeObjectURL(url)
    logAdminAction('EXPORT_BATCH', '导出全部用户批量统计数据')
  }

  if (!adminLoggedIn) return null

  const logs = getAdminLogs()

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 顶部导航 */}
      <header className="bg-slate-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-lg font-bold">管</div>
            <div>
              <h1 className="text-lg font-bold">饮食工作台 · 管理后台</h1>
              <p className="text-xs text-slate-400">管理员：admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm text-slate-300 hover:text-white transition">用户前台</button>
            <button onClick={() => { adminLogout(); navigate('/admin/login', { replace: true }) }} className="text-sm text-red-400 hover:text-red-300 transition">退出登录</button>
          </div>
        </div>
      </header>

      {/* Tab */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex gap-6">
          {[
            { key: 'users', label: '📊 数据看板' },
            { key: 'logs', label: '📝 操作日志' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition ${activeTab === tab.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* 总览面板 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: '总用户数', value: stats.totalUsers, sub: '全部注册用户', color: 'from-blue-500 to-blue-600' },
                { label: '今日在线', value: stats.activeToday, sub: '今日有记录用户', color: 'from-green-500 to-green-600' },
                { label: '本周新增', value: stats.newThisWeek, sub: '近7天新注册', color: 'from-purple-500 to-purple-600' },
                { label: '平均达标率', value: stats.avgAchieveRate + '%', sub: '近7天热量达标', color: 'from-amber-500 to-amber-600' },
              ].map((s, i) => (
                <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
                  <p className="text-sm opacity-90">{s.label}</p>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                  <p className="text-xs opacity-80 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* 目标分布 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">用户目标类型分布</h3>
                <button onClick={exportBatchStats} className="text-sm text-primary-600 hover:text-primary-700 font-medium">📥 导出全部统计</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(GOAL_LABEL).map(([key, label]) => (
                  <div key={key} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-gray-800">{stats.goalDist[key] || 0}</p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${GOAL_COLOR[key]}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 筛选 + 搜索 */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索昵称 / 用户ID / 职业..."
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                <select
                  value={goalFilter}
                  onChange={(e) => setGoalFilter(e.target.value)}
                  className="bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="all">全部目标类型</option>
                  <option value="fat_loss">减脂</option>
                  <option value="weight_gain">增重</option>
                  <option value="muscle_gain">增肌</option>
                  <option value="maintain">维持</option>
                </select>
              </div>

              <p className="text-xs text-gray-500">共找到 {filteredUsers.length} 位用户</p>

              {/* 用户列表 */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="py-3 pr-4 font-medium">用户</th>
                      <th className="py-3 pr-4 font-medium">身体数据</th>
                      <th className="py-3 pr-4 font-medium">目标</th>
                      <th className="py-3 pr-4 font-medium">活跃度</th>
                      <th className="py-3 pr-4 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => {
                      const p = u.profile
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {p.nickname?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{p.nickname}</p>
                                <p className="text-xs text-gray-400">{p.id} · {p.profession}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-gray-700">{p.height}cm / {p.weight}kg</p>
                            <p className="text-xs text-gray-400">BMI {p.bmi?.toFixed(1)} · {p.gender === 'male' ? '男' : '女'} · {p.age}岁</p>
                          </td>
                          <td className="py-4 pr-4">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${GOAL_COLOR[p.dietGoal?.type] || GOAL_COLOR.maintain}`}>
                              {GOAL_LABEL[p.dietGoal?.type] || '维持'}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">目标 {p.dietGoal?.targetWeight}kg · {p.targets?.calorieTarget} kcal/天</p>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="text-gray-700">近7天活跃 {u.stats.activeDays7} 天</p>
                            <p className="text-xs text-gray-400">累计记录 {u.stats.totalLogDays} 天</p>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  logAdminAction('VIEW_USER', `查看用户 ${p.nickname} (${p.id}) 的详情`)
                                  navigate(`/admin/user/${p.id}`)
                                }}
                                className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary-100"
                              >
                                查看详情
                              </button>
                              <button
                                onClick={() => exportUserData(u)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200"
                              >
                                导出数据
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">管理员操作日志</h3>
            <div className="space-y-2">
              {logs.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">暂无操作记录</p>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800">{log.action}</span>
                        <span className="text-xs text-gray-400">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{log.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 隐私提示 */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm text-amber-800 font-medium mb-2">🔒 隐私与合规提示</p>
          <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
            <li>管理员查看用户数据仅用于产品优化、功能迭代分析</li>
            <li>严格禁止随意对外泄露任何用户个人数据</li>
            <li>禁止私自传播用户饮食记录、身高体重等隐私信息</li>
            <li>所有导出数据请妥善保管，使用完毕及时删除</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
