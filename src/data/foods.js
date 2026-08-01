// 常见食物营养数据库（每100g）
export const FOOD_DATABASE = [
  // ============== 主食类 ==============
  { id: 'rice_white', name: '米饭', category: '主食', calories: 116, protein: 2.6, carbs: 25.8, fat: 0.3, fiber: 0.4, tags: ['食堂常见', '高碳水'], price: [1, 2] },
  { id: 'rice_brown', name: '糙米饭', category: '主食', calories: 123, protein: 2.6, carbs: 25.6, fat: 1.0, fiber: 1.8, tags: ['健康', '高纤维', '减脂'], price: [2, 4] },
  { id: 'rice_fried', name: '蛋炒饭', category: '主食', calories: 170, protein: 5.0, carbs: 24.0, fat: 6.0, fiber: 0.5, tags: ['食堂常见', '高热量'], price: [8, 12] },
  { id: 'noodle', name: '面条（煮）', category: '主食', calories: 109, protein: 3.9, carbs: 21.8, fat: 0.5, fiber: 1.2, tags: ['食堂常见'], price: [6, 12] },
  { id: 'noodle_fried', name: '炒面', category: '主食', calories: 176, protein: 5.5, carbs: 28.0, fat: 5.0, fiber: 1.5, tags: ['食堂常见'], price: [8, 12] },
  { id: 'lamian', name: '兰州拉面', category: '主食', calories: 120, protein: 6.0, carbs: 20.0, fat: 2.5, fiber: 1.0, tags: ['食堂常见', '面食', '早餐', '独立餐食'], price: [10, 15] },
  { id: 'zhajiangmian', name: '炸酱面', category: '主食', calories: 165, protein: 8.0, carbs: 22.0, fat: 5.5, fiber: 1.2, tags: ['面食', '独立餐食'], price: [10, 15] },
  { id: 'daoxiao', name: '刀削面', category: '主食', calories: 130, protein: 5.0, carbs: 24.0, fat: 1.5, fiber: 1.0, tags: ['面食', '独立餐食'], price: [10, 14] },
  { id: 'regan', name: '热干面', category: '主食', calories: 152, protein: 5.5, carbs: 25.0, fat: 3.5, fiber: 1.5, tags: ['面食', '早餐', '独立餐食'], price: [6, 10] },
  { id: 'steamed_bun', name: '馒头', category: '主食', calories: 221, protein: 7.0, carbs: 47.0, fat: 1.1, fiber: 1.3, tags: ['食堂常见', '平价', '早餐'], price: [0.5, 1] },
  { id: 'meat_bun', name: '鲜肉包子', category: '主食', calories: 227, protein: 9.0, carbs: 32.0, fat: 6.5, fiber: 1.0, tags: ['食堂常见', '早餐'], price: [2, 3] },
  { id: 'cabbage_bun', name: '素菜包子', category: '主食', calories: 180, protein: 6.0, carbs: 30.0, fat: 3.5, fiber: 1.5, tags: ['素食', '食堂常见', '早餐'], price: [1.5, 2.5] },
  { id: 'redbean_bun', name: '豆沙包', category: '主食', calories: 235, protein: 5.5, carbs: 48.0, fat: 2.5, fiber: 1.5, tags: ['甜口', '早餐'], price: [1.5, 2.5] },
  { id: 'dumpling', name: '饺子（猪肉白菜）', category: '主食', calories: 240, protein: 9.0, carbs: 26.0, fat: 10.0, fiber: 1.0, tags: ['食堂常见'], price: [10, 18] },
  { id: 'wonton', name: '馄饨', category: '主食', calories: 110, protein: 5.0, carbs: 12.0, fat: 4.0, fiber: 0.5, tags: ['汤类'], price: [8, 12] },
  { id: 'spring_roll', name: '春卷', category: '主食', calories: 250, protein: 6.0, carbs: 28.0, fat: 12.0, fiber: 1.0, tags: ['油炸', '偶尔吃'], price: [3, 5] },
  { id: 'youtiao', name: '油条', category: '主食', calories: 386, protein: 6.9, carbs: 51.0, fat: 17.6, fiber: 0.8, tags: ['油炸', '早餐', '高热量'], price: [1.5, 3] },
  { id: 'bing', name: '葱油饼', category: '主食', calories: 280, protein: 6.0, carbs: 38.0, fat: 11.0, fiber: 1.0, tags: ['油炸'], price: [3, 5] },
  { id: 'hand_pancake', name: '手抓饼', category: '主食', calories: 300, protein: 6.0, carbs: 40.0, fat: 13.0, fiber: 1.0, tags: ['早餐'], price: [5, 8] },
  { id: 'jianbing', name: '煎饼果子', category: '主食', calories: 230, protein: 8.0, carbs: 30.0, fat: 8.0, fiber: 1.5, tags: ['早餐'], price: [6, 10] },
  { id: 'congee', name: '白粥', category: '主食', calories: 46, protein: 1.1, carbs: 9.9, fat: 0.3, fiber: 0.2, tags: ['食堂常见', '养胃'], price: [1, 2] },
  { id: 'millet_congee', name: '小米粥', category: '主食', calories: 46, protein: 1.4, carbs: 8.4, fat: 0.7, fiber: 0.5, tags: ['养胃', '早餐'], price: [1.5, 3] },
  { id: 'oatmeal', name: '燕麦粥', category: '主食', calories: 68, protein: 2.4, carbs: 12.0, fat: 1.4, fiber: 1.7, tags: ['健康', '减脂'], price: [3, 5] },
  { id: 'sweet_potato', name: '红薯', category: '主食', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, fiber: 3.0, tags: ['健康', '减脂'], price: [2, 4] },
  { id: 'potato', name: '土豆', category: '主食', calories: 81, protein: 2.6, carbs: 17.8, fat: 0.2, fiber: 0.7, tags: ['健康'], price: [2, 4] },
  { id: 'corn', name: '玉米', category: '主食', calories: 112, protein: 4.0, carbs: 22.8, fat: 1.2, fiber: 2.9, tags: ['健康', '高纤维'], price: [3, 5] },
  { id: 'zongzi', name: '粽子', category: '主食', calories: 195, protein: 4.0, carbs: 36.0, fat: 3.5, fiber: 1.0, tags: ['节日'], price: [5, 8] },
  { id: 'mooncake', name: '月饼', category: '主食', calories: 422, protein: 6.0, carbs: 65.0, fat: 16.0, fiber: 0.8, tags: ['节日', '高糖', '高热量'], price: [8, 15] },
  { id: 'tangyuan', name: '汤圆', category: '主食', calories: 260, protein: 4.0, carbs: 46.0, fat: 7.0, fiber: 0.5, tags: ['节日', '甜口'], price: [5, 10] },
  { id: 'xiaolongbao', name: '小笼包', category: '主食', calories: 230, protein: 9.0, carbs: 28.0, fat: 9.0, fiber: 0.5, tags: ['江浙菜', '早餐'], price: [12, 20] },
  { id: 'shengjian', name: '生煎包', category: '主食', calories: 260, protein: 10.0, carbs: 30.0, fat: 11.0, fiber: 0.5, tags: ['江浙菜', '早餐'], price: [10, 18] },
  { id: 'guotie', name: '锅贴', category: '主食', calories: 250, protein: 8.0, carbs: 28.0, fat: 12.0, fiber: 0.8, tags: ['早餐'], price: [10, 16] },
  { id: 'rice_noodle', name: '米线', category: '主食', calories: 110, protein: 4.0, carbs: 20.0, fat: 1.5, fiber: 1.0, tags: ['面食', '早餐'], price: [10, 18] },
  { id: 'luosifen', name: '螺蛳粉', category: '主食', calories: 180, protein: 6.0, carbs: 28.0, fat: 5.0, fiber: 1.5, tags: ['广西', '辣', '面食', '独立餐食'], price: [12, 20] },
  { id: 'dandanmian', name: '担担面', category: '主食', calories: 175, protein: 7.0, carbs: 24.0, fat: 6.0, fiber: 1.2, tags: ['川菜', '辣', '面食', '独立餐食'], price: [10, 16] },
  { id: 'yuntunmian', name: '云吞面', category: '主食', calories: 140, protein: 8.0, carbs: 22.0, fat: 3.0, fiber: 0.8, tags: ['粤菜', '面食', '独立餐食', '早餐'], price: [12, 20] },
  { id: 'shahefen', name: '沙河粉', category: '主食', calories: 130, protein: 3.5, carbs: 25.0, fat: 2.0, fiber: 0.5, tags: ['粤菜', '面食'], price: [10, 16] },
  { id: 'korean_ramen', name: '韩式拉面', category: '主食', calories: 160, protein: 5.0, carbs: 26.0, fat: 4.5, fiber: 1.0, tags: ['韩餐', '面食', '独立餐食'], price: [15, 25] },
  { id: 'udon', name: '日式乌冬面', category: '主食', calories: 125, protein: 4.0, carbs: 24.0, fat: 1.5, fiber: 0.8, tags: ['日料', '面食'], price: [15, 25] },
  { id: 'soba', name: '日式荞麦面', category: '主食', calories: 99, protein: 4.5, carbs: 20.0, fat: 0.5, fiber: 2.0, tags: ['日料', '健康', '面食'], price: [18, 28] },
  { id: 'pasta', name: '意大利面', category: '主食', calories: 131, protein: 5.0, carbs: 25.0, fat: 1.5, fiber: 1.2, tags: ['西餐', '面食'], price: [18, 30] },
  { id: 'risotto', name: '意大利烩饭', category: '主食', calories: 150, protein: 5.0, carbs: 28.0, fat: 2.5, fiber: 0.8, tags: ['西餐'], price: [22, 35] },
  { id: 'burger_bun', name: '汉堡胚', category: '主食', calories: 220, protein: 6.0, carbs: 40.0, fat: 4.0, fiber: 1.0, tags: ['西餐'], price: [3, 6] },
  { id: 'tortilla', name: '墨西哥卷饼', category: '主食', calories: 200, protein: 5.0, carbs: 32.0, fat: 5.0, fiber: 1.5, tags: ['西餐'], price: [5, 10] },

  // ============== 肉类 ==============
  { id: 'chicken_breast', name: '鸡胸肉', category: '肉类', calories: 133, protein: 19.4, carbs: 2.5, fat: 5.0, fiber: 0, tags: ['高蛋白', '减脂'], price: [8, 12] },
  { id: 'chicken_thigh', name: '鸡腿肉', category: '肉类', calories: 181, protein: 16.0, carbs: 0, fat: 13.0, fiber: 0, tags: ['高蛋白'], price: [7, 11] },
  { id: 'chicken_leg', name: '红烧鸡腿', category: '肉类', calories: 240, protein: 21.0, carbs: 7.0, fat: 14.0, fiber: 0, tags: ['食堂常见'], price: [8, 12] },
  { id: 'chicken_wing', name: '可乐鸡翅', category: '肉类', calories: 215, protein: 17.0, carbs: 8.0, fat: 12.0, fiber: 0, tags: ['食堂常见'], price: [10, 15] },
  { id: 'chicken_curry', name: '咖喱鸡', category: '肉类', calories: 190, protein: 15.0, carbs: 10.0, fat: 9.0, fiber: 1.0, tags: ['食堂常见'], price: [12, 18] },
  { id: 'kung_pao_chicken', name: '宫保鸡丁', category: '肉类', calories: 180, protein: 14.0, carbs: 12.0, fat: 8.0, fiber: 1.0, tags: ['川菜', '辣', '食堂常见'], price: [10, 15] },
  { id: 'pork_loin', name: '猪里脊', category: '肉类', calories: 155, protein: 20.2, carbs: 1.7, fat: 7.9, fiber: 0, tags: ['高蛋白'], price: [10, 15] },
  { id: 'pork_belly', name: '五花肉', category: '肉类', calories: 395, protein: 13.6, carbs: 0, fat: 37.0, fiber: 0, tags: ['高脂肪'], price: [12, 18] },
  { id: 'fish_fragrant_pork', name: '鱼香肉丝', category: '肉类', calories: 165, protein: 12.0, carbs: 10.0, fat: 8.0, fiber: 1.0, tags: ['川菜', '辣', '食堂常见'], price: [10, 15] },
  { id: 'beef', name: '牛肉', category: '肉类', calories: 125, protein: 19.9, carbs: 2.0, fat: 4.2, fiber: 0, tags: ['高蛋白', '增肌'], price: [15, 25] },
  { id: 'black_pepper_beef', name: '黑椒牛柳', category: '肉类', calories: 170, protein: 18.0, carbs: 5.0, fat: 8.5, fiber: 0.5, tags: ['高蛋白', '西餐'], price: [15, 22] },
  { id: 'lamb', name: '羊肉', category: '肉类', calories: 203, protein: 19.0, carbs: 0, fat: 14.1, fiber: 0, tags: ['高蛋白'], price: [18, 28] },
  { id: 'duck', name: '鸭肉', category: '肉类', calories: 240, protein: 15.5, carbs: 0.2, fat: 19.7, fiber: 0, tags: [], price: [12, 18] },
  { id: 'duck_roast', name: '北京烤鸭', category: '肉类', calories: 436, protein: 16.0, carbs: 6.0, fat: 38.0, fiber: 0, tags: ['高热量', '京菜'], price: [25, 40] },
  { id: 'sausage', name: '香肠', category: '肉类', calories: 508, protein: 24.1, carbs: 11.2, fat: 40.7, fiber: 0, tags: ['加工肉', '少喝'], price: [5, 10] },
  { id: 'bacon', name: '培根', category: '肉类', calories: 181, protein: 22.3, carbs: 2.0, fat: 9.0, fiber: 0, tags: ['加工肉', '西餐'], price: [8, 15] },
  { id: 'luncheon_meat', name: '午餐肉', category: '肉类', calories: 157, protein: 10.0, carbs: 4.0, fat: 11.0, fiber: 0, tags: ['加工肉'], price: [5, 10] },
  { id: 'chili_chicken', name: '辣子鸡', category: '肉类', calories: 220, protein: 18.0, carbs: 8.0, fat: 13.0, fiber: 1.0, tags: ['川菜', '辣'], price: [15, 22] },
  { id: 'twice_cooked_pork', name: '回锅肉', category: '肉类', calories: 290, protein: 15.0, carbs: 8.0, fat: 22.0, fiber: 1.0, tags: ['川菜', '辣'], price: [14, 20] },
  { id: 'boiled_blood', name: '毛血旺', category: '肉类', calories: 175, protein: 14.0, carbs: 8.0, fat: 10.0, fiber: 1.5, tags: ['川菜', '辣'], price: [16, 25] },
  { id: 'shredded_pork_garlic', name: '蒜泥白肉', category: '肉类', calories: 260, protein: 16.0, carbs: 5.0, fat: 19.0, fiber: 0.5, tags: ['川菜'], price: [14, 22] },
  { id: 'white_cut_chicken', name: '白切鸡', category: '肉类', calories: 170, protein: 20.0, carbs: 0, fat: 10.0, fiber: 0, tags: ['粤菜', '清淡'], price: [18, 28] },
  { id: 'roast_pork', name: '叉烧肉', category: '肉类', calories: 260, protein: 22.0, carbs: 10.0, fat: 14.0, fiber: 0, tags: ['粤菜', '甜口'], price: [20, 30] },
  { id: 'salted_fish_chicken', name: '咸鱼鸡粒', category: '肉类', calories: 195, protein: 18.0, carbs: 6.0, fat: 11.0, fiber: 0.5, tags: ['粤菜'], price: [18, 28] },
  { id: 'braised_abalone', name: '鲍鱼', category: '肉类', calories: 85, protein: 14.0, carbs: 6.0, fat: 0.5, fiber: 0, tags: ['粤菜', '高端'], price: [50, 100] },
  { id: 'xiang_pork', name: '小炒肉', category: '肉类', calories: 250, protein: 15.0, carbs: 6.0, fat: 18.0, fiber: 1.0, tags: ['湘菜', '辣'], price: [15, 22] },
  { id: 'duck_head', name: '剁椒鱼头', category: '肉类', calories: 150, protein: 16.0, carbs: 5.0, fat: 7.0, fiber: 1.0, tags: ['湘菜', '辣'], price: [28, 45] },
  { id: 'potato_ribs', name: '土豆烧排骨', category: '肉类', calories: 210, protein: 16.0, carbs: 10.0, fat: 11.0, fiber: 1.0, tags: ['东北菜'], price: [16, 24] },
  { id: 'guobaorou', name: '锅包肉', category: '肉类', calories: 285, protein: 14.0, carbs: 22.0, fat: 15.0, fiber: 0.5, tags: ['东北菜', '甜口'], price: [16, 24] },
  { id: 'pork_sauerkraut', name: '猪肉炖粉条', category: '肉类', calories: 220, protein: 15.0, carbs: 12.0, fat: 12.0, fiber: 1.5, tags: ['东北菜'], price: [14, 22] },
  { id: 'dongpo_pork', name: '东坡肉', category: '肉类', calories: 385, protein: 16.0, carbs: 8.0, fat: 32.0, fiber: 0, tags: ['江浙菜'], price: [20, 30] },
  { id: 'longjing_shrimp', name: '龙井虾仁', category: '肉类', calories: 120, protein: 20.0, carbs: 3.0, fat: 3.0, fiber: 0, tags: ['江浙菜', '清淡'], price: [28, 45] },
  { id: 'squirrel_fish', name: '松鼠桂鱼', category: '肉类', calories: 195, protein: 17.0, carbs: 14.0, fat: 8.0, fiber: 0.5, tags: ['江浙菜', '甜口'], price: [45, 70] },
  { id: 'lion_head', name: '狮子头', category: '肉类', calories: 260, protein: 18.0, carbs: 10.0, fat: 16.0, fiber: 0.5, tags: ['江浙菜'], price: [18, 28] },
  { id: 'wuxi_pork_ribs', name: '无锡酱排骨', category: '肉类', calories: 290, protein: 20.0, carbs: 14.0, fat: 16.0, fiber: 0, tags: ['江浙菜', '甜口'], price: [25, 38] },
  { id: 'peking_duck_skin', name: '烤鸭皮', category: '肉类', calories: 530, protein: 10.0, carbs: 5.0, fat: 50.0, fiber: 0, tags: ['京菜', '高热量'], price: [30, 50] },
  { id: 'zhajiang_meat', name: '炸酱（肉酱）', category: '肉类', calories: 220, protein: 12.0, carbs: 8.0, fat: 15.0, fiber: 0.5, tags: ['京菜'], price: [8, 14] },
  { id: 'regan_sauce', name: '热干面酱', category: '肉类', calories: 180, protein: 6.0, carbs: 12.0, fat: 12.0, fiber: 1.0, tags: ['湖北'], price: [5, 10] },
  { id: 'korean_fried_chicken', name: '韩式炸鸡', category: '肉类', calories: 290, protein: 22.0, carbs: 12.0, fat: 17.0, fiber: 0.5, tags: ['韩餐', '油炸'], price: [25, 40] },
  { id: 'bulgogi', name: '韩式烤牛肉', category: '肉类', calories: 210, protein: 22.0, carbs: 8.0, fat: 10.0, fiber: 0.5, tags: ['韩餐'], price: [28, 45] },
  { id: 'kimchi_jjigae', name: '韩式泡菜汤', category: '肉类', calories: 85, protein: 6.0, carbs: 8.0, fat: 3.5, fiber: 2.0, tags: ['韩餐', '辣', '汤类'], price: [18, 28] },
  { id: 'tteokbokki', name: '韩式辣炒年糕', category: '肉类', calories: 180, protein: 4.0, carbs: 32.0, fat: 4.0, fiber: 1.5, tags: ['韩餐', '辣'], price: [15, 25] },
  { id: 'samosatang', name: '日式照烧鸡腿', category: '肉类', calories: 220, protein: 23.0, carbs: 10.0, fat: 9.0, fiber: 0, tags: ['日料'], price: [22, 35] },
  { id: 'tonkatsu', name: '日式炸猪排', category: '肉类', calories: 295, protein: 22.0, carbs: 14.0, fat: 16.0, fiber: 0.5, tags: ['日料', '油炸'], price: [25, 40] },
  { id: 'yakitori', name: '日式烤鸡串', category: '肉类', calories: 180, protein: 20.0, carbs: 5.0, fat: 9.0, fiber: 0, tags: ['日料'], price: [15, 25] },
  { id: 'beef_steak', name: '牛排', category: '肉类', calories: 271, protein: 26.0, carbs: 0, fat: 18.0, fiber: 0, tags: ['西餐', '高蛋白'], price: [50, 120] },
  { id: 'chicken_schnitzel', name: '维也纳炸鸡排', category: '肉类', calories: 260, protein: 24.0, carbs: 12.0, fat: 13.0, fiber: 0.5, tags: ['西餐', '油炸'], price: [28, 45] },
  { id: 'meatball_spaghetti', name: '意式肉圆', category: '肉类', calories: 220, protein: 18.0, carbs: 8.0, fat: 13.0, fiber: 0.5, tags: ['西餐'], price: [22, 35] },
  { id: 'taco_meat', name: '墨西哥taco肉', category: '肉类', calories: 210, protein: 18.0, carbs: 6.0, fat: 13.0, fiber: 1.0, tags: ['西餐'], price: [18, 28] },
  { id: 'xiang_fried_pork', name: '辣椒炒肉', category: '肉类', calories: 230, protein: 15.0, carbs: 8.0, fat: 16.0, fiber: 1.5, tags: ['湘菜', '辣', '食堂常见', '家常菜'], price: [16, 24] },
  { id: 'gan_smoked_pork', name: '烟笋炒腊肉', category: '肉类', calories: 260, protein: 14.0, carbs: 10.0, fat: 18.0, fiber: 2.0, tags: ['赣菜', '湘菜', '家常菜'], price: [20, 32] },

  // ============== 赣菜扩充 ==============
  { id: 'gan_three_cup_chicken', name: '三杯鸡', category: '肉类', calories: 245, protein: 22.0, carbs: 5.0, fat: 15.0, fiber: 0.5, tags: ['赣菜', '家常菜'], price: [22, 35] },
  { id: 'gan_lihao_bacon', name: '藜蒿炒腊肉', category: '肉类', calories: 225, protein: 14.0, carbs: 8.0, fat: 15.0, fiber: 2.5, tags: ['赣菜', '南昌特色', '家常菜'], price: [20, 32] },
  { id: 'gan_meat_pie_soup', name: '瓦罐肉饼汤', category: '汤类', calories: 95, protein: 10.0, carbs: 5.0, fat: 3.5, fiber: 0.5, tags: ['赣菜', '南昌特色', '早餐', '养胃'], price: [8, 15] },
  { id: 'gan_pork_rib_soup', name: '瓦罐排骨汤', category: '汤类', calories: 85, protein: 7.0, carbs: 6.0, fat: 3.0, fiber: 1.0, tags: ['赣菜', '南昌特色', '滋补'], price: [12, 20] },
  { id: 'gan_chicken_soup', name: '瓦罐老母鸡汤', category: '汤类', calories: 110, protein: 12.0, carbs: 3.0, fat: 5.5, fiber: 0.5, tags: ['赣菜', '南昌特色', '滋补'], price: [15, 25] },
  { id: 'gan_nanchang_fried_noodle', name: '南昌炒粉', category: '主食', calories: 220, protein: 7.0, carbs: 36.0, fat: 5.5, fiber: 1.5, tags: ['赣菜', '南昌特色', '面食', '独立餐食'], price: [12, 20] },
  { id: 'gan_ganmi_fen', name: '江西汤粉', category: '主食', calories: 165, protein: 6.0, carbs: 28.0, fat: 3.5, fiber: 1.0, tags: ['赣菜', '面食', '独立餐食', '早餐'], price: [10, 18] },
  { id: 'gan_steamed_pork_rice', name: '江西米粉蒸肉', category: '肉类', calories: 310, protein: 16.0, carbs: 18.0, fat: 19.0, fiber: 1.0, tags: ['赣菜', '家常菜'], price: [25, 38] },
  { id: 'gan_four_star_moon', name: '四星望月（米粉鱼）', category: '水产', calories: 165, protein: 17.0, carbs: 12.0, fat: 5.5, fiber: 1.5, tags: ['赣菜', '辣', '兴国特色'], price: [28, 45] },
  { id: 'gan_yugan_pepper_pork', name: '余干辣椒炒肉', category: '肉类', calories: 235, protein: 15.0, carbs: 7.0, fat: 16.5, fiber: 1.5, tags: ['赣菜', '辣', '家常菜'], price: [20, 32] },
  { id: 'gan_linchuan_beef_offal', name: '临川牛杂', category: '肉类', calories: 195, protein: 18.0, carbs: 6.0, fat: 11.0, fiber: 1.0, tags: ['赣菜', '辣', '抚州特色'], price: [22, 35] },
  { id: 'gan_wanan_fish_head', name: '万安鱼头', category: '水产', calories: 155, protein: 17.0, carbs: 5.0, fat: 7.5, fiber: 1.0, tags: ['赣菜', '辣'], price: [38, 60] },
  { id: 'gan_yongxin_dog_meat', name: '永新狗肉', category: '肉类', calories: 210, protein: 22.0, carbs: 4.0, fat: 12.0, fiber: 1.0, tags: ['赣菜', '辣', '吉安特色'], price: [35, 55] },
  { id: 'gan_pingxiang_lotus', name: '萍乡炒粉', category: '主食', calories: 230, protein: 7.0, carbs: 37.0, fat: 6.0, fiber: 1.5, tags: ['赣菜', '萍乡特色', '面食', '独立餐食'], price: [12, 20] },
  { id: 'gan_xinyu_malapao', name: '新余麻辣鸭三件', category: '肉类', calories: 225, protein: 25.0, carbs: 6.0, fat: 11.5, fiber: 1.0, tags: ['赣菜', '辣', '卤味'], price: [28, 45] },
  { id: 'gan_yingtan_bean_curd', name: '鹰潭贵溪捺菜', category: '蔬菜', calories: 35, protein: 2.0, carbs: 6.0, fat: 1.0, fiber: 2.0, tags: ['赣菜', '鹰潭特色', '小菜'], price: [5, 10] },
  { id: 'gan_jingde_porcelain', name: '景德镇瓷泥煨鸡', category: '肉类', calories: 220, protein: 23.0, carbs: 4.0, fat: 12.0, fiber: 0.5, tags: ['赣菜', '景德镇特色'], price: [38, 60] },

  // ============== 湘菜扩充 ==============
  { id: 'xiang_duck_blood', name: '永州血鸭', category: '肉类', calories: 215, protein: 20.0, carbs: 6.0, fat: 12.5, fiber: 1.0, tags: ['湘菜', '辣', '永州特色'], price: [32, 50] },
  { id: 'xiang_grandma_veg', name: '湘西外婆菜', category: '蔬菜', calories: 95, protein: 4.0, carbs: 10.0, fat: 5.0, fiber: 2.5, tags: ['湘菜', '辣', '湘西特色', '家常菜'], price: [12, 20] },
  { id: 'xiang_hunan_preserve', name: '湖南腊味合蒸', category: '肉类', calories: 295, protein: 18.0, carbs: 6.0, fat: 22.0, fiber: 0.5, tags: ['湘菜', '家常菜'], price: [28, 45] },
  { id: 'xiang_dongan_chicken', name: '东安子鸡', category: '肉类', calories: 195, protein: 22.0, carbs: 5.0, fat: 10.0, fiber: 1.0, tags: ['湘菜', '酸辣', '永州特色'], price: [28, 45] },
  { id: 'xiang_beef_tripe', name: '发丝牛百叶', category: '肉类', calories: 135, protein: 20.0, carbs: 4.0, fat: 5.0, fiber: 1.0, tags: ['湘菜', '辣', '高蛋白'], price: [28, 45] },
  { id: 'xiang_braised_pig_feet', name: '红烧猪脚', category: '肉类', calories: 280, protein: 24.0, carbs: 5.0, fat: 18.0, fiber: 0.5, tags: ['湘菜', '家常菜', '胶原蛋白'], price: [25, 40] },
  { id: 'xiang_taste_shrimp', name: '口味虾', category: '水产', calories: 155, protein: 18.0, carbs: 6.0, fat: 7.0, fiber: 1.0, tags: ['湘菜', '辣', '长沙特色', '高蛋白'], price: [58, 88] },
  { id: 'xiang_changde_beef_noodle', name: '常德牛肉粉', category: '主食', calories: 210, protein: 14.0, carbs: 28.0, fat: 5.0, fiber: 1.5, tags: ['湘菜', '常德特色', '面食', '独立餐食'], price: [15, 25] },
  { id: 'xiang_hunan_rice_noodle', name: '湖南米粉', category: '主食', calories: 175, protein: 6.0, carbs: 30.0, fat: 4.0, fiber: 1.0, tags: ['湘菜', '面食', '独立餐食', '早餐'], price: [10, 18] },
  { id: 'xiang_stinky_tofu', name: '长沙臭豆腐', category: '零食', calories: 145, protein: 8.0, carbs: 12.0, fat: 7.5, fiber: 1.5, tags: ['湘菜', '长沙特色', '小吃'], price: [8, 15] },
  { id: 'xiang_sugar_baba', name: '糖油粑粑', category: '零食', calories: 195, protein: 2.0, carbs: 32.0, fat: 7.0, fiber: 0.5, tags: ['湘菜', '长沙特色', '甜口', '小吃'], price: [5, 10] },
  { id: 'xiang_suan_beans_pork', name: '酸豆角炒肉', category: '肉类', calories: 185, protein: 12.0, carbs: 10.0, fat: 11.0, fiber: 2.0, tags: ['湘菜', '辣', '湘西特色', '家常菜'], price: [16, 26] },
  { id: 'xiang_ningxiang_snake', name: '宁乡口味蛇', category: '肉类', calories: 180, protein: 25.0, carbs: 5.0, fat: 7.0, fiber: 0, tags: ['湘菜', '辣', '高蛋白', '宁乡特色'], price: [88, 150] },
  { id: 'xiang_spicy_pork_larynx', name: '湘辣脆喉', category: '肉类', calories: 205, protein: 18.0, carbs: 5.0, fat: 13.0, fiber: 0.5, tags: ['湘菜', '辣'], price: [25, 40] },
  { id: 'xiang_laoganma_pork', name: '老干妈炒肉', category: '肉类', calories: 250, protein: 15.0, carbs: 8.0, fat: 18.0, fiber: 1.5, tags: ['湘菜', '辣', '家常菜', '食堂常见'], price: [16, 26] },
  // ============== 川菜扩充 ==============
  { id: 'chuan_fuqi_feipian', name: '夫妻肺片', category: '肉类', calories: 205, protein: 22.0, carbs: 5.0, fat: 12.0, fiber: 0.5, tags: ['川菜', '辣', '凉菜'], price: [25, 40] },
  { id: 'chuan_bobo_chicken', name: '钵钵鸡', category: '肉类', calories: 145, protein: 18.0, carbs: 5.0, fat: 6.5, fiber: 1.0, tags: ['川菜', '辣', '乐山特色'], price: [18, 30] },
  { id: 'chuan_maocai', name: '冒菜', category: '肉类', calories: 165, protein: 14.0, carbs: 12.0, fat: 8.0, fiber: 2.0, tags: ['川菜', '辣', '食堂常见'], price: [15, 25] },
  { id: 'chuan_zhang_tea_duck', name: '樟茶鸭', category: '肉类', calories: 265, protein: 22.0, carbs: 5.0, fat: 18.0, fiber: 0, tags: ['川菜', '成都特色'], price: [32, 50] },
  { id: 'chuan_fish_eggplant', name: '鱼香茄子', category: '蔬菜', calories: 135, protein: 3.0, carbs: 14.0, fat: 8.0, fiber: 2.5, tags: ['川菜', '辣', '食堂常见'], price: [10, 16] },
  { id: 'chuan_spicy_pot', name: '麻辣香锅', category: '肉类', calories: 210, protein: 15.0, carbs: 15.0, fat: 11.0, fiber: 2.5, tags: ['川菜', '辣', '食堂常见'], price: [20, 35] },
  { id: 'chuan_chongqing_noodle', name: '重庆小面', category: '主食', calories: 205, protein: 8.0, carbs: 32.0, fat: 5.5, fiber: 1.5, tags: ['川菜', '重庆特色', '面食', '独立餐食', '辣', '早餐'], price: [10, 18] },
  { id: 'chuan_sour_spicy_noodle', name: '酸辣粉', category: '主食', calories: 190, protein: 5.0, carbs: 34.0, fat: 4.5, fiber: 2.0, tags: ['川菜', '辣', '重庆特色', '面食', '独立餐食'], price: [10, 18] },
  { id: 'chuan_north_sichuan_jelly', name: '川北凉粉', category: '零食', calories: 115, protein: 3.0, carbs: 22.0, fat: 2.5, fiber: 1.5, tags: ['川菜', '辣', '南充特色', '小吃', '凉菜'], price: [6, 12] },
  { id: 'chuan_zhong_shui_jiao', name: '钟水饺', category: '主食', calories: 245, protein: 9.0, carbs: 28.0, fat: 11.0, fiber: 1.0, tags: ['川菜', '成都特色', '面食'], price: [12, 20] },
  { id: 'chuan_long_chao_shou', name: '龙抄手', category: '主食', calories: 225, protein: 10.0, carbs: 26.0, fat: 9.0, fiber: 1.0, tags: ['川菜', '成都特色', '面食'], price: [12, 20] },
  { id: 'chuan_lai_tangyuan', name: '赖汤圆', category: '零食', calories: 265, protein: 4.0, carbs: 46.0, fat: 7.5, fiber: 0.5, tags: ['川菜', '成都特色', '甜口', '小吃'], price: [8, 15] },
  { id: 'chuan_dengying_beef', name: '灯影牛肉', category: '肉类', calories: 195, protein: 28.0, carbs: 6.0, fat: 7.0, fiber: 0, tags: ['川菜', '达州特色', '高蛋白', '小吃'], price: [25, 40] },
  { id: 'chuan_zhangfei_beef', name: '张飞牛肉', category: '肉类', calories: 210, protein: 30.0, carbs: 3.0, fat: 9.0, fiber: 0, tags: ['川菜', '阆中特色', '高蛋白', '卤味'], price: [28, 45] },
  { id: 'chuan_ice_jelly', name: '四川冰粉', category: '零食', calories: 75, protein: 0.5, carbs: 18.0, fat: 0.3, fiber: 0.5, tags: ['川菜', '甜口', '小吃', '消暑'], price: [5, 10] },
  { id: 'chuan_huajiao_chicken', name: '花椒鸡', category: '肉类', calories: 205, protein: 20.0, carbs: 6.0, fat: 11.5, fiber: 1.0, tags: ['川菜', '辣', '椒麻'], price: [28, 45] },

  // ============== 食堂大众菜 ==============
  { id: 'canteen_fungus_pork', name: '木耳炒肉', category: '肉类', calories: 165, protein: 12.0, carbs: 8.0, fat: 10.0, fiber: 2.0, tags: ['食堂常见', '家常菜'], price: [10, 16] },
  { id: 'canteen_celery_pork', name: '芹菜炒肉', category: '肉类', calories: 145, protein: 12.0, carbs: 8.0, fat: 7.5, fiber: 2.0, tags: ['食堂常见', '家常菜'], price: [10, 16] },
  { id: 'canteen_onion_egg', name: '洋葱炒鸡蛋', category: '蛋奶', calories: 135, protein: 8.0, carbs: 10.0, fat: 7.5, fiber: 1.5, tags: ['食堂常见', '家常菜'], price: [6, 10] },
  { id: 'canteen_green_pepper_pork', name: '青椒肉丝', category: '肉类', calories: 155, protein: 13.0, carbs: 7.0, fat: 8.5, fiber: 1.5, tags: ['食堂常见', '家常菜', '辣'], price: [10, 16] },
  { id: 'canteen_beans_eggplant', name: '豆角烧茄子', category: '蔬菜', calories: 115, protein: 4.0, carbs: 14.0, fat: 5.5, fiber: 3.0, tags: ['食堂常见', '家常菜'], price: [8, 14] },
  { id: 'canteen_yuba_pork', name: '腐竹烧肉', category: '肉类', calories: 225, protein: 18.0, carbs: 10.0, fat: 13.0, fiber: 1.5, tags: ['食堂常见', '家常菜'], price: [14, 22] },
  { id: 'canteen_winter_melon_ball', name: '冬瓜丸子汤', category: '汤类', calories: 65, protein: 6.0, carbs: 5.0, fat: 2.5, fiber: 1.0, tags: ['食堂常见', '低卡', '汤类'], price: [6, 12] },
  { id: 'canteen_radish_beef_brisket', name: '萝卜牛腩', category: '肉类', calories: 185, protein: 18.0, carbs: 8.0, fat: 9.0, fiber: 1.5, tags: ['食堂常见', '家常菜', '高蛋白'], price: [18, 28] },
  { id: 'canteen_spinach_egg_soup', name: '菠菜蛋汤', category: '汤类', calories: 35, protein: 3.0, carbs: 2.5, fat: 1.5, fiber: 1.0, tags: ['食堂常见', '低卡', '汤类'], price: [3, 5] },
  { id: 'canteen_hot_sour_soup', name: '酸辣汤', category: '汤类', calories: 55, protein: 3.0, carbs: 8.0, fat: 2.0, fiber: 1.0, tags: ['食堂常见', '辣', '汤类'], price: [3, 6] },
  { id: 'canteen_loofah_egg_soup', name: '丝瓜蛋汤', category: '汤类', calories: 30, protein: 2.5, carbs: 3.0, fat: 1.2, fiber: 1.0, tags: ['食堂常见', '低卡', '汤类'], price: [3, 5] },

  // ============== 粉面扩充 ==============
  { id: 'noodle_beef_brisket', name: '红烧牛腩面', category: '主食', calories: 220, protein: 16.0, carbs: 30.0, fat: 5.5, fiber: 1.5, tags: ['面食', '独立餐食', '食堂常见'], price: [15, 25] },
  { id: 'noodle_pork_chitterling', name: '肥肠粉', category: '主食', calories: 210, protein: 10.0, carbs: 30.0, fat: 6.5, fiber: 1.5, tags: ['川菜', '辣', '面食', '独立餐食'], price: [12, 20] },
  { id: 'noodle_clam', name: '花甲粉', category: '主食', calories: 175, protein: 12.0, carbs: 26.0, fat: 3.5, fiber: 1.5, tags: ['面食', '独立餐食', '海鲜'], price: [15, 25] },
  { id: 'noodle_duck_blood', name: '鸭血粉丝汤', category: '主食', calories: 155, protein: 12.0, carbs: 22.0, fat: 3.5, fiber: 1.0, tags: ['南京特色', '面食', '独立餐食', '汤类'], price: [12, 20] },
  { id: 'noodle_xiangyang_beef', name: '襄阳牛肉面', category: '主食', calories: 235, protein: 16.0, carbs: 32.0, fat: 6.0, fiber: 1.5, tags: ['湖北', '辣', '面食', '独立餐食', '早餐'], price: [15, 25] },
  { id: 'noodle_guilin_rice', name: '桂林米粉', category: '主食', calories: 185, protein: 7.0, carbs: 32.0, fat: 4.0, fiber: 1.0, tags: ['广西', '面食', '独立餐食'], price: [12, 20] },
  { id: 'noodle_old_friend', name: '老友粉', category: '主食', calories: 195, protein: 7.0, carbs: 34.0, fat: 4.5, fiber: 1.0, tags: ['广西', '南宁特色', '辣', '面食', '独立餐食'], price: [12, 20] },
  { id: 'noodle_rice_roll', name: '肠粉', category: '主食', calories: 130, protein: 5.0, carbs: 22.0, fat: 2.5, fiber: 0.5, tags: ['粤菜', '早餐', '面食'], price: [6, 12] },
  { id: 'noodle_beef_rice_roll', name: '牛肉肠粉', category: '主食', calories: 175, protein: 12.0, carbs: 22.0, fat: 4.5, fiber: 0.5, tags: ['粤菜', '早餐', '高蛋白', '面食'], price: [12, 20] },
  { id: 'noodle_shrimp_rice_roll', name: '虾仁肠粉', category: '主食', calories: 155, protein: 10.0, carbs: 22.0, fat: 3.5, fiber: 0.5, tags: ['粤菜', '早餐', '高蛋白', '面食'], price: [15, 25] },
  { id: 'noodle_wuhan_hot_dry', name: '武汉热干面', category: '主食', calories: 205, protein: 7.5, carbs: 34.0, fat: 5.0, fiber: 2.0, tags: ['湖北', '武汉特色', '面食', '独立餐食', '早餐'], price: [8, 14] },
  { id: 'noodle_zhacai_rou_si', name: '榨菜肉丝面', category: '主食', calories: 185, protein: 10.0, carbs: 28.0, fat: 4.5, fiber: 1.5, tags: ['面食', '独立餐食', '食堂常见'], price: [10, 16] },

  // ============== 卤味 ==============
  { id: 'lu_duck_wing', name: '卤鸭翅', category: '肉类', calories: 195, protein: 23.0, carbs: 3.0, fat: 10.5, fiber: 0, tags: ['卤味', '辣', '小吃'], price: [8, 15] },
  { id: 'lu_duck_feet', name: '卤鸭掌', category: '肉类', calories: 155, protein: 20.0, carbs: 2.0, fat: 7.5, fiber: 0, tags: ['卤味', '辣', '小吃'], price: [6, 12] },
  { id: 'lu_chicken_feet', name: '卤鸡爪', category: '肉类', calories: 215, protein: 23.0, carbs: 3.0, fat: 12.5, fiber: 0, tags: ['卤味', '辣', '胶原蛋白', '小吃'], price: [5, 10] },
  { id: 'lu_beef', name: '卤牛肉', category: '肉类', calories: 205, protein: 30.0, carbs: 3.0, fat: 8.5, fiber: 0, tags: ['卤味', '高蛋白', '小吃'], price: [25, 40] },
  { id: 'lu_dried_tofu', name: '卤豆干', category: '蛋奶', calories: 165, protein: 18.0, carbs: 12.0, fat: 6.5, fiber: 1.5, tags: ['卤味', '素食', '高蛋白'], price: [3, 6] },
  { id: 'lu_kelp', name: '卤海带', category: '水产', calories: 35, protein: 2.0, carbs: 6.0, fat: 0.5, fiber: 2.0, tags: ['卤味', '低卡', '素食'], price: [3, 6] },
  { id: 'lu_lotus_root', name: '卤藕片', category: '蔬菜', calories: 75, protein: 2.0, carbs: 15.0, fat: 1.0, fiber: 2.5, tags: ['卤味', '素食'], price: [3, 6] },
  { id: 'lu_egg', name: '卤鸡蛋', category: '蛋奶', calories: 150, protein: 13.0, carbs: 3.0, fat: 9.5, fiber: 0, tags: ['卤味', '高蛋白'], price: [2, 3] },
  { id: 'lu_tripe', name: '卤牛肚', category: '肉类', calories: 135, protein: 15.0, carbs: 4.0, fat: 6.5, fiber: 0, tags: ['卤味', '高蛋白'], price: [18, 30] },
  { id: 'lu_pig_ear', name: '卤猪耳', category: '肉类', calories: 175, protein: 20.0, carbs: 2.0, fat: 10.0, fiber: 0, tags: ['卤味', '胶原蛋白'], price: [12, 20] },

  // ============== 奶茶饮品 ==============
  { id: 'drink_pearl_milk_tea', name: '珍珠奶茶', category: '零食', calories: 240, protein: 2.0, carbs: 45.0, fat: 6.0, fiber: 0.5, tags: ['奶茶', '甜口', '饮品'], price: [10, 18] },
  { id: 'drink_taro_milk_tea', name: '芋圆奶茶', category: '零食', calories: 265, protein: 2.5, carbs: 48.0, fat: 7.0, fiber: 1.5, tags: ['奶茶', '甜口', '饮品'], price: [12, 20] },
  { id: 'drink_yangzhi_ganlu', name: '杨枝甘露', category: '零食', calories: 180, protein: 1.5, carbs: 35.0, fat: 4.5, fiber: 1.0, tags: ['奶茶', '甜口', '港式', '饮品'], price: [15, 25] },
  { id: 'drink_honey_grapefruit', name: '蜂蜜柚子茶', category: '零食', calories: 110, protein: 0.5, carbs: 26.0, fat: 0.5, fiber: 0.5, tags: ['饮品', '甜口'], price: [8, 15] },
  { id: 'drink_red_bean_milk_tea', name: '红豆奶茶', category: '零食', calories: 255, protein: 2.5, carbs: 47.0, fat: 6.5, fiber: 2.0, tags: ['奶茶', '甜口', '饮品'], price: [12, 20] },
  { id: 'drink_pudding_milk_tea', name: '布丁奶茶', category: '零食', calories: 270, protein: 3.0, carbs: 48.0, fat: 7.5, fiber: 0.5, tags: ['奶茶', '甜口', '饮品'], price: [12, 20] },
  { id: 'drink_silk_stocking_milk_tea', name: '丝袜奶茶', category: '零食', calories: 155, protein: 3.0, carbs: 22.0, fat: 6.5, fiber: 0, tags: ['奶茶', '港式', '饮品'], price: [12, 20] },
  { id: 'drink_yuan_yang', name: '鸳鸯奶茶', category: '零食', calories: 175, protein: 3.5, carbs: 24.0, fat: 7.5, fiber: 0, tags: ['奶茶', '港式', '咖啡', '饮品'], price: [14, 22] },
  { id: 'drink_four_season_spring', name: '四季春茶', category: '零食', calories: 5, protein: 0, carbs: 1.0, fat: 0, fiber: 0, tags: ['饮品', '低卡', '无糖'], price: [8, 15] },
  { id: 'drink_grape_mushy', name: '多肉葡萄', category: '零食', calories: 195, protein: 1.0, carbs: 44.0, fat: 2.5, fiber: 1.5, tags: ['奶茶', '甜口', '果茶', '饮品'], price: [16, 25] },
  { id: 'drink_cheese_strawberry', name: '芝芝莓莓', category: '零食', calories: 210, protein: 2.5, carbs: 42.0, fat: 4.5, fiber: 2.0, tags: ['奶茶', '甜口', '果茶', '饮品'], price: [18, 28] },
  { id: 'drink_oreo_milk_tea', name: '奥利奥奶茶', category: '零食', calories: 295, protein: 3.5, carbs: 52.0, fat: 9.0, fiber: 1.0, tags: ['奶茶', '甜口', '饮品'], price: [15, 25] },
  { id: 'drink_latte', name: '拿铁咖啡', category: '零食', calories: 120, protein: 5.0, carbs: 10.0, fat: 6.0, fiber: 0, tags: ['咖啡', '饮品'], price: [15, 25] },
  { id: 'drink_americano', name: '美式黑咖啡', category: '零食', calories: 10, protein: 0.5, carbs: 2.0, fat: 0, fiber: 0, tags: ['咖啡', '低卡', '饮品'], price: [12, 20] },
  { id: 'drink_caramel_macchiato', name: '焦糖玛奇朵', category: '零食', calories: 195, protein: 4.0, carbs: 28.0, fat: 8.0, fiber: 0, tags: ['咖啡', '甜口', '饮品'], price: [18, 28] },
  { id: 'drink_lemon_ice_tea', name: '冻柠茶', category: '零食', calories: 95, protein: 0.5, carbs: 22.0, fat: 0.5, fiber: 0.5, tags: ['港式', '饮品', '甜口', '消暑'], price: [10, 16] },

  // ============== 粤菜/浙菜/鲁菜扩充 ==============
  { id: 'yue_bbq_roast_duck', name: '广式烧鸭', category: '肉类', calories: 285, protein: 22.0, carbs: 5.0, fat: 20.0, fiber: 0, tags: ['粤菜', '烧烤'], price: [25, 40] },
  { id: 'yue_roast_pork_belly', name: '广式脆皮烧肉', category: '肉类', calories: 340, protein: 16.0, carbs: 5.0, fat: 30.0, fiber: 0, tags: ['粤菜', '烧烤', '高热量'], price: [28, 45] },
  { id: 'yue_shrimp_dumpling', name: '水晶虾饺', category: '主食', calories: 135, protein: 8.0, carbs: 18.0, fat: 3.5, fiber: 0.5, tags: ['粤菜', '早茶', '高蛋白'], price: [18, 28] },
  { id: 'yue_siu_mai', name: '烧卖', category: '主食', calories: 165, protein: 7.0, carbs: 22.0, fat: 5.5, fiber: 0.5, tags: ['粤菜', '早茶'], price: [15, 25] },
  { id: 'yue_char_siu_bun', name: '叉烧包', category: '主食', calories: 210, protein: 7.0, carbs: 32.0, fat: 6.5, fiber: 0.5, tags: ['粤菜', '早茶', '甜口', '早餐'], price: [4, 8] },
  { id: 'yue_custard_bun', name: '流沙包', category: '主食', calories: 225, protein: 5.0, carbs: 36.0, fat: 7.5, fiber: 0.5, tags: ['粤菜', '早茶', '甜口'], price: [5, 10] },
  { id: 'zhe_beggar_chicken', name: '叫花鸡', category: '肉类', calories: 230, protein: 24.0, carbs: 5.0, fat: 13.0, fiber: 0, tags: ['浙菜', '杭州特色'], price: [45, 70] },
  { id: 'zhe_west_lake_beef_soup', name: '西湖牛肉羹', category: '汤类', calories: 65, protein: 6.0, carbs: 6.0, fat: 2.0, fiber: 0.5, tags: ['浙菜', '杭州特色', '汤类'], price: [15, 25] },
  { id: 'zhe_gan_fried_rice_cake', name: '宁波炒年糕', category: '主食', calories: 215, protein: 5.0, carbs: 38.0, fat: 5.0, fiber: 1.5, tags: ['浙菜', '宁波特色', '面食'], price: [12, 20] },
  { id: 'zhe_shaoxing_drunken_chicken', name: '绍兴醉鸡', category: '肉类', calories: 185, protein: 22.0, carbs: 3.0, fat: 10.0, fiber: 0, tags: ['浙菜', '绍兴特色', '凉菜'], price: [28, 45] },
  { id: 'lu_sweet_sour_yellow_carp', name: '糖醋鲤鱼', category: '水产', calories: 195, protein: 17.0, carbs: 18.0, fat: 7.0, fiber: 0.5, tags: ['鲁菜', '济南特色', '甜口'], price: [45, 70] },
  { id: 'lu_braised_intestines', name: '九转大肠', category: '肉类', calories: 265, protein: 14.0, carbs: 10.0, fat: 19.0, fiber: 1.0, tags: ['鲁菜', '济南特色'], price: [38, 60] },
  { id: 'lu_shredded_pork_agaric', name: '木须肉', category: '肉类', calories: 175, protein: 14.0, carbs: 10.0, fat: 9.5, fiber: 1.5, tags: ['鲁菜', '家常菜', '食堂常见'], price: [14, 22] },

  // ============== 小吃零食扩充 ==============
  { id: 'snack_oily_gluten', name: '烤面筋', category: '零食', calories: 195, protein: 8.0, carbs: 28.0, fat: 6.0, fiber: 1.5, tags: ['小吃', '烧烤', '辣'], price: [3, 6] },
  { id: 'snack_fried_chicken_steak', name: '炸鸡排', category: '零食', calories: 285, protein: 24.0, carbs: 15.0, fat: 15.0, fiber: 0.5, tags: ['小吃', '油炸', '高蛋白'], price: [12, 20] },
  { id: 'snack_salted_egg_yolk_crisp', name: '蛋黄酥', category: '零食', calories: 280, protein: 5.0, carbs: 36.0, fat: 14.0, fiber: 0.5, tags: ['小吃', '甜口', '甜点'], price: [5, 10] },
  { id: 'snack_meat_floss_bun', name: '肉松小贝', category: '零食', calories: 255, protein: 6.0, carbs: 36.0, fat: 11.0, fiber: 0.5, tags: ['小吃', '甜口', '甜点'], price: [4, 8] },
  { id: 'snack_tanghulu', name: '冰糖葫芦', category: '零食', calories: 155, protein: 0.5, carbs: 38.0, fat: 0.5, fiber: 3.0, tags: ['小吃', '甜口', '北京特色'], price: [5, 10] },
  { id: 'snack_malatang_skewer', name: '关东煮串串', category: '零食', calories: 85, protein: 8.0, carbs: 6.0, fat: 3.5, fiber: 0.5, tags: ['小吃', '日料'], price: [5, 10] },
  { id: 'snack_spicy_gluten', name: '辣条', category: '零食', calories: 230, protein: 4.0, carbs: 26.0, fat: 13.0, fiber: 2.0, tags: ['小吃', '辣', '零食'], price: [3, 6] },
  { id: 'snack_instant_noodles', name: '方便面（泡）', category: '零食', calories: 215, protein: 5.0, carbs: 30.0, fat: 9.0, fiber: 1.0, tags: ['零食', '泡面', '独立餐食'], price: [4, 8] },

  // ============== 水果扩充 ==============
  { id: 'fruit_pineapple', name: '凤梨', category: '水果', calories: 50, protein: 0.5, carbs: 13.0, fat: 0.2, fiber: 1.5, tags: ['加餐', '水果'], price: [6, 12] },
  { id: 'fruit_grapefruit_red', name: '红心西柚', category: '水果', calories: 38, protein: 0.8, carbs: 9.0, fat: 0.1, fiber: 2.0, tags: ['减脂', '水果', '维C'], price: [8, 15] },
  { id: 'fruit_pomegranate', name: '石榴', category: '水果', calories: 83, protein: 1.5, carbs: 18.0, fat: 1.2, fiber: 4.0, tags: ['水果', '抗氧化'], price: [8, 15] },
  { id: 'fruit_persimmon', name: '柿子', category: '水果', calories: 74, protein: 0.5, carbs: 18.0, fat: 0.2, fiber: 2.5, tags: ['水果'], price: [4, 8] },
  { id: 'fruit_chestnut', name: '糖炒栗子', category: '零食', calories: 210, protein: 4.5, carbs: 46.0, fat: 1.5, fiber: 3.0, tags: ['小吃', '甜口', '坚果'], price: [10, 20] },

  // ============== 水产 ==============
  { id: 'fish_steamed', name: '清蒸鱼', category: '水产', calories: 113, protein: 20.4, carbs: 0, fat: 3.5, fiber: 0, tags: ['高蛋白', '低脂', '养胃'], price: [10, 18] },
  { id: 'fish_braised', name: '红烧鱼', category: '水产', calories: 150, protein: 18.0, carbs: 5.0, fat: 6.5, fiber: 0.5, tags: ['食堂常见'], price: [12, 20] },
  { id: 'salmon', name: '三文鱼', category: '水产', calories: 139, protein: 17.2, carbs: 0, fat: 7.8, fiber: 0, tags: ['高蛋白', 'Omega3', '日料'], price: [25, 40] },
  { id: 'tuna', name: '金枪鱼', category: '水产', calories: 144, protein: 23.3, carbs: 0, fat: 4.9, fiber: 0, tags: ['高蛋白', '低脂', '日料'], price: [15, 25] },
  { id: 'shrimp', name: '白灼虾', category: '水产', calories: 93, protein: 18.6, carbs: 2.8, fat: 0.8, fiber: 0, tags: ['高蛋白', '低脂'], price: [15, 25] },
  { id: 'shrimp_fried', name: '油焖大虾', category: '水产', calories: 150, protein: 16.0, carbs: 4.0, fat: 7.5, fiber: 0, tags: [], price: [20, 30] },
  { id: 'crab', name: '螃蟹', category: '水产', calories: 103, protein: 17.5, carbs: 2.3, fat: 2.6, fiber: 0, tags: ['高蛋白'], price: [20, 50] },
  { id: 'squid', name: '鱿鱼', category: '水产', calories: 84, protein: 17.0, carbs: 0, fat: 1.4, fiber: 0, tags: ['高蛋白', '低脂'], price: [10, 18] },
  { id: 'octopus', name: '章鱼小丸子', category: '水产', calories: 190, protein: 8.0, carbs: 22.0, fat: 7.0, fiber: 1.0, tags: ['小吃', '日料'], price: [8, 15] },
  { id: 'kelp', name: '海带', category: '水产', calories: 12, protein: 1.2, carbs: 2.1, fat: 0.1, fiber: 0.5, tags: ['低卡', '补碘'], price: [2, 4] },
  { id: 'nori', name: '海苔', category: '水产', calories: 35, protein: 5.8, carbs: 5.1, fat: 0.3, fiber: 2.7, tags: ['低卡', '日料'], price: [3, 6] },
  { id: 'fish_hot_sour', name: '酸辣鱼', category: '水产', calories: 155, protein: 17.0, carbs: 6.0, fat: 7.0, fiber: 1.0, tags: ['贵州', '辣'], price: [16, 26] },
  { id: 'fish_sweet_sour', name: '糖醋鱼', category: '水产', calories: 175, protein: 17.0, carbs: 15.0, fat: 6.0, fiber: 0.5, tags: ['江浙菜', '甜口'], price: [28, 45] },
  { id: 'fish_west_lake', name: '西湖醋鱼', category: '水产', calories: 140, protein: 18.0, carbs: 7.0, fat: 4.5, fiber: 0, tags: ['江浙菜'], price: [32, 50] },
  { id: 'salmon_sashimi', name: '三文鱼刺身', category: '水产', calories: 139, protein: 17.2, carbs: 0, fat: 7.8, fiber: 0, tags: ['日料', '高蛋白'], price: [38, 60] },
  { id: 'tuna_sashimi', name: '金枪鱼刺身', category: '水产', calories: 144, protein: 23.3, carbs: 0, fat: 4.9, fiber: 0, tags: ['日料', '高蛋白'], price: [35, 55] },
  { id: 'unagi', name: '日式烤鳗鱼', category: '水产', calories: 255, protein: 18.0, carbs: 10.0, fat: 15.0, fiber: 0, tags: ['日料'], price: [45, 80] },
  { id: 'shrimp_tempura', name: '日式天妇罗虾', category: '水产', calories: 210, protein: 14.0, carbs: 16.0, fat: 10.0, fiber: 0.5, tags: ['日料', '油炸'], price: [25, 40] },
  { id: 'fish_chips', name: '英式炸鱼', category: '水产', calories: 260, protein: 18.0, carbs: 20.0, fat: 12.0, fiber: 0.5, tags: ['西餐', '油炸'], price: [28, 45] },
  { id: 'shrimp_scampi', name: '意式蒜蓉虾', category: '水产', calories: 165, protein: 18.0, carbs: 4.0, fat: 9.0, fiber: 0.5, tags: ['西餐'], price: [32, 50] },
  { id: 'clams', name: '花蛤', category: '水产', calories: 65, protein: 10.0, carbs: 3.0, fat: 1.5, fiber: 0, tags: ['高蛋白', '低脂'], price: [10, 18] },
  { id: 'mussels', name: '青口贝', category: '水产', calories: 86, protein: 12.0, carbs: 4.0, fat: 2.5, fiber: 0, tags: ['高蛋白'], price: [15, 25] },

  // ============== 蔬菜 ==============
  { id: 'broccoli', name: '清炒西兰花', category: '蔬菜', calories: 36, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.4, tags: ['高纤维', '健康'], price: [4, 6] },
  { id: 'cauliflower', name: '花菜', category: '蔬菜', calories: 24, protein: 2.1, carbs: 4.6, fat: 0.2, fiber: 1.2, tags: ['低卡', '健康'], price: [3, 5] },
  { id: 'cabbage', name: '圆白菜', category: '蔬菜', calories: 22, protein: 1.5, carbs: 4.6, fat: 0.2, fiber: 1.0, tags: ['低卡', '食堂常见'], price: [2, 4] },
  { id: 'greens', name: '清炒时蔬', category: '蔬菜', calories: 25, protein: 2.0, carbs: 4.0, fat: 0.3, fiber: 2.0, tags: ['高纤维', '低卡'], price: [3, 5] },
  { id: 'spinach', name: '菠菜', category: '蔬菜', calories: 24, protein: 2.6, carbs: 3.6, fat: 0.3, fiber: 1.7, tags: ['补铁', '健康'], price: [3, 5] },
  { id: 'lettuce', name: '生菜', category: '蔬菜', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, fiber: 0.7, tags: ['低卡', '沙拉'], price: [2, 4] },
  { id: 'cucumber', name: '黄瓜', category: '蔬菜', calories: 16, protein: 0.8, carbs: 2.9, fat: 0.2, fiber: 0.5, tags: ['低卡'], price: [1, 3] },
  { id: 'cucumber_salad', name: '凉拌黄瓜', category: '蔬菜', calories: 25, protein: 0.8, carbs: 3.5, fat: 1.0, fiber: 0.5, tags: ['低卡', '清淡'], price: [2, 4] },
  { id: 'tomato', name: '番茄', category: '蔬菜', calories: 19, protein: 0.9, carbs: 4.0, fat: 0.2, fiber: 0.5, tags: ['维C', '低卡'], price: [2, 4] },
  { id: 'potato_shredded', name: '酸辣土豆丝', category: '蔬菜', calories: 90, protein: 2.0, carbs: 16.0, fat: 2.5, fiber: 1.5, tags: ['辣', '食堂常见'], price: [4, 7] },
  { id: 'green_beans', name: '豆角', category: '蔬菜', calories: 30, protein: 2.5, carbs: 5.8, fat: 0.3, fiber: 2.1, tags: ['高纤维'], price: [3, 5] },
  { id: 'pea', name: '豌豆', category: '蔬菜', calories: 105, protein: 7.4, carbs: 21.2, fat: 0.3, fiber: 5.0, tags: ['高纤维'], price: [4, 7] },
  { id: 'carrot', name: '胡萝卜', category: '蔬菜', calories: 37, protein: 1.0, carbs: 8.1, fat: 0.2, fiber: 2.4, tags: ['维A'], price: [2, 4] },
  { id: 'radish', name: '白萝卜', category: '蔬菜', calories: 21, protein: 0.9, carbs: 4.0, fat: 0.1, fiber: 1.0, tags: ['低卡'], price: [2, 4] },
  { id: 'mushroom', name: '蘑菇', category: '蔬菜', calories: 24, protein: 2.7, carbs: 4.1, fat: 0.1, fiber: 2.1, tags: ['高蛋白'], price: [4, 8] },
  { id: 'shiitake', name: '香菇', category: '蔬菜', calories: 26, protein: 2.2, carbs: 5.2, fat: 0.3, fiber: 3.3, tags: ['高纤维'], price: [5, 10] },
  { id: 'agaric', name: '木耳', category: '蔬菜', calories: 21, protein: 1.5, carbs: 6.0, fat: 0.2, fiber: 2.6, tags: ['补铁'], price: [3, 6] },
  { id: 'lotus_root', name: '莲藕', category: '蔬菜', calories: 73, protein: 1.9, carbs: 16.4, fat: 0.2, fiber: 1.2, tags: [], price: [4, 7] },
  { id: 'bamboo_shoot', name: '竹笋', category: '蔬菜', calories: 23, protein: 2.6, carbs: 5.1, fat: 0.2, fiber: 2.8, tags: ['高纤维'], price: [4, 8] },
  { id: 'corn_stirfry', name: '玉米炒虾仁', category: '蔬菜', calories: 95, protein: 8.0, carbs: 12.0, fat: 2.5, fiber: 1.5, tags: [], price: [12, 18] },
  { id: 'pickle', name: '泡菜/咸菜', category: '蔬菜', calories: 22, protein: 1.5, carbs: 3.0, fat: 0.5, fiber: 1.0, tags: ['高盐', '少喝'], price: [1, 2] },
  { id: 'dry_potato', name: '干锅土豆片', category: '蔬菜', calories: 130, protein: 3.0, carbs: 20.0, fat: 5.0, fiber: 2.0, tags: ['辣', '川菜'], price: [10, 16] },
  { id: 'dry_cauliflower', name: '干锅花菜', category: '蔬菜', calories: 85, protein: 3.0, carbs: 8.0, fat: 5.0, fiber: 2.0, tags: ['辣', '川菜'], price: [10, 16] },
  { id: 'bok_choy', name: '上海青', category: '蔬菜', calories: 15, protein: 1.5, carbs: 2.5, fat: 0.2, fiber: 1.0, tags: ['低卡', '清淡'], price: [2, 4] },
  { id: 'choy_sum', name: '菜心', category: '蔬菜', calories: 20, protein: 2.0, carbs: 3.0, fat: 0.3, fiber: 1.5, tags: ['粤菜', '清淡'], price: [3, 5] },
  { id: 'kai_lan', name: '芥兰', category: '蔬菜', calories: 24, protein: 2.8, carbs: 3.5, fat: 0.4, fiber: 2.0, tags: ['粤菜'], price: [4, 6] },
  { id: 'snow_pea', name: '荷兰豆', category: '蔬菜', calories: 42, protein: 2.5, carbs: 7.0, fat: 0.3, fiber: 2.0, tags: ['粤菜'], price: [5, 8] },
  { id: 'okra', name: '秋葵', category: '蔬菜', calories: 33, protein: 2.0, carbs: 7.0, fat: 0.1, fiber: 3.2, tags: ['健康', '高纤维'], price: [6, 10] },
  { id: 'asparagus', name: '芦笋', category: '蔬菜', calories: 22, protein: 2.6, carbs: 4.0, fat: 0.2, fiber: 2.1, tags: ['西餐', '健康'], price: [8, 15] },
  { id: 'zucchini', name: '西葫芦', category: '蔬菜', calories: 17, protein: 1.0, carbs: 3.5, fat: 0.2, fiber: 1.0, tags: ['西餐', '低卡'], price: [4, 7] },
  { id: 'bell_pepper', name: '彩椒', category: '蔬菜', calories: 27, protein: 1.0, carbs: 6.0, fat: 0.2, fiber: 2.0, tags: ['西餐', '维C'], price: [5, 8] },
  { id: 'kimchi', name: '韩式泡菜', category: '蔬菜', calories: 32, protein: 1.5, carbs: 5.0, fat: 0.5, fiber: 2.0, tags: ['韩餐', '辣'], price: [5, 10] },
  { id: 'pickled_vegetable', name: '日式腌菜', category: '蔬菜', calories: 28, protein: 1.0, carbs: 5.0, fat: 0.3, fiber: 1.5, tags: ['日料'], price: [4, 8] },
  { id: 'edamame', name: '日式毛豆', category: '蔬菜', calories: 122, protein: 11.0, carbs: 10.0, fat: 5.0, fiber: 5.0, tags: ['日料', '高蛋白'], price: [8, 15] },
  { id: 'salad_green', name: '沙拉菜', category: '蔬菜', calories: 18, protein: 1.2, carbs: 3.5, fat: 0.2, fiber: 1.5, tags: ['西餐', '沙拉', '低卡'], price: [5, 10] },

  // ============== 蛋奶豆制品 ==============
  { id: 'egg_boiled', name: '水煮蛋', category: '蛋奶', calories: 144, protein: 13.3, carbs: 2.8, fat: 8.8, fiber: 0, tags: ['高蛋白', '早餐'], price: [1, 2] },
  { id: 'egg_fried', name: '煎蛋', category: '蛋奶', calories: 209, protein: 13.0, carbs: 2.0, fat: 16.0, fiber: 0, tags: ['早餐'], price: [2, 3] },
  { id: 'egg_tea', name: '茶叶蛋', category: '蛋奶', calories: 140, protein: 13.0, carbs: 2.5, fat: 8.5, fiber: 0, tags: ['早餐'], price: [1.5, 2.5] },
  { id: 'egg_custard', name: '蒸蛋羹', category: '蛋奶', calories: 105, protein: 10.0, carbs: 1.5, fat: 6.5, fiber: 0, tags: ['养胃'], price: [3, 5] },
  { id: 'soy_milk', name: '豆浆', category: '蛋奶', calories: 40, protein: 2.0, carbs: 1.5, fat: 1.8, fiber: 1.1, tags: ['早餐', '养胃'], price: [1.5, 3] },
  { id: 'soy_milk_sweet', name: '甜豆浆', category: '蛋奶', calories: 60, protein: 2.0, carbs: 9.0, fat: 1.8, fiber: 1.1, tags: ['早餐', '甜口'], price: [2, 3.5] },
  { id: 'milk', name: '纯牛奶', category: '蛋奶', calories: 54, protein: 3.0, carbs: 3.4, fat: 3.2, fiber: 0, tags: ['高蛋白', '早餐'], price: [3, 5] },
  { id: 'milk_lowfat', name: '低脂牛奶', category: '蛋奶', calories: 43, protein: 3.4, carbs: 4.8, fat: 1.0, fiber: 0, tags: ['高蛋白', '减脂'], price: [3.5, 5.5] },
  { id: 'milk_skim', name: '脱脂牛奶', category: '蛋奶', calories: 34, protein: 3.4, carbs: 4.8, fat: 0.2, fiber: 0, tags: ['高蛋白', '减脂'], price: [4, 6] },
  { id: 'yogurt', name: '酸奶', category: '蛋奶', calories: 72, protein: 2.5, carbs: 9.3, fat: 2.7, fiber: 0, tags: ['益生菌', '加餐'], price: [4, 7] },
  { id: 'yogurt_lowfat', name: '低脂酸奶', category: '蛋奶', calories: 59, protein: 3.2, carbs: 9.0, fat: 1.0, fiber: 0, tags: ['减脂'], price: [4.5, 7.5] },
  { id: 'cheese', name: '奶酪', category: '蛋奶', calories: 328, protein: 25.7, carbs: 3.5, fat: 23.5, fiber: 0, tags: ['高蛋白', '高脂', '西餐'], price: [15, 25] },
  { id: 'butter', name: '黄油', category: '蛋奶', calories: 888, protein: 0.5, carbs: 0.1, fat: 98.0, fiber: 0, tags: ['高脂', '西餐'], price: [10, 20] },
  { id: 'tofu', name: '豆腐', category: '蛋奶', calories: 81, protein: 8.1, carbs: 3.8, fat: 3.7, fiber: 0.4, tags: ['高蛋白', '素食'], price: [3, 5] },
  { id: 'tofu_dried', name: '豆腐干', category: '蛋奶', calories: 140, protein: 16.2, carbs: 10.7, fat: 3.6, fiber: 0.8, tags: ['高蛋白'], price: [3, 6] },
  { id: 'tofu_puffed', name: '油豆腐', category: '蛋奶', calories: 244, protein: 17.0, carbs: 4.3, fat: 17.6, fiber: 0.6, tags: ['油炸'], price: [4, 7] },
  { id: 'soy_sauce', name: '酱油', category: '蛋奶', calories: 63, protein: 5.6, carbs: 10.1, fat: 0.6, fiber: 0, tags: ['调料'], price: [2, 5] },
  { id: 'tamago', name: '日式厚蛋烧', category: '蛋奶', calories: 160, protein: 11.0, carbs: 5.0, fat: 10.0, fiber: 0, tags: ['日料', '早餐'], price: [12, 20] },
  { id: 'onsen_egg', name: '日式温泉蛋', category: '蛋奶', calories: 144, protein: 13.3, carbs: 2.8, fat: 8.8, fiber: 0, tags: ['日料'], price: [4, 8] },
  { id: 'egg_tart', name: '葡式蛋挞', category: '蛋奶', calories: 220, protein: 5.0, carbs: 26.0, fat: 11.0, fiber: 0.3, tags: ['甜点', '粤菜'], price: [5, 8] },
  { id: 'milk_pudding', name: '牛奶布丁', category: '蛋奶', calories: 110, protein: 4.0, carbs: 16.0, fat: 3.5, fiber: 0, tags: ['甜点'], price: [8, 15] },
  { id: 'ricotta', name: '意式乳清奶酪', category: '蛋奶', calories: 175, protein: 11.0, carbs: 3.0, fat: 13.0, fiber: 0, tags: ['西餐'], price: [20, 35] },

  // ============== 水果 ==============
  { id: 'apple', name: '苹果', category: '水果', calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2, fiber: 2.4, tags: ['加餐', '健康'], price: [3, 6] },
  { id: 'banana', name: '香蕉', category: '水果', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6, tags: ['加餐', '能量'], price: [2, 5] },
  { id: 'orange', name: '橙子', category: '水果', calories: 47, protein: 0.9, carbs: 11.8, fat: 0.1, fiber: 2.4, tags: ['维C', '加餐'], price: [3, 6] },
  { id: 'tangerine', name: '橘子', category: '水果', calories: 51, protein: 0.7, carbs: 11.9, fat: 0.2, fiber: 2.3, tags: ['维C'], price: [2, 4] },
  { id: 'pear', name: '梨', category: '水果', calories: 50, protein: 0.4, carbs: 13.3, fat: 0.2, fiber: 3.1, tags: ['润肺'], price: [3, 6] },
  { id: 'grape', name: '葡萄', category: '水果', calories: 69, protein: 0.6, carbs: 18.1, fat: 0.4, fiber: 0.9, tags: [], price: [5, 10] },
  { id: 'watermelon', name: '西瓜', category: '水果', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.2, fiber: 0.4, tags: ['低卡', '消暑'], price: [2, 5] },
  { id: 'peach', name: '桃子', category: '水果', calories: 48, protein: 0.9, carbs: 12.2, fat: 0.1, fiber: 1.7, tags: [], price: [3, 6] },
  { id: 'strawberry', name: '草莓', category: '水果', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2.0, tags: ['维C', '低卡'], price: [8, 15] },
  { id: 'blueberry', name: '蓝莓', category: '水果', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4, tags: ['抗氧化'], price: [10, 20] },
  { id: 'kiwi', name: '猕猴桃', category: '水果', calories: 56, protein: 0.8, carbs: 14.7, fat: 0.6, fiber: 3.0, tags: ['维C', '高纤维'], price: [4, 8] },
  { id: 'mango', name: '芒果', category: '水果', calories: 65, protein: 0.5, carbs: 17.0, fat: 0.3, fiber: 1.6, tags: ['甜口', '东南亚'], price: [5, 10] },
  { id: 'pineapple', name: '菠萝', category: '水果', calories: 41, protein: 0.4, carbs: 10.8, fat: 0.2, fiber: 1.3, tags: [], price: [4, 8] },
  { id: 'papaya', name: '木瓜', category: '水果', calories: 43, protein: 0.5, carbs: 10.8, fat: 0.1, fiber: 1.8, tags: [], price: [5, 10] },
  { id: 'coconut', name: '椰子', category: '水果', calories: 354, protein: 3.3, carbs: 15.2, fat: 33.5, fiber: 9.0, tags: ['高脂', '东南亚'], price: [8, 15] },
  { id: 'avocado', name: '牛油果', category: '水果', calories: 160, protein: 2.0, carbs: 7.4, fat: 15.3, fiber: 6.7, tags: ['健康脂肪', '西餐'], price: [10, 18] },
  { id: 'lemon', name: '柠檬', category: '水果', calories: 29, protein: 1.1, carbs: 6.5, fat: 0.3, fiber: 1.6, tags: ['维C'], price: [3, 6] },
  { id: 'cherry', name: '樱桃', category: '水果', calories: 63, protein: 1.1, carbs: 16.0, fat: 0.2, fiber: 2.1, tags: ['补铁'], price: [15, 30] },
  { id: 'grapefruit', name: '西柚', category: '水果', calories: 33, protein: 0.8, carbs: 8.0, fat: 0.1, fiber: 1.1, tags: ['减脂'], price: [5, 10] },
  { id: 'dragon_fruit', name: '火龙果', category: '水果', calories: 51, protein: 1.0, carbs: 13.0, fat: 0.2, fiber: 2.0, tags: ['东南亚'], price: [6, 12] },
  { id: 'passion_fruit', name: '百香果', category: '水果', calories: 97, protein: 2.0, carbs: 23.0, fat: 0.7, fiber: 10.0, tags: ['高纤维', '东南亚'], price: [8, 15] },
  { id: 'lychee', name: '荔枝', category: '水果', calories: 66, protein: 0.8, carbs: 17.0, fat: 0.4, fiber: 0.5, tags: ['甜口'], price: [8, 15] },
  { id: 'longan', name: '龙眼', category: '水果', calories: 60, protein: 1.3, carbs: 15.0, fat: 0.1, fiber: 1.1, tags: ['甜口'], price: [8, 15] },
  { id: 'durian', name: '榴莲', category: '水果', calories: 147, protein: 1.5, carbs: 27.0, fat: 5.3, fiber: 3.8, tags: ['东南亚', '高热量'], price: [25, 45] },
  { id: 'honeydew', name: '哈密瓜', category: '水果', calories: 34, protein: 0.5, carbs: 8.0, fat: 0.1, fiber: 0.5, tags: ['低卡', '消暑'], price: [4, 8] },

  // ============== 坚果/种子 ==============
  { id: 'peanut', name: '花生', category: '坚果', calories: 567, protein: 24.8, carbs: 16.1, fat: 44.3, fiber: 5.5, tags: ['高蛋白', '高脂'], price: [5, 10] },
  { id: 'walnut', name: '核桃', category: '坚果', calories: 627, protein: 14.9, carbs: 19.1, fat: 58.8, fiber: 9.7, tags: ['健脑', 'Omega3'], price: [15, 30] },
  { id: 'almond', name: '杏仁', category: '坚果', calories: 578, protein: 21.2, carbs: 21.6, fat: 49.9, fiber: 11.8, tags: ['高蛋白', '高纤维'], price: [15, 25] },
  { id: 'cashew', name: '腰果', category: '坚果', calories: 552, protein: 17.3, carbs: 24.0, fat: 36.7, fiber: 3.6, tags: [], price: [20, 35] },
  { id: 'sesame', name: '芝麻', category: '坚果', calories: 531, protein: 19.1, carbs: 24.0, fat: 46.1, fiber: 14.0, tags: ['补钙'], price: [5, 10] },
  { id: 'pistachio', name: '开心果', category: '坚果', calories: 560, protein: 20.0, carbs: 27.0, fat: 45.0, fiber: 10.0, tags: [], price: [20, 35] },
  { id: 'macadamia', name: '夏威夷果', category: '坚果', calories: 718, protein: 8.0, carbs: 10.0, fat: 75.0, fiber: 8.0, tags: ['高脂'], price: [25, 45] },
  { id: 'pecan', name: '碧根果', category: '坚果', calories: 690, protein: 9.0, carbs: 14.0, fat: 72.0, fiber: 9.0, tags: ['高脂'], price: [25, 45] },

  // ============== 汤类 ==============
  { id: 'egg_soup', name: '蛋花汤', category: '汤类', calories: 20, protein: 1.5, carbs: 1.0, fat: 1.0, fiber: 0, tags: ['低卡', '养胃'], price: [1, 2] },
  { id: 'seaweed_soup', name: '紫菜蛋花汤', category: '汤类', calories: 35, protein: 2.5, carbs: 3.0, fat: 1.5, fiber: 1.0, tags: ['低卡'], price: [2, 3] },
  { id: 'miso_soup', name: '味增汤', category: '汤类', calories: 35, protein: 3.0, carbs: 3.0, fat: 1.2, fiber: 0.8, tags: ['日料'], price: [5, 8] },
  { id: 'chicken_soup', name: '鸡汤', category: '汤类', calories: 75, protein: 6.0, carbs: 2.0, fat: 5.0, fiber: 0, tags: ['滋补'], price: [8, 15] },
  { id: 'pork_soup', name: '排骨汤', category: '汤类', calories: 120, protein: 10.0, carbs: 3.0, fat: 8.0, fiber: 0, tags: ['滋补'], price: [10, 18] },
  { id: 'wax_gourd_soup', name: '冬瓜汤', category: '汤类', calories: 12, protein: 0.4, carbs: 2.6, fat: 0.2, fiber: 0.7, tags: ['低卡', '消暑'], price: [2, 4] },
  { id: 'hot_pot_soup', name: '火锅汤底', category: '汤类', calories: 80, protein: 2.0, carbs: 8.0, fat: 5.0, fiber: 0.5, tags: ['聚餐', '辣'], price: [15, 30] },
  { id: 'bird_nest_soup', name: '银耳羹', category: '汤类', calories: 50, protein: 1.0, carbs: 12.0, fat: 0.2, fiber: 2.0, tags: ['滋补', '甜口'], price: [8, 15] },
  { id: 'red_bean_soup', name: '红豆汤', category: '汤类', calories: 65, protein: 4.0, carbs: 12.0, fat: 0.5, fiber: 3.0, tags: ['滋补', '甜口'], price: [5, 10] },
  { id: 'mung_bean_soup', name: '绿豆汤', category: '汤类', calories: 45, protein: 3.0, carbs: 8.0, fat: 0.3, fiber: 2.5, tags: ['消暑'], price: [3, 6] },
  { id: 'congee_pork', name: '皮蛋瘦肉粥', category: '汤类', calories: 65, protein: 5.0, carbs: 10.0, fat: 1.5, fiber: 0.5, tags: ['粤菜', '养胃'], price: [8, 14] },
  { id: 'congee_fish', name: '鱼片粥', category: '汤类', calories: 55, protein: 6.0, carbs: 8.0, fat: 1.0, fiber: 0.5, tags: ['粤菜', '养胃'], price: [10, 18] },
  { id: 'lotus_root_soup', name: '莲藕排骨汤', category: '汤类', calories: 85, protein: 6.0, carbs: 10.0, fat: 2.5, fiber: 1.5, tags: ['家常菜', '滋补', '赣菜', '湘菜'], price: [18, 28] },
  { id: 'nanchang_waguan', name: '南昌瓦罐汤', category: '汤类', calories: 60, protein: 5.0, carbs: 4.0, fat: 2.5, fiber: 0.5, tags: ['赣菜', '早餐', '养胃', '滋补', '南昌特色'], price: [6, 12] },
  { id: 'tomato_egg_soup', name: '番茄蛋汤', category: '汤类', calories: 45, protein: 3.0, carbs: 5.0, fat: 1.5, fiber: 0.5, tags: ['家常菜', '清淡', '食堂常见'], price: [4, 8] },
  { id: 'french_onion', name: '法式洋葱汤', category: '汤类', calories: 85, protein: 4.0, carbs: 10.0, fat: 3.5, fiber: 1.0, tags: ['西餐'], price: [20, 32] },
  { id: 'mushroom_cream', name: '奶油蘑菇汤', category: '汤类', calories: 110, protein: 3.5, carbs: 10.0, fat: 6.5, fiber: 1.0, tags: ['西餐'], price: [18, 28] },

  // ============== 饮料 ==============
  { id: 'water', name: '矿泉水', category: '饮料', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, tags: ['零卡'], price: [1, 3] },
  { id: 'pepsi', name: '百事可乐', category: '饮料', calories: 41, protein: 0, carbs: 11.2, fat: 0, fiber: 0, tags: ['高糖', '少喝'], price: [3, 4] },
  { id: 'coke_zero', name: '零度可乐', category: '饮料', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, tags: ['零卡'], price: [3, 5] },
  { id: 'sprite_zero', name: '零卡雪碧', category: '饮料', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, tags: ['零卡'], price: [3, 5] },
  { id: 'milk_tea', name: '奶茶', category: '饮料', calories: 80, protein: 1.0, carbs: 15.0, fat: 2.0, fiber: 0, tags: ['高糖'], price: [8, 15] },
  { id: 'fruit_tea', name: '水果茶', category: '饮料', calories: 60, protein: 0.3, carbs: 15.0, fat: 0.2, fiber: 0.5, tags: ['高糖'], price: [12, 20] },
  { id: 'lemon_tea', name: '柠檬茶', category: '饮料', calories: 35, protein: 0.2, carbs: 9.0, fat: 0.1, fiber: 0.2, tags: [], price: [8, 14] },
  { id: 'orange_juice', name: '橙汁', category: '饮料', calories: 45, protein: 0.7, carbs: 10.4, fat: 0.2, fiber: 0.2, tags: ['维C'], price: [5, 10] },
  { id: 'apple_juice', name: '苹果汁', category: '饮料', calories: 46, protein: 0.1, carbs: 11.3, fat: 0.1, fiber: 0.2, tags: [], price: [5, 10] },
  { id: 'coffee_black', name: '黑咖啡', category: '饮料', calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, tags: ['低卡', '提神'], price: [8, 20] },
  { id: 'coffee_milk', name: '拿铁', category: '饮料', calories: 65, protein: 3.5, carbs: 5.5, fat: 3.0, fiber: 0, tags: ['提神'], price: [15, 28] },
  { id: 'coffee_cappuccino', name: '卡布奇诺', category: '饮料', calories: 80, protein: 4.0, carbs: 6.0, fat: 4.0, fiber: 0, tags: ['提神'], price: [15, 28] },
  { id: 'coffee_mocha', name: '摩卡', category: '饮料', calories: 150, protein: 4.0, carbs: 18.0, fat: 7.0, fiber: 0, tags: ['高热量'], price: [18, 30] },
  { id: 'red_bull', name: '红牛', category: '饮料', calories: 55, protein: 0, carbs: 13.5, fat: 0, fiber: 0, tags: ['提神', '功能饮料'], price: [5, 8] },
  { id: 'sport_drink', name: '运动饮料', category: '饮料', calories: 26, protein: 0, carbs: 6.0, fat: 0, fiber: 0, tags: ['运动'], price: [4, 6] },
  { id: 'sour_plum_soup', name: '酸梅汤', category: '饮料', calories: 45, protein: 0.2, carbs: 11.0, fat: 0.1, fiber: 0.1, tags: ['消暑', '低卡', '家常菜'], price: [4, 8] },
  { id: 'herbal_tea', name: '花茶', category: '饮料', calories: 2, protein: 0.1, carbs: 0.5, fat: 0, fiber: 0, tags: ['低卡'], price: [5, 12] },
  { id: 'chrysanthemum_tea', name: '菊花茶', category: '饮料', calories: 20, protein: 0.2, carbs: 4.8, fat: 0.1, fiber: 0.2, tags: ['消暑', '低卡', '家常'], price: [3, 6] },
  { id: 'rock_sugar_pear', name: '冰糖雪梨', category: '饮料', calories: 60, protein: 0.2, carbs: 15.0, fat: 0.1, fiber: 0.5, tags: ['滋补', '甜口', '家常'], price: [5, 10] },
  { id: 'soju', name: '韩式烧酒', category: '饮料', calories: 120, protein: 0, carbs: 8.0, fat: 0, fiber: 0, tags: ['韩餐', '酒精'], price: [15, 25] },
  { id: 'sake', name: '日式清酒', category: '饮料', calories: 130, protein: 0.5, carbs: 5.0, fat: 0, fiber: 0, tags: ['日料', '酒精'], price: [25, 50] },
  { id: 'beer', name: '啤酒', category: '饮料', calories: 43, protein: 0.5, carbs: 3.5, fat: 0, fiber: 0, tags: ['酒精'], price: [5, 12] },
  { id: 'wine_red', name: '红葡萄酒', category: '饮料', calories: 83, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0, tags: ['西餐', '酒精'], price: [30, 80] },

  // ============== 零食/快餐 ==============
  { id: 'instant_noodle', name: '方便面', category: '零食', calories: 440, protein: 9.0, carbs: 60.0, fat: 18.0, fiber: 3.0, tags: ['高盐', '偶尔吃'], price: [4, 7] },
  { id: 'popcorn', name: '爆米花', category: '零食', calories: 387, protein: 10.6, carbs: 67.8, fat: 8.6, fiber: 9.6, tags: ['高纤维'], price: [10, 20] },
  { id: 'chocolate_dark', name: '黑巧克力', category: '零食', calories: 598, protein: 4.2, carbs: 63.2, fat: 35.7, fiber: 3.5, tags: ['抗氧化'], price: [10, 25] },
  { id: 'cake', name: '蛋糕', category: '零食', calories: 347, protein: 7.0, carbs: 56.0, fat: 12.0, fiber: 0.6, tags: ['高糖'], price: [10, 25] },
  { id: 'bread_whole', name: '全麦面包', category: '零食', calories: 246, protein: 13.0, carbs: 41.0, fat: 4.2, fiber: 7.0, tags: ['健康', '高纤维'], price: [8, 15] },
  { id: 'croissant', name: '牛角包', category: '零食', calories: 406, protein: 8.2, carbs: 45.8, fat: 21.8, fiber: 1.5, tags: ['高脂', '西餐'], price: [8, 15] },
  { id: 'hamburger', name: '汉堡', category: '零食', calories: 265, protein: 13.0, carbs: 25.0, fat: 12.0, fiber: 1.0, tags: ['快餐', '西餐'], price: [12, 25] },
  { id: 'cheeseburger', name: '芝士汉堡', category: '零食', calories: 303, protein: 15.0, carbs: 25.0, fat: 15.0, fiber: 1.0, tags: ['快餐', '西餐'], price: [15, 28] },
  { id: 'fried_chicken', name: '炸鸡', category: '零食', calories: 260, protein: 17.0, carbs: 10.0, fat: 17.0, fiber: 0.5, tags: ['油炸'], price: [15, 28] },
  { id: 'pizza', name: '披萨', category: '零食', calories: 266, protein: 11.0, carbs: 33.0, fat: 10.0, fiber: 1.5, tags: ['快餐', '西餐'], price: [30, 60] },
  { id: 'hotdog', name: '热狗', category: '零食', calories: 250, protein: 10.0, carbs: 18.0, fat: 15.0, fiber: 1.0, tags: ['快餐', '西餐'], price: [8, 15] },
  { id: 'meatball', name: '肉丸', category: '零食', calories: 170, protein: 15.0, carbs: 5.0, fat: 10.0, fiber: 0.5, tags: [], price: [10, 18] },
  { id: 'malatang', name: '麻辣烫', category: '零食', calories: 130, protein: 8.0, carbs: 12.0, fat: 6.0, fiber: 2.0, tags: ['辣', '食堂常见', '川菜'], price: [15, 25] },
  { id: 'hot_pot', name: '火锅', category: '零食', calories: 200, protein: 15.0, carbs: 10.0, fat: 12.0, fiber: 2.0, tags: ['聚餐'], price: [50, 100] },
  { id: 'bbq', name: '烧烤', category: '零食', calories: 250, protein: 20.0, carbs: 5.0, fat: 16.0, fiber: 0.5, tags: ['聚餐'], price: [30, 80] },
  { id: 'turnip_cake', name: '萝卜糕', category: '零食', calories: 130, protein: 3.0, carbs: 20.0, fat: 4.5, fiber: 1.0, tags: ['粤菜'], price: [6, 12] },
  { id: 'char_siu_rice', name: '叉烧饭', category: '零食', calories: 220, protein: 18.0, carbs: 28.0, fat: 5.0, fiber: 0.5, tags: ['粤菜', '米饭'], price: [18, 28] },
  { id: 'claypot_rice', name: '煲仔饭', category: '零食', calories: 240, protein: 15.0, carbs: 32.0, fat: 6.0, fiber: 0.5, tags: ['粤菜', '米饭'], price: [20, 32] },
  { id: 'beef_brisket_noodle', name: '牛腩面', category: '零食', calories: 180, protein: 14.0, carbs: 22.0, fat: 5.5, fiber: 1.0, tags: ['粤菜', '面食'], price: [18, 28] },
  { id: 'kimbap', name: '韩式紫菜包饭', category: '零食', calories: 200, protein: 7.0, carbs: 32.0, fat: 5.5, fiber: 1.5, tags: ['韩餐'], price: [15, 25] },
  { id: 'bibimbap', name: '韩式拌饭', category: '零食', calories: 220, protein: 12.0, carbs: 32.0, fat: 5.5, fiber: 2.0, tags: ['韩餐', '米饭'], price: [20, 32] },
  { id: 'japchae', name: '韩式炒粉丝', category: '零食', calories: 180, protein: 4.0, carbs: 32.0, fat: 4.5, fiber: 1.0, tags: ['韩餐'], price: [16, 26] },
  { id: 'sushi', name: '日式寿司拼盘', category: '零食', calories: 180, protein: 8.0, carbs: 28.0, fat: 4.0, fiber: 0.5, tags: ['日料'], price: [30, 55] },
  { id: 'donburi', name: '日式盖饭', category: '零食', calories: 230, protein: 18.0, carbs: 30.0, fat: 5.5, fiber: 0.5, tags: ['日料', '米饭'], price: [25, 40] },
  { id: 'curry_rice', name: '日式咖喱饭', category: '零食', calories: 240, protein: 10.0, carbs: 38.0, fat: 6.0, fiber: 1.5, tags: ['日料', '米饭'], price: [22, 35] },
  { id: 'okonomiyaki', name: '日式大阪烧', category: '零食', calories: 220, protein: 8.0, carbs: 28.0, fat: 9.0, fiber: 1.5, tags: ['日料'], price: [22, 35] },
  { id: 'takoyaki', name: '日式章鱼烧', category: '零食', calories: 190, protein: 8.0, carbs: 22.0, fat: 7.0, fiber: 1.0, tags: ['日料', '小吃'], price: [12, 20] },
  { id: 'spaghetti_bolognese', name: '意式肉酱面', category: '零食', calories: 210, protein: 12.0, carbs: 28.0, fat: 6.0, fiber: 1.5, tags: ['西餐', '面食'], price: [25, 40] },
  { id: 'spaghetti_carbonara', name: '意式培根蛋酱面', category: '零食', calories: 260, protein: 12.0, carbs: 26.0, fat: 12.0, fiber: 1.0, tags: ['西餐', '面食'], price: [28, 45] },
  { id: 'lasagna', name: '意式千层面', category: '零食', calories: 250, protein: 14.0, carbs: 28.0, fat: 10.0, fiber: 1.5, tags: ['西餐'], price: [30, 50] },
  { id: 'caesar_salad', name: '凯撒沙拉', category: '零食', calories: 120, protein: 8.0, carbs: 6.0, fat: 7.5, fiber: 2.0, tags: ['西餐', '沙拉', '健康'], price: [22, 35] },
  { id: 'club_sandwich', name: '俱乐部三明治', category: '零食', calories: 280, protein: 18.0, carbs: 26.0, fat: 12.0, fiber: 2.0, tags: ['西餐'], price: [22, 35] },
  { id: 'fish_and_chips', name: '英式炸鱼薯条', category: '零食', calories: 320, protein: 18.0, carbs: 30.0, fat: 14.0, fiber: 1.5, tags: ['西餐', '油炸'], price: [28, 45] },
  { id: 'taco', name: '墨西哥Taco', category: '零食', calories: 220, protein: 14.0, carbs: 22.0, fat: 10.0, fiber: 2.0, tags: ['西餐'], price: [18, 28] },
  { id: 'dongpo_pork', name: '红烧肉', category: '零食', calories: 360, protein: 12.0, carbs: 8.0, fat: 32.0, fiber: 0.5, tags: ['家常菜', '高热量', '江浙菜'], price: [28, 45] },
  { id: 'mapo_tofu', name: '麻婆豆腐', category: '零食', calories: 150, protein: 12.0, carbs: 10.0, fat: 8.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '家常菜'], price: [12, 20] },
  { id: 'gan_rice_noodle', name: '江西拌粉', category: '零食', calories: 180, protein: 6.0, carbs: 30.0, fat: 4.0, fiber: 1.5, tags: ['赣菜', '面食', '早餐'], price: [10, 18] },
  { id: 'chicken_mushroom_stew', name: '小鸡炖蘑菇', category: '零食', calories: 180, protein: 20.0, carbs: 8.0, fat: 8.0, fiber: 2.0, tags: ['东北菜', '滋补', '家常菜'], price: [25, 40] },
  { id: 'suan_cai_fish', name: '酸菜鱼', category: '零食', calories: 160, protein: 22.0, carbs: 6.0, fat: 6.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '家常菜'], price: [28, 45] },
  { id: 'beef_offal_noodle', name: '牛杂面', category: '零食', calories: 170, protein: 14.0, carbs: 22.0, fat: 4.5, fiber: 1.0, tags: ['粤菜', '面食'], price: [16, 26] },
  { id: 'rice_tofu_pudding', name: '豆花', category: '零食', calories: 55, protein: 4.0, carbs: 8.0, fat: 1.0, fiber: 0.3, tags: ['川菜', '甜口'], price: [4, 8] },
  // ============== 零食·卤味熟食 ==============
  { id: 'snack_chicken_wing_root', name: '卤鸡翅根', category: '零食', calories: 220, protein: 20.0, carbs: 2.0, fat: 15.0, fiber: 0, tags: ['卤味', '高蛋白', '加餐', '偶尔吃'], price: [5, 8] },
  { id: 'snack_duck_neck', name: '卤鸭脖', category: '零食', calories: 230, protein: 22.0, carbs: 4.0, fat: 14.0, fiber: 0, tags: ['卤味', '辣', '高蛋白', '加餐'], price: [6, 12] },
  { id: 'snack_tea_egg', name: '卤蛋', category: '零食', calories: 150, protein: 12.0, carbs: 2.0, fat: 10.0, fiber: 0, tags: ['卤味', '高蛋白', '加餐'], price: [2, 3] },
  { id: 'snack_roasted_chicken_leg', name: '卤鸡腿', category: '零食', calories: 210, protein: 22.0, carbs: 2.0, fat: 13.0, fiber: 0, tags: ['卤味', '高蛋白', '加餐'], price: [8, 15] },
  { id: 'snack_tiger_feet', name: '虎皮凤爪', category: '零食', calories: 280, protein: 20.0, carbs: 5.0, fat: 20.0, fiber: 0, tags: ['卤味', '粤菜', '加餐'], price: [8, 15] },
  { id: 'snack_sausage_grilled', name: '烤肠', category: '零食', calories: 300, protein: 12.0, carbs: 10.0, fat: 25.0, fiber: 0, tags: ['加工肉', '高热量', '加餐'], price: [3, 6] },
  { id: 'snack_ham_sausage', name: '火腿肠', category: '零食', calories: 210, protein: 10.0, carbs: 15.0, fat: 13.0, fiber: 0, tags: ['加工肉', '加餐'], price: [1, 3] },

  // ============== 零食·膨化干脆 ==============
  { id: 'snack_crispy_noodle', name: '干脆面', category: '零食', calories: 480, protein: 9.0, carbs: 58.0, fat: 24.0, fiber: 1.5, tags: ['膨化', '高碳水', '高热量', '加餐'], price: [1, 3] },
  { id: 'snack_chips', name: '薯片', category: '零食', calories: 540, protein: 7.0, carbs: 52.0, fat: 34.0, fiber: 3.0, tags: ['膨化', '高热量', '加餐', '偶尔吃'], price: [5, 10] },
  { id: 'snack_french_fries', name: '薯条', category: '零食', calories: 310, protein: 4.0, carbs: 42.0, fat: 15.0, fiber: 3.0, tags: ['膨化', '高碳水', '加餐'], price: [8, 15] },
  { id: 'snack_shrimp_chips', name: '虾条', category: '零食', calories: 480, protein: 5.0, carbs: 55.0, fat: 27.0, fiber: 1.0, tags: ['膨化', '高热量', '加餐'], price: [3, 6] },
  { id: 'snack_biscuit', name: '饼干', category: '零食', calories: 450, protein: 7.0, carbs: 62.0, fat: 20.0, fiber: 1.5, tags: ['高碳水', '加餐'], price: [5, 10] },
  { id: 'snack_soda_cracker', name: '苏打饼干', category: '零食', calories: 420, protein: 9.0, carbs: 68.0, fat: 12.0, fiber: 2.0, tags: ['加餐'], price: [4, 8] },
  { id: 'snack_wafer', name: '威化饼干', category: '零食', calories: 490, protein: 6.0, carbs: 60.0, fat: 26.0, fiber: 0.5, tags: ['高糖', '高热量', '加餐'], price: [3, 8] },
  { id: 'snack_rice_cracker', name: '锅巴', category: '零食', calories: 500, protein: 8.0, carbs: 60.0, fat: 26.0, fiber: 1.5, tags: ['膨化', '高热量', '加餐'], price: [3, 6] },

  // ============== 零食·乳饮乳品 ==============
  { id: 'snack_yogurt_drink', name: '优酸乳', category: '零食', calories: 70, protein: 1.5, carbs: 14.0, fat: 1.0, fiber: 0, tags: ['乳饮', '甜口', '加餐'], price: [3, 5] },
  { id: 'snack_flavored_yogurt', name: '风味酸奶', category: '零食', calories: 95, protein: 3.5, carbs: 16.0, fat: 2.5, fiber: 0, tags: ['乳饮', '甜口', '加餐'], price: [5, 8] },
  { id: 'snack_breakfast_milk', name: '早餐奶', category: '零食', calories: 65, protein: 2.5, carbs: 10.0, fat: 2.0, fiber: 0, tags: ['乳饮', '甜口', '加餐'], price: [3, 5] },
  { id: 'snack_ad_calcium', name: 'AD钙奶', category: '零食', calories: 55, protein: 1.5, carbs: 9.0, fat: 1.5, fiber: 0, tags: ['乳饮', '甜口', '加餐'], price: [2, 4] },
  { id: 'snack_lactic_acid', name: '乳酸菌饮料', category: '零食', calories: 60, protein: 1.0, carbs: 13.0, fat: 0.5, fiber: 0, tags: ['乳饮', '甜口', '加餐'], price: [4, 7] },

  // ============== 零食·速食主食 ==============
  { id: 'snack_instant_noodle_cup', name: '桶装泡面', category: '零食', calories: 430, protein: 10.0, carbs: 58.0, fat: 18.0, fiber: 1.5, tags: ['速食', '高热量', '独立餐食'], price: [5, 8] },
  { id: 'snack_instant_noodle_bag', name: '袋装泡面', category: '零食', calories: 450, protein: 10.0, carbs: 60.0, fat: 20.0, fiber: 1.5, tags: ['速食', '高热量', '独立餐食'], price: [3, 5] },
  { id: 'snack_instant_noodle_mix', name: '干拌面', category: '零食', calories: 480, protein: 11.0, carbs: 62.0, fat: 22.0, fiber: 1.5, tags: ['速食', '高热量', '独立餐食'], price: [5, 8] },
  { id: 'snack_self_heating_rice', name: '自热米饭', category: '零食', calories: 380, protein: 12.0, carbs: 55.0, fat: 13.0, fiber: 1.5, tags: ['速食', '独立餐食'], price: [12, 20] },
  { id: 'snack_bread', name: '面包', category: '零食', calories: 310, protein: 9.0, carbs: 52.0, fat: 6.0, fiber: 2.0, tags: ['早餐', '加餐'], price: [3, 6] },
  { id: 'snack_toast', name: '吐司面包', category: '零食', calories: 290, protein: 9.0, carbs: 50.0, fat: 5.0, fiber: 2.5, tags: ['早餐', '加餐'], price: [8, 15] },
  { id: 'snack_sandwich', name: '三明治', category: '零食', calories: 260, protein: 12.0, carbs: 28.0, fat: 10.0, fiber: 1.5, tags: ['早餐', '便携'], price: [8, 15] },
  { id: 'snack_rice_ball', name: '饭团', category: '零食', calories: 200, protein: 6.0, carbs: 35.0, fat: 4.0, fiber: 1.0, tags: ['便携', '早餐'], price: [5, 10] },

  // ============== 零食·饮料甜品 ==============
  { id: 'snack_cola', name: '可乐', category: '零食', calories: 43, protein: 0, carbs: 10.6, fat: 0, fiber: 0, tags: ['饮料', '高糖', '偶尔吃'], price: [3, 5] },
  { id: 'snack_sprite', name: '雪碧', category: '零食', calories: 42, protein: 0, carbs: 10.0, fat: 0, fiber: 0, tags: ['饮料', '高糖', '偶尔吃'], price: [3, 5] },
  { id: 'snack_bottled_milk_tea', name: '瓶装奶茶', category: '零食', calories: 65, protein: 1.0, carbs: 14.0, fat: 1.0, fiber: 0, tags: ['饮料', '高糖', '甜口', '偶尔吃'], price: [5, 8] },
  { id: 'snack_canned_coffee', name: '罐装咖啡', category: '零食', calories: 50, protein: 1.0, carbs: 8.0, fat: 1.5, fiber: 0, tags: ['饮料', '提神'], price: [5, 10] },
  { id: 'snack_popsicle', name: '雪糕', category: '零食', calories: 120, protein: 2.0, carbs: 20.0, fat: 4.0, fiber: 0, tags: ['甜品', '高糖', '偶尔吃'], price: [3, 6] },
  { id: 'snack_ice_cream', name: '冰淇淋', category: '零食', calories: 200, protein: 3.5, carbs: 25.0, fat: 10.0, fiber: 0, tags: ['甜品', '高糖', '高热量', '偶尔吃'], price: [8, 15] },
  { id: 'snack_chocolate', name: '巧克力', category: '零食', calories: 546, protein: 4.9, carbs: 52.0, fat: 35.0, fiber: 3.0, tags: ['甜品', '高糖', '高热量', '加餐'], price: [8, 20] },
  { id: 'snack_candy', name: '糖果', category: '零食', calories: 400, protein: 0, carbs: 98.0, fat: 2.0, fiber: 0, tags: ['甜品', '高糖', '偶尔吃'], price: [2, 5] },

  // ============== 零食·坚果果干 ==============
  { id: 'snack_sunflower_seeds', name: '瓜子', category: '零食', calories: 600, protein: 23.0, carbs: 18.0, fat: 50.0, fiber: 5.0, tags: ['坚果', '高蛋白', '高脂肪', '加餐'], price: [5, 10] },
  { id: 'snack_peanut_salted', name: '五香花生', category: '零食', calories: 580, protein: 25.0, carbs: 16.0, fat: 48.0, fiber: 6.0, tags: ['坚果', '高蛋白', '高脂肪', '加餐'], price: [3, 6] },
  { id: 'snack_daily_nuts', name: '每日坚果', category: '零食', calories: 580, protein: 18.0, carbs: 22.0, fat: 48.0, fiber: 7.0, tags: ['坚果', '高蛋白', '加餐'], price: [5, 10] },
  { id: 'snack_raisin', name: '葡萄干', category: '零食', calories: 320, protein: 3.0, carbs: 78.0, fat: 0.5, fiber: 2.0, tags: ['果干', '高糖', '加餐'], price: [5, 10] },
  { id: 'snack_dried_mango', name: '芒果干', category: '零食', calories: 310, protein: 1.5, carbs: 75.0, fat: 1.5, fiber: 2.5, tags: ['果干', '高糖', '加餐'], price: [8, 15] },

  // ============== 菜系·川菜补充 ==============
  { id: 'dish_shuizhu_roupian', name: '水煮肉片', category: '肉类', calories: 245, protein: 22.0, carbs: 8.0, fat: 15.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '家常菜', '重油'], price: [22, 35] },
  { id: 'dish_shuizhu_fish', name: '水煮鱼', category: '肉类', calories: 200, protein: 25.0, carbs: 5.0, fat: 10.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '家常菜', '重油'], price: [35, 55] },
  { id: 'dish_koushui_ji', name: '口水鸡', category: '肉类', calories: 220, protein: 22.0, carbs: 6.0, fat: 13.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '凉菜'], price: [25, 40] },

  // ============== 菜系·赣菜补充 ==============
  { id: 'dish_xiaochao_huangniurou', name: '小炒黄牛肉', category: '肉类', calories: 210, protein: 24.0, carbs: 6.0, fat: 11.0, fiber: 1.0, tags: ['赣菜', '辣', '高蛋白', '家常菜', '重油'], price: [28, 45] },
  { id: 'dish_fenzheng_rou', name: '粉蒸肉', category: '肉类', calories: 295, protein: 15.0, carbs: 18.0, fat: 19.0, fiber: 1.5, tags: ['赣菜', '家常菜', '高热量'], price: [22, 38] },
  { id: 'dish_duojiao_yutou_gan', name: '剁椒鱼头（赣菜）', category: '肉类', calories: 155, protein: 20.0, carbs: 6.0, fat: 6.0, fiber: 1.0, tags: ['赣菜', '辣', '高蛋白'], price: [45, 70] },
  { id: 'dish_pijiu_ya', name: '啤酒鸭', category: '肉类', calories: 260, protein: 22.0, carbs: 6.0, fat: 17.0, fiber: 1.0, tags: ['赣菜', '家常菜', '高蛋白'], price: [30, 48] },
  { id: 'dish_waguan_tang', name: '瓦罐汤', category: '汤类', calories: 65, protein: 5.0, carbs: 4.0, fat: 3.5, fiber: 0.5, tags: ['赣菜', '汤类', '早餐', '养胃'], price: [5, 10] },
  { id: 'dish_ganchaofen', name: '江西炒粉', category: '主食', calories: 195, protein: 6.0, carbs: 34.0, fat: 5.0, fiber: 1.5, tags: ['赣菜', '面食', '独立餐食'], price: [10, 18] },

  // ============== 菜系·湘菜补充 ==============
  { id: 'dish_duojiao_yutou_xiang', name: '剁椒鱼头（湘菜）', category: '肉类', calories: 150, protein: 20.0, carbs: 5.0, fat: 6.0, fiber: 1.0, tags: ['湘菜', '辣', '高蛋白'], price: [48, 75] },
  { id: 'dish_xiaochao_rou', name: '湘菜小炒肉', category: '肉类', calories: 260, protein: 18.0, carbs: 5.0, fat: 20.0, fiber: 1.0, tags: ['湘菜', '辣', '家常菜', '重油'], price: [22, 38] },
  { id: 'dish_ganguo_qianyedoufu', name: '干锅千叶豆腐', category: '豆制品', calories: 195, protein: 14.0, carbs: 10.0, fat: 12.0, fiber: 2.0, tags: ['湘菜', '辣', '家常菜', '重油'], price: [18, 28] },
  { id: 'dish_duojiao_jidan', name: '剁椒鸡蛋', category: '蛋奶', calories: 180, protein: 12.0, carbs: 5.0, fat: 13.0, fiber: 0.5, tags: ['湘菜', '辣', '家常菜'], price: [12, 20] },
  { id: 'dish_lawei_hezheng', name: '腊味合蒸', category: '肉类', calories: 310, protein: 20.0, carbs: 5.0, fat: 24.0, fiber: 0.5, tags: ['湘菜', '家常菜', '高热量'], price: [35, 55] },

  // ============== 通用家常菜补充 ==============
  { id: 'dish_fanqie_chaodan', name: '番茄炒蛋', category: '蛋奶', calories: 125, protein: 8.0, carbs: 8.0, fat: 8.0, fiber: 0.8, tags: ['家常菜', '食堂常见'], price: [10, 18] },
  { id: 'dish_tudou_dun_niurou', name: '土豆炖牛肉', category: '肉类', calories: 180, protein: 18.0, carbs: 12.0, fat: 7.0, fiber: 1.5, tags: ['家常菜', '高蛋白', '滋补'], price: [28, 45] },
  { id: 'dish_disanxian', name: '地三鲜', category: '蔬菜', calories: 160, protein: 3.0, carbs: 18.0, fat: 9.0, fiber: 2.0, tags: ['家常菜', '东北菜'], price: [12, 20] },
  { id: 'dish_tangcu_liji', name: '糖醋里脊', category: '肉类', calories: 260, protein: 18.0, carbs: 22.0, fat: 12.0, fiber: 0.5, tags: ['家常菜', '甜口'], price: [25, 40] },

  // ============== 家常菜·素菜 ==============
  { id: 'dish_chao_nangua', name: '炒南瓜', category: '蔬菜', calories: 85, protein: 2.0, carbs: 14.0, fat: 3.0, fiber: 2.5, tags: ['家常菜', '素菜', '食堂常见'], price: [8, 15] },
  { id: 'dish_qingchao_sigua', name: '清炒丝瓜', category: '蔬菜', calories: 65, protein: 2.0, carbs: 9.0, fat: 2.5, fiber: 2.0, tags: ['家常菜', '素菜', '清淡'], price: [10, 18] },
  { id: 'dish_hongshao_qiezi', name: '红烧茄子', category: '蔬菜', calories: 130, protein: 2.5, carbs: 15.0, fat: 7.5, fiber: 3.0, tags: ['家常菜', '素菜', '重油'], price: [12, 20] },
  { id: 'dish_jiucai_chaodan', name: '韭菜炒蛋', category: '蛋奶', calories: 150, protein: 10.0, carbs: 5.0, fat: 11.0, fiber: 1.5, tags: ['家常菜', '食堂常见'], price: [10, 18] },
  { id: 'dish_zheng_nangua', name: '蒸南瓜', category: '蔬菜', calories: 35, protein: 1.0, carbs: 8.0, fat: 0.2, fiber: 2.0, tags: ['家常菜', '素菜', '蒸菜', '清淡'], price: [5, 10] },
  { id: 'dish_muer_chao_shanyao', name: '木耳炒山药', category: '蔬菜', calories: 95, protein: 3.0, carbs: 14.0, fat: 3.5, fiber: 3.0, tags: ['家常菜', '素菜', '健康'], price: [15, 25] },
  { id: 'dish_xianggan_chaorou', name: '香干炒肉', category: '豆制品', calories: 185, protein: 16.0, carbs: 8.0, fat: 11.0, fiber: 2.0, tags: ['家常菜', '高蛋白', '食堂常见'], price: [14, 22] },

  // ============== 家常菜·荤素合烧 ==============
  { id: 'dish_anchundan_shaorou', name: '鹌鹑蛋烧肉', category: '肉类', calories: 255, protein: 20.0, carbs: 8.0, fat: 17.0, fiber: 0.5, tags: ['家常菜', '高蛋白', '红烧'], price: [25, 40] },
  { id: 'dish_oupian_chaorou', name: '藕片炒肉', category: '蔬菜', calories: 155, protein: 10.0, carbs: 15.0, fat: 7.0, fiber: 2.5, tags: ['家常菜', '食堂常见'], price: [15, 25] },
  { id: 'dish_luobo_shaorou', name: '萝卜烧肉', category: '肉类', calories: 180, protein: 15.0, carbs: 10.0, fat: 9.0, fiber: 2.0, tags: ['家常菜', '红烧'], price: [18, 30] },

  // ============== 家常菜·炖菜汤类 ==============
  { id: 'dish_donggua_paigu_tang', name: '冬瓜排骨汤', category: '汤类', calories: 85, protein: 10.0, carbs: 4.0, fat: 3.5, fiber: 1.0, tags: ['家常菜', '汤类', '滋补'], price: [20, 35] },
  { id: 'dish_xihongshi_jidan_tang', name: '西红柿鸡蛋汤', category: '汤类', calories: 50, protein: 3.0, carbs: 5.0, fat: 2.0, fiber: 0.5, tags: ['家常菜', '汤类', '清淡'], price: [6, 12] },
  { id: 'dish_zicai_jidan_tang', name: '紫菜鸡蛋汤', category: '汤类', calories: 55, protein: 4.0, carbs: 4.0, fat: 2.5, fiber: 0.8, tags: ['家常菜', '汤类'], price: [5, 10] },

  // ============== 家常菜·其他 ==============
  { id: 'dish_mapo_qiezi', name: '麻婆茄子', category: '蔬菜', calories: 140, protein: 3.0, carbs: 12.0, fat: 9.0, fiber: 2.5, tags: ['家常菜', '素菜', '辣'], price: [12, 20] },
  { id: 'dish_ganbian_sijidou', name: '干煸四季豆', category: '蔬菜', calories: 145, protein: 4.0, carbs: 14.0, fat: 8.5, fiber: 3.5, tags: ['家常菜', '素菜', '重油'], price: [14, 22] },
  { id: 'dish_xiangcai_niurou', name: '香菜牛肉', category: '肉类', calories: 190, protein: 22.0, carbs: 4.0, fat: 10.0, fiber: 1.0, tags: ['家常菜', '高蛋白'], price: [28, 45] },
  { id: 'dish_congbao_yangrou', name: '葱爆羊肉', category: '肉类', calories: 230, protein: 20.0, carbs: 4.0, fat: 16.0, fiber: 1.0, tags: ['家常菜', '高蛋白', '高热量'], price: [35, 55] },
  { id: 'dish_shuizhu_niurou', name: '水煮牛肉', category: '肉类', calories: 250, protein: 24.0, carbs: 6.0, fat: 15.0, fiber: 1.0, tags: ['川菜', '辣', '高蛋白', '重油'], price: [30, 48] },
  { id: 'dish_ganbian_niurou', name: '干煸牛肉丝', category: '肉类', calories: 235, protein: 22.0, carbs: 8.0, fat: 14.0, fiber: 1.5, tags: ['川菜', '辣', '高蛋白', '重油'], price: [28, 45] },
  { id: 'dish_heizhima_liji', name: '黑芝麻里脊', category: '肉类', calories: 220, protein: 22.0, carbs: 10.0, fat: 11.0, fiber: 1.0, tags: ['家常菜', '高蛋白'], price: [25, 40] },

  // ============== 粉面主食补充 ==============
  { id: 'dish_beef_noodle', name: '牛肉面', category: '主食', calories: 165, protein: 14.0, carbs: 22.0, fat: 4.0, fiber: 1.5, tags: ['面食', '独立餐食', '高蛋白'], price: [15, 25] },
  { id: 'dish_nanchang_banfen', name: '南昌拌粉', category: '主食', calories: 185, protein: 5.5, carbs: 32.0, fat: 5.0, fiber: 1.5, tags: ['赣菜', '面食', '独立餐食', '早餐'], price: [8, 15] },
  { id: 'dish_liangpi', name: '凉皮', category: '主食', calories: 130, protein: 4.0, carbs: 24.0, fat: 2.5, fiber: 1.0, tags: ['面食', '独立餐食', '凉菜'], price: [8, 15] },
  { id: 'dish_roujiamo', name: '肉夹馍', category: '主食', calories: 260, protein: 14.0, carbs: 28.0, fat: 10.0, fiber: 1.5, tags: ['西北菜', '独立餐食', '便携'], price: [10, 18] },
]

