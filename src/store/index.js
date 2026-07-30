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
import { getFoodById, CANTEEN_RECIPES } from '../data/foods'

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
        const { profile, tastePreferences } = get()
        const date = dayjs().format('YYYY-MM-DD')

        // 简单随机选择食谱 + 过滤忌口
        const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

        const filterByDislikes = (recipe) => {
          const dislikes = profile.restrictions.dislikes || []
          return true // 简化：暂不做复杂过滤
        }

        const breakfast = pickRandom(CANTEEN_RECIPES.breakfast.filter(filterByDislikes))
        const lunch = pickRandom(CANTEEN_RECIPES.lunch.filter(filterByDislikes))
        const dinner = pickRandom(CANTEEN_RECIPES.dinner.filter(filterByDislikes))
        const snack = pickRandom(CANTEEN_RECIPES.snack.filter(filterByDislikes))

        const buildMealDetail = (recipe) => {
          const items = recipe.items.map(foodId => {
            const food = getFoodById(foodId)
            const qty = food.category === '主食' ? 150 : food.category === '肉类' ? 120 : food.category === '汤类' ? 200 : 100
            const factor = qty / 100
            return {
              foodId,
              name: food.name,
              quantity: qty,
              unit: food.category === '饮料' || food.category === '汤类' ? 'ml' : 'g',
              calories: Math.round(food.calories * factor),
              protein: Math.round(food.protein * factor * 10) / 10,
              carbs: Math.round(food.carbs * factor * 10) / 10,
              fat: Math.round(food.fat * factor * 10) / 10,
            }
          })

          let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0
          items.forEach(it => {
            totalCals += it.calories
            totalProtein += it.protein
            totalCarbs += it.carbs
            totalFat += it.fat
          })

          return {
            name: recipe.name,
            canteen: recipe.canteen,
            items,
            totalNutrition: {
              calories: Math.round(totalCals),
              protein: Math.round(totalProtein * 10) / 10,
              carbs: Math.round(totalCarbs * 10) / 10,
              fat: Math.round(totalFat * 10) / 10,
            },
          }
        }

        const recs = {
          date,
          breakfast: buildMealDetail(breakfast),
          lunch: buildMealDetail(lunch),
          dinner: buildMealDetail(dinner),
          snack: buildMealDetail(snack),
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

      // 重置数据（用于调试）
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
