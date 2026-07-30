import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import useStore from '../store'

const mealLabels = {
  breakfast: { icon: '🌅', label: '早餐' },
  lunch: { icon: '🌞', label: '午餐' },
  dinner: { icon: '🌙', label: '晚餐' },
  snack: { icon: '⏰', label: '加餐' },
}

const tasteTags = [
  { key: 'spicy', label: '🌶️ 想吃辣' },
  { key: 'light', label: '🥬 清淡点' },
  { key: 'noodle', label: '🍜 面食' },
  { key: 'less_oil', label: '🥗 少油' },
  { key: 'rice', label: '🍚 米饭' },
  { key: 'soup', label: '🍲 汤类' },
  { key: 'high_protein', label: '💪 高蛋白' },
  { key: 'budget', label: '💰 省钱' },
]

const specialScenes = [
  { key: 'party', label: '今晚聚餐', icon: '🎉', tip: '适当放宽，选清蒸/凉拌，少喝饮料' },
  { key: 'busy', label: '太忙没时间', icon: '⏰', tip: '推荐便携方案：面包+牛奶+鸡蛋' },
  { key: 'poor', label: '预算紧张', icon: '💸', tip: '高性价比：馒头+粥+免费汤' },
  { key: 'exam', label: '考试周', icon: '📚', tip: '增加补脑食物：鱼类、坚果、鸡蛋' },
]

export default function Recommendation() {
  const {
    targets,
    todayRecommendations,
    generateTodayRecommendations,
    tastePreferences,
    setTastePreferences,
    getTodaySummary,
  } = useStore()

  const [activeTags, setActiveTags] = useState(tastePreferences)
  const [activeScene, setActiveScene] = useState(null)
  const [customInput, setCustomInput] = useState('')

  const summary = getTodaySummary()
  const remainingCals = Math.max(0, targets.calorieTarget - summary.calories)

  useEffect(() => {
    if (!todayRecommendations) {
      generateTodayRecommendations()
    }
  }, [todayRecommendations, generateTodayRecommendations])

  const toggleTag = (key) => {
    const newTags = activeTags.includes(key)
      ? activeTags.filter(t => t !== key)
      : [...activeTags, key]
    setActiveTags(newTags)
    setTastePreferences(newTags)
  }

  const handleSceneClick = (scene) => {
    setActiveScene(activeScene === scene.key ? null : scene.key)
  }

  const handleApplyTaste = () => {
    // 模拟：重新生成推荐
    generateTodayRecommendations()
    alert('已根据你的口味偏好调整推荐方案！')
  }

  // 营养平衡检查
  const balanceChecks = [
    { label: '蛋白质', current: summary.protein, target: targets.proteinTarget, pct: summary.proteinPct, good: 80 },
    { label: '碳水', current: summary.carbs, target: targets.carbsTarget, pct: summary.carbsPct, good: 60 },
    { label: '脂肪', current: summary.fat, target: targets.fatTarget, pct: summary.fatPct, good: 50 },
  ]

  if (!todayRecommendations) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="pb-4">
      {/* 顶部 */}
      <div className="bg-gradient-to-r from-accent-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-xl font-bold">🍽️ 智能推荐</h1>
        <p className="text-sm opacity-80 mt-1">
          基于你的身体数据和饮食目标，为你定制今日食谱
        </p>
      </div>

      {/* 口味偏好输入 */}
      <div className="px-4 -mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">💡 说说今天想吃什么？</h3>
          <div className="relative mb-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="例如：想吃辣的、来点面食、少油少盐..."
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {tasteTags.map((tag) => (
              <button
                key={tag.key}
                onClick={() => toggleTag(tag.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeTags.includes(tag.key)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
          {(activeTags.length > 0 || customInput) && (
            <button
              onClick={handleApplyTaste}
              className="w-full bg-primary-500 text-white py-2.5 rounded-xl text-sm font-semibold active:bg-primary-600"
            >
              应用偏好，调整推荐 ✨
            </button>
          )}
        </div>
      </div>

      {/* 特殊场景 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🎯 特殊场景</h3>
          <div className="grid grid-cols-2 gap-2">
            {specialScenes.map((scene) => (
              <button
                key={scene.key}
                onClick={() => handleSceneClick(scene)}
                className={`p-3 rounded-xl text-left transition-colors ${
                  activeScene === scene.key
                    ? 'bg-accent-100 border-2 border-accent-400'
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="text-xl mb-1">{scene.icon}</div>
                <p className="text-sm font-medium text-gray-800">{scene.label}</p>
              </button>
            ))}
          </div>
          {activeScene && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-700">
                💡 {specialScenes.find(s => s.key === activeScene)?.tip}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 今日固定食谱 */}
      <div className="px-4 mt-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">📅 今日固定食谱</h3>
            <button
              onClick={generateTodayRecommendations}
              className="text-xs text-primary-500 active:text-primary-700"
            >
              🔄 换一批
            </button>
          </div>

          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealKey) => {
              const meal = mealLabels[mealKey]
              const rec = todayRecommendations[mealKey]
              return (
                <div key={mealKey} className="border-l-4 border-primary-400 pl-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{meal.icon}</span>
                    <span className="font-semibold text-gray-800">{meal.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      约 {rec.totalNutrition.calories} kcal
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-sm font-medium text-gray-700">{rec.name}</p>
                    <p className="text-xs text-gray-400 mt-1">📍 {rec.canteen}</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>蛋白 {rec.totalNutrition.protein}g</span>
                      <span>碳水 {rec.totalNutrition.carbs}g</span>
                      <span>脂肪 {rec.totalNutrition.fat}g</span>
                    </div>
                  </div>
                  <button className="mt-2 text-xs text-primary-500 font-medium">
                    标记已吃 ✓
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 实时营养平衡 */}
      <div className="px-4 mt-4 mb-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">⚖️ 实时营养平衡</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">已摄入 {summary.calories} kcal</span>
            <span className="text-sm font-semibold text-primary-600">还可摄入 {remainingCals} kcal</span>
          </div>
          <div className="space-y-3">
            {balanceChecks.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`font-medium ${
                    item.pct > 100 ? 'text-red-500' : item.pct >= item.good ? 'text-green-500' : 'text-amber-500'
                  }`}>
                    {item.current}/{item.target}g
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.pct > 100 ? 'bg-red-400' : item.pct >= item.good ? 'bg-green-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, item.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-primary-50 rounded-xl">
            <p className="text-sm text-primary-700">
              💡 {summary.proteinPct < 50
                ? '蛋白质还差一些，晚餐可增加鸡胸肉或豆腐'
                : summary.carbsPct > 100
                ? '碳水超标啦，晚餐减少主食，多吃蔬菜'
                : '营养状况不错，继续保持均衡饮食！'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
