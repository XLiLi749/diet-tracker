import dayjs from 'dayjs'
import { calcBMI, calcDailyTargets, calcBMR } from './mock'

// 管理员账号密码（纯前端demo）
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

// 生成随机虚拟用户
const NICKNAMES = ['小兔子', '小熊猫', '橘子汽水', '奶茶加冰', '柠檬不萌', '草莓酸奶', '芝士蛋糕', '抹茶拿铁', '可乐加冰', '番茄炒蛋', '糖醋里脊', '红烧肉爱好者']
const GENDERS = ['male', 'female']
const GOAL_TYPES = ['fat_loss', 'maintain', 'weight_gain', 'muscle_gain']
const IDENTITIES = ['student', 'office_worker', 'freelancer']
const PROFESSIONS = ['大学生', '办公室职员', '自由职业', '程序员', '设计师', '教师', '护士']

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]

// 为指定用户生成饮食日志
const generateLogsForUser = (profile, days = 30) => {
  const logs = []
  const targetCal = profile.targets?.calorieTarget || 2000

  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    // 每周约2-3天"达标"，其余波动
    const achievementRand = Math.random()
    const factor = achievementRand < 0.4 ? 1.0 : (achievementRand < 0.7 ? 0.85 : 1.2)

    const meals = ['breakfast', 'lunch', 'dinner']
    if (Math.random() > 0.5) meals.push('snack')

    let dayTotalCals = 0, dayTotalProtein = 0, dayTotalCarbs = 0, dayTotalFat = 0

    meals.forEach((mealType, idx) => {
      const mealRatio = mealType === 'breakfast' ? 0.25 : mealType === 'lunch' ? 0.35 : mealType === 'dinner' ? 0.30 : 0.10
      const mealCals = Math.round(targetCal * mealRatio * factor * (0.9 + Math.random() * 0.2))
      const protein = Math.round(mealCals * 0.2 / 4)
      const carbs = Math.round(mealCals * 0.5 / 4)
      const fat = Math.round(mealCals * 0.3 / 9)

      dayTotalCals += mealCals
      dayTotalProtein += protein
      dayTotalCarbs += carbs
      dayTotalFat += fat

      const timeMap = { breakfast: '08:00', lunch: '12:15', dinner: '18:30', snack: '15:30' }
      logs.push({
        id: `log_${profile.id}_${date}_${idx}`,
        date,
        mealType,
        time: timeMap[mealType],
        source: Math.random() > 0.7 ? 'photo' : 'manual',
        photoUrl: Math.random() > 0.7 ? `mock_photo_${profile.id}_${date}_${idx}` : null,
        items: generateMealItems(mealType, mealCals),
        totalNutrition: {
          calories: mealCals,
          protein,
          carbs,
          fat,
        },
      })
    })
  }

  return logs
}

// 生成餐食明细
const generateMealItems = (mealType, totalCals) => {
  const items = []
  const breakfastOptions = [
    { name: '豆浆', calFactor: 0.15 },
    { name: '包子', calFactor: 0.25 },
    { name: '鸡蛋', calFactor: 0.10 },
    { name: '馒头', calFactor: 0.20 },
    { name: '小米粥', calFactor: 0.10 },
    { name: '油条', calFactor: 0.20 },
  ]
  const mainOptions = [
    { name: '米饭', calFactor: 0.25 },
    { name: '青椒肉丝', calFactor: 0.20 },
    { name: '番茄炒蛋', calFactor: 0.15 },
    { name: '炒青菜', calFactor: 0.08 },
    { name: '红烧肉', calFactor: 0.25 },
    { name: '宫保鸡丁', calFactor: 0.20 },
    { name: '麻婆豆腐', calFactor: 0.18 },
    { name: '鱼香肉丝', calFactor: 0.22 },
  ]

  const pool = mealType === 'breakfast' ? breakfastOptions : mainOptions
  const numItems = mealType === 'snack' ? 1 : randInt(2, 4)
  let usedCals = 0

  for (let i = 0; i < numItems; i++) {
    const opt = pool[randInt(0, pool.length - 1)]
    const itemCals = Math.round(totalCals * opt.calFactor * (0.8 + Math.random() * 0.4))
    usedCals += itemCals
    items.push({
      foodId: 'mock_' + opt.name,
      name: opt.name,
      quantity: randInt(80, 150),
      unit: 'g',
      calories: itemCals,
      protein: Math.round(itemCals * 0.15 / 4),
      carbs: Math.round(itemCals * 0.5 / 4),
      fat: Math.round(itemCals * 0.3 / 9),
      eatSoup: Math.random() > 0.7,
    })
  }

  return items
}