// 按ID查询食物
export const getFoodById = (id) => FOOD_DATABASE.find(f => f.id === id)

// 按名称模糊搜索
export const searchFood = (keyword, customFoods = []) => {
  if (!keyword) return [...customFoods, ...FOOD_DATABASE].slice(0, 30)
  const kw = keyword.toLowerCase()
  const allFoods = [...customFoods, ...FOOD_DATABASE]
  return allFoods.filter(f =>
    f.name.toLowerCase().includes(kw) ||
    (f.tags && f.tags.some(t => t.toLowerCase().includes(kw))) ||
    (f.category && f.category.toLowerCase().includes(kw))
  )
}

// ============== 智能食材匹配（兜底机制） ==============

// 食材关键词 → 对应标准食物的映射表
const INGREDIENT_MAP = [
  // 素菜
  { kw: '南瓜', food: 'sweet_potato', ratio: 0.7, nameHint: '南瓜' },
  { kw: '丝瓜', food: 'cucumber', ratio: 1.0, nameHint: '丝瓜' },
  { kw: '茄子', food: 'eggplant', ratio: 1.0, nameHint: '茄子' },
  { kw: '韭菜', food: 'scallion', ratio: 0.8, nameHint: '韭菜' },
  { kw: '藕', food: 'lotus_root', ratio: 1.0, nameHint: '藕' },
  { kw: '萝卜', food: 'carrot', ratio: 1.0, nameHint: '萝卜' },
  { kw: '冬瓜', food: 'cucumber', ratio: 1.2, nameHint: '冬瓜' },
  { kw: '木耳', food: 'mushroom', ratio: 0.5, nameHint: '木耳' },
  { kw: '山药', food: 'potato', ratio: 0.9, nameHint: '山药' },
  { kw: '四季豆', food: 'greens', ratio: 1.0, nameHint: '四季豆' },
  { kw: '香菜', food: 'scallion', ratio: 0.5, nameHint: '香菜' },
  { kw: '葱', food: 'scallion', ratio: 1.0, nameHint: '葱' },
  // 肉蛋奶
  { kw: '鹌鹑蛋', food: 'egg_boiled', ratio: 1.2, nameHint: '鹌鹑蛋' },
  { kw: '鸡蛋', food: 'egg_boiled', ratio: 1.0, nameHint: '鸡蛋' },
  { kw: '肉', food: 'pork_belly', ratio: 1.0, nameHint: '猪肉' },
  { kw: '五花肉', food: 'pork_belly', ratio: 1.0, nameHint: '五花肉' },
  { kw: '瘦肉', food: 'pork_lean', ratio: 1.0, nameHint: '瘦肉' },
  { kw: '里脊', food: 'pork_lean', ratio: 1.0, nameHint: '里脊肉' },
  { kw: '牛肉', food: 'chicken_breast', ratio: 0.9, nameHint: '牛肉' },
  { kw: '羊肉', food: 'chicken_breast', ratio: 1.1, nameHint: '羊肉' },
  { kw: '排骨', food: 'pork_ribs', ratio: 1.0, nameHint: '排骨' },
  { kw: '鸡肉', food: 'chicken_breast', ratio: 1.0, nameHint: '鸡肉' },
  { kw: '鱼', food: 'salmon', ratio: 0.8, nameHint: '鱼肉' },
  { kw: '香干', food: 'tofu_firm', ratio: 0.9, nameHint: '香干' },
  { kw: '豆腐', food: 'tofu', ratio: 1.0, nameHint: '豆腐' },
  { kw: '豆干', food: 'tofu_firm', ratio: 0.9, nameHint: '豆干' },
  // 主食
  { kw: '粉', food: 'rice_noodle', ratio: 1.0, nameHint: '米粉' },
  { kw: '面', food: 'noodle', ratio: 1.0, nameHint: '面条' },
]

