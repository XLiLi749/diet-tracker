import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import { FOOD_DATABASE, searchFood } from '../data/foods'

const mealLabels = {
  breakfast: { icon: '🌅', label: '早餐' },
  lunch: { icon: '🌞', label: '午餐' },
  dinner: { icon: '🌙', label: '晚餐' },
  snack: { icon: '⏰', label: '加餐' },
}

export default function FoodLog() {
  const [searchParams] = useSearchParams()
  const preselectMeal = searchParams.get('meal')

  const {
    targets,
    getLogsByDate,
    getTodaySummary,
    addFoodLog,
    deleteFoodLog,
  } = useStore()

  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(preselectMeal || 'breakfast')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedItems, setSelectedItems] = useState([]) // {foodId, name, quantity, ...nutrition}
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState(null)

  const logs = getLogsByDate(selectedDate)
  const summary = getTodaySummary()

  const searchResults = useMemo(() => searchFood(searchKeyword), [searchKeyword])

  // 按餐次分组
  const groupedLogs = useMemo(() => {
    const groups = { breakfast: [], lunch: [], dinner: [], snack: [] }
    logs.forEach(log => {
      if (groups[log.mealType]) groups[log.mealType].push(log)
    })
    return groups
  }, [logs])

  const handleSelectFood = (food) => {
    const qty = 100
    const factor = qty / 100
    const newItem = {
      foodId: food.id,
      name: food.name,
      quantity: qty,
      unit: 'g',
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
    }
    setSelectedItems([...selectedItems, newItem])
  }

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index))
  }

  const handleUpdateQty = (index, qty) => {
    const food = FOOD_DATABASE.find(f => f.id === selectedItems[index].foodId)
    if (!food) return
    const factor = qty / 100
    const updated = [...selectedItems]
    updated[index] = {
      ...updated[index],
      quantity: qty,
      calories: Math.round(food.calories * factor),
      protein: Math.round(food.protein * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
    }
    setSelectedItems(updated)
  }

  const handleConfirmAdd = () => {
    if (selectedItems.length === 0) return
    addFoodLog(selectedDate, selectedMeal, selectedItems)
    setSelectedItems([])
    setShowAddPanel(false)
    setSearchKeyword('')
  }

  // 处理拍照/相册选择
  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCapturedPhoto(ev.target?.result)
    }
    reader.readAsDataURL(file)
  }

  // 模拟AI识别
  const handleSimulateAi = () => {
    // 随机选几个食物作为识别结果
    const sample = FOOD_DATABASE.slice(0, 8)
    const picks = []
    for (let i = 0; i < 3; i++) {
      const f = sample[Math.floor(Math.random() * sample.length)]
      const qty = 100 + Math.floor(Math.random() * 50)
      const factor = qty / 100
      picks.push({
        foodId: f.id,
        name: f.name,
        quantity: qty,
        unit: 'g',
        calories: Math.round(f.calories * factor),
        protein: Math.round(f.protein * factor * 10) / 10,
        carbs: Math.round(f.carbs * factor * 10) / 10,
        fat: Math.round(f.fat * factor * 10) / 10,
      })
    }
    setSelectedItems(picks)
    setCapturedPhoto(null)
    setShowAiPanel(false)
    setShowAddPanel(true)
  }

  // 日期导航
  const goPrevDay = () => setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'))
  const goNextDay = () => setSelectedDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'))
  const isToday = selectedDate === dayjs().format('YYYY-MM-DD')

  return (
    <div className="pb-4">
      {/* 顶部导航 */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-800">📸 饮食记录</h1>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5">
            <button onClick={goPrevDay} className="w-6 h-6 flex items-center justify-center text-gray-500">‹</button>
            <span className="text-sm font-medium text-gray-700 min-w-[80px] text-center">
              {isToday ? '今天' : selectedDate}
            </span>
            <button
              onClick={goNextDay}
              disabled={isToday}
              className={`w-6 h-6 flex items-center justify-center ${isToday ? 'text-gray-300' : 'text-gray-500'}`}
            >›</button>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAiPanel(true)}
            className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-4 text-left shadow-card active:scale-[0.98] transition-transform"
          >
            <div className="text-2xl mb-2">📷</div>
            <div className="font-semibold">拍照识别</div>
            <div className="text-xs opacity-80 mt-0.5">AI自动识别食物</div>
          </button>
          <button
            onClick={() => setShowAddPanel(true)}
            className="bg-white text-gray-800 rounded-2xl p-4 text-left shadow-card active:scale-[0.98] transition-transform border border-gray-100"
          >
            <div className="text-2xl mb-2">✏️</div>
            <div className="font-semibold">手动添加</div>
            <div className="text-xs text-gray-500 mt-0.5">从食物库选择</div>
          </button>
        </div>
      </div>

      {/* 饮食记录列表 */}
      <div className="px-4 mt-5 space-y-4">
        {Object.entries(mealLabels).map(([mealKey, meal]) => {
          const mealLogs = groupedLogs[mealKey] || []
          return (
            <div key={mealKey} className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meal.icon}</span>
                  <span className="font-semibold text-gray-800">{meal.label}</span>
                  {mealLogs.length > 0 && (
                    <span className="text-xs text-gray-400">{mealLogs[0].time}</span>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedMeal(mealKey); setShowAddPanel(true) }}
                  className="text-primary-500 text-sm font-medium"
                >
                  + 添加
                </button>
              </div>

              {mealLogs.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">暂无记录，快添加吧~</p>
              ) : (
                <div className="space-y-3">
                  {mealLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="space-y-1">
                        {log.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} <span className="text-gray-400 text-xs">{item.quantity}{item.unit}</span>
                            </span>
                            <span className="text-gray-500 text-xs">{item.calories} kcal</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          合计: {log.totalNutrition.calories} kcal · 蛋白{log.totalNutrition.protein}g
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('确定删除这条记录吗？')) {
                              deleteFoodLog(selectedDate, log.id)
                            }
                          }}
                          className="text-xs text-red-400"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 当日汇总 */}
      <div className="px-4 mt-5">
        <div className="bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl p-4">
          <h3 className="font-semibold mb-3">📊 当日汇总</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-80">总热量</p>
              <p className="text-xl font-bold">{summary.calories} <span className="text-sm font-normal opacity-80">/ {targets.calorieTarget} kcal</span></p>
            </div>
            <div>
              <p className="text-xs opacity-80">蛋白质</p>
              <p className="text-xl font-bold">{summary.protein} <span className="text-sm font-normal opacity-80">/ {targets.proteinTarget}g</span></p>
            </div>
            <div>
              <p className="text-xs opacity-80">碳水</p>
              <p className="text-xl font-bold">{summary.carbs} <span className="text-sm font-normal opacity-80">/ {targets.carbsTarget}g</span></p>
            </div>
            <div>
              <p className="text-xs opacity-80">脂肪</p>
              <p className="text-xl font-bold">{summary.fat} <span className="text-sm font-normal opacity-80">/ {targets.fatTarget}g</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 添加面板 */}
      {showAddPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => { setShowAddPanel(false); setSelectedItems([]) }}>
          <div
            className="w-full max-w-md mx-auto bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">添加{mealLabels[selectedMeal].label}</h2>
                <button onClick={() => { setShowAddPanel(false); setSelectedItems([]) }} className="text-gray-400 text-xl">×</button>
              </div>
              {/* 餐次切换 */}
              <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                {Object.entries(mealLabels).map(([key, meal]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMeal(key)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedMeal === key
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {meal.icon} {meal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 已选食物 */}
            {selectedItems.length > 0 && (
              <div className="px-5 py-3 bg-primary-50">
                <p className="text-xs font-medium text-primary-700 mb-2">已选 {selectedItems.length} 项</p>
                <div className="space-y-2">
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white rounded-lg p-2">
                      <span className="text-sm flex-1">{item.name}</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQty(idx, Number(e.target.value) || 0)}
                        className="w-16 text-center text-sm border border-gray-200 rounded py-1"
                      />
                      <span className="text-xs text-gray-400">{item.unit}</span>
                      <span className="text-xs text-gray-500 w-14 text-right">{item.calories}kcal</span>
                      <button onClick={() => handleRemoveItem(idx)} className="text-red-400 text-lg">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索 */}
            <div className="px-5 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索食物名称，如米饭、鸡胸肉..."
                  className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* 搜索结果 */}
            <div className="flex-1 overflow-y-auto px-5 pb-3">
              <div className="space-y-2">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{food.name}</p>
                      <p className="text-xs text-gray-400">{food.category} · {food.calories} kcal/100g</p>
                    </div>
                    <span className="text-primary-500 text-lg">+</span>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-8">没有找到相关食物</p>
                )}
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="px-5 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={handleConfirmAdd}
                disabled={selectedItems.length === 0}
                className={`w-full py-3.5 rounded-xl font-semibold transition-colors ${
                  selectedItems.length > 0
                    ? 'bg-primary-500 text-white active:bg-primary-600'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI识别面板 */}
      {showAiPanel && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center" onClick={() => { setShowAiPanel(false); setCapturedPhoto(null) }}>
          <div
            className="w-full max-w-md mx-auto bg-white rounded-3xl mx-4 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center overflow-y-auto">
              {capturedPhoto ? (
                <>
                  <div className="text-3xl mb-3">✅</div>
                  <h2 className="text-lg font-bold text-gray-800 mb-3">照片已拍摄</h2>
                  <div className="bg-gray-100 rounded-2xl p-2 mb-4">
                    <img src={capturedPhoto} alt="拍摄的食物" className="w-full h-48 object-cover rounded-xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    点击下方按钮，AI将开始识别食物种类和营养成分
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleSimulateAi}
                      className="w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold active:bg-primary-600"
                    >
                      🔍 开始AI识别
                    </button>
                    <button
                      onClick={() => setCapturedPhoto(null)}
                      className="w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold active:bg-gray-200"
                    >
                      📸 重新拍照
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">📷</div>
                  <h2 className="text-lg font-bold text-gray-800 mb-2">拍照识别</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    对准食物拍照，AI将自动识别食物种类并估算营养成分
                  </p>
                  <div className="space-y-3">
                    <label className="block w-full bg-primary-500 text-white py-3.5 rounded-xl font-semibold active:bg-primary-600 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                      📸 拍照识别
                    </label>
                    <label className="block w-full bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold active:bg-gray-200 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoCapture}
                        className="hidden"
                      />
                      🖼️ 从相册选择
                    </label>
                    <button
                      onClick={() => { setShowAiPanel(false); setCapturedPhoto(null) }}
                      className="w-full text-gray-400 py-2 text-sm"
                    >
                      取消
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    * AI识别为演示模式，将基于食物库智能匹配识别结果
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
