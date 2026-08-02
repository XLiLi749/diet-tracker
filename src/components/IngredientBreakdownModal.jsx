import { useState, useMemo, useEffect } from 'react'
import { analyzeDish, COOK_METHOD_MAP, INGREDIENT_CATEGORIES } from '../utils/ingredientParser'
import { INGREDIENT_DATABASE } from '../data/ingredients'

/**
 * 食材拆解弹窗组件
 * @param {object} props
 * @param {string} props.dishName - 菜名
 * @param {function} props.onClose - 关闭回调
 * @param {function} props.onConfirm - 确认使用回调 (foodData) => void
 */
export default function IngredientBreakdownModal({ dishName, onClose, onConfirm }) {
  const [totalWeight, setTotalWeight] = useState(150)
  const [cookMethod, setCookMethod] = useState('炒')
  const [customOil, setCustomOil] = useState(null) // 每100g额外用油量
  const [ingredients, setIngredients] = useState([])
  const [showIngredientPicker, setShowIngredientPicker] = useState(null) // 当前编辑的食材index

  // 初始分析
  useEffect(() => {
    const initial = analyzeDish(dishName, totalWeight)
    setCookMethod(initial.cookMethod)
    setIngredients(initial.ingredients.map(ing => ({ ...ing })))
  }, [dishName])

  // 重新计算
  const result = useMemo(() => {
    // 使用当前手动调整后的食材重新汇总
    let ingCals = 0, ingProtein = 0, ingFat = 0, ingCarbs = 0
    ingredients.forEach(i => {
      const factor = i.weight / 100
      ingCals += Math.round(i.nutritionPer100g.calories * factor)
      ingProtein += Math.round(i.nutritionPer100g.protein * factor * 10) / 10
      ingFat += Math.round(i.nutritionPer100g.fat * factor * 10) / 10
      ingCarbs += Math.round(i.nutritionPer100g.carbs * factor * 10) / 10
    })

    const method = COOK_METHOD_MAP.find(m => m.kw === cookMethod) || COOK_METHOD_MAP[0]
    let oilPer100g = method.oilPer100g + (customOil || 0)
    oilPer100g = Math.max(0, oilPer100g)

    const totalOil = Math.round(oilPer100g * totalWeight / 100 * 10) / 10
    const oilCalories = Math.round(totalOil * 9)

    const attachedOilRatio = method.hasSoup ? 0.6 : 1.0
    const attachedOilCal = Math.round(oilCalories * attachedOilRatio)
    const soupOilCal = oilCalories - attachedOilCal

    const solidCals = ingCals + attachedOilCal
    const soupBonusCal = method.hasSoup ? soupOilCal + Math.round(ingCals * method.soupRatio * 0.3) : 0

    return {
      hasSoup: method.hasSoup,
      soupRatio: method.soupRatio,
      oilPer100g,
      totalOil,
      oilCalories,
      ingredients,
      solidOnly: {
        calories: solidCals,
        protein: Math.round(ingProtein * 10) / 10,
        fat: Math.round((ingFat + totalOil * attachedOilRatio) * 10) / 10,
        carbs: Math.round(ingCarbs * 10) / 10,
      },
      withSoup: {
        calories: solidCals + soupBonusCal,
        protein: Math.round(ingProtein * 10) / 10,
        fat: Math.round((ingFat + totalOil) * 10) / 10,
        carbs: Math.round(ingCarbs * 10) / 10,
      },
      soupExtraCalories: soupBonusCal,
    }
  }, [ingredients, totalWeight, cookMethod, customOil])

  // 更新食材重量（支持空值输入，失焦时才校验）
  const updateIngredientWeight = (index, weight) => {
    const updated = [...ingredients]
    if (weight === '' || weight === null || weight === undefined) {
      updated[index] = { ...updated[index], weight: '' }
      setIngredients(updated)
      return
    }
    const w = Math.max(5, Math.round(Number(weight)))
    if (isNaN(w)) return
    const factor = w / 100
    updated[index] = {
      ...updated[index],
      weight: w,
      calories: Math.round(updated[index].nutritionPer100g.calories * factor),
      protein: Math.round(updated[index].nutritionPer100g.protein * factor * 10) / 10,
      fat: Math.round(updated[index].nutritionPer100g.fat * factor * 10) / 10,
      carbs: Math.round(updated[index].nutritionPer100g.carbs * factor * 10) / 10,
    }
    setIngredients(updated)
  }

  // 替换食材
  const replaceIngredient = (index, newIngId) => {
    const newIng = INGREDIENT_DATABASE.find(i => i.id === newIngId)
    if (!newIng) return
    const updated = [...ingredients]
    const oldWeight = updated[index].weight
    const factor = oldWeight / 100
    updated[index] = {
      ingredientId: newIng.id,
      name: newIng.name,
      category: newIng.category,
      weight: oldWeight,
      matchedKw: updated[index].matchedKw,
      nutritionPer100g: {
        calories: newIng.calories,
        protein: newIng.protein,
        fat: newIng.fat,
        carbs: newIng.carbs,
      },
      calories: Math.round(newIng.calories * factor),
      protein: Math.round(newIng.protein * factor * 10) / 10,
      fat: Math.round(newIng.fat * factor * 10) / 10,
      carbs: Math.round(newIng.carbs * factor * 10) / 10,
    }
    setIngredients(updated)
    setShowIngredientPicker(null)
  }

  // 添加食材
  const addIngredient = () => {
    setIngredients([...ingredients, {
      ingredientId: 'ing_greens',
      name: '时令蔬菜',
      category: 'leafy',
      weight: 50,
      matchedKw: '手动添加',
      nutritionPer100g: { calories: 15, protein: 1.5, fat: 0.3, carbs: 2.7 },
      calories: 8,
      protein: 0.8,
      fat: 0.2,
      carbs: 1.4,
    }])
  }

  // 删除食材
  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  // 确认使用
  const handleConfirm = () => {
    const foodData = {
      id: 'smart_' + Date.now(),
      name: dishName,
      category: result.hasSoup ? '汤类' : (ingredients.some(i => ['meat', 'seafood', 'egg'].includes(i.category)) ? '肉类' : '蔬菜'),
      calories: result.solidOnly.calories,  // 默认不喝汤
      protein: result.solidOnly.protein,
      carbs: result.solidOnly.carbs,
      fat: result.solidOnly.fat,
      fiber: 1.0,
      tags: ['智能估算', cookMethod, ...ingredients.map(i => i.name)],
      price: [15, 30],
      isSmartGuess: true,
      cookMethod,
      hasSoup: result.hasSoup,
      servingQty: totalWeight,
      breakdown: result,
    }
    onConfirm?.(foodData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-auto bg-white rounded-t-3xl md:rounded-3xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">🍳 食材拆解估算</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{dishName} · 估算依据见下方</p>
          </div>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-semibold active:bg-primary-600 flex-shrink-0 shadow-md shadow-primary-500/20"
          >
            ✓ 确认
          </button>
          <button onClick={onClose} className="text-gray-400 text-2xl w-8 h-8 flex items-center justify-center flex-shrink-0">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* 基础设置 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">菜品总重量</label>
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
                <input
                  type="number"
                  value={totalWeight}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setTotalWeight('')
                    } else {
                      const v = Number(e.target.value)
                      if (!isNaN(v)) setTotalWeight(Math.max(30, v))
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || Number(e.target.value) < 30) {
                      setTotalWeight(30)
                    }
                  }}
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                />
                <span className="text-xs text-gray-400">g</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">烹饪方式</label>
              <select
                value={cookMethod}
                onChange={(e) => setCookMethod(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none"
              >
                {COOK_METHOD_MAP.map(m => (
                  <option key={m.kw} value={m.kw}>{m.kw}（油{m.oilPer100g}g/100g）</option>
                ))}
              </select>
            </div>
          </div>

          {/* 用油量调整 */}
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-amber-800">🔥 烹饪用油量</span>
              <span className="text-xs text-amber-700 font-semibold">
                基础 {result.totalOil}g ≈ {result.oilCalories} kcal
              </span>
            </div>
            <input
              type="range"
              min={-10}
              max={20}
              value={customOil || 0}
              onChange={(e) => setCustomOil(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-[11px] text-amber-600 mt-0.5">
              {(customOil || 0) >= 0 ? '+' : ''}{customOil || 0}g/100g · 向左少油，向右多油
            </p>
          </div>

          {/* 食材构成 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">🥬 食材构成</span>
              <button onClick={addIngredient} className="text-xs text-primary-500 font-medium">+ 添加食材</button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setShowIngredientPicker(showIngredientPicker === idx ? null : idx)}
                      className="text-sm font-medium text-gray-700 hover:text-primary-600 flex-1 text-left"
                    >
                      {ing.name} ⟳
                    </button>
                    <button
                      onClick={() => removeIngredient(idx)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      删除
                    </button>
                  </div>

                  {/* 替换食材选择器 */}
                  {showIngredientPicker === idx && (
                    <div className="bg-white rounded-lg p-2 mb-2 border border-gray-200 max-h-40 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-1">
                        {INGREDIENT_DATABASE.slice(0, 60).map(it => (
                          <button
                            key={it.id}
                            onClick={() => replaceIngredient(idx, it.id)}
                            className="text-xs px-2 py-1.5 text-left hover:bg-primary-50 rounded text-gray-700"
                          >
                            {it.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={ing.weight}
                        onChange={(e) => updateIngredientWeight(idx, e.target.value === '' ? '' : e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value === '' || Number(e.target.value) < 5) {
                            updateIngredientWeight(idx, 5)
                          }
                        }}
                        className="w-16 bg-white rounded-lg px-2 py-1 text-sm outline-none text-center"
                      />
                      <span className="text-xs text-gray-400">g</span>
                    </div>
                    <div className="flex-1 text-right text-xs text-gray-500 space-x-2">
                      <span className="text-primary-600 font-semibold">{ing.calories} kcal</span>
                      <span>蛋白{ing.protein}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热量汇总 */}
          <div className="bg-gradient-to-br from-primary-50 to-amber-50 rounded-xl p-4 border border-primary-100">
            <p className="text-xs font-medium text-primary-700 mb-2">📊 热量估算汇总</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">🥗 只吃菜，不喝汤不蘸红油</span>
                <span className="text-base font-bold text-primary-600">{result.solidOnly.calories} kcal</span>
              </div>
              {result.hasSoup && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">🍲 连汤汁、酱汁、红油一起吃</span>
                  <span className="text-base font-bold text-red-600">{result.withSoup.calories} kcal</span>
                </div>
              )}
              {result.hasSoup && result.soupExtraCalories > 0 && (
                <p className="text-[11px] text-red-500 bg-red-50 rounded-lg px-2 py-1">
                  汤汁/红油额外 +{result.soupExtraCalories} kcal
                </p>
              )}
              <div className="border-t border-primary-200 pt-2 text-[11px] text-gray-500 leading-relaxed">
                估算依据：{ingredients.map(i => i.name).join(' + ')} + {cookMethod}用油{result.totalOil}g<br />
                【估算值，实际取决于食材重量与放油多少】
              </div>
              <button
                onClick={handleConfirm}
                className="w-full mt-3 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold active:bg-primary-600"
              >
                ✓ 确认使用此估算（{result.solidOnly.calories} kcal）
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
