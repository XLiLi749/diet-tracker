// 热量估算工具：综合食材 + 调料 + 汤汁 + 红油 的双层热量模型
// 为每道菜提供：不喝汤 / 连汤喝 两组参考热量

// 油脂等级定义
// extreme: 极重油（干锅、水煮、红烧、麻辣香锅等）- 汤汁上浮60-100%
// heavy:   重油（赣/湘/川普通小炒、带浓汁肉菜）- 汤汁上浮35-55%
// medium:  中油（家常菜、粤菜小炒、食堂大众菜）- 汤汁上浮20-30%
// light:   清淡（蒸菜、凉拌、白灼、清炒时蔬）- 汤汁上浮5-15%
// soup:    粉面/火锅/麻辣烫（汤底红油）- 喝汤上浮50-120%
// none:    无汤无油（米饭、馒头、主食、水果、饮品）- 上浮0%

const EXTREME_KEYWORDS = [
  '干锅', '水煮', '麻辣', '红油', '冒菜', '火锅', '麻辣烫',
  '烤鱼', '石锅', '铁板', '沸腾', '口水', '钵钵', '串串',
  '红烧', '糖醋', '鱼香', '宫保', '辣子', '回锅',
]

const HEAVY_KEYWORDS = [
  '小炒', '爆炒', '红烧', '干烧', '煎', '炸', '烤',
  '三杯', '剁椒', '泡椒', '豆瓣', '豆豉',
  '赣菜', '湘菜', '川菜',
]

const SOUP_KEYWORDS = [
  '粉', '面', '米线', '拉面', '刀削', '热干', '炸酱',
  '螺丝', '担担', '云吞', '馄饨', '饺子',
  '火锅', '麻辣烫', '冒菜', '串串', '汤锅',
]

const LIGHT_KEYWORDS = [
  '蒸', '凉拌', '白灼', '清炒时蔬', '烫', '煮', '炖',
  '粥', '羹', '清汤', '时蔬', '水果', '沙拉',
]

const NONE_KEYWORDS = [
  '米饭', '馒头', '包子', '花卷', '面包', '饼', '粥',
  '水果', '奶茶', '咖啡', '果汁', '可乐', '雪碧',
  '零食', '饼干', '蛋糕', '糖果',
]

// 菜系油脂加成（赣/湘/川 重油）
const HEAVY_CUISINES = ['赣菜', '湘菜', '川菜']
const MEDIUM_CUISINES = ['粤菜', '江浙菜', '鲁菜', '浙菜', '东北菜', '家常菜']
const LIGHT_CUISINES = ['日料']

export const getOilLevel = (food) => {
  const name = food.name || ''
  const tags = food.tags || []
  const category = food.category || ''

  // 1. 名称关键词（优先级最高）
  if (EXTREME_KEYWORDS.some(k => name.includes(k))) return 'extreme'
  if (SOUP_KEYWORDS.some(k => name.includes(k))) return 'soup'
  if (LIGHT_KEYWORDS.some(k => name.includes(k))) {
    // 但如果名称里同时有重油菜名（如"水煮青菜"），还是算重油
    if (!EXTREME_KEYWORDS.some(k => name.includes(k)) && !HEAVY_KEYWORDS.some(k => name.includes(k))) {
      return 'light'
    }
  }
  if (NONE_KEYWORDS.some(k => name.includes(k))) return 'none'
  if (HEAVY_KEYWORDS.some(k => name.includes(k))) return 'heavy'

  // 2. 菜系标签
  if (tags.some(t => HEAVY_CUISINES.includes(t))) return 'heavy'
  if (tags.some(t => LIGHT_CUISINES.includes(t))) return 'light'
  if (tags.some(t => MEDIUM_CUISINES.includes(t))) return 'medium'

  // 3. 类别判断
  if (['主食', '水果', '饮品', '零食', '甜点'].includes(category)) return 'none'
  if (['汤类', '粥品'].includes(category)) return 'light'

  // 4. 标签辅助
  if (tags.includes('清淡') || tags.includes('健康') || tags.includes('减脂') || tags.includes('低卡')) return 'light'
  if (tags.includes('油炸') || tags.includes('高热量') || tags.includes('高脂肪')) return 'heavy'

  // 5. 默认：食堂大众菜，中油
  return 'medium'
}

// 根据油脂等级和分量，返回上浮比例
const getSoupRatio = (oilLevel) => {
  switch (oilLevel) {
    case 'extreme': return 0.75  // 极重油菜：汤占75%
    case 'heavy':   return 0.45  // 重油菜：汤占45%
    case 'medium':  return 0.25  // 中油菜：汤占25%
    case 'light':   return 0.10  // 清淡菜：汤占10%
    case 'soup':    return 0.80  // 粉面火锅：汤底占80%
    case 'none':    return 0     // 无汤：0%
    default:        return 0.25
  }
}

