import dayjs from 'dayjs'

// 生成最近N天的日期数组
export const getRecentDays = (n = 7) => {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'))
  }
  return days
}

// 默认用户档案
export const DEFAULT_PROFILE = {
  id: 'user_001',
  nickname: '同学',
  avatar: null,
  gender: 'male',
  age: 20,
  height: 175,
  weight: 64.2,
  createdAt: '2026-06-01',
  updatedAt: dayjs().format('YYYY-MM-DD'),

  dietGoal: {
    type: 'fat_loss',
    targetWeight: 62,
    startDate: '2026-06-01',
    expectedDurationMonths: 3,
  },

  restrictions: {
    allergies: [],
    dislikes: ['香菜'],
    dietaryType: 'normal',
  },

  lifestyle: {
    sleepSchedule: 'night_owl',
    sleepHours: 6,
    exerciseFrequency: '2-3_per_week',
    exerciseTypes: ['running', 'basketball'],
  },
}

// 计算BMR（基础代谢率）
export const calcBMR = (gender, weight, height, age) => {
  if (gender === 'male') {
    return Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age)
  }
  return Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.330 * age)
}

// 计算BMI
export const calcBMI = (weight, height) => {
  const h = height / 100
  return (weight / (h * h)).toFixed(1)
}

// 计算活动系数
const ACTIVITY_FACTOR = {
  none: 1.2,
  '1-2_per_week': 1.375,
  '2-3_per_week': 1.55,
  '3-5_per_week': 1.725,
  daily: 1.9,
}

// 计算每日营养目标
export const calcDailyTargets = (profile) => {
  const { gender, weight, height, age, dietGoal, lifestyle } = profile
  const bmr = calcBMR(gender, weight, height, age)
  const tdee = bmr * (ACTIVITY_FACTOR[lifestyle.exerciseFrequency] || 1.375)

  let calorieTarget, proteinPerKg, carbsPct, fatPct
  switch (dietGoal.type) {
    case 'fat_loss':
      calorieTarget = Math.round(tdee - 300)
      proteinPerKg = 1.8
      carbsPct = 0.40
      fatPct = 0.25
      break
    case 'weight_gain':
      calorieTarget = Math.round(tdee + 500)
      proteinPerKg = 1.6
      carbsPct = 0.55
      fatPct = 0.25
      break
    case 'muscle_gain':
      calorieTarget = Math.round(tdee + 300)
      proteinPerKg = 2.0
      carbsPct = 0.50
      fatPct = 0.25
      break
    case 'stomach_care':
      calorieTarget = Math.round(tdee - 100)
      proteinPerKg = 1.2
      carbsPct = 0.55
      fatPct = 0.20
      break
    default: // maintain
      calorieTarget = Math.round(tdee)
      proteinPerKg = 1.4
      carbsPct = 0.50
      fatPct = 0.30
  }

  const proteinTarget = Math.round(weight * proteinPerKg)
  const fatTarget = Math.round((calorieTarget * fatPct) / 9)
  const carbsTarget = Math.round((calorieTarget * carbsPct) / 4)

  return {
    bmr,
    tdee: Math.round(tdee),
    calorieTarget,
    proteinTarget,
    carbsTarget,
    fatTarget,
  }
}

// 生成模拟饮食日志（最近7天）
export const generateMockLogs = () => {
  const logs = {}
  const days = getRecentDays(7)
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']

  days.forEach((date, dayIdx) => {
    const dayLogs = []
    // 最近3天有完整记录，更早的随机有记录
    const hasFullRecord = dayIdx >= 4

    mealTypes.forEach((mealType, mealIdx) => {
      if (!hasFullRecord && Math.random() > 0.6) return

      const items = []
      let totalCals = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0

      // 根据餐次生成不同的食物
      if (mealType === 'breakfast') {
        items.push(
          { foodId: 'soy_milk', name: '豆浆', quantity: 250, unit: 'ml', calories: 78, protein: 4.5, carbs: 2.8, fat: 4.0 },
          { foodId: 'meat_bun', name: '鲜肉包子', quantity: 100, unit: 'g', calories: 227, protein: 9.0, carbs: 32.0, fat: 6.5 },
          { foodId: 'egg_boiled', name: '水煮蛋', quantity: 50, unit: 'g', calories: 72, protein: 6.7, carbs: 1.4, fat: 4.4 }
        )
      } else if (mealType === 'lunch') {
        items.push(
          { foodId: 'rice_white', name: '米饭', quantity: 150, unit: 'g', calories: 174, protein: 3.9, carbs: 38.7, fat: 0.5 },
          { foodId: 'chicken_leg', name: '红烧鸡腿', quantity: 120, unit: 'g', calories: 288, protein: 25.2, carbs: 8.4, fat: 16.8 },
          { foodId: 'broccoli', name: '清炒西兰花', quantity: 100, unit: 'g', calories: 36, protein: 2.8, carbs: 6.6, fat: 0.4 }
        )
      } else if (mealType === 'dinner') {
        items.push(
          { foodId: 'congee', name: '杂粮粥', quantity: 300, unit: 'ml', calories: 138, protein: 3.3, carbs: 29.7, fat: 0.9 },
          { foodId: 'fish_steamed', name: '清蒸鱼', quantity: 120, unit: 'g', calories: 136, protein: 24.5, carbs: 0, fat: 4.2 },
          { foodId: 'cucumber_salad', name: '凉拌黄瓜', quantity: 100, unit: 'g', calories: 16, protein: 0.8, carbs: 2.9, fat: 0.2 }
        )
      } else if (mealType === 'snack') {
        items.push(
          { foodId: 'apple', name: '苹果', quantity: 150, unit: 'g', calories: 78, protein: 0.5, carbs: 20.7, fat: 0.3 }
        )
      }

      items.forEach(it => {
        totalCals += it.calories
        totalProtein += it.protein
        totalCarbs += it.carbs
        totalFat += it.fat
      })

      const timeMap = { breakfast: '08:00', lunch: '12:15', dinner: '18:30', snack: '15:30' }

      dayLogs.push({
        id: `log_${date}_${mealIdx}`,
        date,
        mealType,
        time: timeMap[mealType],
        source: 'manual',
        photoUrl: null,
        items,
        totalNutrition: {
          calories: Math.round(totalCals),
          protein: Math.round(totalProtein * 10) / 10,
          carbs: Math.round(totalCarbs * 10) / 10,
          fat: Math.round(totalFat * 10) / 10,
        },
        note: '',
        createdAt: `${date}T${timeMap[mealType]}:00Z`,
      })
    })

    logs[date] = dayLogs
  })

  return logs
}

// 生成模拟体重记录
export const generateMockBodyRecords = () => {
  const records = []
  const days = getRecentDays(28)
  let weight = 65.0

  days.forEach((date) => {
    // 模拟体重波动和下降趋势
    weight = weight - 0.03 + (Math.random() - 0.5) * 0.1
    records.push({
      id: `body_${date}`,
      date,
      weight: Math.round(weight * 10) / 10,
      bodyFat: null,
      note: '',
      createdAt: `${date}T07:30:00Z`,
    })
  })

  return records
}
