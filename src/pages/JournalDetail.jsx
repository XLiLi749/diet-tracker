import { useRef, useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import useStore from '../store'
import usagiDetail from '../assets/11_躺着的乌萨奇.jpg'
import { getPhoto } from '../utils/photoStorage'

export default function JournalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getJournalById, deleteJournal } = useStore()
  const journal = getJournalById(id)
  const previewRef = useRef(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(null)

  // 从 IndexedDB 加载照片（兼容旧数据：旧版直接存 photo base64，新版存 photoId）
  useEffect(() => {
    if (!journal) return
    if (journal.photo) {
      setPhotoUrl(journal.photo)
    } else if (journal.photoId) {
      getPhoto(journal.photoId).then(url => {
        if (url) setPhotoUrl(url)
      }).catch(() => {})
    }
  }, [journal])

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🤔</div>
          <p className="text-gray-500 mb-4">找不到这条手账记录</p>
          <button
            onClick={() => navigate('/journal')}
            className="px-6 py-2 bg-primary-500 text-white rounded-full font-semibold"
          >
            返回手账列表
          </button>
        </div>
      </div>
    )
  }

  const mealLabel = (type) => ({
    breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐'
  })[type] || type

  const totalCalories = journal.items.reduce((s, i) => s + (i.calories || 0), 0)

  const handleDelete = () => {
    deleteJournal(id)
    navigate('/journal')
  }

  // 保存为图片（使用canvas绘制手账）
  const saveAsImage = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scale = 2
    const W = 375 * scale
    let currentY = 0

    // 计算高度
    const headerH = 60 * scale
    const photoH = photoUrl ? 300 * scale : 0
    const itemsH = (journal.items.length * 44 + 60) * scale
    const footerH = 50 * scale
    canvas.width = W
    canvas.height = headerH + photoH + itemsH + footerH + 40 * scale

    // 背景
    ctx.fillStyle = '#FFFDF5'
    ctx.fillRect(0, 0, W, canvas.height)

    // 顶部装饰条
    ctx.fillStyle = '#FFE066'
    ctx.fillRect(0, 0, W, 8 * scale)

    // 标题区
    currentY = 24 * scale
    ctx.fillStyle = '#333'
    ctx.font = `bold ${20 * scale}px sans-serif`
    ctx.textBaseline = 'top'
    ctx.fillText(`📔 ${dayjs(journal.date).format('YYYY年M月D日')}`, 24 * scale, currentY)
    currentY += 30 * scale
    ctx.font = `${13 * scale}px sans-serif`
    ctx.fillStyle = '#888'
    ctx.fillText(`${mealLabel(journal.mealType)} · ${dayjs(journal.createdAt).format('HH:mm')}`, 24 * scale, currentY)

    currentY = headerH + 16 * scale

    // 照片区
    if (photoUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        // 圆角照片
        const r = 20 * scale
        const photoW = W - 48 * scale
        const photoHActual = Math.min(photoH, photoW * 0.75)
        const px = 24 * scale
        const py = currentY

        ctx.save()
        roundRect(ctx, px, py, photoW, photoHActual, r)
        ctx.clip()
        const imgScale = Math.max(photoW / img.width, photoHActual / img.height)
        const dw = img.width * imgScale
        const dh = img.height * imgScale
        const dx = px + (photoW - dw) / 2
        const dy = py + (photoHActual - dh) / 2
        ctx.drawImage(img, dx, dy, dw, dh)
        ctx.restore()

        // 继续绘制
        drawItems(ctx, W, currentY + photoHActual + 24 * scale, journal, totalCalories, scale)
        downloadCanvas(canvas)
      }
      img.src = photoUrl
    } else {
      drawItems(ctx, W, currentY, journal, totalCalories, scale)
      downloadCanvas(canvas)
    }
  }

  const drawItems = (ctx, W, startY, journal, totalCal, scale) => {
    let y = startY

    // 分隔线
    ctx.strokeStyle = '#F0E6D3'
    ctx.lineWidth = 1
    ctx.setLineDash([8 * scale, 6 * scale])
    ctx.beginPath()
    ctx.moveTo(24 * scale, y)
    ctx.lineTo(W - 24 * scale, y)
    ctx.stroke()
    ctx.setLineDash([])
    y += 20 * scale

    // 菜品列表
    journal.items.forEach((item, idx) => {
      // 圆点
      ctx.fillStyle = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][idx % 5]
      ctx.beginPath()
      ctx.arc(32 * scale, y + 10 * scale, 5 * scale, 0, Math.PI * 2)
      ctx.fill()

      // 菜名
      ctx.fillStyle = '#333'
      ctx.font = `bold ${15 * scale}px sans-serif`
      ctx.textBaseline = 'top'
      ctx.fillText(item.name, 48 * scale, y)

      // 热量
      ctx.fillStyle = '#F5A623'
      ctx.font = `bold ${13 * scale}px sans-serif`
      ctx.textAlign = 'right'
      ctx.fillText(`${item.calories} kcal`, W - 24 * scale, y + 2 * scale)
      ctx.textAlign = 'left'

      y += 40 * scale
    })

    // 总计
    y += 8 * scale
    ctx.strokeStyle = '#E8DFCC'
    ctx.beginPath()
    ctx.moveTo(24 * scale, y)
    ctx.lineTo(W - 24 * scale, y)
    ctx.stroke()
    y += 16 * scale

    ctx.fillStyle = '#666'
    ctx.font = `${13 * scale}px sans-serif`
    ctx.fillText(`共 ${journal.items.length} 道菜`, 24 * scale, y)

    ctx.fillStyle = '#F5A623'
    ctx.font = `bold ${16 * scale}px sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText(`总计约 ${totalCal} kcal`, W - 24 * scale, y - 2 * scale)
    ctx.textAlign = 'left'

    // 底部水印
    y += 40 * scale
    ctx.fillStyle = '#BBB'
    ctx.font = `${11 * scale}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('—— 饮食工作台 · 美食手账 ——', W / 2, y)
    ctx.textAlign = 'left'

    // 免责声明
    y += 24 * scale
    ctx.fillStyle = '#CCC'
    ctx.font = `${9 * scale}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('* 热量为估算参考，实际烹饪油量会造成数值浮动', W / 2, y)
    ctx.textAlign = 'left'
  }

  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }

  const downloadCanvas = (canvas) => {
    const link = document.createElement('a')
    link.download = `手账_${dayjs(journal.date).format('YYYYMMDD')}_${mealLabel(journal.mealType)}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="pb-4">
      {/* 顶部导航 */}
      <div className="bg-white px-4 pt-4 pb-3 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-gray-600 text-xl">
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex-1 text-center">手账详情</h1>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 flex items-center justify-center text-red-400"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* 手账内容 */}
      <div className="px-4 mt-4" ref={previewRef}>
        <div id="journal-card" className="bg-white rounded-3xl overflow-hidden shadow-cute">
          {/* 照片区 */}
          {photoUrl && (
            <div className="relative">
              <img src={photoUrl} alt="" className="w-full" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                {dayjs(journal.date).format('YYYY.MM.DD')}
              </div>
            </div>
          )}

          {/* 信息区 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs px-2 py-0.5 bg-usagi-pinkLight text-pink-600 rounded-full font-bold">
                {mealLabel(journal.mealType)}
              </span>
              <span className="text-xs text-gray-400">
                {dayjs(journal.createdAt).format('HH:mm')}
              </span>
            </div>

            {/* 菜品列表 */}
            <div className="space-y-2">
              {journal.items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'][idx % 5] }}
                  />
                  <span className="flex-1 text-sm font-semibold text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold text-primary-500">{item.calories} kcal</span>
                </div>
              ))}
            </div>

            {/* 备注 */}
            {journal.note && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">{journal.note}</p>
              </div>
            )}

            {/* 合计 */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
              <span className="text-xs text-gray-400">共 {journal.items.length} 道菜</span>
              <span className="text-sm font-bold text-primary-500">总计约 {totalCalories} kcal</span>
            </div>

            {/* 免责声明 */}
            <p className="text-[10px] text-gray-300 mt-3 text-center">
              * 热量为估算参考，实际烹饪油量会造成数值浮动
            </p>
          </div>
        </div>

        {/* 小装饰 */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img src={usagiDetail} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs text-gray-300">—— 饮食工作台 · 美食手账 ——</span>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-gray-100 p-4 flex gap-3">
        <Link
          to="/journal/create"
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold text-center"
        >
          + 再写一条
        </Link>
        <button
          onClick={saveAsImage}
          className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-2xl font-bold"
        >
          📥 保存为图片
        </button>
      </div>

      {/* 删除确认 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowDeleteConfirm(false)}>
          <div className="w-[85%] max-w-sm bg-white rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-2">确认删除？</h3>
            <p className="text-sm text-gray-500 mb-5">删除后无法恢复哦~</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
