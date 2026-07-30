import { useState } from 'react'
import useStore from '../store'
import { calcBMI } from '../data/mock'

const goalOptions = [
  { key: 'fat_loss', label: '减脂', icon: '🏃', desc: '控制热量，健康减重' },
  { key: 'weight_gain', label: '增重', icon: '📈', desc: '增加热量摄入，健康增重' },
  { key: 'muscle_gain', label: '增肌', icon: '💪', desc: '增加蛋白质，促进肌肉生长' },
  { key: 'maintain', label: '维持体重', icon: '⚖️', desc: '均衡营养，保持现状' },
  { key: 'stomach_care', label: '养胃', icon: '🫃', desc: '清淡饮食，温和养胃' },
]

const scheduleOptions = [
  { key: 'early_bird', label: '早睡早起', icon: '🌅' },
  { key: 'night_owl', label: '熬夜党', icon: '🦉' },
  { key: 'irregular', label: '不规律', icon: '🔀' },
]

const exerciseOptions = [
  { key: 'none', label: '几乎不运动' },
  { key: '1-2_per_week', label: '每周1-2次' },
  { key: '2-3_per_week', label: '每周2-3次' },
  { key: '3-5_per_week', label: '每周3-5次' },
  { key: 'daily', label: '几乎每天' },
]

const identityOptions = [
  { key: 'student', label: '学生', icon: '🎓' },
  { key: 'office_worker', label: '办公室职员', icon: '💼' },
  { key: 'teacher', label: '教师', icon: '👨‍🏫' },
  { key: 'doctor', label: '医护人员', icon: '👨‍⚕️' },
  { key: 'engineer', label: '工程师/程序员', icon: '👨‍💻' },
  { key: 'designer', label: '设计师', icon: '🎨' },
  { key: 'freelancer', label: '自由职业者', icon: '🌟' },
  { key: 'business', label: '创业者/企业主', icon: '🚀' },
  { key: 'athlete', label: '运动员/健身教练', icon: '🏋️' },
  { key: 'retired', label: '退休人员', icon: '🌴' },
  { key: 'homemaker', label: '家庭主妇/主夫', icon: '🏠' },
  { key: 'other', label: '其他', icon: '👤' },
]

const allergyOptions = ['花生', '海鲜', '牛奶', '鸡蛋', '小麦', '大豆', '坚果']
const dislikeOptions = ['香菜', '苦瓜', '芹菜', '韭菜', '胡萝卜', '洋葱', '大蒜']

// 通用弹窗样式：屏幕正中央，避免被底部导航遮挡
const modalOverlayClass = 'fixed inset-0 bg-black/50 z-[100] flex items-center justify-center'
const modalContainerClass = 'w-full max-w-sm mx-4 bg-white rounded-3xl p-5 max-h-[80vh] overflow-y-auto'

