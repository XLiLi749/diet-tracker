// ============================================================
// 食材拆解引擎
// 根据菜名自动识别基础食材、烹饪方式、估算用油量
// ============================================================

import { findIngredientByName, INGREDIENT_DATABASE } from '../data/ingredients'

// ============================================================
// 1. 关键词 → 食材ID 映射（优先级高于模糊匹配）
// ============================================================
const KEYWORD_INGREDIENT_MAP = [
  // 肉类
  { kw: '五花肉', ingId: 'ing_pork_belly', ratio: 0.35 },
  { kw: '瘦肉', ingId: 'ing_pork_lean', ratio: 0.30 },
  { kw: '里脊', ingId: 'ing_pork_lean', ratio: 0.28 },
  { kw: '排骨', ingId: 'ing_pork_ribs', ratio: 0.35 },
  { kw: '猪蹄', ingId: 'ing_pork_trotter', ratio: 0.30 },
  { kw: '猪脚', ingId: 'ing_pork_trotter', ratio: 0.30 },
  { kw: '猪肝', ingId: 'ing_pork_liver', ratio: 0.25 },
  { kw: '肥牛', ingId: 'ing_beef_fat', ratio: 0.30 },
  { kw: '牛肉', ingId: 'ing_beef', ratio: 0.28 },
  { kw: '黄牛肉', ingId: 'ing_beef', ratio: 0.30 },
  { kw: '羊肉', ingId: 'ing_lamb_fat', ratio: 0.28 },
  { kw: '肥羊', ingId: 'ing_lamb_fat', ratio: 0.30 },
  { kw: '鸭肉', ingId: 'ing_duck', ratio: 0.28 },
  { kw: '鸭胸', ingId: 'ing_duck_breast', ratio: 0.25 },
  { kw: '兔肉', ingId: 'ing_rabbit', ratio: 0.28 },

  // 禽蛋
  { kw: '鸡胸', ingId: 'ing_chicken_breast', ratio: 0.30 },
  { kw: '鸡脯', ingId: 'ing_chicken_breast', ratio: 0.30 },
  { kw: '鸡翅', ingId: 'ing_chicken_wing', ratio: 0.25 },
  { kw: '鸡腿', ingId: 'ing_chicken_leg', ratio: 0.28 },
  { kw: '鸡肉', ingId: 'ing_chicken_whole', ratio: 0.28 },
  { kw: '土鸡', ingId: 'ing_chicken_whole', ratio: 0.30 },
  { kw: '鸡蛋', ingId: 'ing_egg', ratio: 0.20 },
  { kw: '蛋', ingId: 'ing_egg', ratio: 0.18 },
  { kw: '蛋清', ingId: 'ing_egg_white', ratio: 0.20 },
  { kw: '蛋黄', ingId: 'ing_egg_yolk', ratio: 0.15 },
  { kw: '鹌鹑蛋', ingId: 'ing_quail_egg', ratio: 0.18 },
  { kw: '鸭蛋', ingId: 'ing_duck_egg', ratio: 0.18 },

  // 水产
  { kw: '草鱼', ingId: 'ing_grass_carp', ratio: 0.30 },
  { kw: '鲫鱼', ingId: 'ing_crucian', ratio: 0.28 },
  { kw: '三文鱼', ingId: 'ing_salmon', ratio: 0.28 },
  { kw: '鲑鱼', ingId: 'ing_salmon', ratio: 0.28 },
  { kw: '虾仁', ingId: 'ing_shrimp_peeled', ratio: 0.20 },
  { kw: '虾', ingId: 'ing_shrimp', ratio: 0.22 },
  { kw: '螃蟹', ingId: 'ing_crab', ratio: 0.25 },
  { kw: '蟹', ingId: 'ing_crab', ratio: 0.25 },
  { kw: '鱿鱼', ingId: 'ing_squid', ratio: 0.22 },
  { kw: '章鱼', ingId: 'ing_octopus', ratio: 0.22 },
  { kw: '八爪鱼', ingId: 'ing_octopus', ratio: 0.22 },
  { kw: '蛤蜊', ingId: 'ing_clam', ratio: 0.20 },
  { kw: '花蛤', ingId: 'ing_clam', ratio: 0.20 },
  { kw: '生蚝', ingId: 'ing_oyster', ratio: 0.22 },
  { kw: '牡蛎', ingId: 'ing_oyster', ratio: 0.22 },
  { kw: '海带', ingId: 'ing_kelp', ratio: 0.10 },
  { kw: '紫菜', ingId: 'ing_seaweed', ratio: 0.05 },
  { kw: '鱼片', ingId: 'ing_grass_carp', ratio: 0.30 },
  { kw: '鱼', ingId: 'ing_grass_carp', ratio: 0.28 },

  // 绿叶蔬菜
  { kw: '白菜', ingId: 'ing_chinese_cabbage', ratio: 0.30 },
  { kw: '青菜', ingId: 'ing_greens', ratio: 0.30 },
  { kw: '上海青', ingId: 'ing_greens', ratio: 0.30 },
  { kw: '小白菜', ingId: 'ing_greens', ratio: 0.30 },
  { kw: '菠菜', ingId: 'ing_spinach', ratio: 0.28 },
  { kw: '生菜', ingId: 'ing_lettuce', ratio: 0.28 },
  { kw: '油麦菜', ingId: 'ing_oilseed', ratio: 0.28 },
  { kw: '芹菜', ingId: 'ing_celery', ratio: 0.25 },
  { kw: '香菜', ingId: 'ing_coriander', ratio: 0.05 },
  { kw: '葱', ingId: 'ing_scallion', ratio: 0.05 },
  { kw: '大葱', ingId: 'ing_scallion', ratio: 0.05 },
  { kw: '小葱', ingId: 'ing_scallion', ratio: 0.03 },
  { kw: '韭菜', ingId: 'ing_chives', ratio: 0.25 },
  { kw: '包菜', ingId: 'ing_cabbage', ratio: 0.28 },
  { kw: '卷心菜', ingId: 'ing_cabbage', ratio: 0.28 },
  { kw: '圆白菜', ingId: 'ing_cabbage', ratio: 0.28 },
  { kw: '莲花白', ingId: 'ing_cabbage', ratio: 0.28 },
  { kw: '西兰花', ingId: 'ing_broccoli', ratio: 0.25 },
  { kw: '绿菜花', ingId: 'ing_broccoli', ratio: 0.25 },
  { kw: '花菜', ingId: 'ing_cauliflower', ratio: 0.28 },
  { kw: '花椰菜', ingId: 'ing_cauliflower', ratio: 0.28 },
  { kw: '时蔬', ingId: 'ing_greens', ratio: 0.28 },

  // 瓜茄类
  { kw: '番茄', ingId: 'ing_tomato', ratio: 0.28 },
  { kw: '西红柿', ingId: 'ing_tomato', ratio: 0.30 },
  { kw: '黄瓜', ingId: 'ing_cucumber', ratio: 0.28 },
  { kw: '茄子', ingId: 'ing_eggplant', ratio: 0.30 },
  { kw: '南瓜', ingId: 'ing_pumpkin', ratio: 0.35 },
  { kw: '冬瓜', ingId: 'ing_wax_gourd', ratio: 0.35 },
  { kw: '苦瓜', ingId: 'ing_bitter_gourd', ratio: 0.28 },
  { kw: '丝瓜', ingId: 'ing_sponge_gourd', ratio: 0.30 },
  { kw: '辣椒', ingId: 'ing_chili', ratio: 0.15 },
  { kw: '青椒', ingId: 'ing_chili', ratio: 0.18 },
  { kw: '尖椒', ingId: 'ing_chili', ratio: 0.15 },
  { kw: '剁椒', ingId: 'ing_hot_pepper', ratio: 0.08 },
  { kw: '小米辣', ingId: 'ing_hot_pepper', ratio: 0.05 },
  { kw: '玉米', ingId: 'ing_corn', ratio: 0.25 },

  // 根茎类
  { kw: '土豆', ingId: 'ing_potato', ratio: 0.30 },
  { kw: '马铃薯', ingId: 'ing_potato', ratio: 0.30 },
  { kw: '藕', ingId: 'ing_lotus_root', ratio: 0.30 },
  { kw: '莲藕', ingId: 'ing_lotus_root', ratio: 0.30 },
  { kw: '藕片', ingId: 'ing_lotus_root', ratio: 0.28 },
  { kw: '胡萝卜', ingId: 'ing_carrot', ratio: 0.20 },
  { kw: '红萝卜', ingId: 'ing_radish_red', ratio: 0.25 },
  { kw: '白萝卜', ingId: 'ing_radish_white', ratio: 0.28 },
  { kw: '萝卜', ingId: 'ing_radish_white', ratio: 0.28 },
  { kw: '红薯', ingId: 'ing_sweet_potato', ratio: 0.30 },
  { kw: '地瓜', ingId: 'ing_sweet_potato', ratio: 0.30 },
  { kw: '番薯', ingId: 'ing_sweet_potato', ratio: 0.30 },
  { kw: '山药', ingId: 'ing_yam', ratio: 0.28 },
  { kw: '芋头', ingId: 'ing_taro', ratio: 0.28 },
  { kw: '四季豆', ingId: 'ing_green_bean', ratio: 0.28 },
  { kw: '豆角', ingId: 'ing_green_bean', ratio: 0.28 },
  { kw: '豌豆', ingId: 'ing_pea', ratio: 0.20 },
  { kw: '蚕豆', ingId: 'ing_broad_bean', ratio: 0.22 },

  // 菌菇
  { kw: '香菇', ingId: 'ing_mushroom', ratio: 0.15 },
  { kw: '平菇', ingId: 'ing_oyster_mushroom', ratio: 0.15 },
  { kw: '蘑菇', ingId: 'ing_shiitake', ratio: 0.15 },
  { kw: '口蘑', ingId: 'ing_shiitake', ratio: 0.15 },
  { kw: '白蘑菇', ingId: 'ing_shiitake', ratio: 0.15 },
  { kw: '木耳', ingId: 'ing_black_fungus', ratio: 0.08 },
  { kw: '黑木耳', ingId: 'ing_black_fungus', ratio: 0.08 },
  { kw: '银耳', ingId: 'ing_tremella', ratio: 0.08 },
  { kw: '金针菇', ingId: 'ing_needle_mushroom', ratio: 0.15 },
  { kw: '杏鲍菇', ingId: 'ing_enoki', ratio: 0.15 },

  // 豆制品
  { kw: '豆腐', ingId: 'ing_tofu_soft', ratio: 0.28 },
  { kw: '嫩豆腐', ingId: 'ing_tofu_soft', ratio: 0.28 },
  { kw: '老豆腐', ingId: 'ing_tofu_firm', ratio: 0.25 },
  { kw: '北豆腐', ingId: 'ing_tofu_firm', ratio: 0.25 },
  { kw: '南豆腐', ingId: 'ing_tofu_soft', ratio: 0.28 },
  { kw: '豆腐干', ingId: 'ing_tofu_dried', ratio: 0.22 },
  { kw: '豆干', ingId: 'ing_tofu_dried', ratio: 0.22 },
  { kw: '香干', ingId: 'ing_tofu_dried', ratio: 0.22 },
  { kw: '千张', ingId: 'ing_tofu_dried', ratio: 0.20 },
  { kw: '腐竹', ingId: 'ing_yuba', ratio: 0.15 },
  { kw: '豆浆', ingId: 'ing_soy_milk', ratio: 0.40 },
  { kw: '豆腐脑', ingId: 'ing_tofu_pudding', ratio: 0.40 },
  { kw: '豆花', ingId: 'ing_tofu_pudding', ratio: 0.40 },
  { kw: '千叶豆腐', ingId: 'ing_tofu_firm', ratio: 0.25 },

  // 主食
  { kw: '米饭', ingId: 'ing_rice_cooked', ratio: 0.50 },
  { kw: '白米饭', ingId: 'ing_rice_cooked', ratio: 0.50 },
  { kw: '大米', ingId: 'ing_rice', ratio: 0.30 },
  { kw: '面条', ingId: 'ing_noodle_cooked', ratio: 0.50 },
  { kw: '面', ingId: 'ing_noodle_cooked', ratio: 0.45 },
  { kw: '馒头', ingId: 'ing_steamed_bread', ratio: 0.40 },
  { kw: '面粉', ingId: 'ing_flour', ratio: 0.30 },
  { kw: '小米', ingId: 'ing_millet', ratio: 0.30 },
  { kw: '燕麦', ingId: 'ing_oat', ratio: 0.25 },
  { kw: '黑米', ingId: 'ing_black_rice', ratio: 0.30 },
  { kw: '糙米', ingId: 'ing_brown_rice', ratio: 0.30 },
  { kw: '糯米', ingId: 'ing_sweet_rice', ratio: 0.30 },

  // 水果
  { kw: '苹果', ingId: 'ing_apple', ratio: 0.50 },
  { kw: '香蕉', ingId: 'ing_banana', ratio: 0.45 },
  { kw: '橙子', ingId: 'ing_orange', ratio: 0.45 },
  { kw: '橙', ingId: 'ing_orange', ratio: 0.40 },
  { kw: '西瓜', ingId: 'ing_watermelon', ratio: 0.60 },
  { kw: '葡萄', ingId: 'ing_grape', ratio: 0.40 },
  { kw: '草莓', ingId: 'ing_strawberry', ratio: 0.40 },
  { kw: '芒果', ingId: 'ing_mango', ratio: 0.40 },
  { kw: '梨', ingId: 'ing_pear', ratio: 0.45 },
  { kw: '桃子', ingId: 'ing_peach', ratio: 0.45 },
  { kw: '猕猴桃', ingId: 'ing_kiwi', ratio: 0.40 },

  // 奶类坚果
  { kw: '牛奶', ingId: 'ing_milk', ratio: 0.50 },
  { kw: '纯牛奶', ingId: 'ing_milk', ratio: 0.50 },
  { kw: '酸奶', ingId: 'ing_yogurt', ratio: 0.45 },
  { kw: '花生', ingId: 'ing_peanut', ratio: 0.15 },
  { kw: '核桃', ingId: 'ing_walnut', ratio: 0.12 },
  { kw: '杏仁', ingId: 'ing_almond', ratio: 0.12 },
  { kw: '黄豆', ingId: 'ing_soybean', ratio: 0.20 },
  { kw: '大豆', ingId: 'ing_soybean', ratio: 0.20 },
  { kw: '奶酪', ingId: 'ing_cheese', ratio: 0.20 },
  { kw: '芝士', ingId: 'ing_cheese', ratio: 0.20 },

  // ============ 面点及馅料 ============
  { kw: '红豆沙', ingId: 'ing_red_bean_paste', ratio: 0.20 },
  { kw: '豆沙', ingId: 'ing_red_bean_paste', ratio: 0.18 },
  { kw: '猪肉馅', ingId: 'ing_pork_minced', ratio: 0.25 },
  { kw: '肉馅', ingId: 'ing_pork_minced', ratio: 0.22 },
  { kw: '肉末', ingId: 'ing_pork_minced', ratio: 0.20 },
  { kw: '白菜馅', ingId: 'ing_cabbage_minced', ratio: 0.25 },
  { kw: '韭菜馅', ingId: 'ing_chives_filling', ratio: 0.25 },
  { kw: '萝卜丝', ingId: 'ing_radish_shredded', ratio: 0.25 },
  { kw: '萝卜丝馅', ingId: 'ing_radish_shredded', ratio: 0.25 },
  { kw: '香菇馅', ingId: 'ing_mushroom_filling', ratio: 0.20 },
  { kw: '青菜馅', ingId: 'ing_greens_filling', ratio: 0.25 },
  { kw: '红糖', ingId: 'ing_brown_sugar', ratio: 0.10 },
  { kw: '黑糖', ingId: 'ing_brown_sugar', ratio: 0.10 },
  { kw: '黑芝麻', ingId: 'ing_sesame_black', ratio: 0.08 },
  { kw: '芝麻', ingId: 'ing_sesame_black', ratio: 0.06 },
  { kw: '花生酱', ingId: 'ing_peanut_butter', ratio: 0.10 },
  { kw: '葱油', ingId: 'ing_scallion_oil', ratio: 0.08 },
  { kw: '面皮', ingId: 'ing_dough', ratio: 0.60 },
  { kw: '面团', ingId: 'ing_dough', ratio: 0.60 },
  { kw: '饺子皮', ingId: 'ing_wonton_wrapper', ratio: 0.45 },
  { kw: '馄饨皮', ingId: 'ing_wonton_wrapper', ratio: 0.40 },
  { kw: '酥皮', ingId: 'ing_phyllo', ratio: 0.50 },

  // 面点整体名称 -> 映射到面皮 + 典型馅料
  { kw: '豆沙包', ingId: 'ing_red_bean_paste', ratio: 0.22 },
  { kw: '红豆卷', ingId: 'ing_red_bean_paste', ratio: 0.25 },
  { kw: '鲜肉包', ingId: 'ing_pork_minced', ratio: 0.25 },
  { kw: '肉包子', ingId: 'ing_pork_minced', ratio: 0.22 },
  { kw: '萝卜丝包', ingId: 'ing_radish_shredded', ratio: 0.30 },
  { kw: '青菜包', ingId: 'ing_greens_filling', ratio: 0.28 },
  { kw: '香菇包', ingId: 'ing_mushroom_filling', ratio: 0.22 },
  { kw: '素菜包', ingId: 'ing_greens_filling', ratio: 0.25 },
  { kw: '红糖馒头', ingId: 'ing_brown_sugar', ratio: 0.12 },
  { kw: '韭菜盒子', ingId: 'ing_chives_filling', ratio: 0.30 },
  { kw: '葱油花卷', ingId: 'ing_scallion_oil', ratio: 0.08 },
  { kw: '花卷', ingId: 'ing_dough', ratio: 0.85 },
  { kw: '烧麦', ingId: 'ing_pork_minced', ratio: 0.15 },
  { kw: '小笼包', ingId: 'ing_pork_minced', ratio: 0.20 },
  { kw: '生煎包', ingId: 'ing_pork_minced', ratio: 0.22 },
  { kw: '麻团', ingId: 'ing_sesame_black', ratio: 0.06 },
  { kw: '芝麻球', ingId: 'ing_sesame_black', ratio: 0.08 },
  { kw: '流沙包', ingId: 'ing_brown_sugar', ratio: 0.10 },
  { kw: '叉烧包', ingId: 'ing_pork_minced', ratio: 0.22 },
  { kw: '蒸饺', ingId: 'ing_pork_minced', ratio: 0.20 },
  { kw: '煎饺', ingId: 'ing_pork_minced', ratio: 0.20 },
  { kw: '锅贴', ingId: 'ing_pork_minced', ratio: 0.20 },
  { kw: '千层饼', ingId: 'ing_scallion_oil', ratio: 0.10 },
  { kw: '面饼', ingId: 'ing_dough', ratio: 0.90 },
]