// 烹饪方式 → 热量调整系数
const COOK_METHOD_MAP = [
  { kw: '红烧', oil: 8, soup: true, pct: 0.25 },   // 红烧多加8g油/100g，有汤汁
  { kw: '烧', oil: 5, soup: true, pct: 0.15 },
  { kw: '炒', oil: 5, soup: false, pct: 0 },
  { kw: '清炒', oil: 3, soup: false, pct: 0 },
  { kw: '干煸', oil: 7, soup: false, pct: 0 },
  { kw: '干锅', oil: 10, soup: false, pct: 0.3 },
  { kw: '水煮', oil: 8, soup: true, pct: 0.35 },
  { kw: '蒸', oil: 0, soup: false, pct: 0 },
  { kw: '炖', oil: 2, soup: true, pct: 0.1 },
  { kw: '煮', oil: 0, soup: true, pct: 0 },
  { kw: '卤', oil: 3, soup: true, pct: 0.15 },
  { kw: '焖', oil: 4, soup: true, pct: 0.15 },
]

// 识别菜品的烹饪方式
const detectCookMethod = (name) => {
  for (const m of COOK_METHOD_MAP) {
    if (name.includes(m.kw)) return m
  }
  return { kw: '炒', oil: 5, soup: false, pct: 0 }  // 默认清炒
}