export default function Profile() {
  const {
    profile,
    targets,
    updateProfile,
    getBMI,
    resetAll,
    addBodyRecord,
    clearAllRecords,
  } = useStore()

  const [editingField, setEditingField] = useState(null) // 行内编辑（仅昵称）
  const [editValue, setEditValue] = useState('')

  // 各类型弹窗
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [showAllergyPicker, setShowAllergyPicker] = useState(false)
  const [showDislikePicker, setShowDislikePicker] = useState(false)
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [showIdentityPicker, setShowIdentityPicker] = useState(false)

  // 数值型字段弹窗（身高、体重、年龄、目标体重）
  const [showNumberPicker, setShowNumberPicker] = useState(false)
  const [numberPickerConfig, setNumberPickerConfig] = useState({ field: '', label: '', unit: '', min: 0, max: 999, step: 1 })

  const [newWeight, setNewWeight] = useState('')
  const [tempNumberValue, setTempNumberValue] = useState('')

  const bmi = getBMI()
  const bmiCategory = (() => {
    const b = parseFloat(bmi)
    if (b < 18.5) return { label: '偏瘦', color: 'text-blue-500', bg: 'bg-blue-50' }
    if (b < 24) return { label: '正常', color: 'text-green-500', bg: 'bg-green-50' }
    if (b < 28) return { label: '偏胖', color: 'text-amber-500', bg: 'bg-amber-50' }
    return { label: '肥胖', color: 'text-red-500', bg: 'bg-red-50' }
  })()

  const startEdit = (field, value) => {
    setEditingField(field)
    setEditValue(String(value))
  }

  const saveEdit = () => {
    if (editingField === 'nickname') {
      updateProfile({ nickname: editValue || profile.nickname })
    }
    setEditingField(null)
  }

  // 打开数值编辑弹窗
  const openNumberPicker = (field, value) => {
    const configs = {
      height: { label: '身高', unit: 'cm', min: 100, max: 250, step: 1 },
      weight: { label: '体重', unit: 'kg', min: 20, max: 300, step: 0.1 },
      age: { label: '年龄', unit: '岁', min: 10, max: 100, step: 1 },
      targetWeight: { label: '目标体重', unit: 'kg', min: 30, max: 200, step: 0.1 },
    }
    const cfg = configs[field] || { label: field, unit: '', min: 0, max: 999, step: 1 }
    setNumberPickerConfig({ field, ...cfg })
    setTempNumberValue(String(value))
    setShowNumberPicker(true)
  }

  const saveNumberPicker = () => {
    const { field } = numberPickerConfig
    const val = parseFloat(tempNumberValue)
    if (isNaN(val)) {
      setShowNumberPicker(false)
      return
    }
    if (field === 'targetWeight') {
      updateProfile({ dietGoal: { ...profile.dietGoal, targetWeight: val } })
    } else if (field === 'weight') {
      updateProfile({ weight: val })
      addBodyRecord(val)
    } else {
      updateProfile({ [field]: field === 'age' ? parseInt(val) || profile.age : val })
    }
    setShowNumberPicker(false)
  }

  const toggleAllergy = (item) => {
    const current = profile.restrictions.allergies || []
    const updated = current.includes(item)
      ? current.filter(a => a !== item)
      : [...current, item]
    updateProfile({ restrictions: { ...profile.restrictions, allergies: updated } })
  }

  const toggleDislike = (item) => {
    const current = profile.restrictions.dislikes || []
    const updated = current.includes(item)
      ? current.filter(d => d !== item)
      : [...current, item]
    updateProfile({ restrictions: { ...profile.restrictions, dislikes: updated } })
  }

  const handleRecordWeight = () => {
    const w = parseFloat(newWeight)
    if (w && w > 20 && w < 300) {
      addBodyRecord(w)
      setNewWeight('')
      setShowWeightInput(false)
    }
  }

  const currentGoal = goalOptions.find(g => g.key === profile.dietGoal.type) || goalOptions[2]
  const currentSchedule = scheduleOptions.find(s => s.key === profile.lifestyle.sleepSchedule) || scheduleOptions[1]
  const currentExercise = exerciseOptions.find(e => e.key === profile.lifestyle.exerciseFrequency) || exerciseOptions[2]
  const currentIdentity = identityOptions.find(i => i.key === profile.identity) || identityOptions[1]

  const displayProfession = profile.profession || currentIdentity.label

  const genderDisplay = profile.gender === 'female' ? '女' : '男'
  const genderIcon = profile.gender === 'female' ? '👩' : '👨'

  return (
    <div className="pb-4">
      {/* 顶部 */}
      <div className="bg-gradient-to-br from-purple-500 to-primary-400 text-white px-5 pt-12 pb-8 rounded-b-3xl">
        <h1 className="text-xl font-bold">👤 我的</h1>
        <div className="flex items-center gap-4 mt-5">
          <div
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl cursor-pointer"
            onClick={() => setShowGenderPicker(true)}
          >
            {genderIcon}
          </div>
          <div className="flex-1">
            {editingField === 'nickname' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/50 outline-none w-32"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-white font-medium">✓</button>
                <button onClick={() => setEditingField(null)} className="text-white/60">✕</button>
              </div>
            ) : (
              <h2
                className="text-xl font-bold cursor-pointer"
                onClick={() => startEdit('nickname', profile.nickname)}
              >
                {profile.nickname} ✏️
              </h2>
            )}
            <p
              className="text-sm opacity-80 mt-1 cursor-pointer"
              onClick={() => setShowIdentityPicker(true)}
            >
              {currentIdentity.icon} {displayProfession} · 饮食管理 ✏️
            </p>
          </div>
        </div>
      </div>

      {/* 身体数据 */}
      <div className="px-4 -mt-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">📝 身体数据</h3>
            <button
              onClick={() => setShowWeightInput(true)}
              className="text-xs text-primary-500 font-medium"
            >
              + 记录今日体重
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: '身高', value: profile.height, unit: 'cm', field: 'height' },
              { label: '体重', value: profile.weight, unit: 'kg', field: 'weight' },
              { label: '年龄', value: profile.age, unit: '岁', field: 'age' },
              { label: '性别', value: genderDisplay, unit: '', field: 'gender', isGender: true },
            ].map((item) => (
              <div
                key={item.field}
                onClick={() => {
                  if (item.isGender) {
                    setShowGenderPicker(true)
                  } else {
                    openNumberPicker(item.field, item.value)
                  }
                }}
                className="bg-gray-50 rounded-xl p-3 cursor-pointer active:bg-gray-100"
              >
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {item.value}{item.unit}
                </p>
              </div>
            ))}
          </div>

          {/* 计算数据 */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-400">BMI</p>
              <p className={`text-lg font-bold ${bmiCategory.color}`}>{bmi}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${bmiCategory.bg} ${bmiCategory.color}`}>
                {bmiCategory.label}
              </span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">基础代谢</p>
              <p className="text-lg font-bold text-gray-800">{targets.bmr}</p>
              <span className="text-[10px] text-gray-400">kcal</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">每日目标</p>
              <p className="text-lg font-bold text-primary-600">{targets.calorieTarget}</p>
              <span className="text-[10px] text-gray-400">kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 饮食目标 */}
      <div className="px-4 mt-4">
        <div className="card">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowGoalPicker(true)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentGoal.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-700">🎯 饮食目标</h3>
                <p className="text-xs text-primary-600 font-medium mt-0.5">
                  当前：{currentGoal.label}（目标 {profile.dietGoal.targetWeight}kg）
                </p>
              </div>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>
      </div>

      {/* 生活习惯 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">🏃 生活习惯</h3>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowSchedulePicker(true)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{currentSchedule.icon}</span>
                <span className="text-sm text-gray-700">作息</span>
              </div>
              <span className="text-sm text-gray-500">{currentSchedule.label} ›</span>
            </div>

            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowExercisePicker(true)}
            >
              <span className="text-sm text-gray-700">运动频率</span>
              <span className="text-sm text-gray-500">{currentExercise.label} ›</span>
            </div>
          </div>
        </div>
      </div>

      {/* 忌口与过敏 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">⚠️ 忌口与过敏</h3>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowAllergyPicker(true)}
            >
              <span className="text-sm text-gray-700">过敏食材</span>
              <span className="text-sm text-gray-500">
                {(profile.restrictions.allergies || []).length > 0
                  ? `${profile.restrictions.allergies.join('、')} ›`
                  : '无 ›'}
              </span>
            </div>

            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowDislikePicker(true)}
            >
              <span className="text-sm text-gray-700">忌口食物</span>
              <span className="text-sm text-gray-500">
                {(profile.restrictions.dislikes || []).length > 0
                  ? `${profile.restrictions.dislikes.join('、')} ›`
                  : '无 ›'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 营养目标 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 每日营养目标</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 rounded-xl p-3">
              <p className="text-xs text-orange-600">热量</p>
              <p className="text-lg font-bold text-orange-700">{targets.calorieTarget} kcal</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-blue-600">蛋白质</p>
              <p className="text-lg font-bold text-blue-700">{targets.proteinTarget} g</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <p className="text-xs text-amber-600">碳水</p>
              <p className="text-lg font-bold text-amber-700">{targets.carbsTarget} g</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xs text-red-600">脂肪</p>
              <p className="text-lg font-bold text-red-700">{targets.fatTarget} g</p>
            </div>
          </div>
        </div>
      </div>

      {/* 设置 */}
      <div className="px-4 mt-4 mb-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ 设置</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-gray-600 py-2">📤 数据导出</button>
            <button
              onClick={() => {
                if (confirm('确定要清空所有饮食和体重记录吗？用户档案（身高、性别等）会保留。')) {
                  clearAllRecords()
                }
              }}
              className="w-full text-left text-sm text-orange-500 py-2"
            >
              🧹 清空所有记录（保留个人档案）
            </button>
            <button
              onClick={() => {
                if (confirm('确定要重置为初始示例数据吗？所有个人数据将被覆盖！')) {
                  resetAll()
                }
              }}
              className="w-full text-left text-sm text-red-500 py-2"
            >
              🔄 重置为示例数据（恢复初始状态）
            </button>
            <p className="text-xs text-gray-400 pt-2">
              版本 v0.1.0 · 仅供参考，不替代专业医疗建议
            </p>
          </div>
        </div>
      </div>

      {/* ========== 弹窗区域 ========== */}

      {/* 数值编辑弹窗（身高/体重/年龄/目标体重） */}
      {showNumberPicker && (
        <div className={modalOverlayClass} onClick={() => setShowNumberPicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">修改{numberPickerConfig.label}</h3>
            <div className="relative">
              <input
                type="number"
                step={numberPickerConfig.step}
                min={numberPickerConfig.min}
                max={numberPickerConfig.max}
                value={tempNumberValue}
                onChange={(e) => setTempNumberValue(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-4 text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-primary-300"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                {numberPickerConfig.unit}
              </span>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowNumberPicker(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold"
              >
                取消
              </button>
              <button
                onClick={saveNumberPicker}
                className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 目标选择弹窗 */}
      {showGoalPicker && (
        <div className={modalOverlayClass} onClick={() => setShowGoalPicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择饮食目标</h3>
            <div className="space-y-2">
              {goalOptions.map((goal) => (
                <button
                  key={goal.key}
                  onClick={() => {
                    updateProfile({ dietGoal: { ...profile.dietGoal, type: goal.key } })
                    setShowGoalPicker(false)
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${
                    profile.dietGoal.type === goal.key
                      ? 'bg-primary-50 border-2 border-primary-400'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{goal.label}</p>
                    <p className="text-xs text-gray-500">{goal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">目标体重 (kg)</p>
              <input
                type="number"
                step="0.1"
                value={profile.dietGoal.targetWeight}
                onChange={(e) => updateProfile({ dietGoal: { ...profile.dietGoal, targetWeight: parseFloat(e.target.value) } })}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* 作息选择 */}
      {showSchedulePicker && (
        <div className={modalOverlayClass} onClick={() => setShowSchedulePicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择作息类型</h3>
            <div className="space-y-2">
              {scheduleOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    updateProfile({ lifestyle: { ...profile.lifestyle, sleepSchedule: opt.key } })
                    setShowSchedulePicker(false)
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${
                    profile.lifestyle.sleepSchedule === opt.key
                      ? 'bg-primary-50 border-2 border-primary-400'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <p className="font-semibold text-gray-800">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 运动频率选择 */}
      {showExercisePicker && (
        <div className={modalOverlayClass} onClick={() => setShowExercisePicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择运动频率</h3>
            <div className="space-y-2">
              {exerciseOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    updateProfile({ lifestyle: { ...profile.lifestyle, exerciseFrequency: opt.key } })
                    setShowExercisePicker(false)
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-colors ${
                    profile.lifestyle.exerciseFrequency === opt.key
                      ? 'bg-primary-50 border-2 border-primary-400'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 身份/职业选择 */}
      {showIdentityPicker && (
        <div className={modalOverlayClass} onClick={() => setShowIdentityPicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择您的身份</h3>
            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {identityOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    updateProfile({ identity: opt.key, profession: opt.label })
                    setShowIdentityPicker(false)
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    profile.identity === opt.key
                      ? 'bg-primary-50 border-2 border-primary-400'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">选择后可在个人信息中自定义职业名称</p>
          </div>
        </div>
      )}

      {/* 过敏选择 */}
      {showAllergyPicker && (
        <div className={modalOverlayClass} onClick={() => setShowAllergyPicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择过敏食材</h3>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map((item) => {
                const selected = (profile.restrictions.allergies || []).includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleAllergy(item)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selected && '✓ '}{item}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowAllergyPicker(false)}
              className="w-full mt-5 bg-primary-500 text-white py-3 rounded-xl font-semibold"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 忌口选择 */}
      {showDislikePicker && (
        <div className={modalOverlayClass} onClick={() => setShowDislikePicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择忌口食物</h3>
            <div className="flex flex-wrap gap-2">
              {dislikeOptions.map((item) => {
                const selected = (profile.restrictions.dislikes || []).includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleDislike(item)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selected && '✓ '}{item}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowDislikePicker(false)}
              className="w-full mt-5 bg-primary-500 text-white py-3 rounded-xl font-semibold"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 记录体重弹窗 */}
      {showWeightInput && (
        <div className={modalOverlayClass} onClick={() => setShowWeightInput(false)}>
          <div className="w-full max-w-sm mx-auto bg-white rounded-3xl p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center">记录今日体重</h3>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="请输入体重 (kg)"
                className="w-full bg-gray-100 rounded-xl px-4 py-4 text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-primary-300"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">kg</span>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowWeightInput(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleRecordWeight}
                className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-semibold"
              >
                记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 性别选择弹窗 */}
      {showGenderPicker && (
        <div className={modalOverlayClass} onClick={() => setShowGenderPicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">选择性别</h3>
            <div className="space-y-2">
              {[
                { key: 'male', label: '男', icon: '👨' },
                { key: 'female', label: '女', icon: '👩' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => {
                    updateProfile({ gender: opt.key })
                    setShowGenderPicker(false)
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-colors ${
                    profile.gender === opt.key
                      ? 'bg-primary-50 border-2 border-primary-400'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <p className="font-semibold text-gray-800">{opt.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