// 油脂等级标签
export const OIL_LABELS = {
  extreme: { label: '极重油', color: 'bg-red-100 text-red-700', emoji: '🔥🔥' },
  heavy:   { label: '重油',   color: 'bg-orange-100 text-orange-700', emoji: '🔥' },
  medium:  { label: '中油',   color: 'bg-amber-100 text-amber-700', emoji: '✨' },
  light:   { label: '清淡',   color: 'bg-green-100 text-green-700', emoji: '🥬' },
  soup:    { label: '汤底红油', color: 'bg-red-100 text-red-700', emoji: '🍜' },
  none:    { label: '无汤',   color: 'bg-gray-100 text-gray-600', emoji: '🍚' },
}

// 获取双层热量信息
export const getCaloriesInfo = (food, qty = 100) => {
  const oilLevel = getOilLevel(food)
  const soupRatio = getSoupRatio(oilLevel)
  const factor = qty / 100

  // 当前 calories 是食材+炒菜用的油（不喝汤的热量）
  const caloriesNoSoup = Math.round((food.calories || 0) * factor)

  // 连汤喝 = 不喝汤 + 汤汁/红油的热量
  // 汤汁/红油热量 = 不喝汤 * soupRatio（因为菜本身热量已经包含了炒菜的油，
  // 汤汁主要是额外浮在表面的油和调味酱汁）
  const extraSoupCalories = Math.round(caloriesNoSoup * soupRatio)
  const caloriesWithSoup = caloriesNoSoup + extraSoupCalories

  const oilInfo = OIL_LABELS[oilLevel]

  return {
    oilLevel,
    oilLabel: oilInfo.label,
    oilColor: oilInfo.color,
    oilEmoji: oilInfo.emoji,
    caloriesNoSoup,           // 不喝汤：只吃菜本体
    caloriesWithSoup,         // 连汤喝：菜+汤汁+红油
    soupCalories: extraSoupCalories,  // 汤汁额外热量
    soupRatio: Math.round(soupRatio * 100),
    tip: getTip(oilLevel, extraSoupCalories),
  }
}

// 获取一条提示
const getTip = (oilLevel, soupCal) => {
  if (oilLevel === 'none') return null
  if (oilLevel === 'light') return soupCal > 30 ? '清淡菜，汤汁油脂较少' : null
  if (oilLevel === 'medium') return `汤汁/酱汁约含 ${soupCal} kcal，不喝汤更清爽`
  if (oilLevel === 'heavy') return `红油/浓汁约含 ${soupCal} kcal，建议沥去表面浮油`
  if (oilLevel === 'extreme') return `⚠️ 干锅/水煮菜汤汁油脂极高，约含 ${soupCal} kcal，强烈建议不喝汤`
  if (oilLevel === 'soup') return `汤底/红油耗热量巨大，约含 ${soupCal} kcal，少喝汤更健康`
  return null
}

// 估算一份的分量（和之前的 estimateQuantity 保持一致，新增油脂标签）
export const estimateQuantity = (food) => {
  const name = food.name || ''
  const category = food.category || ''
  const tags = food.tags || []

  // 名称匹配
  const namePatterns = [
    { p: /米饭|白饭|大米/, qty: 150, unit: 'g' },
    { p: /面|粉|米线|拉面|刀削/, qty: 250, unit: 'g' },
    { p: /粥|羹|汤/, qty: 300, unit: 'ml' },
    { p: /饺子|馄饨|包子|馒头|小笼包|生煎|锅贴/, qty: 200, unit: 'g' },
    { p: /饼|煎饼|手抓饼|葱油饼|春卷/, qty: 120, unit: 'g' },
    { p: /油条/, qty: 60, unit: 'g' },
    { p: /粽子|月饼|汤圆/, qty: 150, unit: 'g' },
    { p: /汉堡|披萨|三明治/, qty: 200, unit: 'g' },
    { p: /牛排|猪排|鸡排|鱼排/, qty: 150, unit: 'g' },
    { p: /红烧肉|扣肉|五花肉/, qty: 120, unit: 'g' },
    { p: /水煮鱼|水煮肉|酸菜鱼|毛血旺|烤鱼/, qty: 200, unit: 'g' },
    { p: /干锅|麻辣|香锅/, qty: 180, unit: 'g' },
    { p: /炸鸡|烤鸡|烤鸭/, qty: 150, unit: 'g' },
    { p: /奶茶|咖啡|果汁|可乐/, qty: 500, unit: 'ml' },
    { p: /水果/, qty: 200, unit: 'g' },
    { p: /酸奶|牛奶/, qty: 250, unit: 'ml' },
  ]

  for (const np of namePatterns) {
    if (np.p.test(name)) return { qty: np.qty, unit: np.unit }
  }

  // 类别匹配
  if (category === '主食') return { qty: 150, unit: 'g' }
  if (category === '肉类') return { qty: 120, unit: 'g' }
  if (category === '素菜') return { qty: 150, unit: 'g' }
  if (category === '汤类') return { qty: 300, unit: 'ml' }
  if (category === '饮品') return { qty: 500, unit: 'ml' }
  if (category === '水果') return { qty: 200, unit: 'g' }
  if (category === '零食') return { qty: 80, unit: 'g' }

  // 默认
  return { qty: 100, unit: 'g' }
}
