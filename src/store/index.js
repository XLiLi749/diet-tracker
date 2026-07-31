import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import dayjs from 'dayjs'
import {
  DEFAULT_PROFILE,
  calcDailyTargets,
  calcBMI,
  generateMockLogs,
  generateMockBodyRecords,
} from '../data/mock'
import { getFoodById, FOOD_DATABASE } from '../data/foods'

const useStore = create(
  persist(
    (set, get) => ({
      // 用户档案
      profile: DEFAULT_PROFILE,

      // 计算后的营养目标
      targets: calcDailyTargets(DEFAULT_PROFILE),

      // 饮食日志（按日期索引）
      foodLogs: generateMockLogs(),

      // 身体数据记录
      bodyRecords: generateMockBodyRecords(),

      // 今日推荐
      todayRecommendations: null,

      // 口味偏好（临时）
      tastePreferences: [],

      // 当前特殊场景
      activeScene: 'normal',

      setActiveScene: (scene) => set({ activeScene: scene }),

      // ========== 用户档案相关 ==========
      updateProfile: (updates) => {
        const { profile } = get()
        const newProfile = { ...profile, ...updates, updatedAt: dayjs().format('YYYY-MM-DD') }
        const newTargets = calcDailyTargets(newProfile)
        set({ profile: newProfile, targets: newTargets })
      },

      getBMI: () => {
        const { profile } = get()
        return calcBMI(profile.weight, profile.height)
      },

      // ========== 饮食日志相关 ==========
      getLogsByDate: (date) => {
        const { foodLogs } = get()
        return foodLogs[date] || []
      },

      getTodaySummary: () => {
        const { foodLogs, targets } = get()
        const today = dayjs().format('YYYY-MM-DD')
        const logs = foodLogs[today] || []

        let calories = 0, protein = 0, carbs = 0, fat = 0
        logs.forEach(log => {
          calories += log.totalNutrition.calories
          protein += log.totalNutrition.protein
          carbs += log.totalNutrition.carbs
          fat += log.totalNutrition.fat
        })

        return {
          calories,
          protein: Math.round(protein * 10) / 10,
          carbs: Math.round(carbs * 10) / 10,
          fat: Math.round(fat * 10) / 10,
          caloriePct: Math.min(100, Math.round((calories / targets.calorieTarget) * 100)),
          proteinPct: Math.min(100, Math.round((protein / targets.proteinTarget) * 100)),
          carbsPct: Math.min(100, Math.round((carbs / targets.carbsTarget) * 100)),
          fatPct: Math.min(100, Math.round((fat / targets.fatTarget) * 100)),
        }
      },

      addFoodLog: (date, mealType, items, source = 'manual', photoUrl = null) => {
        const { foodLogs } = get()
        const dayLogs = foodLogs[date] || []

        // 计算总营养
        let calories = 0, protein = 0, carbs = 0, fat = 0
        items.forEach(it => {
          calories += it.calories
          protein += it.protein
          carbs += it.carbs
          fat += it.fat
        })

        const newLog = {
          id: `log_${date}_${Date.now()}`,
          date,
          mealType,
          time: dayjs().format('HH:mm'),
          source,
          photoUrl,
          items,
          totalNutrition: {
            calories: Math.round(calories),
            protein: Math.round(protein * 10) / 10,
            carbs: Math.round(carbs * 10) / 10,
            fat: Math.round(fat * 10) / 10,
          },
          note: '',
          createdAt: new Date().toISOString(),
        }

        set({
          foodLogs: {
            ...foodLogs,
            [date]: [...dayLogs, newLog],
          },
        })

        return newLog
      },

      deleteFoodLog: (date, logId) => {
        const { foodLogs } = get()
        const dayLogs = (foodLogs[date] || []).filter(l => l.id !== logId)
        set({
          foodLogs: {
            ...foodLogs,
            [date]: dayLogs,
          },
        })
      },

      // ========== 身体数据相关 ==========
      addBodyRecord: (weight, note = '') => {
        const { bodyRecords, profile } = get()
        const date = dayjs().format('YYYY-MM-DD')
        const newRecord = {
          id: `body_${date}_${Date.now()}`,
          date,
          weight: Math.round(weight * 10) / 10,
          bodyFat: null,
          note,
          createdAt: new Date().toISOString(),
        }
        set({
          bodyRecords: [...bodyRecords, newRecord],
          profile: { ...profile, weight: newRecord.weight, updatedAt: date },
        })
      },

      getWeightTrend: (days = 28) => {
        const { bodyRecords } = get()
        const startDate = dayjs().subtract(days - 1, 'day')
        return bodyRecords
          .filter(r => dayjs(r.date).isAfter(startDate.subtract(1, 'day')))
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      // ========== 推荐相关 ==========
      generateTodayRecommendations: () => {
        const { profile, tastePreferences, activeScene, targets } = get()
        const date = dayjs().format('YYYY-MM-DD')
        const dislikes = profile.restrictions.dislikes || []
        const allergies = profile.restrictions.allergies || []

        // ========== 场景强制标签（会影响权重和过滤） ==========
        const sceneBoostTags = {
          normal: [],
          party: ['budget', '高碳水'],
          busy: ['budget', '便携'],
          poor: ['budget'],
          exam: ['high_protein', '补脑'],
          gym: ['high_protein', '增肌'],
          sick: ['light', 'less_oil', '养胃'],
          travel: ['便携'],
          date: ['精致', '西餐', '日料'],
          festival: ['聚餐', '高热量'],
          period: ['补铁', '温热'],
          pregnancy: ['营养均衡', '清淡'],
          breakfast_skip: ['快手', '早餐'],
          night_owl: ['light', '宵夜'],
          vegetarian: ['素食'],
          detox: ['light', 'less_oil', '低卡'],
        }
        const sceneTags = sceneBoostTags[activeScene] || []

        // ========== 过滤不喜欢/过敏的食物 ==========
        const isFoodOk = (food) => {
          if (dislikes.some(d => food.name.includes(d))) return false
          if (allergies.some(a => food.name.includes(a))) return false
          if (activeScene === 'vegetarian' && food.category === '肉类') return false
          if (activeScene === 'detox' && food.tags?.includes('高热量')) return false
          if (activeScene === 'sick' && food.tags?.includes('油炸')) return false
          return true
        }

        // ========== 给食物打分（综合偏好+场景） ==========
        const scoreFood = (food) => {
          let score = 0
          const tags = food.tags || []
          tastePreferences.forEach(pref => {
            if (tags.includes(pref)) score += 15
          })
          sceneTags.forEach(tag => {
            if (tags.includes(tag)) score += 20
          })
          // 菜系偏好（如果用户口味里选了川菜/湘菜等，匹配菜名或标签）
          const cuisineMap = {
            '川菜': ['川菜', '辣'],
            '湘菜': ['湘菜', '辣'],
            '粤菜': ['粤菜', '清淡'],
            '东北菜': ['东北菜'],
            '江浙菜': ['江浙菜', '甜口'],
            '赣菜': ['赣菜', '辣'],
          }
          tastePreferences.forEach(pref => {
            if (cuisineMap[pref]) {
              cuisineMap[pref].forEach(t => {
                if (tags.includes(t) || food.name.includes(pref)) score += 12
              })
            }
          })
          score += Math.random() * 5
          return score
        }

        // ========== 从食物库选菜（按类别+排序） ==========
        const pickByCategory = (category, count = 1, excludeIds = []) => {
          const candidates = FOOD_DATABASE.filter(f =>
            f.category === category && isFoodOk(f) && !excludeIds.includes(f.id)
          )
          candidates.sort((a, b) => scoreFood(b) - scoreFood(a))
          const top = candidates.slice(0, Math.max(count * 3, 5))
          const result = []
          for (let i = 0; i < count && top.length > 0; i++) {
            const idx = Math.floor(Math.random() * Math.min(3, top.length))
            result.push(top.splice(idx, 1)[0])
          }
          return result
        }

        const pickByTags = (tags, count = 1, excludeIds = []) => {
          const candidates = FOOD_DATABASE.filter(f =>
            isFoodOk(f) && !excludeIds.includes(f.id) &&
            tags.some(t => f.tags?.includes(t))
          )
          candidates.sort((a, b) => scoreFood(b) - scoreFood(a))
          const top = candidates.slice(0, Math.max(count * 3, 5))
          const result = []
          for (let i = 0; i < count && top.length > 0; i++) {
            const idx = Math.floor(Math.random() * Math.min(3, top.length))
            result.push(top.splice(idx, 1)[0])
          }
          return result
        }

        // ========== 构建餐次（灵活组合） ==========
        const buildFoodItem = (food, qty) => {
          const factor = qty / 100
          return {
            foodId: food.id,
            name: food.name,
            quantity: qty,
            unit: (food.category === '饮料' || food.category === '汤类') ? 'ml' : 'g',
            calories: Math.round(food.calories * factor),
            protein: Math.round(food.protein * factor * 10) / 10,
            carbs: Math.round(food.carbs * factor * 10) / 10,
            fat: Math.round(food.fat * factor * 10) / 10,
          }
        }

        const buildMeal = (itemsArr, mealName) => {
          const items = itemsArr.map(({ food, qty }) => buildFoodItem(food, qty))
          let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0
          items.forEach(it => {
            totalCals += it.calories
            totalProtein += it.protein
            totalCarbs += it.carbs
            totalFat += it.fat
          })
          return {
            name: mealName || items.map(i => i.name).join(' + '),
            items,
            totalNutrition: {
              calories: Math.round(totalCals),
              protein: Math.round(totalProtein * 10) / 10,
              carbs: Math.round(totalCarbs * 10) / 10,
              fat: Math.round(totalFat * 10) / 10,
            },
          }
        }

        // ========== 生成各餐次 ==========
        // 早餐：主食(1) + 蛋奶(1) + 可选小菜
        const breakfastStaple = pickByTags(['早餐', '主食'], 1)[0] || pickByCategory('主食', 1)[0]
        const breakfastEgg = pickByTags(['早餐'], 1, breakfastStaple ? [breakfastStaple.id] : [])[0] || pickByCategory('蛋奶', 1)[0]
        const breakfastItems = []
        if (breakfastStaple) breakfastItems.push({ food: breakfastStaple, qty: breakfastStaple.category === '主食' ? 150 : 100 })
        if (breakfastEgg) breakfastItems.push({ food: breakfastEgg, qty: breakfastEgg.category === '蛋奶' ? 100 : 50 })
        const breakfast = buildMeal(breakfastItems)

        // 午餐：主食(1) + 主菜(1) + 配菜(1)
        const lunchStaple = pickByTags(['rice', '主食'], 1)[0] || pickByCategory('主食', 1)[0]
        const lunchMain = pickByCategory('肉类', 1, lunchStaple ? [lunchStaple.id] : [])[0]
        const lunchSide = pickByCategory('蔬菜', 1, [lunchStaple?.id, lunchMain?.id].filter(Boolean))[0]
        const lunchItems = []
        if (lunchStaple) lunchItems.push({ food: lunchStaple, qty: 150 })
        if (lunchMain) lunchItems.push({ food: lunchMain, qty: 120 })
        if (lunchSide) lunchItems.push({ food: lunchSide, qty: 100 })
        const lunch = buildMeal(lunchItems)

        // 晚餐：主食(1) + 主菜(1) + 蔬菜(1)
        const usedForDinner = new Set()
        const dinnerStaple = pickByTags(['rice', '主食', 'light'], 1)[0] || pickByCategory('主食', 1)[0]
        if (dinnerStaple) usedForDinner.add(dinnerStaple.id)
        const dinnerMain = pickByTags(['high_protein', '肉类', '水产'], 1, Array.from(usedForDinner))[0] || pickByCategory('肉类', 1, Array.from(usedForDinner))[0]
        if (dinnerMain) usedForDinner.add(dinnerMain.id)
        const dinnerVeg = pickByCategory('蔬菜', 1, Array.from(usedForDinner))[0]
        const dinnerItems = []
        if (dinnerStaple) dinnerItems.push({ food: dinnerStaple, qty: 120 })
        if (dinnerMain) dinnerItems.push({ food: dinnerMain, qty: 100 })
        if (dinnerVeg) dinnerItems.push({ food: dinnerVeg, qty: 100 })
        const dinner = buildMeal(dinnerItems)

        // 加餐：水果/蛋奶/坚果
        const snack = (() => {
          const fruit = pickByCategory('水果', 1)[0]
          if (fruit) {
            return buildMeal([{ food: fruit, qty: 150 }])
          }
          const yogurt = pickByTags(['加餐', '益生菌'], 1)[0] || pickByCategory('蛋奶', 1)[0]
          if (yogurt) {
            return buildMeal([{ food: yogurt, qty: 150 }])
          }
          return buildMeal([{ food: { id: 'dummy', name: '加餐', calories: 100, protein: 2, carbs: 20, fat: 1, tags: [] }, qty: 100 }])
        })()

        const recs = {
          date,
          breakfast,
          lunch,
          dinner,
          snack,
          adjustments: [],
        }

        set({ todayRecommendations: recs })
        return recs
      },

      setTastePreferences: (prefs) => set({ tastePreferences: prefs }),

      // ========== 营养提醒 ==========
      getNutritionAlerts: () => {
        const summary = get().getTodaySummary()
        const { targets } = get()
        const alerts = []

        if (summary.proteinPct < 50) {
          alerts.push({ type: 'warning', text: `蛋白质还差 ${targets.proteinTarget - Math.round(summary.protein)}g，晚餐可增加鸡胸肉或豆腐` })
        } else if (summary.proteinPct >= 90) {
          alerts.push({ type: 'success', text: '蛋白质充足，继续保持 ✓' })
        }

        if (summary.carbsPct > 100) {
          alerts.push({ type: 'warning', text: '碳水摄入超标，晚餐建议减少主食' })
        }

        if (summary.fatPct > 100) {
          alerts.push({ type: 'danger', text: '脂肪摄入超标，注意控制油腻食物' })
        }

        // 估算蔬菜摄入（简化）
        const { foodLogs } = get()
        const today = dayjs().format('YYYY-MM-DD')
        const logs = foodLogs[today] || []
        let hasVegetable = false
        logs.forEach(l => l.items.forEach(it => {
          if (it.name.includes('蔬') || it.name.includes('菜') || it.name.includes('瓜') || it.name.includes('兰花')) {
            hasVegetable = true
          }
        }))
        if (!hasVegetable && logs.length > 0) {
          alerts.push({ type: 'warning', text: '今日蔬菜摄入不足，建议加一份凉拌菜或蔬菜汤' })
        }

        return alerts
      },

      // ========== 统计 ==========
      getWeeklyStats: () => {
        const { foodLogs, targets } = get()
        const stats = []
        for (let i = 6; i >= 0; i--) {
          const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
          const logs = foodLogs[date] || []
          let calories = 0
          logs.forEach(l => calories += l.totalNutrition.calories)
          stats.push({
            date,
            label: dayjs().subtract(i, 'day').format('MM/DD'),
            weekday: ['日', '一', '二', '三', '四', '五', '六'][dayjs().subtract(i, 'day').day()],
            calories,
            target: targets.calorieTarget,
          })
        }
        return stats
      },

      // 重置数据（用于调试，恢复 mock 数据）
      resetAll: () => {
        set({
          profile: DEFAULT_PROFILE,
          targets: calcDailyTargets(DEFAULT_PROFILE),
          foodLogs: generateMockLogs(),
          bodyRecords: generateMockBodyRecords(),
          todayRecommendations: null,
          tastePreferences: [],
        })
      },

      // 清空所有记录（保留用户档案）
      clearAllRecords: () => {
        const { profile } = get()
        set({
          foodLogs: {},
          bodyRecords: [],
          todayRecommendations: null,
        })
      },

      // ========== 数据导出/导入 ==========
      exportData: () => {
        const state = get()
        const data = {
          version: 1,
          exportAt: new Date().toISOString(),
          profile: state.profile,
          foodLogs: state.foodLogs,
          bodyRecords: state.bodyRecords,
          tastePreferences: state.tastePreferences,
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `diet-data-${dayjs().format('YYYYMMDD-HHmmss')}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },

      importData: (jsonText) => {
        try {
          const data = JSON.parse(jsonText)
          if (!data.profile || !data.foodLogs) {
            throw new Error('文件格式不正确')
          }
          const newProfile = data.profile
          const newTargets = calcDailyTargets(newProfile)
          set({
            profile: newProfile,
            targets: newTargets,
            foodLogs: data.foodLogs || {},
            bodyRecords: data.bodyRecords || [],
            tastePreferences: data.tastePreferences || [],
            todayRecommendations: null,
          })
          return true
        } catch (e) {
          console.error('导入失败:', e)
          return false
        }
      },

      // ========== 账户管理（本地账户） ==========
      currentUser: null,

      // 简易字符串哈希（非加密安全，仅用于本地存储）
      _hashPassword: (pwd) => {
        let hash = 0
        for (let i = 0; i < pwd.length; i++) {
          const char = pwd.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash
        }
        return String(hash)
      },

      _getAccounts: () => {
        try {
          return JSON.parse(localStorage.getItem('diet-tracker-accounts') || '{}')
        } catch {
          return {}
        }
      },

      _saveAccounts: (accounts) => {
        localStorage.setItem('diet-tracker-accounts', JSON.stringify(accounts))
      },

      registerAccount: (username, password) => {
        if (!username || !password) return { success: false, msg: '用户名和密码不能为空' }
        if (username.length < 2) return { success: false, msg: '用户名至少2个字符' }
        if (password.length < 4) return { success: false, msg: '密码至少4个字符' }
        const accounts = get()._getAccounts()
        if (accounts[username]) return { success: false, msg: '该用户名已存在' }
        accounts[username] = {
          passwordHash: get()._hashPassword(password),
          createdAt: new Date().toISOString(),
        }
        get()._saveAccounts(accounts)
        return { success: true, msg: '注册成功' }
      },

      loginAccount: (username, password) => {
        const accounts = get()._getAccounts()
        const account = accounts[username]
        if (!account) return { success: false, msg: '用户名不存在' }
        if (account.passwordHash !== get()._hashPassword(password)) {
          return { success: false, msg: '密码错误' }
        }
        // 恢复该用户的数据（如果存在）
        const savedData = localStorage.getItem(`diet-tracker-user-${username}`)
        if (savedData) {
          try {
            const data = JSON.parse(savedData)
            get().importData(JSON.stringify(data))
          } catch (e) {
            console.error('恢复用户数据失败:', e)
          }
        }
        set({ currentUser: username })
        localStorage.setItem('diet-tracker-current-user', username)
        return { success: true, msg: '登录成功' }
      },

      logoutAccount: () => {
        const { currentUser } = get()
        if (currentUser) {
          // 保存当前数据到该用户名下
          const state = get()
          const data = {
            profile: state.profile,
            foodLogs: state.foodLogs,
            bodyRecords: state.bodyRecords,
            tastePreferences: state.tastePreferences,
          }
          localStorage.setItem(`diet-tracker-user-${currentUser}`, JSON.stringify(data))
        }
        set({ currentUser: null })
        localStorage.removeItem('diet-tracker-current-user')
      },

      autoLogin: () => {
        const saved = localStorage.getItem('diet-tracker-current-user')
        if (saved) {
          set({ currentUser: saved })
        }
      },

      listAccounts: () => {
        return Object.keys(get()._getAccounts())
      },
    }),
    {
      name: 'diet-tracker-storage',
      partialize: (state) => ({
        profile: state.profile,
        foodLogs: state.foodLogs,
        bodyRecords: state.bodyRecords,
        tastePreferences: state.tastePreferences,
      }),
    }
  )
)

export default useStore