// ============================================================
// 2. 烹饪方式 → 用油量 & 汤汁判断
// ============================================================
export const COOK_METHOD_MAP = [
  // 方式关键词, 每100g菜品用油量(g), 是否有汤汁, 汤汁热量上浮比例
  { kw: '红烧', oilPer100g: 8, hasSoup: true, soupRatio: 0.30 },
  { kw: '烧', oilPer100g: 6, hasSoup: true, soupRatio: 0.20 },
  { kw: '焖', oilPer100g: 5, hasSoup: true, soupRatio: 0.18 },
  { kw: '炖', oilPer100g: 3, hasSoup: true, soupRatio: 0.15 },
  { kw: '煮', oilPer100g: 2, hasSoup: true, soupRatio: 0.12 },
  { kw: '卤', oilPer100g: 4, hasSoup: true, soupRatio: 0.18 },
  { kw: '酱', oilPer100g: 5, hasSoup: true, soupRatio: 0.15 },
  { kw: '干锅', oilPer100g: 12, hasSoup: false, soupRatio: 0.35 },
  { kw: '水煮', oilPer100g: 10, hasSoup: true, soupRatio: 0.45 },
  { kw: '干煸', oilPer100g: 9, hasSoup: false, soupRatio: 0 },
  { kw: '爆炒', oilPer100g: 7, hasSoup: false, soupRatio: 0.05 },
  { kw: '滑炒', oilPer100g: 6, hasSoup: false, soupRatio: 0.05 },
  { kw: '清炒', oilPer100g: 4, hasSoup: false, soupRatio: 0.05 },
  { kw: '炒', oilPer100g: 5, hasSoup: false, soupRatio: 0.08 },
  { kw: '蒸', oilPer100g: 1, hasSoup: false, soupRatio: 0 },
  { kw: '清蒸', oilPer100g: 0.5, hasSoup: false, soupRatio: 0 },
  { kw: '粉蒸', oilPer100g: 3, hasSoup: false, soupRatio: 0 },
  { kw: '凉拌', oilPer100g: 5, hasSoup: false, soupRatio: 0.05 },
  { kw: '炸', oilPer100g: 15, hasSoup: false, soupRatio: 0 },
  { kw: '煎', oilPer100g: 8, hasSoup: false, soupRatio: 0 },
  { kw: '烤', oilPer100g: 5, hasSoup: false, soupRatio: 0 },
  { kw: '铁板', oilPer100g: 8, hasSoup: false, soupRatio: 0.05 },
  { kw: '煲', oilPer100g: 4, hasSoup: true, soupRatio: 0.20 },
  { kw: '火锅', oilPer100g: 6, hasSoup: true, soupRatio: 0.50 },
  { kw: '麻辣烫', oilPer100g: 8, hasSoup: true, soupRatio: 0.55 },
  { kw: '汤', oilPer100g: 2, hasSoup: true, soupRatio: 0.20 },
]

