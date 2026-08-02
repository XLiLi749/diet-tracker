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
import { deletePhoto as deletePhotoFromDB } from '../utils/photoStorage'
import { generateMockUsers, addAdminLog as addLog, ADMIN_CREDENTIALS } from '../data/adminMock'
import { clearLoginState as clearCloudLoginState } from '../utils/auth'

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

      // 我的收藏（食物/菜系/口味）
      favorites: {
        foods: [],      // 收藏的食物ID
        cuisines: [],   // 收藏的菜系
        tastes: [],     // 收藏的口味标签
      },

      // 美食手账记录
      journals: [],

      // ========== 管理员后台相关 ==========
      adminLoggedIn: false,
      adminUser: null,
      mockUsers: null,  // 模拟用户数据（首次进入后台时生成）

      adminLogin: (username, password) => {
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
          set({ adminLoggedIn: true, adminUser: { username } })
          if (!get().mockUsers) {
            set({ mockUsers: generateMockUsers() })
          }
          addLog('LOGIN', `管理员 ${username} 登录`)
          return true
        }
        return false
      },

      adminLogout: () => {
        addLog('LOGOUT', `管理员登出`)
        set({ adminLoggedIn: false, adminUser: null })
      },

      ensureMockUsers: () => {
        if (!get().mockUsers) {
          set({ mockUsers: generateMockUsers() })
        }
        return get().mockUsers
      },

      logAdminAction: (action, detail) => {
        addLog(action, detail)
      },

      // 个人自定义菜品库
      customFoods: [],

      // 添加自定义菜品
      addCustomFood: (food) => {
        const { customFoods } = get()
        const newFood = {
          ...food,
          id: food.id || ('custom_' + Date.now()),
          isCustom: true,
          createdAt: Date.now(),
        }
        set({ customFoods: [newFood, ...customFoods] })
        return newFood
      },

      // 删除自定义菜品
      deleteCustomFood: (foodId) => {
        const { customFoods } = get()
        set({ customFoods: customFoods.filter(f => f.id !== foodId) })
      },

      // 获取所有可用食物（系统库 + 个人库）
      getAllFoods: () => {
        const { customFoods } = get()
        return [...customFoods, ...FOOD_DATABASE]
      },

      toggleFavoriteFood: (foodId) => {
        const { favorites } = get()
        const foods = favorites.foods.includes(foodId)
          ? favorites.foods.filter(id => id !== foodId)
          : [...favorites.foods, foodId]
        set({ favorites: { ...favorites, foods } })
      },

      toggleFavoriteCuisine: (cuisine) => {
        const { favorites } = get()
        const cuisines = favorites.cuisines.includes(cuisine)
          ? favorites.cuisines.filter(c => c !== cuisine)
          : [...favorites.cuisines, cuisine]
        set({ favorites: { ...favorites, cuisines } })
      },

      toggleFavoriteTaste: (taste) => {
        const { favorites } = get()
        const tastes = favorites.tastes.includes(taste)
          ? favorites.tastes.filter(t => t !== taste)
          : [...favorites.tastes, taste]
        set({ favorites: { ...favorites, tastes } })
      },

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
        return get().getSummaryByDate(dayjs().format('YYYY-MM-DD'))
      },

      getSummaryByDate: (date) => {
        const { foodLogs, targets } = get()
        const logs = foodLogs[date] || []

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
        const { foodLogs, journals } = get()
        const dayLogs = foodLogs[date] || []
        const log = dayLogs.find(l => l.id === logId)
        if (log?.photoId) {
          deletePhotoFromDB(log.photoId).catch(() => {})
        }
        // 同步删除关联了该记录的手账
        const linkedJournal = journals.find(j => j.logId === logId)
        if (linkedJournal) {
          if (linkedJournal.photoId && linkedJournal.photoId !== log?.photoId) {
            deletePhotoFromDB(linkedJournal.photoId).catch(() => {})
          }
          set({ journals: journals.filter(j => j.id !== linkedJournal.id) })
        }
        set({
          foodLogs: {
            ...foodLogs,
            [date]: dayLogs.filter(l => l.id !== logId),
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
        const { bodyRecords, profile } = get()
        const startDate = dayjs().subtract(days - 1, 'day')
        const endDate = dayjs()

        // 先按日期去重：同一天多条只保留最新的一条
        const dailyMap = {}
        bodyRecords
          .filter(r => dayjs(r.date).isAfter(startDate.subtract(1, 'day')))
          .sort((a, b) => a.date.localeCompare(b.date))
          .forEach(r => {
            dailyMap[r.date] = r  // 后写入的覆盖先写入的
          })

        // 生成连续日期序列，没有记录的天沿用前一天的体重
        const result = []
        let lastWeight = profile?.weight || 60
        for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate, 'day'); d = d.add(1, 'day')) {
          const dateStr = d.format('YYYY-MM-DD')
          if (dailyMap[dateStr]) {
            lastWeight = dailyMap[dateStr].weight
            result.push({ ...dailyMap[dateStr], date: dateStr })
          } else {
            result.push({
              id: `body_fill_${dateStr}`,
              date: dateStr,
              weight: lastWeight,
              bodyFat: null,
              note: '',
              isFilled: true,
            })
          }
        }
        return result
      },

      // ========== 推荐相关 ==========
      generateTodayRecommendations: () => {
        const { profile, tastePreferences, activeScene, targets, favorites } = get()
        const date = dayjs().format('YYYY-MM-DD')
        const dislikes = profile.restrictions.dislikes || []
        const allergies = profile.restrictions.allergies || []

        // 合并口味偏好 + 收藏的口味/菜系
        const mergedPreferences = [...new Set([
          ...tastePreferences,
          ...(favorites?.tastes || []),
          ...(favorites?.cuisines || []),
        ])]

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

        // ========== 过滤不喜欢/过敏/场景不合适的食物 ==========
        const isFoodOk = (food) => {
          if (dislikes.some(d => food.name.includes(d))) return false
          if (allergies.some(a => food.name.includes(a))) return false
          const tags = food.tags || []

          // 场景过滤
          if (activeScene === 'vegetarian' && food.category === '肉类') return false
          if (activeScene === 'detox' && (tags.includes('高热量') || tags.includes('油炸'))) return false
          if (activeScene === 'sick' && tags.includes('油炸')) return false

          // 增肌日：排除油炸、高糖、纯垃圾食品
          if (activeScene === 'gym') {
            if (tags.includes('油炸')) return false
            if (tags.includes('高糖')) return false
            if (tags.includes('节日') && tags.includes('高热量')) return false
          }

          // 预算紧张：排除高价菜（单价上限 > 30元的菜）
          if (activeScene === 'poor') {
            if (food.price && food.price[1] > 30) return false
            if (tags.includes('高端')) return false
          }

          return true
        }

        // ========== 给食物打分（综合偏好+场景+收藏） ==========
        const scoreFood = (food) => {
          let score = 0
          const tags = food.tags || []

          // 收藏的食物额外大幅加分
          if (favorites?.foods?.includes(food.id)) score += 40

          // 口味/菜系偏好（使用合并后的偏好）
          mergedPreferences.forEach(pref => {
            if (tags.includes(pref)) score += 15
          })

          // 场景标签
          sceneTags.forEach(tag => {
            if (tags.includes(tag)) score += 20
          })

          // 菜系偏好匹配（收藏的菜系权重更高）
          const cuisineMap = {
            '川菜': ['川菜', '辣'],
            '湘菜': ['湘菜', '辣'],
            '粤菜': ['粤菜', '清淡'],
            '东北菜': ['东北菜'],
            '江浙菜': ['江浙菜', '甜口'],
            '赣菜': ['赣菜', '辣'],
          }
          mergedPreferences.forEach(pref => {
            if (cuisineMap[pref]) {
              const isFavCuisine = favorites?.cuisines?.includes(pref)
              const boost = isFavCuisine ? 25 : 12
              cuisineMap[pref].forEach(t => {
                if (tags.includes(t) || food.name.includes(pref)) score += boost
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

        // ========== 生成各餐次（严格按正常人饮食习惯） ==========
        // 判断当前偏好菜系
        const preferredCuisines = mergedPreferences.filter(p => ['川菜', '湘菜', '赣菜', '粤菜', '东北菜', '江浙菜'].includes(p))

        // 当日已用食物id，避免重复
        const usedTodayIds = new Set()

        // 判断是否"汤汤水水"类食物（液体类，一餐中最多只能出现一种）
        const isLiquidFood = (f) => {
          if (f.category === '汤类' || f.category === '饮料') return true
          if (f.category === '蛋奶' && /豆浆|牛奶|酸奶/.test(f.name)) return true
          if (f.category === '主食' && /粥/.test(f.name)) return true
          if ((f.tags || []).includes('汤类')) return true
          return false
        }

        // ========== 早餐：严格只选早餐类，清淡为主，绝对不选肉类大菜 ==========
        const isBreakfastFood = (f) => {
          const tags = f.tags || []
          if (!tags.includes('早餐')) return false
          if (f.category === '肉类') return false
          if (activeScene === 'gym' && tags.includes('油炸')) return false
          return true
        }

        const pickBreakfastFoods = () => {
          const candidates = FOOD_DATABASE.filter(f => isFoodOk(f) && isBreakfastFood(f))
          candidates.sort((a, b) => scoreFood(b) - scoreFood(a))
          // 菜系特色优先
          if (preferredCuisines.includes('赣菜')) {
            const ganfen = candidates.find(f => f.tags?.includes('赣菜') && f.tags?.includes('面食'))
            const waguan = candidates.find(f => f.tags?.includes('赣菜') && f.tags?.includes('汤类'))
            // 拌粉（固体）+ 瓦罐汤（液体）是可以的，但瓦罐汤+牛奶不行
            if (ganfen) {
              const result = [{ food: ganfen, qty: 200 }]
              if (waguan) result.push({ food: waguan, qty: 200 })
              return result
            }
          }
          if (preferredCuisines.includes('湘菜')) {
            const noodles = candidates.find(f => (f.tags?.includes('湘菜') && f.tags?.includes('面食')) || f.tags?.includes('面食'))
            const soy = candidates.find(f => f.category === '蛋奶' && (!noodles || f.id !== noodles.id))
            if (noodles) {
              const result = [{ food: noodles, qty: 200 }]
              // 如果面是汤面（液体），就不要再加豆浆/牛奶了
              if (soy && !isLiquidFood(noodles)) result.push({ food: soy, qty: 150 })
              return result
            }
          }
          if (preferredCuisines.includes('粤菜')) {
            const congee = candidates.find(f => f.name.includes('粥')) || candidates.find(f => f.tags?.includes('粤菜'))
            const dimsum = candidates.find(f => (f.name.includes('肠粉') || f.name.includes('烧卖') || f.tags?.includes('粤菜')) && (!congee || f.id !== congee.id))
            if (congee) {
              const result = [{ food: congee, qty: 250 }]
              // 粥是液体，如果点心是固体的话可以加
              if (dimsum && !isLiquidFood(dimsum)) result.push({ food: dimsum, qty: 100 })
              return result
            }
          }
          if (preferredCuisines.includes('川菜')) {
            const noodles = candidates.find(f => f.tags?.includes('川菜') && f.tags?.includes('面食')) || candidates.find(f => f.tags?.includes('面食'))
            const soy = candidates.find(f => f.category === '蛋奶' && (!noodles || f.id !== noodles.id))
            if (noodles) {
              const result = [{ food: noodles, qty: 200 }]
              if (soy && !isLiquidFood(noodles)) result.push({ food: soy, qty: 150 })
              return result
            }
          }
          if (preferredCuisines.includes('东北菜')) {
            const bun = candidates.find(f => f.name.includes('包')) || candidates.find(f => f.category === '主食')
            const soy = candidates.find(f => (f.category === '蛋奶' || f.name.includes('粥')) && (!bun || f.id !== bun.id))
            if (bun) {
              const result = [{ food: bun, qty: 150 }]
              // 包子是固体，可以加豆浆/粥（液体）作为搭配
              if (soy) result.push({ food: soy, qty: 200 })
              return result
            }
          }
          // 通用：从高分早餐里随机选（主食+蛋奶组合），但禁止液体+液体
          const topCandidates = candidates.slice(0, 8)
          // 先找一个固体主食（非液体）
          const staple = topCandidates.find(f => (f.category === '主食' || f.category === '汤类') && !isLiquidFood(f))
            || topCandidates.find(f => f.category === '主食' || f.category === '汤类')
            || topCandidates[0]
          const result = []
          if (staple) {
            result.push({ food: staple, qty: staple.category === '汤类' ? 250 : 150 })
          }
          // 如果主食不是液体，再加一个蛋奶/饮料作为搭配
          if (staple && !isLiquidFood(staple)) {
            const eggOrMilk = topCandidates.find(f => f.category === '蛋奶' && f.id !== staple.id)
            if (eggOrMilk) result.push({ food: eggOrMilk, qty: 100 })
          }
          return result.length > 0 ? result : (topCandidates[0] ? [{ food: topCandidates[0], qty: 150 }] : [])
        }

        const breakfastItems = pickBreakfastFoods()
        breakfastItems.forEach(it => usedTodayIds.add(it.food.id))
        const breakfast = buildMeal(breakfastItems)

        // ========== 午餐/晚餐：智能判断是否独立餐食 ==========
        const isStandaloneMeal = (f) => (f.tags || []).includes('独立餐食')

        const buildMainMeal = (excludeIds = []) => {
          const allExclude = new Set([...excludeIds, ...usedTodayIds])
          // 先看独立餐食（粉/面类）
          const standaloneCandidates = FOOD_DATABASE.filter(f =>
            isFoodOk(f) && isStandaloneMeal(f) && !allExclude.has(f.id)
          )
          standaloneCandidates.sort((a, b) => scoreFood(b) - scoreFood(a))

          // 30% 概率选独立餐食（粉面），70% 概率选米饭+菜组合
          const shouldPickStandalone = standaloneCandidates.length > 0 && Math.random() < 0.3
          if (shouldPickStandalone) {
            const top = standaloneCandidates.slice(0, Math.min(3, standaloneCandidates.length))
            const pick = top[Math.floor(Math.random() * top.length)]
            usedTodayIds.add(pick.id)
            return buildMeal([{ food: pick, qty: 250 }])
          }

          // 米饭 + 主菜 + 配菜组合
          const items = []
          const staple = (() => {
            const riceCandidates = FOOD_DATABASE.filter(f =>
              isFoodOk(f) && f.category === '主食' && !isStandaloneMeal(f) && !allExclude.has(f.id)
              && (f.name.includes('饭') || f.name.includes('粥') || f.name.includes('馒头'))
            )
            if (riceCandidates.length === 0) {
              const backup = FOOD_DATABASE.filter(f =>
                isFoodOk(f) && f.category === '主食' && !isStandaloneMeal(f) && !allExclude.has(f.id)
              )
              backup.sort((a, b) => scoreFood(b) - scoreFood(a))
              return backup[0]
            }
            riceCandidates.sort((a, b) => scoreFood(b) - scoreFood(a))
            return riceCandidates[Math.floor(Math.random() * Math.min(3, riceCandidates.length))]
          })()
          if (staple) {
            items.push({ food: staple, qty: 150 })
            allExclude.add(staple.id)
          }

          const mainDish = (() => {
            const candidates = FOOD_DATABASE.filter(f =>
              isFoodOk(f) && f.category === '肉类' && !allExclude.has(f.id)
            )
            candidates.sort((a, b) => scoreFood(b) - scoreFood(a))
            const top = candidates.slice(0, Math.min(5, candidates.length))
            return top[Math.floor(Math.random() * top.length)]
          })()
          if (mainDish) {
            items.push({ food: mainDish, qty: 120 })
            allExclude.add(mainDish.id)
          }

          const sideDish = (() => {
            const candidates = FOOD_DATABASE.filter(f =>
              isFoodOk(f) && f.category === '蔬菜' && !allExclude.has(f.id)
            )
            candidates.sort((a, b) => scoreFood(b) - scoreFood(a))
            const top = candidates.slice(0, Math.min(5, candidates.length))
            return top[Math.floor(Math.random() * top.length)]
          })()
          if (sideDish) {
            items.push({ food: sideDish, qty: 100 })
            allExclude.add(sideDish.id)
          }

          items.forEach(it => usedTodayIds.add(it.food.id))
          return buildMeal(items)
        }

        const lunch = buildMainMeal()
        const dinner = buildMainMeal()

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

      // ========== 美食手账相关 ==========
      addJournal: (journal) => {
        const { journals } = get()
        const newJournal = {
          id: 'j_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
          createdAt: new Date().toISOString(),
          ...journal,
        }
        set({ journals: [newJournal, ...journals] })
        return newJournal
      },

      updateJournal: (id, updates) => {
        const { journals } = get()
        set({
          journals: journals.map(j => j.id === id ? { ...j, ...updates } : j)
        })
      },

      deleteJournal: (id) => {
        const { journals } = get()
        const journal = journals.find(j => j.id === id)
        if (journal?.photoId) {
          deletePhotoFromDB(journal.photoId).catch(() => {})
        }
        set({ journals: journals.filter(j => j.id !== id) })
      },

      getJournalById: (id) => {
        return get().journals.find(j => j.id === id)
      },

      getJournalsByDate: (date) => {
        return get().journals.filter(j => j.date === date)
      },

      getAllJournals: () => {
        return get().journals
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
            journals: state.journals,
          }
          try {
            localStorage.setItem(`diet-tracker-user-${currentUser}`, JSON.stringify(data))
          } catch (e) {
            console.warn('保存用户数据失败:', e)
          }
        }
        // 清除所有登录状态（云端 + 本地）
        try {
          clearCloudLoginState()
        } catch (e) {}
        set({ currentUser: null })
        try {
          localStorage.removeItem('diet-tracker-current-user')
        } catch (e) {}
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

      // ========== 云端账户同步 ==========
      // 将云端用户信息（注册/登录返回的 user 对象）同步到本地 store
      syncCloudUser: (cloudUser) => {
        if (!cloudUser) return
        const p = cloudUser.profile || {}

        // 将云端 profile 映射到本地 store 的 profile 结构
        const goalMap = { lose: 'fat_loss', gain: 'weight_gain', maintain: 'maintain' }
        const genderMap = { '女': 'female', '男': 'male', 'female': 'female', 'male': 'male' }

        const profileUpdates = {
          nickname: cloudUser.username || p.nickname || '用户',
          gender: genderMap[p.gender] || p.gender || 'female',
          age: p.age || 20,
          height: p.height || 165,
          weight: p.weight || 55,
          identity: p.identity || 'student',
          profession: p.profession || '学生',
          dietGoal: {
            type: goalMap[p.goal] || p.goal || 'maintain',
            targetWeight: p.targetWeight || p.weight || 55,
            rateLevel: 'gentle',
            startDate: new Date().toISOString().slice(0, 10),
            expectedDurationMonths: 3,
          },
        }

        const newProfile = { ...get().profile, ...profileUpdates, updatedAt: new Date().toISOString().slice(0, 10) }
        const newTargets = calcDailyTargets(newProfile)
        set({
          profile: newProfile,
          targets: newTargets,
          currentUser: cloudUser.username || null,
        })
      },

      // 从 localStorage 恢复登录态并同步到 store
      restoreCloudLogin: () => {
        try {
          const data = localStorage.getItem('diet_tracker_current_user')
          if (data) {
            const user = JSON.parse(data)
            if (user) {
              get().syncCloudUser(user)
            }
          }
        } catch (e) {
          console.warn('恢复云端登录态失败:', e)
        }
      },
    }),
    {
      name: 'diet-tracker-storage',
      partialize: (state) => ({
        profile: state.profile,
        foodLogs: state.foodLogs,
        bodyRecords: state.bodyRecords,
        tastePreferences: state.tastePreferences,
        favorites: state.favorites,
        journals: state.journals,
        currentUser: state.currentUser,
      }),
      onRehydrateStorage: (state) => {
        return (restoredState, error) => {
          if (error) {
            console.error('zustand rehydrate error:', error)
            return
          }
          if (restoredState?.profile) {
            const newTargets = calcDailyTargets(restoredState.profile)
            state.targets = newTargets
          }
          // 如果有云端登录态，同步云端用户信息覆盖默认 profile
          try {
            const data = localStorage.getItem('diet_tracker_current_user')
            if (data) {
              const cloudUser = JSON.parse(data)
              if (cloudUser && cloudUser.profile) {
                state.syncCloudUser(cloudUser)
              }
            }
          } catch (e) {
            console.warn('恢复云端用户信息失败:', e)
          }
        }
      },
    }
  )
)

export default useStore
