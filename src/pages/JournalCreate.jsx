import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import { searchFood, getFoodById } from '../data/foods'

// 生成模拟的AI识别勾边结果（根据图片尺寸生成随机多边形）
const generateMockDetections = (imgW, imgH) => {
  const count = Math.floor(Math.random() * 2) + 2 // 2-3道菜
  const detections = []
  const regions = [
    { x: 0.15, y: 0.2, w: 0.3, h: 0.35 },
    { x: 0.55, y: 0.15, w: 0.35, h: 0.35 },
    { x: 0.3, y: 0.55, w: 0.4, h: 0.35 },
  ]
  const sampleFoods = ['小炒黄牛肉', '番茄炒蛋', '清炒时蔬', '红烧肉', '宫保鸡丁', '鱼香肉丝']

  for (let i = 0; i < Math.min(count, regions.length); i++) {
    const r = regions[i]
    const cx = r.x + r.w / 2
    const cy = r.y + r.h / 2
    const points = []
    const segments = 12
    for (let s = 0; s < segments; s++) {
      const angle = (s / segments) * Math.PI * 2
      const variation = 0.7 + Math.random() * 0.6
      const rx = (r.w / 2) * variation
      const ry = (r.h / 2) * (0.85 + Math.random() * 0.3)
      points.push({
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
      })
    }
    const name = sampleFoods[Math.floor(Math.random() * sampleFoods.length)]
    const matched = searchFood(name)[0]
    detections.push({
      id: 'd_' + Date.now() + '_' + i,
      name,
      calories: matched ? matched.calories : 150,
      foodId: matched ? matched.id : null,
      points,
      color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][i % 5],
    })
  }
  return detections
}

