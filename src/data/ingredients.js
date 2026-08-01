// ============================================================
// 基础食材数据库（每100g可食用部分）
// 分类：肉类、禽蛋、水产、绿叶菜、瓜茄、根茎、菌菇、豆制品、
//       主食杂粮、油脂调料、水果、奶类坚果
// ============================================================

export const INGREDIENT_CATEGORIES = {
  meat: '生鲜肉类',
  egg: '禽蛋',
  seafood: '水产',
  leafy: '绿叶蔬菜',
  melon: '瓜茄类蔬菜',
  root: '根茎主食类',
  mushroom: '菌菇',
  soy: '豆制品',
  staple: '主食杂粮',
  oil: '油脂调料',
  fruit: '水果',
  dairy: '奶类坚果',
}

// 基础食材数据：每100g可食用部分
export const INGREDIENT_DATABASE = [
  // ============ 生鲜肉类 ============
  { id: 'ing_pork_belly', name: '五花肉', category: 'meat', alias: ['猪肉', '肥肉'], calories: 395, protein: 13.6, fat: 37.0, carbs: 2.4 },
  { id: 'ing_pork_lean', name: '猪瘦肉', category: 'meat', alias: ['猪里脊', '瘦猪肉'], calories: 143, protein: 20.3, fat: 6.2, carbs: 1.5 },
  { id: 'ing_pork_ribs', name: '猪排骨', category: 'meat', alias: ['排骨'], calories: 264, protein: 18.3, fat: 20.4, carbs: 1.7 },
  { id: 'ing_pork_liver', name: '猪肝', category: 'meat', alias: [], calories: 129, protein: 19.3, fat: 3.5, carbs: 5.0 },
  { id: 'ing_pork_trotter', name: '猪蹄', category: 'meat', alias: ['猪脚'], calories: 260, protein: 23.6, fat: 18.0, carbs: 0 },
  { id: 'ing_beef', name: '牛肉（瘦）', category: 'meat', alias: ['牛瘦肉', '牛里脊'], calories: 125, protein: 20.2, fat: 4.2, carbs: 1.2 },
  { id: 'ing_beef_fat', name: '肥牛', category: 'meat', alias: ['牛肉', '雪花牛肉'], calories: 190, protein: 18.0, fat: 12.0, carbs: 2.0 },
  { id: 'ing_lamb', name: '羊肉（瘦）', category: 'meat', alias: ['羊瘦肉'], calories: 118, protein: 20.5, fat: 3.9, carbs: 0.2 },
  { id: 'ing_lamb_fat', name: '肥羊', category: 'meat', alias: ['羊肉'], calories: 203, protein: 19.0, fat: 14.1, carbs: 1.0 },
  { id: 'ing_duck', name: '鸭肉', category: 'meat', alias: [], calories: 240, protein: 15.5, fat: 19.7, carbs: 0.2 },
  { id: 'ing_duck_breast', name: '鸭胸肉', category: 'meat', alias: [], calories: 150, protein: 19.5, fat: 7.5, carbs: 0 },
  { id: 'ing_rabbit', name: '兔肉', category: 'meat', alias: [], calories: 102, protein: 19.7, fat: 2.2, carbs: 0.9 },

  // ============ 禽蛋 ============
  { id: 'ing_chicken_breast', name: '鸡胸肉', category: 'egg', alias: ['鸡脯肉'], calories: 133, protein: 19.4, fat: 5.0, carbs: 2.5 },
  { id: 'ing_chicken_whole', name: '鸡肉（整）', category: 'egg', alias: ['土鸡', '三黄鸡'], calories: 167, protein: 19.3, fat: 9.4, carbs: 1.3 },
  { id: 'ing_chicken_wing', name: '鸡翅', category: 'egg', alias: [], calories: 194, protein: 17.4, fat: 11.8, carbs: 4.6 },
  { id: 'ing_chicken_leg', name: '鸡腿', category: 'egg', alias: [], calories: 181, protein: 16.0, fat: 13.0, carbs: 0 },
  { id: 'ing_egg', name: '鸡蛋', category: 'egg', alias: [], calories: 144, protein: 13.3, fat: 8.8, carbs: 2.8 },
  { id: 'ing_egg_white', name: '鸡蛋清', category: 'egg', alias: ['蛋白'], calories: 60, protein: 11.6, fat: 0.1, carbs: 3.1 },
  { id: 'ing_egg_yolk', name: '鸡蛋黄', category: 'egg', alias: ['蛋黄'], calories: 328, protein: 15.2, fat: 28.2, carbs: 3.4 },
  { id: 'ing_quail_egg', name: '鹌鹑蛋', category: 'egg', alias: [], calories: 160, protein: 12.8, fat: 11.1, carbs: 2.1 },
  { id: 'ing_duck_egg', name: '鸭蛋', category: 'egg', alias: [], calories: 180, protein: 12.6, fat: 13.0, carbs: 3.1 },

  // ============ 水产 ============
  { id: 'ing_grass_carp', name: '草鱼', category: 'seafood', alias: ['混子'], calories: 113, protein: 16.6, fat: 5.2, carbs: 0 },
  { id: 'ing_crucian', name: '鲫鱼', category: 'seafood', alias: [], calories: 108, protein: 17.1, fat: 2.7, carbs: 3.8 },
  { id: 'ing_salmon', name: '三文鱼', category: 'seafood', alias: ['鲑鱼'], calories: 139, protein: 17.2, fat: 7.8, carbs: 0 },
  { id: 'ing_shrimp', name: '河虾', category: 'seafood', alias: ['青虾', '大虾'], calories: 87, protein: 16.4, fat: 2.4, carbs: 0 },
  { id: 'ing_shrimp_peeled', name: '虾仁', category: 'seafood', alias: [], calories: 93, protein: 18.6, fat: 0.8, carbs: 2.8 },
  { id: 'ing_crab', name: '螃蟹', category: 'seafood', alias: ['河蟹'], calories: 103, protein: 17.5, fat: 2.6, carbs: 2.3 },
  { id: 'ing_squid', name: '鱿鱼', category: 'seafood', alias: [], calories: 84, protein: 17.0, fat: 1.4, carbs: 0 },
  { id: 'ing_octopus', name: '章鱼', category: 'seafood', alias: ['八爪鱼'], calories: 135, protein: 18.0, fat: 2.0, carbs: 10.0 },
  { id: 'ing_clam', name: '蛤蜊', category: 'seafood', alias: ['花蛤'], calories: 62, protein: 10.0, fat: 0.8, carbs: 2.8 },
  { id: 'ing_oyster', name: '生蚝', category: 'seafood', alias: ['牡蛎'], calories: 73, protein: 9.0, fat: 1.5, carbs: 6.0 },
  { id: 'ing_kelp', name: '海带', category: 'seafood', alias: [], calories: 12, protein: 1.2, fat: 0.1, carbs: 2.1 },
  { id: 'ing_seaweed', name: '紫菜', category: 'seafood', alias: [], calories: 207, protein: 26.7, fat: 1.1, carbs: 44.1 },

  // ============ 绿叶蔬菜 ============
  { id: 'ing_chinese_cabbage', name: '大白菜', category: 'leafy', alias: ['白菜'], calories: 17, protein: 1.5, fat: 0.1, carbs: 3.2 },
  { id: 'ing_greens', name: '小青菜', category: 'leafy', alias: ['上海青', '小白菜', '青菜'], calories: 15, protein: 1.5, fat: 0.3, carbs: 2.7 },
  { id: 'ing_spinach', name: '菠菜', category: 'leafy', alias: [], calories: 24, protein: 2.6, fat: 0.3, carbs: 4.5 },
  { id: 'ing_lettuce', name: '生菜', category: 'leafy', alias: ['叶生菜'], calories: 13, protein: 1.3, fat: 0.3, carbs: 1.3 },
  { id: 'ing_oilseed', name: '油麦菜', category: 'leafy', alias: [], calories: 15, protein: 1.4, fat: 0.4, carbs: 2.1 },
  { id: 'ing_celery', name: '芹菜', category: 'leafy', alias: [], calories: 16, protein: 0.8, fat: 0.1, carbs: 3.9 },
  { id: 'ing_coriander', name: '香菜', category: 'leafy', alias: [], calories: 31, protein: 1.8, fat: 0.4, carbs: 6.2 },
  { id: 'ing_scallion', name: '葱', category: 'leafy', alias: ['小葱', '大葱'], calories: 30, protein: 1.7, fat: 0.3, carbs: 6.5 },
  { id: 'ing_chives', name: '韭菜', category: 'leafy', alias: [], calories: 26, protein: 2.4, fat: 0.4, carbs: 4.6 },
  { id: 'ing_cabbage', name: '卷心菜', category: 'leafy', alias: ['包菜', '圆白菜', '莲花白'], calories: 22, protein: 1.5, fat: 0.2, carbs: 5.4 },
  { id: 'ing_broccoli', name: '西兰花', category: 'leafy', alias: ['绿菜花'], calories: 36, protein: 4.1, fat: 0.6, carbs: 4.3 },
  { id: 'ing_cauliflower', name: '花菜', category: 'leafy', alias: ['花椰菜'], calories: 24, protein: 2.1, fat: 0.2, carbs: 4.6 },

  // ============ 瓜茄类蔬菜 ============
  { id: 'ing_tomato', name: '番茄', category: 'melon', alias: ['西红柿'], calories: 19, protein: 0.9, fat: 0.2, carbs: 4.0 },
  { id: 'ing_cucumber', name: '黄瓜', category: 'melon', alias: [], calories: 15, protein: 0.8, fat: 0.2, carbs: 2.9 },
  { id: 'ing_eggplant', name: '茄子', category: 'melon', alias: [], calories: 21, protein: 1.1, fat: 0.2, carbs: 4.9 },
  { id: 'ing_pumpkin', name: '南瓜', category: 'melon', alias: [], calories: 22, protein: 0.7, fat: 0.1, carbs: 5.3 },
  { id: 'ing_wax_gourd', name: '冬瓜', category: 'melon', alias: [], calories: 11, protein: 0.4, fat: 0.2, carbs: 2.6 },
  { id: 'ing_bitter_gourd', name: '苦瓜', category: 'melon', alias: [], calories: 19, protein: 1.0, fat: 0.1, carbs: 4.9 },
  { id: 'ing_sponge_gourd', name: '丝瓜', category: 'melon', alias: [], calories: 20, protein: 1.0, fat: 0.2, carbs: 4.2 },
  { id: 'ing_chili', name: '辣椒', category: 'melon', alias: ['青椒', '尖椒'], calories: 22, protein: 1.0, fat: 0.3, carbs: 5.8 },
  { id: 'ing_hot_pepper', name: '小米辣', category: 'melon', alias: ['红辣椒', '剁椒'], calories: 32, protein: 1.3, fat: 0.4, carbs: 8.9 },
  { id: 'ing_corn', name: '玉米（鲜）', category: 'melon', alias: ['甜玉米', '玉米粒'], calories: 112, protein: 4.0, fat: 1.2, carbs: 22.8 },

  // ============ 根茎主食类 ============
  { id: 'ing_potato', name: '土豆', category: 'root', alias: ['马铃薯'], calories: 81, protein: 2.6, fat: 0.2, carbs: 17.8 },
  { id: 'ing_lotus_root', name: '藕', category: 'root', alias: ['莲藕'], calories: 73, protein: 1.9, fat: 0.2, carbs: 16.4 },
  { id: 'ing_carrot', name: '胡萝卜', category: 'root', alias: [], calories: 37, protein: 1.0, fat: 0.2, carbs: 8.8 },
  { id: 'ing_radish_white', name: '白萝卜', category: 'root', alias: ['萝卜'], calories: 21, protein: 0.9, fat: 0.1, carbs: 5.0 },
  { id: 'ing_radish_red', name: '红萝卜', category: 'root', alias: [], calories: 26, protein: 1.0, fat: 0.1, carbs: 6.0 },
  { id: 'ing_sweet_potato', name: '红薯', category: 'root', alias: ['地瓜', '番薯'], calories: 102, protein: 1.1, fat: 0.2, carbs: 24.7 },
  { id: 'ing_yam', name: '山药', category: 'root', alias: [], calories: 56, protein: 1.9, fat: 0.2, carbs: 12.4 },
  { id: 'ing_taro', name: '芋头', category: 'root', alias: [], calories: 79, protein: 2.2, fat: 0.2, carbs: 18.1 },
  { id: 'ing_green_bean', name: '四季豆', category: 'root', alias: ['豆角'], calories: 30, protein: 2.0, fat: 0.3, carbs: 7.0 },
  { id: 'ing_pea', name: '豌豆', category: 'root', alias: [], calories: 105, protein: 7.4, fat: 0.3, carbs: 21.2 },
  { id: 'ing_broad_bean', name: '蚕豆', category: 'root', alias: [], calories: 104, protein: 8.8, fat: 0.4, carbs: 19.5 },

  // ============ 菌菇 ============
  { id: 'ing_mushroom', name: '香菇', category: 'mushroom', alias: ['冬菇'], calories: 26, protein: 2.2, fat: 0.3, carbs: 5.2 },
  { id: 'ing_oyster_mushroom', name: '平菇', category: 'mushroom', alias: [], calories: 24, protein: 1.9, fat: 0.3, carbs: 4.6 },
  { id: 'ing_shiitake', name: '鲜蘑菇', category: 'mushroom', alias: ['口蘑', '白蘑菇'], calories: 27, protein: 2.7, fat: 0.1, carbs: 4.1 },
  { id: 'ing_black_fungus', name: '黑木耳', category: 'mushroom', alias: ['木耳'], calories: 27, protein: 1.5, fat: 0.2, carbs: 6.5 },
  { id: 'ing_tremella', name: '银耳', category: 'mushroom', alias: ['白木耳'], calories: 261, protein: 10.0, fat: 1.4, carbs: 67.3 },
  { id: 'ing_needle_mushroom', name: '金针菇', category: 'mushroom', alias: [], calories: 26, protein: 2.4, fat: 0.4, carbs: 6.0 },
  { id: 'ing_enoki', name: '杏鲍菇', category: 'mushroom', alias: [], calories: 35, protein: 1.3, fat: 0.1, carbs: 8.3 },

  // ============ 豆制品 ============
  { id: 'ing_tofu_soft', name: '嫩豆腐', category: 'soy', alias: ['南豆腐', '豆腐'], calories: 57, protein: 6.2, fat: 2.5, carbs: 2.4 },
  { id: 'ing_tofu_firm', name: '老豆腐', category: 'soy', alias: ['北豆腐'], calories: 98, protein: 8.1, fat: 3.7, carbs: 1.9 },
  { id: 'ing_tofu_dried', name: '豆腐干', category: 'soy', alias: ['香干', '豆干', '千张'], calories: 140, protein: 16.2, fat: 3.6, carbs: 11.5 },
  { id: 'ing_yuba', name: '腐竹', category: 'soy', alias: [], calories: 485, protein: 44.6, fat: 21.7, carbs: 21.3 },
  { id: 'ing_soy_milk', name: '豆浆', category: 'soy', alias: [], calories: 30, protein: 3.0, fat: 1.6, carbs: 1.2 },
  { id: 'ing_tofu_pudding', name: '豆腐脑', category: 'soy', alias: ['豆花'], calories: 15, protein: 1.9, fat: 0.8, carbs: 0 },

  // ============ 主食杂粮 ============
  { id: 'ing_rice', name: '大米（生）', category: 'staple', alias: ['稻米'], calories: 347, protein: 7.7, fat: 0.6, carbs: 77.9 },
  { id: 'ing_rice_cooked', name: '米饭', category: 'staple', alias: ['白米饭'], calories: 116, protein: 2.6, fat: 0.3, carbs: 25.9 },
  { id: 'ing_noodle_raw', name: '面条（生）', category: 'staple', alias: [], calories: 355, protein: 11.2, fat: 0.9, carbs: 77.7 },
  { id: 'ing_noodle_cooked', name: '面条（煮）', category: 'staple', alias: [], calories: 109, protein: 3.5, fat: 0.4, carbs: 23.4 },
  { id: 'ing_steamed_bread', name: '馒头', category: 'staple', alias: [], calories: 221, protein: 7.0, fat: 1.1, carbs: 47.0 },
  { id: 'ing_flour', name: '小麦粉', category: 'staple', alias: ['面粉'], calories: 366, protein: 15.7, fat: 2.5, carbs: 70.9 },
  { id: 'ing_millet', name: '小米', category: 'staple', alias: [], calories: 361, protein: 9.0, fat: 3.1, carbs: 75.1 },
  { id: 'ing_oat', name: '燕麦片', category: 'staple', alias: [], calories: 367, protein: 15.0, fat: 6.7, carbs: 61.6 },
  { id: 'ing_black_rice', name: '黑米', category: 'staple', alias: [], calories: 341, protein: 9.4, fat: 2.5, carbs: 68.3 },
  { id: 'ing_brown_rice', name: '糙米', category: 'staple', alias: [], calories: 348, protein: 7.7, fat: 2.7, carbs: 75.0 },
  { id: 'ing_sweet_rice', name: '糯米', category: 'staple', alias: [], calories: 348, protein: 7.3, fat: 1.0, carbs: 78.3 },
  { id: 'ing_corn_grain', name: '玉米粒（干）', category: 'staple', alias: ['苞谷'], calories: 335, protein: 8.7, fat: 3.8, carbs: 66.6 },

  // ============ 油脂调料 ============
  { id: 'ing_cooking_oil', name: '食用油', category: 'oil', alias: ['植物油', '花生油', '菜籽油', '大豆油', '色拉油'], calories: 899, protein: 0, fat: 99.9, carbs: 0 },
  { id: 'ing_sesame_oil', name: '香油', category: 'oil', alias: ['芝麻油'], calories: 898, protein: 0, fat: 99.7, carbs: 0.2 },
  { id: 'ing_chili_oil', name: '辣椒油', category: 'oil', alias: ['红油'], calories: 850, protein: 0, fat: 95.0, carbs: 1.0 },
  { id: 'ing_lard', name: '猪油', category: 'oil', alias: ['大油'], calories: 897, protein: 0, fat: 99.6, carbs: 0 },
  { id: 'ing_butter', name: '黄油', category: 'oil', alias: [], calories: 892, protein: 1.4, fat: 98.0, carbs: 0 },
  { id: 'ing_soy_sauce', name: '生抽', category: 'oil', alias: ['酱油'], calories: 63, protein: 5.6, fat: 0.1, carbs: 10.1 },
  { id: 'ing_dark_soy_sauce', name: '老抽', category: 'oil', alias: [], calories: 71, protein: 4.8, fat: 0.1, carbs: 12.9 },
  { id: 'ing_oyster_sauce', name: '蚝油', category: 'oil', alias: [], calories: 174, protein: 4.0, fat: 1.5, carbs: 35.0 },
  { id: 'ing_broad_bean_paste', name: '豆瓣酱', category: 'oil', alias: [], calories: 150, protein: 8.5, fat: 6.8, carbs: 15.6 },
  { id: 'ing_sweet_bean_paste', name: '甜面酱', category: 'oil', alias: [], calories: 136, protein: 4.5, fat: 0.4, carbs: 28.5 },
  { id: 'ing_salt', name: '盐', category: 'oil', alias: ['食盐'], calories: 0, protein: 0, fat: 0, carbs: 0 },
  { id: 'ing_sugar', name: '白砂糖', category: 'oil', alias: ['白糖', '蔗糖'], calories: 400, protein: 0, fat: 0, carbs: 99.9 },
  { id: 'ing_vinegar', name: '醋', category: 'oil', alias: ['陈醋', '米醋'], calories: 31, protein: 0, fat: 0.3, carbs: 4.9 },
  { id: 'ing_chicken_broth', name: '鸡精', category: 'oil', alias: [], calories: 195, protein: 10.0, fat: 2.8, carbs: 32.0 },
  { id: 'ing_cooking_wine', name: '料酒', category: 'oil', alias: [], calories: 20, protein: 0.1, fat: 0, carbs: 5.0 },
  { id: 'ing_starch', name: '淀粉', category: 'oil', alias: ['生粉', '玉米淀粉'], calories: 346, protein: 1.2, fat: 0.1, carbs: 85.0 },
  { id: 'ing_ginger', name: '姜', category: 'oil', alias: [], calories: 46, protein: 1.3, fat: 0.6, carbs: 10.3 },
  { id: 'ing_garlic', name: '蒜', category: 'oil', alias: ['大蒜'], calories: 128, protein: 4.5, fat: 0.2, carbs: 27.6 },
  { id: 'ing_star_anise', name: '八角', category: 'oil', alias: ['大料'], calories: 220, protein: 5.0, fat: 5.0, carbs: 45.0 },
  { id: 'ing_pepper', name: '花椒', category: 'oil', alias: [], calories: 307, protein: 6.0, fat: 8.0, carbs: 65.0 },
  { id: 'ing_cinnamon', name: '桂皮', category: 'oil', alias: ['肉桂'], calories: 275, protein: 3.0, fat: 2.0, carbs: 71.0 },
  { id: 'ing_bay_leaf', name: '香叶', category: 'oil', alias: [], calories: 310, protein: 6.0, fat: 8.0, carbs: 55.0 },

  // ============ 水果 ============
  { id: 'ing_apple', name: '苹果', category: 'fruit', alias: [], calories: 52, protein: 0.2, fat: 0.2, carbs: 13.5 },
  { id: 'ing_banana', name: '香蕉', category: 'fruit', alias: [], calories: 89, protein: 1.4, fat: 0.2, carbs: 22.0 },
  { id: 'ing_orange', name: '橙子', category: 'fruit', alias: ['橙'], calories: 47, protein: 0.8, fat: 0.2, carbs: 11.1 },
  { id: 'ing_watermelon', name: '西瓜', category: 'fruit', alias: [], calories: 26, protein: 0.6, fat: 0.1, carbs: 5.8 },
  { id: 'ing_grape', name: '葡萄', category: 'fruit', alias: [], calories: 43, protein: 0.5, fat: 0.2, carbs: 10.3 },
  { id: 'ing_strawberry', name: '草莓', category: 'fruit', alias: [], calories: 32, protein: 1.0, fat: 0.2, carbs: 7.1 },
  { id: 'ing_mango', name: '芒果', category: 'fruit', alias: [], calories: 32, protein: 0.6, fat: 0.2, carbs: 8.3 },
  { id: 'ing_pear', name: '梨', category: 'fruit', alias: [], calories: 50, protein: 0.4, fat: 0.2, carbs: 13.3 },
  { id: 'ing_peach', name: '桃子', category: 'fruit', alias: [], calories: 48, protein: 0.9, fat: 0.1, carbs: 12.2 },
  { id: 'ing_kiwi', name: '猕猴桃', category: 'fruit', alias: [], calories: 61, protein: 0.8, fat: 0.6, carbs: 14.5 },

  // ============ 奶类坚果 ============
  { id: 'ing_milk', name: '纯牛奶', category: 'dairy', alias: ['牛奶'], calories: 54, protein: 3.0, fat: 3.2, carbs: 3.4 },
  { id: 'ing_yogurt', name: '原味酸奶', category: 'dairy', alias: [], calories: 72, protein: 2.5, fat: 2.7, carbs: 9.3 },
  { id: 'ing_peanut', name: '花生（生）', category: 'dairy', alias: [], calories: 313, protein: 12.1, fat: 25.4, carbs: 13.0 },
  { id: 'ing_walnut', name: '核桃', category: 'dairy', alias: [], calories: 646, protein: 14.9, fat: 58.8, carbs: 19.1 },
  { id: 'ing_almond', name: '杏仁', category: 'dairy', alias: [], calories: 579, protein: 22.5, fat: 51.0, carbs: 23.0 },
  { id: 'ing_soybean', name: '黄豆（大豆）', category: 'dairy', alias: [], calories: 359, protein: 35.1, fat: 16.0, carbs: 34.2 },
  { id: 'ing_cheese', name: '奶酪', category: 'dairy', alias: ['芝士'], calories: 328, protein: 25.7, fat: 23.5, carbs: 3.5 },
]

// ============================================================
// 工具函数
// ============================================================

// 通过 ID 获取食材
export const getIngredientById = (id) => {
  return INGREDIENT_DATABASE.find(i => i.id === id)
}

// 通过名称/别名模糊匹配食材
export const findIngredientByName = (name) => {
  if (!name) return null
  const kw = name.toLowerCase().trim()
  return INGREDIENT_DATABASE.find(i =>
    i.name.toLowerCase() === kw ||
    i.name.toLowerCase().includes(kw) ||
    i.alias?.some(a => a.toLowerCase() === kw || a.toLowerCase().includes(kw))
  )
}

// 获取某分类下所有食材
export const getIngredientsByCategory = (category) => {
  return INGREDIENT_DATABASE.filter(i => i.category === category)
}

export default INGREDIENT_DATABASE