// ============================================================
// 3. 菜系默认油量修正
// ============================================================
const CUISINE_OIL_BONUS = [
  { cuisine: '赣菜', bonus: 2 },
  { cuisine: '湘菜', bonus: 2 },
  { cuisine: '川菜', bonus: 2.5 },
  { cuisine: '贵州菜', bonus: 2 },
  { cuisine: '东北菜', bonus: 1 },
  { cuisine: '鲁菜', bonus: 1 },
  { cuisine: '粤菜', bonus: -1 },
  { cuisine: '江浙菜', bonus: -0.5 },
  { cuisine: '日料', bonus: -2 },
]

// ============================================================
// 4. 核心：菜名食材拆解引擎
// ============================================================

/**
 * 识别菜品的烹饪方式
 */
export const detectCookMethod = (dishName) => {
  for (const m of COOK_METHOD_MAP) {
    if (dishName.includes(m.kw)) return m
  }
  return { kw: '炒', oilPer100g: 5, hasSoup: false, soupRatio: 0.08 }
}

/**
 * 从菜名中拆解基础食材（带估算重量）
 * @param {string} dishName - 菜名
 * @param {number} totalWeight - 菜品总重量(g)，默认150g
 * @returns {Array} 食材清单 [{id, name, weight, calories, protein, fat, carbs}]
 */