export default function JournalCreate() {
  const navigate = useNavigate()
  const { addJournal } = useStore()
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const [step, setStep] = useState(1) // 1=上传, 2=勾边编辑, 3=手账确认
  const [image, setImage] = useState(null) // { src, w, h }
  const [detections, setDetections] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawPoints, setDrawPoints] = useState([])
  const [mealType, setMealType] = useState('lunch')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // 绘制Canvas
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // 清空
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 绘制图片
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = (canvas.width - dw) / 2
      const dy = (canvas.height - dh) / 2

      ctx.drawImage(img, dx, dy, dw, dh)

      // 存储图片在canvas中的位置
      canvas._imgRect = { dx, dy, dw, dh, iw: img.width, ih: img.height }

      // 绘制每个菜品的勾边
      detections.forEach(d => {
        ctx.save()
        const pts = d.points.map(p => ({
          x: dx + p.x * dw,
          y: dy + p.y * dh,
        }))

        // 填充半透明色
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        pts.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.closePath()
        ctx.fillStyle = d.color + '22'
        ctx.fill()

        // 手绘风格虚线边框
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        pts.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.closePath()
        ctx.strokeStyle = selectedId === d.id ? d.color : '#333'
        ctx.lineWidth = selectedId === d.id ? 3 : 2
        ctx.setLineDash(selectedId === d.id ? [] : [6, 4])
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()

        // 菜品名称标签
        const labelY = pts[0].y - 8
        ctx.setLineDash([])
        ctx.font = 'bold 11px sans-serif'
        const label = d.name
        const labelW = ctx.measureText(label).width + 12
        ctx.fillStyle = d.color
        ctx.beginPath()
        roundRect(ctx, pts[0].x - 2, labelY - 14, labelW, 20, 6)
        ctx.fill()
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, pts[0].x + 4, labelY - 4)

        ctx.restore()
      })

      // 正在绘制的新选区
      if (drawPoints.length > 0) {
        ctx.save()
        ctx.beginPath()
        const dp = drawPoints.map(p => ({
          x: dx + p.x * dw,
          y: dy + p.y * dh,
        }))
        ctx.moveTo(dp[0].x, dp[0].y)
        dp.forEach(p => ctx.lineTo(p.x, p.y))
        ctx.strokeStyle = '#FF6B6B'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 3])
        ctx.stroke()
        ctx.restore()
      }
    }
    img.src = image.src
  }, [image, detections, selectedId, drawPoints])

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

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

  // AI识别（模拟）
  const startAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const dets = generateMockDetections(image.w, image.h)
      setDetections(dets)
      setIsAnalyzing(false)
      setStep(2)
    }, 1500)
  }

  // Canvas坐标转相对坐标
  const canvasToRel = (clientX, clientY) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const imgRect = canvas._imgRect
    if (!imgRect) return null
    const x = (clientX - rect.left - imgRect.dx) / imgRect.dw
    const y = (clientY - rect.top - imgRect.dy) / imgRect.dh
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
  }

  // 点击检测选中的菜品
  const handleCanvasClick = (e) => {
    if (isDrawing) return
    const pos = canvasToRel(e.clientX, e.clientY)
    if (!pos) return

    // 检查点击了哪个选区
    let found = null
    for (const d of detections) {
      if (pointInPolygon(pos, d.points)) {
        found = d.id
        break
      }
    }
    setSelectedId(found)
  }

  const pointInPolygon = (p, polygon) => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y
      const xj = polygon[j].x, yj = polygon[j].y
      if (((yi > p.y) !== (yj > p.y)) && (p.x < (xj - xi) * (p.y - yi) / (yj - yi) + xi)) {
        inside = !inside
      }
    }
    return inside
  }

  // 开始绘制新选区
  const startDraw = () => {
    setIsDrawing(true)
    setSelectedId(null)
    setDrawPoints([])
  }

  const handleCanvasMove = (e) => {
    if (!isDrawing) return
    const pos = canvasToRel(e.clientX, e.clientY)
    if (!pos) return
    setDrawPoints(prev => [...prev, pos])
  }

  const handleCanvasUp = () => {
    if (!isDrawing || drawPoints.length < 5) {
      setIsDrawing(false)
      setDrawPoints([])
      return
    }
    // 简化点集
    const simplified = simplifyPoints(drawPoints, 12)
    const newDet = {
      id: 'd_' + Date.now(),
      name: '新菜品',
      calories: 150,
      foodId: null,
      points: simplified,
      color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][detections.length % 5],
    }
    setDetections(prev => [...prev, newDet])
    setSelectedId(newDet.id)
    setIsDrawing(false)
    setDrawPoints([])
  }

  const simplifyPoints = (pts, target) => {
    if (pts.length <= target) return pts
    const result = []
    const step = pts.length / target
    for (let i = 0; i < target; i++) {
      result.push(pts[Math.floor(i * step)])
    }
    return result
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setDetections(prev => prev.filter(d => d.id !== selectedId))
    setSelectedId(null)
  }

  const updateDetection = (id, updates) => {
    setDetections(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }

  // 绑定菜品库
  const bindFood = (detId, foodId) => {
    const food = getFoodById(foodId)
    if (food) {
      updateDetection(detId, { foodId, name: food.name, calories: food.calories })
    }
  }

  // 保存手账
  const saveJournal = () => {
    const journal = {
      date,
      mealType,
      note,
      photo: image?.src || null,
      items: detections.map(d => ({
        id: d.id,
        name: d.name,
        calories: d.calories,
        foodId: d.foodId,
        points: d.points,
      })),
    }
    const saved = addJournal(journal)
    navigate(`/journal/${saved.id}`)
  }

  const selectedDet = detections.find(d => d.id === selectedId)

  return (
    <div className="pb-4">
      {/* 顶部导航 */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-gray-600 text-xl">
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex-1 text-center pr-10">
            {step === 1 ? '上传图片' : step === 2 ? '调整勾边' : '确认手账'}
          </h1>
        </div>
        {/* 步骤条 */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= s ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* 步骤1：上传图片 */}
      {step === 1 && (
        <div className="px-4 mt-4">
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
              className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-gray-50 active:bg-gray-100"
            >
              <div className="text-6xl mb-4">📷</div>
              <p className="text-gray-600 font-medium">点击上传餐食照片</p>
              <p className="text-gray-400 text-xs mt-1">支持 JPG、PNG 格式</p>
            </button>
          ) : (
            <div>
              <div className="rounded-3xl overflow-hidden">
                <img src={image.src} alt="" className="w-full" />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold"
                >
                  重新上传
                </button>
                <button
                  onClick={startAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-bold disabled:opacity-50"
                >
                  {isAnalyzing ? 'AI识别中...' : '开始AI识别'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 步骤2：勾边编辑 */}
      {step === 2 && image && (
        <div>
          <div className="px-4 mt-3">
            <div className="text-xs text-gray-500 mb-2 px-1">
              {isDrawing ? '✏️ 在图片上拖动绘制新选区' : '点击选区可选中编辑 · 支持新增/删除/调整'}
            </div>
            <div className="relative rounded-3xl overflow-hidden bg-black">
              <canvas
                ref={canvasRef}
                className="w-full touch-none"
                style={{ aspectRatio: `${image.w}/${image.h}`, cursor: isDrawing ? 'crosshair' : 'pointer' }}
                onClick={handleCanvasClick}
                onMouseDown={isDrawing ? () => {} : undefined}
                onMouseMove={handleCanvasMove}
                onMouseUp={handleCanvasUp}
                onMouseLeave={handleCanvasUp}
                onTouchStart={(e) => {
                  if (isDrawing) {
                    const t = e.touches[0]
                    handleCanvasMove({ clientX: t.clientX, clientY: t.clientY })
                  }
                }}
                onTouchMove={(e) => {
                  if (isDrawing) {
                    const t = e.touches[0]
                    handleCanvasMove({ clientX: t.clientX, clientY: t.clientY })
                  }
                }}
                onTouchEnd={handleCanvasUp}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="px-4 mt-3 flex gap-2">
            <button
              onClick={startDraw}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${
                isDrawing ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isDrawing ? '✏️ 绘制中...' : '+ 新增选区'}
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedId}
              className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-50 text-red-500 disabled:opacity-40"
            >
              🗑️ 删除选中
            </button>
          </div>

          {/* 选中的菜品编辑 */}
          {selectedDet && (
            <div className="px-4 mt-4">
              <div className="bg-white rounded-2xl p-4 shadow-card">
                <h4 className="font-bold text-gray-800 mb-3">编辑菜品</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">菜品名称</label>
                    <input
                      type="text"
                      value={selectedDet.name}
                      onChange={(e) => updateDetection(selectedId, { name: e.target.value })}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">预估热量 (kcal)</label>
                    <input
                      type="number"
                      value={selectedDet.calories}
                      onChange={(e) => updateDetection(selectedId, { calories: Number(e.target.value) })}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-300"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      * 估算参考，实际烹饪油量会造成数值浮动
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">绑定菜品库（可选）</label>
                    <select
                      value={selectedDet.foodId || ''}
                      onChange={(e) => e.target.value && bindFood(selectedId, e.target.value)}
                      className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      <option value="">不绑定 / 手动输入</option>
                      {searchFood(selectedDet.name).slice(0, 8).map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.calories}kcal)</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 菜品列表 */}
          <div className="px-4 mt-4 mb-20">
            <div className="text-sm font-bold text-gray-700 mb-2">识别到 {detections.length} 道菜</div>
            <div className="space-y-2">
              {detections.map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer ${
                    selectedId === d.id ? 'bg-primary-50 border-2 border-primary-300' : 'bg-white shadow-card'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{d.name}</div>
                  </div>
                  <div className="text-sm font-bold text-primary-600">{d.calories} kcal</div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步按钮 */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-gray-100 p-4">
            <button
              onClick={() => setStep(3)}
              disabled={detections.length === 0}
              className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-bold disabled:opacity-40"
            >
              下一步 · 生成手账 ({detections.length}道菜)
            </button>
          </div>
        </div>
      )}

      {/* 步骤3：手账确认 */}
      {step === 3 && image && (
        <div className="px-4 mt-4 pb-24">
          {/* 手账预览卡 */}
          <div id="journal-preview" className="bg-white rounded-3xl overflow-hidden shadow-cute">
            {/* 照片区 */}
            <div className="relative">
              <img src={image.src} alt="" className="w-full" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                {dayjs(date).format('YYYY.MM.DD')} · {mealLabel(mealType)}
              </div>
            </div>

            {/* 菜品标签区 */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {detections.map((d, idx) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-semibold text-gray-700">{d.name}</span>
                    <span className="text-[10px] text-primary-500 font-bold">{d.calories}kcal</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>共 {detections.length} 道菜</span>
                <span className="font-bold text-primary-500">
                  总计约 {detections.reduce((s, d) => s + d.calories, 0)} kcal
                </span>
              </div>
            </div>
          </div>

          {/* 基本信息 */}
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-card space-y-3">
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
            <div>
              <label className="text-xs text-gray-500 block mb-1">备注（可选）</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="记录一下今天的心情..."
                rows={2}
                className="w-full bg-gray-50 rounded-xl px-3 py-2 text-sm outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-gray-100 p-4 flex gap-3">
          <button
            onClick={() => setStep(2)}
            className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-bold"
          >
            返回调整
          </button>
          <button
            onClick={saveJournal}
            className="flex-1 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-bold"
          >
            💾 保存手账
          </button>
        </div>
      )}
    </div>
  )
}

function mealLabel(type) {
  return { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' }[type] || type
}
