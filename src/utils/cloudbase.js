// ============================================================
// 腾讯云 CloudBase 云开发初始化
// ============================================================

import cloudbase from '@cloudbase/js-sdk'

const ENV_ID = 'diet-tracker-d2gr0b2gscc27183c'

let app = null
let db = null
let auth = null
let initPromise = null

export const initCloudBase = () => {
  if (initPromise) return initPromise

  initPromise = (async () => {
    if (app) return { app, db, auth }

    try {
      app = cloudbase.init({
        env: ENV_ID,
        region: 'ap-shanghai',
      })
      auth = app.auth({ persistence: 'local' })

      // 自动匿名登录（操作数据库前必须有登录态）
      const loginState = await auth.getLoginState()
      if (!loginState) {
        try {
          await auth.signInAnonymously()
        } catch (e) {
          console.warn('匿名登录失败，请检查腾讯云控制台是否开启「匿名登录」:', e)
        }
      }

      db = app.database()
      return { app, db, auth }
    } catch (e) {
      console.error('云开发初始化失败:', e)
      initPromise = null
      throw e
    }
  })()

  return initPromise
}

export const getCloudBase = async () => {
  if (!app) await initCloudBase()
  return { app, db, auth }
}

export const getDb = async () => {
  if (!db) await initCloudBase()
  return db
}

export const getAuth = async () => {
  if (!auth) await initCloudBase()
  return auth
}

export default initCloudBase