// 从菜品名中识别食材
const extractIngredients = (name) => {
  const found = []
  for (const ing of INGREDIENT_MAP) {
    if (name.includes(ing.kw)) {
      found.push(ing)
    }
  }
  // 如果一个食材都没识别到，用通用猜测
  if (found.length === 0) {
    if (name.includes('肉')) return [{ kw: '肉', food: 'pork_lean', ratio: 1.0, nameHint: '肉' }]
    return [{ kw: '素菜', food: 'greens', ratio: 1.0, nameHint: '时令蔬菜' }]
  }
  return found
}

// 基于食材组合智能估算菜品热量
export const smartGuessDish = (dishName) => {
  const ingredients = extractIngredients(dishName)
  const cookMethod = detectCookMethod(dishName)

  // 汇总食材营养（假设总量100g，各食材均分）
  const count = ingredients.length
  let calories = 0, protein = 0, carbs = 0, fat = 0, fiber = 0

  for (const ing of ingredients) {
    const baseFood = getFoodById(ing.food)
    if (!baseFood) continue
    const ratio = ing.ratio / count
    calories += baseFood.calories * ratio
    protein += baseFood.protein * ratio
    carbs += baseFood.carbs * ratio
    fat += baseFood.fat * ratio
    fiber += (baseFood.fiber || 0) * ratio
  }

  // 加上烹饪用油（每100g菜品的用油量）
  const oilCal = cookMethod.oil * 9  // 1g油=9kcal
  calories += oilCal
  fat += cookMethod.oil

  // 如果没有任何食材数据，给一个通用估算
  if (calories < 30) {
    calories = 150
    protein = 6
    carbs = 15
    fat = 8
  }

  return {
    id: 'smart_guess_' + Date.now(),
    name: dishName,
    category: cookMethod.soup ? '汤类' : (ingredients.some(i => ['肉', '鸡', '牛', '羊', '鱼', '蛋'].some(x => i.kw.includes(x))) ? '肉类' : '蔬菜'),
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: Math.round(fiber * 10) / 10,
    tags: ['智能估算', cookMethod.soup ? '有汤汁' : '少油', ...ingredients.map(i => i.nameHint)],
    price: [15, 25],
    isSmartGuess: true,
    cookMethod: cookMethod.kw,
    hasSoup: cookMethod.soup,
    ingredients: ingredients.map(i => i.nameHint),
  }
}