export const parseDishIngredients = (dishName, totalWeight = 150) => {
  const found = []
  const usedKeywords = new Set()

  // 第一步：优先用关键词映射精确匹配（长关键词优先匹配，避免「肉」覆盖「五花肉」）
  const sortedMap = [...KEYWORD_INGREDIENT_MAP].sort((a, b) => b.kw.length - a.kw.length)

  for (const item of sortedMap) {
    if (dishName.includes(item.kw)) {
      // 检查是否已经被更长的关键词覆盖
      let alreadyFound = false
      for (const kw of usedKeywords) {
        if (kw.includes(item.kw)) { alreadyFound = true; break }
      }
      if (alreadyFound) continue

      const ing = INGREDIENT_DATABASE.find(i => i.id === item.ingId)
      if (ing) {
        found.push({
          ingredientId: ing.id,
          name: ing.name,
          category: ing.category,
          ratio: item.ratio,     // 在菜品中的占比
          matchedKw: item.kw,
          nutritionPer100g: {
            calories: ing.calories,
            protein: ing.protein,
            fat: ing.fat,
            carbs: ing.carbs,
          },
        })
        usedKeywords.add(item.kw)
      }
    }
  }

  // 如果一个食材都没识别到，给通用默认
  if (found.length === 0) {
    // 用模糊匹配找一个
    const fuzzy = findIngredientByName(dishName)
    if (fuzzy) {
      found.push({
        ingredientId: fuzzy.id,
        name: fuzzy.name,
        category: fuzzy.category,
        ratio: 0.70,
        matchedKw: dishName,
        nutritionPer100g: {
          calories: fuzzy.calories,
          protein: fuzzy.protein,
          fat: fuzzy.fat,
          carbs: fuzzy.carbs,
        },
      })
    } else {
      found.push({
        ingredientId: 'ing_greens',
        name: '时令蔬菜',
        category: 'leafy',
        ratio: 0.60,
        matchedKw: '未知',
        nutritionPer100g: { calories: 15, protein: 1.5, fat: 0.3, carbs: 2.7 },
      })
    }
  }

  // 归一化占比，确保总和≈1
  const totalRatio = found.reduce((s, f) => s + f.ratio, 0)
  found.forEach(f => { f.ratio = f.ratio / totalRatio })

  // 计算每种食材的估算重量
  found.forEach(f => {
    const weight = Math.round(totalWeight * f.ratio)
    const factor = weight / 100
    f.weight = weight
    f.calories = Math.round(f.nutritionPer100g.calories * factor)
    f.protein = Math.round(f.nutritionPer100g.protein * factor * 10) / 10
    f.fat = Math.round(f.nutritionPer100g.fat * factor * 10) / 10
    f.carbs = Math.round(f.nutritionPer100g.carbs * factor * 10) / 10
  })

  return found
}

