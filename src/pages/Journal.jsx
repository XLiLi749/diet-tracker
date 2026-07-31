import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import usagiJournal from '../assets/12_购物的乌萨奇.jpg'
import { getPhoto } from '../utils/photoStorage'

// 单条手账卡片（异步加载照片）
function JournalCard({ j, mealLabel, foodLogs }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  useEffect(() => {
    if (j.photo) {
      setPhotoUrl(j.photo)
    } else if (j.photoId) {
      getPhoto(j.photoId).then(url => url && setPhotoUrl(url)).catch(() => {})
    }
  }, [j.photo, j.photoId])

  // 如果手账关联了 logId，从记录中取最新菜品
  const effectiveItems = (() => {
    if (!j.logId) return j.items || []
    const dayLogs = foodLogs[j.date] || []
    const log = dayLogs.find(l => l.id === j.logId)
    if (!log) return j.items || []
    return log.items.map(it => ({
      id: it.foodId || it.id,
      name: it.name,
      calories: it.calories,
    }))
  })()

  const totalCals = effectiveItems.reduce((s, i) => s + (i.calories || 0), 0)

  return (
    <Link
      to={`/journal/${j.id}`}
      className="block bg-white rounded-3xl p-3 shadow-card active:scale-[0.99] transition-transform"
    >
      <div className="flex gap-3">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
          {photoUrl ? (
            <img src={photoUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 bg-usagi-pinkLight text-pink-600 rounded-full font-bold">
              {mealLabel(j.mealType)}
            </span>
            <span className="text-xs text-gray-400">
              {dayjs(j.createdAt).format('HH:mm')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {effectiveItems.slice(0, 3).map((item, idx) => (
              <span key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">
                {item.name}
              </span>
            ))}
            {effectiveItems.length > 3 && (
              <span className="text-xs text-gray-400">+{effectiveItems.length - 3}</span>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            共 {effectiveItems.length} 道菜 · 约 {totalCals} kcal
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Journal() {
  const { getAllJournals, foodLogs } = useStore()
  const journals = getAllJournals()

  const grouped = useMemo(() => {
    const map = {}
    journals.forEach(j => {
      if (!map[j.date]) map[j.date] = []
      map[j.date].push(j)
    })
    const dates = Object.keys(map).sort((a, b) => b.localeCompare(a))
    return dates.map(d => ({ date: d, items: map[d] }))
  }, [journals])

  const mealLabel = (type) => ({
    breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐'
  })[type] || type

  return (
    <div className="pb-4">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-usagi-pinkLight via-usagi-cream to-usagi-skyLight px-5 pt-12 pb-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/30" />
        <div className="absolute left-12 bottom-6 w-3 h-3 rounded-full bg-white/60" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-cute flex-shrink-0">
            <img src={usagiJournal} alt="乌萨奇" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">📔 美食手账</h1>
            <p className="text-sm text-gray-600 mt-1">记录每一餐的美好瞬间</p>
          </div>
        </div>
      </div>

      {/* 新建按钮 */}
      <div className="px-4 mt-4">
        <Link
          to="/journal/create"
          className="block w-full bg-gradient-to-r from-usagi-yellow to-primary-400 text-white font-bold py-4 rounded-3xl text-center shadow-cute active:scale-[0.98] transition-transform"
        >
          📷 拍照创建新手账
        </Link>
      </div>

      {/* 手账列表 - 按日期分组 */}
      <div className="px-4 mt-6 space-y-6">
        {grouped.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-usagi-pinkLight/50 flex items-center justify-center text-5xl">
              📔
            </div>
            <p className="text-gray-400 text-sm">还没有手账记录哦~</p>
            <p className="text-gray-300 text-xs mt-1">点击上方按钮创建第一条吧</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary-400" />
                <span className="text-sm font-bold text-gray-700">
                  {dayjs(group.date).format('YYYY年M月D日')}
                  <span className="text-gray-400 font-normal ml-2">
                    {dayjs(group.date).format('dddd')}
                  </span>
                </span>
                <span className="text-xs text-gray-400 ml-auto">{group.items.length} 条</span>
              </div>
              <div className="space-y-3">
                {group.items.map(j => (
                  <JournalCard key={j.id} j={j} mealLabel={mealLabel} foodLogs={foodLogs} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