// 食堂推荐菜品池（用于智能推荐）
export const CANTEEN_RECIPES = {
  breakfast: [
    // 中式传统
    { items: ['soy_milk', 'meat_bun', 'egg_boiled'], name: '豆浆 + 鲜肉包 + 水煮蛋', canteen: '食堂1楼', tags: ['budget', 'high_protein'] },
    { items: ['milk', 'steamed_bun', 'egg_boiled'], name: '牛奶 + 馒头 + 水煮蛋', canteen: '食堂1楼', tags: ['budget', 'light', 'high_protein'] },
    { items: ['congee', 'egg_fried', 'greens'], name: '白粥 + 煎蛋 + 小菜', canteen: '食堂1楼', tags: ['budget', 'light'] },
    { items: ['millet_congee', 'steamed_bun', 'egg_boiled'], name: '小米粥 + 馒头 + 水煮蛋', canteen: '食堂1楼', tags: ['budget', 'light', 'less_oil'] },
    { items: ['soy_milk_sweet', 'youtiao', 'egg_tea'], name: '甜豆浆 + 油条 + 茶叶蛋', canteen: '食堂1楼', tags: ['budget'] },
    { items: ['congee', 'cabbage_bun', 'egg_tea'], name: '白粥 + 素菜包 + 茶叶蛋', canteen: '食堂1楼', tags: ['light', 'budget', 'less_oil'] },
    { items: ['congee_pork', 'youtiao'], name: '皮蛋瘦肉粥 + 油条', canteen: '食堂2楼', tags: ['light', 'soup', '粤菜'] },
    { items: ['congee_fish', 'steamed_bun'], name: '鱼片粥 + 馒头', canteen: '食堂2楼', tags: ['light', 'soup', 'high_protein', '粤菜'] },
    // 煎饼/饼类
    { items: ['jianbing', 'milk'], name: '煎饼果子 + 牛奶', canteen: '食堂1楼', tags: ['noodle'] },
    { items: ['hand_pancake', 'egg_boiled', 'soy_milk'], name: '手抓饼 + 水煮蛋 + 豆浆', canteen: '食堂2楼', tags: ['high_protein'] },
    { items: ['bing', 'egg_boiled', 'soy_milk'], name: '葱油饼 + 水煮蛋 + 豆浆', canteen: '食堂1楼', tags: ['budget'] },
    { items: ['spring_roll', 'soy_milk', 'egg_boiled'], name: '春卷 + 豆浆 + 水煮蛋', canteen: '食堂2楼', tags: [] },
    // 面食
    { items: ['regan', 'egg_boiled'], name: '武汉热干面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'budget'] },
    { items: ['daoxiao', 'egg_boiled', 'greens'], name: '山西刀削面 + 水煮蛋 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'high_protein'] },
    { items: ['wonton', 'egg_boiled'], name: '鲜肉馄饨 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['dumpling', 'egg_soup'], name: '猪肉白菜饺子 + 蛋花汤', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['dandanmian', 'egg_boiled'], name: '四川担担面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'spicy', '川菜'] },
    { items: ['yuntunmian'], name: '港式云吞面', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', '粤菜'] },
    { items: ['zhajiangmian', 'egg_boiled'], name: '老北京炸酱面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', '京菜'] },
    // 健康轻食
    { items: ['oatmeal', 'egg_boiled', 'banana'], name: '燕麦粥 + 水煮蛋 + 香蕉', canteen: '食堂2楼', tags: ['light', 'high_protein', 'less_oil'] },
    { items: ['sweet_potato', 'egg_boiled', 'milk_lowfat'], name: '蒸红薯 + 水煮蛋 + 低脂牛奶', canteen: '食堂2楼', tags: ['light', 'less_oil', 'high_protein'] },
    { items: ['corn', 'egg_boiled', 'yogurt'], name: '玉米 + 水煮蛋 + 酸奶', canteen: '超市', tags: ['light', 'high_protein'] },
    { items: ['rice_brown', 'egg_custard', 'spinach'], name: '糙米饭 + 蒸蛋羹 + 菠菜', canteen: '食堂2楼', tags: ['light', 'less_oil', 'high_protein'] },
    { items: ['avocado', 'egg_boiled', 'bread_whole'], name: '牛油果 + 水煮蛋 + 全麦面包', canteen: '食堂3楼', tags: ['light', 'high_protein', '西餐'] },
    // 西南风味
    { items: ['rice_noodle', 'egg_boiled'], name: '过桥米线 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'spicy'] },
    { items: ['guilin_rice_noodle', 'egg_boiled'], name: '桂林米粉 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', '广西'] },
    { items: ['luosifen', 'egg_boiled'], name: '柳州螺蛳粉 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'spicy', '广西'] },
    // 江浙/粤式早餐
    { items: ['xiaolongbao', 'soy_milk'], name: '上海小笼包 + 豆浆', canteen: '食堂3楼', tags: ['江浙菜', 'high_protein'] },
    { items: ['shengjian', 'egg_soup'], name: '上海生煎包 + 蛋花汤', canteen: '食堂3楼', tags: ['江浙菜', 'high_protein'] },
    { items: ['rice_roll', 'soy_milk'], name: '广式肠粉 + 豆浆', canteen: '食堂3楼', tags: ['粤菜', 'light'] },
    { items: ['shumai', 'congee'], name: '广式烧卖 + 白粥', canteen: '食堂3楼', tags: ['粤菜', 'high_protein'] },
    { items: ['turnip_cake', 'soy_milk'], name: '广式萝卜糕 + 豆浆', canteen: '食堂3楼', tags: ['粤菜'] },
    { items: ['egg_tart', 'milk_tea'], name: '葡式蛋挞 + 奶茶', canteen: '超市', tags: ['甜点', '粤菜'] },
    // 面包三明治（西式/日韩）
    { items: ['sandwich', 'milk'], name: '火腿三明治 + 牛奶', canteen: '超市', tags: ['high_protein', '西餐'] },
    { items: ['bread_whole', 'egg_fried', 'milk_lowfat'], name: '全麦面包 + 煎蛋 + 低脂牛奶', canteen: '超市', tags: ['light', 'high_protein'] },
    { items: ['croissant', 'milk', 'egg_boiled'], name: '牛角包 + 牛奶 + 水煮蛋', canteen: '超市', tags: ['high_protein', '西餐'] },
    { items: ['bread', 'egg_boiled', 'yogurt'], name: '面包 + 水煮蛋 + 酸奶', canteen: '超市', tags: ['budget', 'high_protein'] },
    { items: ['kimbap', 'milk'], name: '韩式紫菜包饭 + 牛奶', canteen: '食堂3楼', tags: ['韩餐', 'high_protein'] },
    { items: ['tamago', 'rice_white', 'miso_soup'], name: '日式厚蛋烧 + 米饭 + 味增汤', canteen: '食堂3楼', tags: ['日料', 'high_protein'] },
    { items: ['club_sandwich', 'orange_juice'], name: '俱乐部三明治 + 橙汁', canteen: '食堂3楼', tags: ['西餐', 'high_protein'] },
  ],
  lunch: [
    // 经典食堂套餐
    { items: ['rice_white', 'chicken_leg', 'broccoli'], name: '米饭 + 红烧鸡腿 + 西兰花', canteen: '食堂2楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'chicken_breast', 'greens'], name: '米饭 + 香煎鸡胸肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'light', 'less_oil', 'high_protein'] },
    { items: ['rice_white', 'fish_steamed', 'cucumber_salad'], name: '米饭 + 清蒸鲈鱼 + 凉拌黄瓜', canteen: '食堂3楼', tags: ['rice', 'light', 'less_oil', 'high_protein'] },
    { items: ['rice_white', 'beef', 'tomato_egg'], name: '米饭 + 小炒黄牛肉 + 番茄炒蛋', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'spicy'] },
    { items: ['rice_white', 'sweet_sour_pork', 'greens'], name: '米饭 + 糖醋里脊 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'fish_braised', 'greens'], name: '米饭 + 红烧草鱼 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'eggplant', 'egg_boiled'], name: '米饭 + 红烧茄子 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', 'budget', 'high_protein'] },
    { items: ['rice_white', 'chicken_wing', 'broccoli'], name: '米饭 + 可乐鸡翅 + 西兰花', canteen: '食堂2楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'braised_pork', 'greens'], name: '米饭 + 红烧肉 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    { items: ['rice_white', 'duck', 'greens'], name: '米饭 + 啤酒鸭 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'tomato_egg', 'greens'], name: '米饭 + 番茄炒蛋 + 时蔬', canteen: '食堂1楼', tags: ['rice', 'budget', 'light'] },
    { items: ['rice_white', 'potato_shredded', 'egg_boiled'], name: '米饭 + 酸辣土豆丝 + 水煮蛋', canteen: '食堂1楼', tags: ['rice', 'budget', 'spicy'] },
    // 川菜系
    { items: ['rice_white', 'kung_pao_chicken', 'greens'], name: '米饭 + 宫保鸡丁 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'mapo_tofu', 'greens'], name: '米饭 + 麻婆豆腐 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'fish_sour', 'cucumber'], name: '米饭 + 酸菜鱼 + 黄瓜', canteen: '食堂3楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'fish_boiled', 'greens'], name: '米饭 + 水煮鱼 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'fish_fragrant_pork', 'greens'], name: '米饭 + 鱼香肉丝 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'chili_chicken', 'greens'], name: '米饭 + 辣子鸡 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'twice_cooked_pork', 'greens'], name: '米饭 + 回锅肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'boiled_blood', 'rice_white'], name: '米饭 + 毛血旺 + 米饭', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'dry_potato', 'egg_boiled'], name: '米饭 + 干锅土豆片 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'dry_cauliflower', 'greens'], name: '米饭 + 干锅花菜 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['malatang', 'rice_white'], name: '麻辣烫 + 米饭', canteen: '食堂1楼', tags: ['spicy', 'rice', '川菜'] },
    // 粤菜系
    { items: ['rice_white', 'white_cut_chicken', 'greens'], name: '米饭 + 白切鸡 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'light', '粤菜'] },
    { items: ['char_siu_rice'], name: '广式叉烧饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', '粤菜'] },
    { items: ['claypot_rice'], name: '广式腊味煲仔饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', '粤菜'] },
    { items: ['rice_white', 'roast_pork', 'greens'], name: '米饭 + 蜜汁叉烧 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '粤菜'] },
    { items: ['rice_white', 'duck_roast', 'greens'], name: '米饭 + 北京烤鸭 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '京菜'] },
    { items: ['beef_brisket_noodle'], name: '广式牛腩面', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', '粤菜'] },
    { items: ['wonton_noodle'], name: '广式云吞面', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', '粤菜'] },
    // 湘菜系
    { items: ['rice_white', 'xiang_pork', 'greens'], name: '米饭 + 湖南小炒肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '湘菜'] },
    { items: ['rice_white', 'duck_head', 'greens'], name: '米饭 + 剁椒鱼头 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'spicy', 'high_protein', '湘菜'] },
    // 东北菜
    { items: ['rice_white', 'guobaorou', 'greens'], name: '米饭 + 锅包肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    { items: ['rice_white', 'disanxian', 'egg_boiled'], name: '米饭 + 地三鲜 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', '东北菜'] },
    { items: ['rice_white', 'pork_sauerkraut', 'greens'], name: '米饭 + 猪肉炖粉条 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    { items: ['rice_white', 'chicken_mushroom', 'greens'], name: '米饭 + 小鸡炖蘑菇 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    { items: ['rice_white', 'potato_ribs', 'greens'], name: '米饭 + 土豆烧排骨 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    // 江浙菜
    { items: ['rice_white', 'dongpo_pork', 'greens'], name: '米饭 + 东坡肉 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    { items: ['rice_white', 'longjing_shrimp', 'greens'], name: '米饭 + 龙井虾仁 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'light', '江浙菜'] },
    { items: ['rice_white', 'lion_head', 'greens'], name: '米饭 + 扬州狮子头 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    { items: ['rice_white', 'fish_sweet_sour', 'greens'], name: '米饭 + 松鼠桂鱼 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    // 面/粉类
    { items: ['lamian', 'egg_boiled', 'greens'], name: '兰州拉面 + 水煮蛋 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'soup'] },
    { items: ['noodle_fried', 'egg_boiled'], name: '广东炒面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'high_protein'] },
    { items: ['beef_noodle', 'egg_boiled'], name: '红烧牛肉面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['rice_noodle', 'egg_boiled', 'greens'], name: '云南过桥米线 + 水煮蛋 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'soup', 'spicy'] },
    { items: ['daoxiao', 'egg_boiled', 'greens'], name: '山西刀削面 + 水煮蛋 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['suanla_fen', 'egg_boiled'], name: '重庆酸辣粉 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'spicy', '川菜'] },
    // 日韩料理
    { items: ['rice_fried', 'egg_boiled', 'sausage'], name: '日式蛋炒饭 + 水煮蛋 + 香肠', canteen: '食堂2楼', tags: ['rice', 'high_protein', '日料'] },
    { items: ['rice_white', 'black_pepper_beef', 'broccoli'], name: '黑椒牛柳饭 + 西兰花', canteen: '食堂3楼', tags: ['rice', 'high_protein', '西餐'] },
    { items: ['rice_white', 'salmon', 'spinach'], name: '三文鱼饭 + 菠菜', canteen: '食堂3楼', tags: ['rice', 'light', 'less_oil', 'high_protein', '日料'] },
    { items: ['rice_white', 'shrimp', 'broccoli'], name: '虾仁饭 + 西兰花', canteen: '食堂3楼', tags: ['rice', 'light', 'less_oil', 'high_protein'] },
    { items: ['donburi'], name: '日式牛肉盖饭（牛丼）', canteen: '食堂3楼', tags: ['rice', 'high_protein', '日料'] },
    { items: ['curry_rice'], name: '日式咖喱猪排饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', '日料'] },
    { items: ['sushi', 'miso_soup'], name: '日式寿司拼盘 + 味增汤', canteen: '食堂3楼', tags: ['high_protein', '日料'] },
    { items: ['korean_ramen', 'egg_boiled', 'kimchi'], name: '韩式辛拉面 + 水煮蛋 + 泡菜', canteen: '食堂3楼', tags: ['noodle', 'soup', 'spicy', '韩餐'] },
    { items: ['bibimbap'], name: '韩式石锅拌饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', '韩餐'] },
    { items: ['rice_white', 'bulgogi', 'kimchi'], name: '米饭 + 韩式烤牛肉 + 泡菜', canteen: '食堂3楼', tags: ['rice', 'high_protein', '韩餐'] },
    { items: ['rice_white', 'korean_fried_chicken', 'kimchi'], name: '米饭 + 韩式炸鸡 + 泡菜', canteen: '食堂3楼', tags: ['rice', 'high_protein', '韩餐'] },
    { items: ['japchae', 'egg_boiled'], name: '韩式炒粉丝 + 水煮蛋', canteen: '食堂3楼', tags: ['韩餐'] },
    // 西餐
    { items: ['hamburger', 'french_fries', 'coca_cola'], name: '经典汉堡套餐', canteen: '食堂1楼', tags: ['西餐'] },
    { items: ['cheeseburger', 'french_fries', 'coke_zero'], name: '芝士汉堡套餐', canteen: '食堂1楼', tags: ['西餐', 'high_protein'] },
    { items: ['spaghetti_bolognese', 'caesar_salad'], name: '意式肉酱面 + 凯撒沙拉', canteen: '食堂3楼', tags: ['noodle', 'high_protein', '西餐'] },
    { items: ['spaghetti_carbonara'], name: '意式培根蛋酱面', canteen: '食堂3楼', tags: ['noodle', 'high_protein', '西餐'] },
    { items: ['lasagna', 'caesar_salad'], name: '意式千层面 + 凯撒沙拉', canteen: '食堂3楼', tags: ['high_protein', '西餐'] },
    { items: ['beef_steak', 'risotto', 'asparagus'], name: '牛排 + 意式烩饭 + 芦笋', canteen: '食堂3楼', tags: ['rice', 'high_protein', '西餐'] },
    { items: ['fish_and_chips'], name: '英式炸鱼薯条', canteen: '食堂3楼', tags: ['西餐'] },
    { items: ['pizza', 'coca_cola'], name: '意式披萨套餐', canteen: '食堂3楼', tags: ['西餐'] },
    { items: ['taco', 'rice_white'], name: '墨西哥Taco + 米饭', canteen: '食堂3楼', tags: ['high_protein', '西餐'] },
    { items: ['burrito'], name: '墨西哥鸡肉卷饼', canteen: '食堂3楼', tags: ['high_protein', '西餐'] },
    // 东南亚
    { items: ['nasi_lemak'], name: '马来西亚椰浆饭', canteen: '食堂3楼', tags: ['rice', '东南亚'] },
    { items: ['chicken_rice'], name: '新加坡海南鸡饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'light', '东南亚'] },
    { items: ['pho'], name: '越南牛肉河粉', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', 'light', '东南亚'] },
    { items: ['pad_thai'], name: '泰式炒河粉', canteen: '食堂3楼', tags: ['noodle', '东南亚'] },
    { items: ['tom_yum_soup', 'rice_white', 'shrimp'], name: '冬阴功虾汤 + 米饭', canteen: '食堂3楼', tags: ['rice', 'spicy', 'soup', '东南亚'] },
    { items: ['bak_kut_teh', 'rice_white'], name: '新加坡肉骨茶 + 米饭', canteen: '食堂3楼', tags: ['rice', 'soup', 'high_protein', '东南亚'] },
    { items: ['laksa'], name: '马来西亚叻沙', canteen: '食堂3楼', tags: ['noodle', 'soup', 'spicy', '东南亚'] },
    // 快餐
    { items: ['fried_chicken', 'rice_white', 'egg_soup'], name: '韩式炸鸡 + 米饭 + 蛋花汤', canteen: '食堂2楼', tags: ['rice', 'high_protein'] },
    // 健康餐
    { items: ['rice_brown', 'salmon', 'broccoli'], name: '糙米饭 + 三文鱼 + 西兰花', canteen: '食堂3楼', tags: ['rice', 'light', 'less_oil', 'high_protein'] },
    { items: ['sweet_potato', 'shrimp', 'spinach'], name: '蒸红薯 + 白灼虾 + 菠菜', canteen: '食堂3楼', tags: ['light', 'less_oil', 'high_protein'] },
    { items: ['rice_white', 'tofu', 'mushroom', 'greens'], name: '米饭 + 家常豆腐 + 香菇青菜', canteen: '食堂2楼', tags: ['rice', 'light', 'budget'] },
    { items: ['rice_white', 'shrimp_fried', 'lotus_root'], name: '米饭 + 油焖大虾 + 藕片', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['caesar_salad', 'chicken_breast', 'bread_whole'], name: '凯撒鸡肉沙拉 + 全麦面包', canteen: '食堂3楼', tags: ['light', 'less_oil', 'high_protein', '西餐'] },
  ],
  dinner: [
    // 清淡晚餐
    { items: ['congee', 'fish_steamed', 'cucumber_salad'], name: '杂粮粥 + 清蒸鱼 + 凉拌菜', canteen: '食堂1楼', tags: ['light', 'less_oil', 'high_protein', 'soup'] },
    { items: ['millet_congee', 'steamed_bun', 'egg_custard'], name: '小米粥 + 馒头 + 蒸蛋羹', canteen: '食堂1楼', tags: ['light', 'budget', 'less_oil'] },
    { items: ['noodle', 'egg_soup', 'greens'], name: '阳春面 + 蛋花汤 + 小菜', canteen: '食堂1楼', tags: ['noodle', 'soup', 'light', 'budget'] },
    { items: ['sweet_potato', 'chicken_breast', 'broccoli'], name: '蒸红薯 + 香煎鸡胸肉 + 西兰花', canteen: '食堂2楼', tags: ['light', 'less_oil', 'high_protein'] },
    { items: ['corn', 'fish_steamed', 'spinach'], name: '玉米 + 清蒸鱼 + 菠菜', canteen: '食堂3楼', tags: ['light', 'less_oil', 'high_protein'] },
    { items: ['rice_brown', 'tofu', 'mushroom'], name: '糙米饭 + 香菇豆腐', canteen: '食堂2楼', tags: ['light', 'less_oil', 'budget'] },
    { items: ['congee_fish', 'cucumber_salad'], name: '广式鱼片粥 + 凉拌黄瓜', canteen: '食堂3楼', tags: ['light', 'less_oil', 'high_protein', 'soup', '粤菜'] },
    { items: ['congee_pork', 'greens'], name: '皮蛋瘦肉粥 + 时蔬', canteen: '食堂3楼', tags: ['light', 'less_oil', 'high_protein', 'soup', '粤菜'] },
    // 正餐
    { items: ['rice_white', 'tofu', 'greens'], name: '米饭 + 麻婆豆腐 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'chicken_breast', 'mushroom'], name: '米饭 + 香菇滑鸡 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'light', 'high_protein'] },
    { items: ['rice_white', 'fish_braised', 'greens'], name: '米饭 + 红烧鱼 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'eggplant', 'egg_boiled'], name: '米饭 + 红烧茄子 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', 'budget', 'high_protein'] },
    { items: ['rice_white', 'beef', 'broccoli'], name: '米饭 + 小炒牛肉 + 西兰花', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'tomato_egg', 'greens'], name: '米饭 + 番茄炒蛋 + 时蔬', canteen: '食堂1楼', tags: ['rice', 'budget', 'light'] },
    { items: ['rice_white', 'kung_pao_chicken', 'cucumber'], name: '米饭 + 宫保鸡丁 + 黄瓜', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'mapo_tofu', 'egg_boiled'], name: '米饭 + 麻婆豆腐 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', 'spicy', '川菜'] },
    { items: ['rice_white', 'fish_sour', 'greens'], name: '米饭 + 酸菜鱼 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'chicken_leg', 'greens'], name: '米饭 + 红烧鸡腿 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'shrimp', 'lotus_root'], name: '米饭 + 白灼虾 + 藕片', canteen: '食堂3楼', tags: ['rice', 'high_protein'] },
    { items: ['rice_white', 'fish_fragrant_pork', 'cucumber'], name: '米饭 + 鱼香肉丝 + 凉拌黄瓜', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '川菜'] },
    { items: ['rice_white', 'braised_pork', 'greens'], name: '米饭 + 红烧肉 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    { items: ['rice_white', 'dongpo_pork', 'greens'], name: '米饭 + 东坡肉 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    { items: ['rice_white', 'white_cut_chicken', 'greens'], name: '米饭 + 白切鸡 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'light', '粤菜'] },
    { items: ['rice_white', 'xiang_pork', 'greens'], name: '米饭 + 湖南小炒肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'spicy', 'high_protein', '湘菜'] },
    // 东北菜
    { items: ['rice_white', 'guobaorou', 'greens'], name: '米饭 + 锅包肉 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    { items: ['rice_white', 'disanxian', 'egg_boiled'], name: '米饭 + 地三鲜 + 水煮蛋', canteen: '食堂2楼', tags: ['rice', '东北菜'] },
    { items: ['rice_white', 'pork_sauerkraut', 'greens'], name: '米饭 + 猪肉炖粉条 + 时蔬', canteen: '食堂2楼', tags: ['rice', 'high_protein', '东北菜'] },
    // 江浙菜
    { items: ['rice_white', 'lion_head', 'greens'], name: '米饭 + 扬州狮子头 + 时蔬', canteen: '食堂3楼', tags: ['rice', 'high_protein', '江浙菜'] },
    // 面食
    { items: ['zhajiangmian', 'egg_soup'], name: '炸酱面 + 蛋花汤', canteen: '食堂1楼', tags: ['noodle', 'soup'] },
    { items: ['lamian', 'egg_boiled'], name: '兰州拉面 + 水煮蛋', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['daoxiao', 'egg_soup', 'greens'], name: '山西刀削面 + 蛋花汤 + 小菜', canteen: '食堂1楼', tags: ['noodle', 'soup'] },
    { items: ['dumpling', 'seaweed_soup'], name: '三鲜饺子 + 紫菜蛋汤', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['wonton', 'egg_boiled', 'greens'], name: '上海馄饨 + 水煮蛋 + 小菜', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['rice_noodle', 'tofu_puffed', 'greens'], name: '砂锅米线 + 油豆腐 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'soup'] },
    { items: ['beef_noodle', 'greens'], name: '台湾牛肉面 + 时蔬', canteen: '食堂1楼', tags: ['noodle', 'soup', 'high_protein'] },
    { items: ['noodle_fried', 'egg_soup'], name: '日式炒面 + 蛋花汤', canteen: '食堂1楼', tags: ['noodle'] },
    { items: ['wonton_noodle'], name: '广式云吞面', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', '粤菜'] },
    // 日韩/东南亚/西餐
    { items: ['donburi', 'miso_soup'], name: '日式牛肉盖饭 + 味增汤', canteen: '食堂3楼', tags: ['rice', 'high_protein', '日料'] },
    { items: ['bibimbap'], name: '韩式石锅拌饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', '韩餐'] },
    { items: ['spaghetti_bolognese', 'caesar_salad'], name: '意式肉酱面 + 凯撒沙拉', canteen: '食堂3楼', tags: ['noodle', 'high_protein', '西餐'] },
    { items: ['pho'], name: '越南牛肉河粉', canteen: '食堂3楼', tags: ['noodle', 'soup', 'high_protein', 'light', '东南亚'] },
    { items: ['chicken_rice'], name: '新加坡海南鸡饭', canteen: '食堂3楼', tags: ['rice', 'high_protein', 'light', '东南亚'] },
    // 特色
    { items: ['malatang', 'rice_white'], name: '麻辣烫 + 米饭', canteen: '食堂1楼', tags: ['spicy', 'rice', '川菜'] },
    { items: ['congee', 'cabbage_bun', 'egg_custard'], name: '皮蛋瘦肉粥 + 素菜包 + 蒸蛋羹', canteen: '食堂1楼', tags: ['light', 'budget', 'less_oil'] },
    { items: ['rice_fried', 'egg_soup'], name: '扬州蛋炒饭 + 蛋花汤', canteen: '食堂1楼', tags: ['rice'] },
  ],
  snack: [
    // 水果
    { items: ['apple'], name: '苹果 x1', canteen: '超市', tags: ['light', 'budget'] },
    { items: ['banana'], name: '香蕉 x1', canteen: '超市', tags: ['light', 'budget'] },
    { items: ['orange'], name: '橙子 x1', canteen: '超市', tags: ['light', 'budget'] },
    { items: ['pear'], name: '梨 x1', canteen: '超市', tags: ['light', 'budget'] },
    { items: ['grape'], name: '葡萄 150g', canteen: '超市', tags: ['light'] },
    { items: ['kiwi'], name: '猕猴桃 x2', canteen: '超市', tags: ['light'] },
    { items: ['watermelon'], name: '西瓜 300g', canteen: '超市', tags: ['light'] },
    { items: ['peach'], name: '桃子 x1', canteen: '超市', tags: ['light'] },
    { items: ['strawberry'], name: '草莓 150g', canteen: '超市', tags: ['light'] },
    { items: ['mango'], name: '芒果 x1', canteen: '超市', tags: ['light', '东南亚'] },
    { items: ['blueberry'], name: '蓝莓 100g', canteen: '超市', tags: ['light'] },
    { items: ['tangerine'], name: '橘子 x2', canteen: '超市', tags: ['light', 'budget'] },
    { items: ['grapefruit'], name: '西柚 x1', canteen: '超市', tags: ['light'] },
    { items: ['dragon_fruit'], name: '火龙果 x1', canteen: '超市', tags: ['light', '东南亚'] },
    // 奶制品/高蛋白
    { items: ['yogurt'], name: '原味酸奶 150g', canteen: '超市', tags: ['high_protein', 'light'] },
    { items: ['yogurt_lowfat'], name: '低脂酸奶 150g', canteen: '超市', tags: ['high_protein', 'light', 'less_oil'] },
    { items: ['milk', 'egg_boiled'], name: '纯牛奶 + 水煮蛋', canteen: '食堂1楼', tags: ['high_protein'] },
    { items: ['milk_lowfat', 'egg_boiled'], name: '低脂牛奶 + 水煮蛋', canteen: '食堂1楼', tags: ['high_protein', 'less_oil'] },
    { items: ['bread_whole', 'milk_lowfat'], name: '全麦面包 + 低脂牛奶', canteen: '超市', tags: ['high_protein', 'light', 'less_oil'] },
    { items: ['soy_milk', 'egg_boiled'], name: '无糖豆浆 + 水煮蛋', canteen: '食堂1楼', tags: ['high_protein', 'budget'] },
    { items: ['milk_skim', 'bread_whole'], name: '脱脂牛奶 + 全麦面包', canteen: '超市', tags: ['high_protein', 'light', 'less_oil'] },
    // 坚果
    { items: ['almond'], name: '原味杏仁 15g', canteen: '超市', tags: ['high_protein'] },
    { items: ['walnut'], name: '核桃 2个', canteen: '超市', tags: ['high_protein'] },
    { items: ['peanut'], name: '五香花生 20g', canteen: '超市', tags: ['high_protein'] },
    { items: ['cashew'], name: '腰果 15g', canteen: '超市', tags: ['high_protein'] },
    { items: ['pistachio'], name: '开心果 15g', canteen: '超市', tags: ['high_protein'] },
    // 饮料
    { items: ['milk_tea'], name: '珍珠奶茶 中杯', canteen: '超市', tags: [] },
    { items: ['coffee_milk'], name: '拿铁咖啡', canteen: '超市', tags: [] },
    { items: ['lemon_tea'], name: '柠檬茶', canteen: '超市', tags: ['light'] },
    { items: ['coconut_water'], name: '新鲜椰子水', canteen: '超市', tags: ['light', '东南亚'] },
    { items: ['orange_juice'], name: '鲜榨橙汁', canteen: '超市', tags: ['light'] },
    { items: ['coffee_black'], name: '美式黑咖啡', canteen: '超市', tags: ['light'] },
    // 其他小食
    { items: ['meatball'], name: '关东煮（鱼丸+萝卜）', canteen: '食堂1楼', tags: ['high_protein'] },
    { items: ['octopus'], name: '章鱼小丸子 6颗', canteen: '食堂1楼', tags: ['日料'] },
    { items: ['bread'], name: '奶香面包 x2', canteen: '超市', tags: ['budget'] },
    { items: ['rice_noodle'], name: '螺蛳粉', canteen: '食堂1楼', tags: ['spicy', 'noodle', '广西'] },
    { items: ['instant_noodle', 'egg_boiled'], name: '红烧牛肉面 + 水煮蛋', canteen: '超市', tags: ['budget'] },
    { items: ['sandwich'], name: '全麦三明治', canteen: '超市', tags: ['high_protein', '西餐'] },
    { items: ['chocolate_dark'], name: '黑巧克力 20g', canteen: '超市', tags: [] },
    { items: ['ice_cream'], name: '冰淇淋 1支', canteen: '超市', tags: [] },
    { items: ['takoyaki'], name: '日式章鱼烧', canteen: '食堂3楼', tags: ['日料'] },
    { items: ['edamame'], name: '日式毛豆', canteen: '食堂3楼', tags: ['high_protein', '日料'] },
    { items: ['rice_tofu_pudding'], name: '四川冰粉/豆花', canteen: '食堂1楼', tags: ['川菜', '甜口'] },
    { items: ['egg_tart'], name: '葡式蛋挞 x2', canteen: '超市', tags: ['粤菜', '甜点'] },
  ],
}