/**
 * 计算菜品完整的热量拆解（含烹饪用油、汤汁）
 * @param {string} dishName - 菜名
 * @param {number} totalWeight - 总重量(g)
 * @param {object} options - { cuisine: '赣菜', customOilPer100g: null }
 */
export const analyzeDish = (dishName, totalWeight = 150, options = {}) => {
  const ingredients = parseDishIngredients(dishName, totalWeight)
  const cookMethod = detectCookMethod(dishName)

  // 菜系油量加成
  let cuisineBonus = 0
  if (options.cuisine) {
    const c = CUISINE_OIL_BONUS.find(x => options.cuisine.includes(x.cuisine))
    if (c) cuisineBonus = c.bonus
  }

  // 每100g用油量
  let oilPer100g = cookMethod.oilPer100g + (options.customOilPer100g != null ? options.customOilPer100g : 0) + cuisineBonus
  oilPer100g = Math.max(0, oilPer100g)

  const totalOil = Math.round(oilPer100g * totalWeight / 100 * 10) / 10   // 总用油量(g)
  const oilCalories = Math.round(totalOil * 9)   // 油脂热量

  // 汇总食材营养
  let ingCals = 0, ingProtein = 0, ingFat = 0, ingCarbs = 0
  ingredients.forEach(i => {
    ingCals += i.calories
    ingProtein += i.protein
    ingFat += i.fat
    ingCarbs += i.carbs
  })

  // 固体食材（不喝汤）的热量：食材本体 + 炒菜用油的一部分（附着在菜上的油）
  // 假设 60% 的油在固体食材上，40% 在汤汁里
  const attachedOilRatio = cookMethod.hasSoup ? 0.6 : 1.0
  const attachedOilCal = Math.round(oilCalories * attachedOilRatio)
  const soupOilCal = oilCalories - attachedOilCal

  const solidCals = ingCals + attachedOilCal
  const solidProtein = ingProtein
  const solidFat = Math.round((ingFat + totalOil * attachedOilRatio) * 10) / 10
  const solidCarbs = ingCarbs

  // 连汤汁一起吃：固体 + 汤汁里的油
  const soupBonusCal = cookMethod.hasSoup ? soupOilCal + Math.round(ingCals * cookMethod.soupRatio * 0.3) : 0
  const withSoupCals = solidCals + soupBonusCal

  return {
    dishName,
    totalWeight,
    cookMethod: cookMethod.kw,
    hasSoup: cookMethod.hasSoup,
    soupRatio: cookMethod.soupRatio,
    oilPer100g,
    totalOil,
    cuisine: options.cuisine || null,
    ingredients,      // 拆解的食材清单
    oilNutrition: {
      weight: totalOil,
      calories: oilCalories,
      fat: totalOil,
    },
    // 不喝汤（只吃固体食材）
    solidOnly: {
      calories: solidCals,
      protein: Math.round(solidProtein * 10) / 10,
      fat: solidFat,
      carbs: Math.round(solidCarbs * 10) / 10,
    },
    // 连汤汁一起吃
    withSoup: {
      calories: withSoupCals,
      protein: Math.round(solidProtein * 10) / 10,
      fat: Math.round((solidFat + (cookMethod.hasSoup ? totalOil * (1 - attachedOilRatio) : 0)) * 10) / 10,
      carbs: Math.round(solidCarbs * 10) / 10,
    },
    soupExtraCalories: soupBonusCal,
  }
}
