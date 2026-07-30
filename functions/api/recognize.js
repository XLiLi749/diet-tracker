// Cloudflare Pages Functions - 百度 AI 菜品识别代理
// 保护 API Key 不暴露在前端

// 百度 AI Access Token 缓存（避免每次都请求）
let accessTokenCache = null;
let accessTokenExpireTime = 0;

// 获取百度 AI Access Token
async function getAccessToken(env) {
  const now = Date.now();
  if (accessTokenCache && now < accessTokenExpireTime) {
    return accessTokenCache;
  }

  const apiKey = env.BAIDU_API_KEY;
  const secretKey = env.BAIDU_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('请先配置 BAIDU_API_KEY 和 BAIDU_SECRET_KEY 环境变量');
  }

  const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(`获取 Access Token 失败: ${data.error_description || data.error}`);
  }

  accessTokenCache = data.access_token;
  // 提前 5 分钟过期
  accessTokenExpireTime = now + (data.expires_in - 300) * 1000;

  return accessTokenCache;
}

// 根据识别结果匹配本地食物库
function matchFoodLibrary(baiduResult, foods) {
  const results = [];

  for (const item of baiduResult) {
    const dishName = item.name;
    const probability = item.probability || item.score || 0;

    // 1. 精确匹配
    let matched = foods.find(f =>
      f.name === dishName ||
      dishName.includes(f.name) ||
      f.name.includes(dishName)
    );

    if (matched) {
      results.push({
        ...matched,
        matchProbability: probability,
        matchType: '精确匹配'
      });
      continue;
    }

    // 2. 关键词匹配（去掉「炒」「红烧」「清蒸」等烹饪方式）
    const keywords = dishName.replace(/(红烧|清蒸|爆炒|糖醋|麻辣|干锅|水煮|凉拌|香煎|油炸|蒜蓉|咖喱|黑椒|泡椒|鱼香|宫保|回锅|白切|盐焗|蜜汁|叉烧|可乐|奥尔良|番茄|鸡蛋|土豆|青椒|豆角|茄子|黄瓜|胡萝卜|豆腐|蘑菇|白菜|菠菜|生菜|番茄|米饭|面条|馒头|包子|饺子|粥|汤|饼|糕|包|丸|片|丝|块|丁|条)/g, '').trim();

    if (keywords.length > 0) {
      matched = foods.find(f =>
        f.name.includes(keywords) ||
        keywords.includes(f.name)
      );

      if (matched) {
        results.push({
          ...matched,
          matchProbability: probability * 0.8,
          matchType: '关键词匹配'
        });
        continue;
      }
    }

    // 3. 分类模糊匹配
    const categoryRules = [
      ['肉', '肉类'], ['鸡', '肉类'], ['鸭', '肉类'], ['猪', '肉类'], ['牛', '肉类'], ['羊', '肉类'],
      ['鱼', '水产'], ['虾', '水产'], ['蟹', '水产'], ['贝', '水产'], ['海鲜', '水产'],
      ['菜', '蔬菜'], ['瓜', '蔬菜'], ['菇', '蔬菜'], ['笋', '蔬菜'], ['豆', '蔬菜'],
      ['饭', '主食'], ['面', '主食'], ['米', '主食'], ['包', '主食'], ['饼', '主食'], ['馒头', '主食'],
      ['蛋', '蛋奶'], ['奶', '蛋奶'], ['乳', '蛋奶'], ['豆腐', '蛋奶'],
      ['果', '水果'], ['西瓜', '水果'], ['哈密瓜', '水果'], ['甜瓜', '水果'],
      ['汤', '汤类'],
      ['水', '饮料'], ['茶', '饮料'], ['咖啡', '饮料'], ['可乐', '饮料'], ['果汁', '饮料'],
      ['薯', '零食'], ['巧克', '零食'], ['糖', '零食']
    ];

    let matchedCategory = '其他';
    for (const [keyword, category] of categoryRules) {
      if (dishName.includes(keyword)) {
        matchedCategory = category;
        break;
      }
    }

    // 估算营养（基于概率和分类）
    const estimatedCalories = Math.round(150 + probability * 200);

    results.push({
      id: `unknown_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: dishName,
      category: matchedCategory,
      calories: estimatedCalories,
      protein: Math.round(estimatedCalories * 0.15 / 4),
      carbs: Math.round(estimatedCalories * 0.5 / 4),
      fat: Math.round(estimatedCalories * 0.3 / 9),
      fiber: 1,
      tags: ['AI识别', matchedCategory],
      price: [5, 15],
      matchProbability: probability,
      matchType: '分类估算'
    });
  }

  // 按匹配概率排序
  return results.sort((a, b) => b.matchProbability - a.matchProbability);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return new Response(JSON.stringify({ error: '请上传图片' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 移除 data:image/xxx;base64, 前缀
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // 获取 Access Token
    const accessToken = await getAccessToken(env);

    // 调用百度 AI 菜品识别 API
    const dishUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${accessToken}`;

    const dishParams = new URLSearchParams();
    dishParams.append('image', base64Data);
    dishParams.append('top_num', '5');

    const dishResponse = await fetch(dishUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: dishParams.toString()
    });

    const dishData = await dishResponse.json();

    if (dishData.error_code) {
      return new Response(JSON.stringify({
        error: `识别失败: ${dishData.error_msg || dishData.error_code}`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 如果没有结果，返回通用菜品
    if (!dishData.result || dishData.result.length === 0) {
      return new Response(JSON.stringify({
        results: [{
          id: `unknown_${Date.now()}`,
          name: '未识别的菜品',
          category: '其他',
          calories: 200,
          protein: 10,
          carbs: 20,
          fat: 8,
          fiber: 2,
          tags: ['AI识别'],
          price: [5, 15],
          matchProbability: 0,
          matchType: '未识别'
        }]
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 匹配本地食物库（简化版：直接用百度返回结果）
    const foodLibrary = []; // 这里不需要加载完整食物库，直接返回百度结果即可

    const matchedResults = dishData.result.map(item => {
      const probability = item.probability || item.score || 0;
      return {
        name: item.name,
        category: 'AI识别',
        calories: item.calorie || Math.round(150 + probability * 200),
        protein: item.protein || Math.round(8 + probability * 15),
        carbs: item.carbohydrate || Math.round(15 + probability * 25),
        fat: item.fat || Math.round(5 + probability * 15),
        fiber: item.fiber || 1,
        tags: ['AI识别', '百度AI'],
        probability: probability,
        has_calorie: !!item.calorie
      };
    });

    return new Response(JSON.stringify({ results: matchedResults }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('识别错误:', error);
    return new Response(JSON.stringify({
      error: `服务器错误: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
