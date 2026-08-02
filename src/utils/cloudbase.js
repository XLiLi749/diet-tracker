// ============================================================
// 腾讯云 CloudBase 云开发初始化
// ============================================================

import cloudbase from '@cloudbase/js-sdk'

const ENV_ID = 'diet-tracker-d2gr0b2gscc27183c'

let app = null
let db = null
let auth = null

export const initCloudBase = () => {
  if (app) return { app, db, auth }

  try {
    app = cloudbase.init({
      env: ENV_ID,
      region: 'ap-shanghai',
    })
    auth = app.auth({ persistence: 'local' })
    db = app.database()
    return { app, db, auth }
  } catch (e) {
    console.error('云开发初始化失败:', e)
    return null
  }
}

export const getCloudBase = () => {
  if (!app) return initCloudBase()
  return { app, db, auth }
}

export const getDb = () => {
  if (!db) initCloudBase()
  return db
}

export const getAuth = () => {
  if (!auth) initCloudBase()
  return auth
}

export default initCloudBase
