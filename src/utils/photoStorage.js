// IndexedDB 照片存储工具（大容量，不占用 localStorage）
// 同时提供图片压缩功能，减少存储占用

const DB_NAME = 'diet-tracker-photos'
const DB_VERSION = 1
const STORE_NAME = 'photos'

let dbPromise = null

// 打开 IndexedDB
const openDB = () => {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
  return dbPromise
}

// 保存照片
export const savePhoto = async (id, dataUrl) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ id, dataUrl, createdAt: Date.now() })
    tx.oncomplete = () => resolve(id)
    tx.onerror = () => reject(tx.error)
  })
}

// 读取照片
export const getPhoto = async (id) => {
  if (!id) return null
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    req.onsuccess = () => resolve(req.result?.dataUrl || null)
    req.onerror = () => reject(req.error)
  })
}

// 删除照片
export const deletePhoto = async (id) => {
  if (!id) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

// 图片压缩：最大边 1280px，质量 0.7，大幅减小体积
export const compressImage = (dataUrl, maxSize = 1280, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width)
          width = maxSize
        } else {
          width = Math.round((width * maxSize) / height)
          height = maxSize
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

// 生成照片 ID
export const genPhotoId = () => `photo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
