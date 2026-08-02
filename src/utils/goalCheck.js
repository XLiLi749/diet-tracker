// ============================================================
// 目标达成判定工具
// 科学区间：
//   减重 fat_loss:   目标值的 80% ~ 100%（不能太低也不能超标）
//   增重 weight_gain: 目标值的 100% ~ 120%（不能太低也不能过量）
//   维持 maintain:    目标值的 90% ~ 110%
// 附加条件：早餐、中餐、晚餐 三餐都有记录（加餐无所谓）
// ============================================================

export const GOAL_ACHIEVE_RULES = {
  fat_loss:    { minRatio: 0.80, maxRatio: 1.00, label: '减脂' },
  weight_gain: { minRatio: 1.00, maxRatio: 1.20, label: '增重' },
  maintain:    { minRatio: 0.90, maxRatio: 1.10, label: '维持' },
}

// 判断是否达成目标
export const checkGoalAchieved = (totalCalories, targetCalories, goalType, records = []) => {
  const rule = GOAL_ACHIEVE_RULES[goalType] || GOAL_ACHIEVE_RULES.maintain
  const minCal = targetCalories * rule.minRatio
  const maxCal = targetCalories * rule.maxRatio

  // 检查三餐是否都有
  const mealTypes = new Set(records.map(r => r.mealType))
  const hasBreakfast = mealTypes.has('breakfast') || mealTypes.has('早餐')
  const hasLunch = mealTypes.has('lunch') || mealTypes.has('午餐')
  const hasDinner = mealTypes.has('dinner') || mealTypes.has('晚餐')
  const threeMealsDone = hasBreakfast && hasLunch && hasDinner

  const inRange = totalCalories >= minCal && totalCalories <= maxCal

  return {
    achieved: inRange && threeMealsDone,
    totalCalories: Math.round(totalCalories),
    targetCalories: Math.round(targetCalories),
    minCal: Math.round(minCal),
    maxCal: Math.round(maxCal),
    threeMealsDone,
    hasBreakfast,
    hasLunch,
    hasDinner,
    inRange,
    goalLabel: rule.label,
    ratio: targetCalories > 0 ? (totalCalories / targetCalories) : 0,
  }
}

// 获取昨日日期字符串
export const getYesterdayStr = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

// 获取今日日期字符串
export const getTodayStr = () => {
  return new Date().toISOString().slice(0, 10)
}

// 计算连续达成目标的天数
export const calcGoalStreak = (foodLogs, targetCalories, goalType) => {
  if (!foodLogs) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayLogs = foodLogs[dateStr] || []
    if (dayLogs.length === 0) {
      // 今天还没有记录不算断档，往前继续找
      if (i === 0) continue
      break
    }
    const records = []
    dayLogs.forEach(log => {
      (log.items || []).forEach(item => {
        records.push({ ...item, mealType: log.mealType })
      })
    })
    const totalCalories = records.reduce((s, r) => s + (r.calories || 0), 0)
    const result = checkGoalAchieved(totalCalories, targetCalories, goalType, records)
    if (result.achieved) {
      streak++
    } else {
      // 今天还没结束，不达成不算断档
      if (i === 0) continue
      break
    }
  }
  return streak
}