// 生成体重记录
const generateBodyRecordsForUser = (profile, days = 90) => {
  const records = []
  let currentWeight = profile.weight

  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    // 每周测1-2次体重
    if (Math.random() > 0.7) {
      // 根据目标增减体重
      const goalTrend = profile.dietGoal?.type === 'fat_loss' ? -0.08 : profile.dietGoal?.type === 'weight_gain' ? 0.05 : 0
      currentWeight = currentWeight + goalTrend + (Math.random() - 0.5) * 0.3
      records.push({
        id: `body_${profile.id}_${date}`,
        date,
        weight: Math.round(currentWeight * 10) / 10,
        note: '',
      })
    }
  }

  return records
}

// 生成全部模拟用户
export const generateMockUsers = () => {
  const users = []
  const today = dayjs()

  for (let i = 0; i < 12; i++) {
    const gender = i % 2 === 0 ? 'male' : 'female'
    const age = randInt(18, 35)
    const height = gender === 'male' ? randInt(168, 185) : randInt(155, 172)
    const weight = gender === 'male' ? randInt(55, 85) : randInt(42, 70)
    const goalType = GOAL_TYPES[i % GOAL_TYPES.length]
    const identity = IDENTITIES[i % IDENTITIES.length]
    const profession = PROFESSIONS[i % PROFESSIONS.length]

    const baseProfile = {
      id: `user_${String(i + 1).padStart(3, '0')}`,
      nickname: NICKNAMES[i % NICKNAMES.length],
      avatar: null,
      gender,
      age,
      height,
      weight,
      identity,
      profession,
      createdAt: today.subtract(randInt(5, 90), 'day').format('YYYY-MM-DD'),
      updatedAt: today.format('YYYY-MM-DD'),
      dietGoal: {
        type: goalType,
        targetWeight: Math.round((weight + (goalType === 'fat_loss' ? -5 : goalType === 'weight_gain' ? 5 : 0)) * 10) / 10,
        rateLevel: i % 3 === 0 ? 'standard' : 'gentle',
        startDate: today.subtract(randInt(10, 60), 'day').format('YYYY-MM-DD'),
        expectedDurationMonths: randInt(2, 6),
      },
      lifestyle: {
        exerciseFrequency: ['none', '1-2_per_week', '2-3_per_week', '3-5_per_week'][i % 4],
        sleepHours: randInt(6, 9),
        workStress: ['low', 'medium', 'high'][i % 3],
      },
      preferences: {
        tasteTags: ['辣', '清淡', '咸鲜', '酸甜'].slice(0, randInt(1, 3)),
        dislikedFoods: [],
        cuisinePreferences: ['赣菜', '湘菜', '川菜', '家常菜'].slice(0, randInt(1, 3)),
      },
    }

    const targets = calcDailyTargets(baseProfile)
    baseProfile.targets = targets
    baseProfile.bmi = parseFloat(calcBMI(weight, height))

    const logs = generateLogsForUser(baseProfile, 30)
    const bodyRecords = generateBodyRecordsForUser(baseProfile, 90)

    // 计算活跃度
    const last7DayLogs = logs.filter(l => dayjs(l.date).isAfter(today.subtract(7, 'day')))
    const activeDays = new Set(last7DayLogs.map(l => l.date)).size

    users.push({
      profile: baseProfile,
      logs,
      bodyRecords,
      stats: {
        totalLogDays: new Set(logs.map(l => l.date)).size,
        activeDays7: activeDays,
        isActiveToday: logs.some(l => l.date === today.format('YYYY-MM-DD')),
        lastActive: logs.length > 0 ? logs[logs.length - 1].date : baseProfile.createdAt,
      },
    })
  }

  return users
}

// 管理员操作日志（模拟）
let adminActionLogs = []

export const addAdminLog = (action, detail) => {
  adminActionLogs.unshift({
    id: 'log_' + Date.now(),
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    admin: 'admin',
    action,
    detail,
  })
  if (adminActionLogs.length > 200) adminActionLogs = adminActionLogs.slice(0, 200)
}

export const getAdminLogs = () => adminActionLogs
