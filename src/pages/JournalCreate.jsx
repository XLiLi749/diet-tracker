import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import { searchFood, getFoodById, FOOD_DATABASE } from '../data/foods'
import { compressImage, savePhoto, genPhotoId, getPhoto } from '../utils/photoStorage'

export default function JournalCreate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const { addJournal, updateJournal, getJournalById, getLogsByDate } = useStore()
  const fileInputRef = useRef(null)

  const [image, setImage] = useState(null)
  const [items, setItems] = useState([])
  const [mealType, setMealType] = useState('lunch')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [showFoodPicker, setShowFoodPicker] = useState(false)
  const [searchKw, setSearchKw] = useState('')
  const [showImportPanel, setShowImportPanel] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // 编辑模式：加载已有手账数据
  useEffect(() => {
    if (!isEdit) { setLoaded(true); return }
    const journal = getJournalById(id)
    if (!journal) {
      navigate('/journal')
      return
    }
    setDate(journal.date)
    setMealType(journal.mealType)
    setNote(journal.note || '')
    setItems(journal.items || [])
    // 加载照片
    if (journal.photo) {
      setImage({ src: journal.photo })
      setLoaded(true)
    } else if (journal.photoId) {
      getPhoto(journal.photoId).then(url => {
        if (url) setImage({ src: url })
        setLoaded(true)
      }).catch(() => setLoaded(true))
    } else {
      setLoaded(true)
    }
  }, [id, isEdit])

  // 从记录导入（当天某餐）
  const importFromLog = (log) => {
    const newItems = log.items.map(it => ({
      id: 'i_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: it.name,
      calories: it.calories,
      foodId: it.foodId,
    }))
    setItems(prev => [...prev, ...newItems])
    setMealType(log.mealType)
    setShowImportPanel(false)
  }

  // 当天已有的记录（可导入）
  const todayLogs = getLogsByDate(date)

  // 处理图片上传
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        setImage({ src: ev.target.result, w: img.width, h: img.height })
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  // 搜索菜品
  const searchResults = searchKw.trim()
    ? searchFood(searchKw).slice(0, 15)
    : []

  // 添加菜品
  const addFoodItem = (food) => {
    const newItem = {
      id: 'i_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: food.name,
      calories: food.calories,
      foodId: food.id,
    }
    setItems(prev => [...prev, newItem])
    setSearchKw('')
    setShowFoodPicker(false)
  }

  // 手动输入菜品
  const addManualItem = () => {
    if (!searchKw.trim()) return
    const newItem = {
      id: 'i_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: searchKw.trim(),
      calories: 150,
      foodId: null,
    }
    setItems(prev => [...prev, newItem])
    setSearchKw('')
    setShowFoodPicker(false)
  }

  // 删除菜品
  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  // 修改菜品热量
  const updateItemCalories = (id, calories) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, calories: Number(calories) || 0 } : i))
  }

  // 保存手账（新建/编辑共用）
  const saveJournal = async () => {
    let photoId = null
    if (image?.src) {
      try {
        const compressed = await compressImage(image.src, 1280, 0.7)
        photoId = genPhotoId()
        await savePhoto(photoId, compressed)
      } catch (e) {
        console.error('保存照片失败:', e)
      }
    }
    const journalData = {
      date,
      mealType,
      note,
      photoId: photoId || (isEdit ? getJournalById(id)?.photoId : null),
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        calories: i.calories,
        foodId: i.foodId,
        points: i.points || [],
      })),
    }
    if (isEdit) {
      updateJournal(id, journalData)
      navigate(`/journal/${id}`)
    } else {
      const saved = addJournal(journalData)
      navigate(`/journal/${saved.id}`)
    }
  }

  const totalCalories = items.reduce((s, i) => s + i.calories, 0)

  return (
    <div className="pb-28">
      {/* 顶部导航 */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-gray-600 text-xl">
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex-1 text-center">
            {isEdit ? '编辑手账' : '新建手账'}
          </h1>
          <button
            onClick={saveJournal}
            disabled={items.length === 0}
            className="px-4 py-1.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full text-sm font-bold disabled:opacity-40"
          >
            保存
          </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">

        {/* 照片上传区 */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <h3 className="font-bold text-gray-800 mb-3">📷 美食照片</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          {!image ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100"
            >
              <div className="text-5xl mb-2">🍽️</div>
              <p className="text-gray-600 font-medium text-sm">点击上传照片（可选）</p>
              <p className="text-gray-400 text-xs mt-1">也可以只记录菜品不上传照片</p>
            </button>
          ) : (
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img src={image.src} alt="" className="w-full" />
              </div>
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={() => setImage(null)}
                  className="bg-red-500/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-white shadow"
                >
                  删除
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow"
                >
                  重新上传
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-3xl p-4 shadow-card space-y-3">
          <h3 className="font-bold text-gray-800">📋 基本信息</h3>
          <div>
            <label className="text-xs text-gray-500 block mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">餐次</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { k: 'breakfast', l: '早餐' }, { k: 'lunch', l: '午餐' },
                { k: 'dinner', l: '晚餐' }, { k: 'snack', l: '加餐' },
              ].map(m => (
                <button
                  key={m.k}
                  onClick={() => setMealType(m.k)}
                  className={`py-2 rounded-xl text-sm font-bold ${
                    mealType === m.k ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {m.l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 菜品列表 */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">🍲 菜品（{items.length}道）</h3>
            <div className="flex gap-2">
              {todayLogs.length > 0 && (
                <button
                  onClick={() => setShowImportPanel(true)}
                  className="px-3 py-1.5 bg-usagi-skyLight text-sky-700 rounded-full text-xs font-bold"
                >
                  从记录导入
                </button>
              )}
            </div>
          </div>

          {/* 菜品列表 */}
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>还没有添加菜品</p>
              <p className="text-xs mt-1">点击下方「添加菜品」开始记录</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                  <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.calories}
                      onChange={(e) => updateItemCalories(item.id, e.target.value)}
                      className="w-16 bg-white rounded-lg px-2 py-1 text-xs text-right outline-none border border-gray-200"
                    />
                    <span className="text-xs text-gray-500">kcal</span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 text-lg w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 添加菜品按钮 */}
          <button
            onClick={() => setShowFoodPicker(true)}
            className="w-full mt-3 py-3 border-2 border-dashed border-primary-300 text-primary-500 rounded-2xl font-bold text-sm"
          >
            + 添加菜品
          </button>

          {items.length > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
              <span className="text-xs text-gray-400">合计</span>
              <span className="text-sm font-bold text-primary-500">约 {totalCalories} kcal</span>
            </div>
          )}
        </div>

        {/* 备注 */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <h3 className="font-bold text-gray-800 mb-2">✏️ 备注（可选）</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录一下今天的心情、和谁一起吃的..."
            rows={3}
            className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none resize-none"
          />
        </div>

        <p className="text-[10px] text-gray-300 text-center pb-2">
          * 热量为估算参考，实际烹饪油量会造成数值浮动
        </p>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-gray-100 p-4">
        <button
          onClick={saveJournal}
          disabled={items.length === 0}
          className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-bold disabled:opacity-40"
        >
          💾 保存手账（{items.length}道菜 · 约{totalCalories}kcal）
        </button>
      </div>

      {/* 菜品选择弹窗 */}
      {showFoodPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center" onClick={() => setShowFoodPicker(false)}>
          <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-4 pb-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">添加菜品</h3>
              <button onClick={() => setShowFoodPicker(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchKw}
                onChange={(e) => setSearchKw(e.target.value)}
                placeholder="搜索菜品名称，如：红烧肉、米饭..."
                autoFocus
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map(food => {
                  const cuisineTag = food.tags?.find(t => ['川菜','湘菜','赣菜','粤菜','东北菜','江浙菜','鲁菜','浙菜','日料','韩餐','西餐','东南亚'].includes(t))
                  return (
                    <button
                      key={food.id}
                      onClick={() => addFoodItem(food)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left active:bg-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-800 truncate">{food.name}</span>
                          {cuisineTag && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0">{cuisineTag}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary-500 flex-shrink-0 ml-2">{food.calories} kcal</span>
                    </button>
                  )
                })
              ) : searchKw.trim() ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">没有找到「{searchKw}」</p>
                  <button
                    onClick={addManualItem}
                    className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-bold"
                  >
                    手动添加「{searchKw}」
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>输入菜品名称搜索</p>
                  <p className="text-xs mt-1">支持赣菜、湘菜、川菜等453+道菜</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 从记录导入弹窗 */}
      {showImportPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center" onClick={() => setShowImportPanel(false)}>
          <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-4 pb-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">从记录导入</h3>
              <button onClick={() => setShowImportPanel(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <p className="text-xs text-gray-500 mb-3">选择 {dayjs(date).format('M月D日')} 的一条饮食记录导入</p>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {todayLogs.map(log => {
                const mealInfo = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }[log.mealType] || log.mealType
                return (
                  <button
                    key={log.id}
                    onClick={() => importFromLog(log)}
                    className="w-full p-3 bg-gray-50 rounded-2xl text-left active:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-800">{mealInfo} · {log.time}</span>
                      <span className="text-xs font-bold text-primary-500">{log.totalNutrition.calories} kcal</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {log.items.map(i => i.name).join('、')}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
