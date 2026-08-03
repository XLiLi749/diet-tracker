import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store'
import { clearLoginState } from '../utils/auth'
import { calcBMI, calcIdealWeightRange, calcSuggestedTargetWeight, RATE_LEVELS } from '../data/mock'
import { savePhoto, compressImage, genPhotoId, getPhoto } from '../utils/photoStorage'
import usagiYellow from '../assets/03_黄色背景乌萨奇.jpg'
import usagiGlasses from '../assets/04_戴眼镜的乌萨奇.jpg'
import usagiSleep from '../assets/05_戴睡帽的乌萨奇.jpg'

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

const cuisineOptions = ['川菜', '湘菜', '赣菜', '粤菜', '东北菜', '江浙菜', '鲁菜', '闽菜', '徽菜', '浙菜']
const tasteOptions = ['辣', '清淡', '少油', '高蛋白', '甜口', '咸香', '酸', '麻', '香煎', '煲汤', '清蒸', '凉拌']

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
    exportData,
    importData,
    currentUser,
    currentUserId,
    registerAccount,
    loginAccount,
    logoutAccount,
    favorites,
    toggleFavoriteCuisine,
    toggleFavoriteTaste,
  } = useStore()

  const [editingField, setEditingField] = useState(null) // 行内编辑（仅昵称）
  const [editValue, setEditValue] = useState('')
  const navigate = useNavigate()

  // 头像
  const [avatarUrl, setAvatarUrl] = useState(null)

  // 加载已保存的头像
  useEffect(() => {
    if (profile.avatar) {
      getPhoto(profile.avatar).then(url => {
        if (url) setAvatarUrl(url)
      })
    }
  }, [profile.avatar])

  // 处理头像上传
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result
        if (typeof dataUrl !== 'string') return
        // 压缩图片
        const compressed = await compressImage(dataUrl, 512, 0.85)
        // 保存到 IndexedDB
        const photoId = genPhotoId()
        await savePhoto(photoId, compressed)
        // 更新 profile
        updateProfile({ avatar: photoId })
        setAvatarUrl(compressed)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.warn('头像上传失败:', err)
    }
    e.target.value = ''
  }

  // 各类型弹窗
  const [showGoalPicker, setShowGoalPicker] = useState(false)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [showExercisePicker, setShowExercisePicker] = useState(false)
  const [showAllergyPicker, setShowAllergyPicker] = useState(false)
  const [showDislikePicker, setShowDislikePicker] = useState(false)
  const [showWeightInput, setShowWeightInput] = useState(false)
  const [showGenderPicker, setShowGenderPicker] = useState(false)
  const [showIdentityPicker, setShowIdentityPicker] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [showFavCuisinePicker, setShowFavCuisinePicker] = useState(false)
  const [showFavTastePicker, setShowFavTastePicker] = useState(false)

  // 账户表单
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPassword2, setRegPassword2] = useState('')
  const [authMsg, setAuthMsg] = useState('')
  const [importMsg, setImportMsg] = useState('')

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
      {/* 顶部 - 乌萨奇可爱风格 */}
      <div className="bg-gradient-to-br from-usagi-pinkLight via-usagi-cream to-usagi-yellow/50 px-5 pt-12 pb-10 rounded-b-[2.5rem] relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/40" />
        <div className="absolute left-16 bottom-6 w-3 h-3 rounded-full bg-white/60" />
        <h1 className="text-xl font-bold text-gray-800 relative z-10">👤 我的</h1>
        <div className="flex items-center gap-4 mt-5 relative z-10">
          {/* 头像（支持点击上传） */}
          <div className="relative">
            <label className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-cute cursor-pointer flex-shrink-0 block">
              <img
                src={avatarUrl || usagiYellow}
                alt="头像"
                className="w-full h-full object-cover"
              />
            </label>
            {/* 相机图标覆盖层 */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow">
              <span className="text-white text-xs">📷</span>
            </div>
            {/* 隐形文件输入（支持拍照+相册） */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleAvatarUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            {editingField === 'nickname' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-white rounded-lg px-3 py-1 text-gray-800 placeholder-gray-400 outline-none w-32 border border-gray-200"
                  autoFocus
                />
                <button onClick={saveEdit} className="text-primary-600 font-bold">✓</button>
                <button onClick={() => setEditingField(null)} className="text-gray-400">✕</button>
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
              <p className="text-[10px] text-primary-500 mt-0.5">
                健康速率·每月约变化{targets.monthlyChangeKg || '1~2'}kg
              </p>
              {profile.dietGoal.type === 'weight_gain' && (
                <p className="text-[10px] text-amber-600 mt-0.5">
                  💡 以优质蛋白+主食为主
                </p>
              )}
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
                {['fat_loss', 'weight_gain', 'muscle_gain'].includes(profile.dietGoal.type) && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    ⚡ {targets.rateLabel || '温和健康档'} · 每月约变化{targets.monthlyChangeKg || '1~2'}kg
                  </p>
                )}
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

      {/* 我的收藏 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">❤️ 我的收藏（影响推荐）</h3>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowFavCuisinePicker(true)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🍜</span>
                <span className="text-sm text-gray-700">收藏菜系</span>
              </div>
              <span className="text-sm text-gray-500">
                {(favorites?.cuisines || []).length > 0
                  ? `${favorites.cuisines.join('、')} ›`
                  : '点击添加 ›'}
              </span>
            </div>

            <div
              className="flex items-center justify-between bg-gray-50 rounded-xl p-3 cursor-pointer"
              onClick={() => setShowFavTastePicker(true)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">👅</span>
                <span className="text-sm text-gray-700">收藏口味</span>
              </div>
              <span className="text-sm text-gray-500">
                {(favorites?.tastes || []).length > 0
                  ? `${favorites.tastes.join('、')} ›`
                  : '点击添加 ›'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            💡 收藏的菜系和口味会在推荐时优先匹配，让推荐更符合你的喜好
          </p>
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

      {/* 账户管理 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">👤 账户</h3>
          {currentUser ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                已登录：<span className="font-semibold text-primary-600">{currentUser}</span>
              </p>
              {currentUserId && (
                <div
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    navigator.clipboard?.writeText(currentUserId)
                    alert('个人ID已复制！')
                  }}
                >
                  <div>
                    <p className="text-[10px] text-gray-400">个人ID（点击复制）</p>
                    <p className="text-xs font-mono text-gray-700">{currentUserId}</p>
                  </div>
                  <span className="text-xs text-gray-400">📋</span>
                </div>
              )}
              <p className="text-xs text-gray-400">数据会自动保存到云端，可在不同设备间同步</p>
              <button
                onClick={() => {
                  try {
                    logoutAccount()
                  } catch (e) {}
                  setTimeout(() => {
                    navigate('/login', { replace: true })
                    window.location.reload()
                  }, 50)
                }}
                className="w-full text-left text-sm text-orange-500 py-2"
              >
                🚪 退出登录
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => { setShowLoginModal(true); setAuthMsg('') }}
                className="w-full text-left text-sm text-primary-600 py-2"
              >
                🔐 登录账户（保存数据）
              </button>
              <button
                onClick={() => { setShowRegisterModal(true); setAuthMsg('') }}
                className="w-full text-left text-sm text-primary-600 py-2"
              >
                ✨ 注册新账户
              </button>
              <p className="text-xs text-gray-400 pt-1">
                注册后可在不同设备间通过登录恢复数据（当前为本地账户，数据保存在浏览器中）
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="px-4 mt-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📌 快捷功能</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/journal')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="text-2xl">📔</span>
              <div className="text-left">
                <p className="font-medium text-gray-800">手账</p>
                <p className="text-xs text-gray-500">图文饮食日志</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/recommend')}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="text-2xl">🍽️</span>
              <div className="text-left">
                <p className="font-medium text-gray-800">推荐</p>
                <p className="text-xs text-gray-500">健康食谱</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 设置 */}
      <div className="px-4 mt-4 mb-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">⚙️ 设置</h3>
          <div className="space-y-2">
            {/* 隐私告知 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <p className="text-xs text-amber-800 font-medium mb-1">🔒 隐私告知</p>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                您的饮食记录、身体数据将自动保存到云端，不同设备登录同一账号即可同步。
                平台严格保护您的个人隐私。所有热量数据为估算参考值。
              </p>
            </div>

            {/* 本地备份（辅助功能，云端已自动同步） */}
            <div className="border-t border-gray-100 my-2" />
            <p className="text-[10px] text-gray-400 mb-1">本地备份（云端已自动同步，以下为辅助功能）</p>
            <button
              onClick={() => exportData()}
              className="w-full text-left text-sm text-gray-500 py-2"
            >
              📤 导出数据（备份为 JSON 文件）
            </button>
            <label className="block w-full text-left text-sm text-gray-500 py-2 cursor-pointer">
              📥 导入数据（从 JSON 文件恢复）
              <input
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = (ev) => {
                    const text = ev.target?.result
                    if (typeof text !== 'string') {
                      setImportMsg('❌ 读取文件失败')
                      return
                    }
                    const ok = importData(text)
                    setImportMsg(ok ? '✅ 导入成功！' : '❌ 导入失败，请检查文件格式')
                    setTimeout(() => setImportMsg(''), 3000)
                  }
                  reader.readAsText(file)
                  e.target.value = ''
                }}
              />
            </label>
            {importMsg && (
              <p className={`text-xs ${importMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {importMsg}
              </p>
            )}

            <div className="border-t border-gray-100 my-2" />
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full text-left text-sm text-gray-500 py-2 hover:text-gray-700"
            >
              🔑 管理员入口
            </button>

            <div className="border-t border-gray-100 my-2" />
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

            {/* 速率档位选择（仅增重/减重/增肌时显示） */}
            {['fat_loss', 'weight_gain', 'muscle_gain'].includes(profile.dietGoal.type) && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">⚡ 速率档位</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(RATE_LEVELS).map((level) => {
                    const isGentleForced = targets.isGentleByBMI && level.key === 'gentle'
                    return (
                      <button
                        key={level.key}
                        onClick={() => {
                          if (!isGentleForced) {
                            updateProfile({ dietGoal: { ...profile.dietGoal, rateLevel: level.key } })
                          }
                        }}
                        className={`p-3 rounded-xl text-left transition-colors ${
                          (profile.dietGoal.rateLevel || 'gentle') === level.key || isGentleForced
                            ? 'bg-primary-50 border-2 border-primary-400'
                            : 'bg-gray-50 border-2 border-transparent'
                        } ${isGentleForced ? 'opacity-80' : ''}`}
                      >
                        <p className="text-sm font-bold text-gray-800">{level.label}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{level.desc}</p>
                        <p className="text-[10px] text-primary-600 mt-1">
                          每月变化约 {level.monthlyChangeKg}kg
                        </p>
                        {isGentleForced && (
                          <p className="text-[10px] text-amber-600 mt-1">
                            ⚠️ BMI偏低，自动启用温和档
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">目标体重 (kg)</p>
              <input
                type="number"
                step="0.1"
                value={profile.dietGoal.targetWeight}
                onChange={(e) => updateProfile({ dietGoal: { ...profile.dietGoal, targetWeight: parseFloat(e.target.value) } })}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              {(() => {
                const range = calcIdealWeightRange(profile.height)
                const suggested = calcSuggestedTargetWeight(profile)
                const targetBMI = parseFloat(calcBMI(profile.dietGoal.targetWeight, profile.height))
                const isBMIUnhealthy = targetBMI < 18.5 || targetBMI > 24
                return (
                  <div className="mt-3 space-y-1 text-xs">
                    <p className="text-gray-500">
                      健康范围：<span className="text-gray-700">{range.minHealthy} ~ {range.maxHealthy} kg</span>
                      （BMI 18.5 ~ 23.9）
                    </p>
                    <p className="text-gray-500">
                      理想体重（BMI 22）：<span className="text-primary-600 font-medium">{range.ideal} kg</span>
                    </p>
                    <p className="text-blue-600">
                      💡 根据当前目标，智能推荐：<span className="font-bold">{suggested} kg</span>
                      <button
                        onClick={() => updateProfile({ dietGoal: { ...profile.dietGoal, targetWeight: suggested } })}
                        className="ml-2 underline"
                      >
                        使用推荐值
                      </button>
                    </p>
                    {isBMIUnhealthy && (
                      <div className="mt-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-amber-700">
                          ⚠️ 目标体重对应 BMI 为 <span className="font-bold">{targetBMI}</span>
                          ，{targetBMI < 18.5 ? '偏瘦' : '超重'}。
                        </p>
                        <p className="text-[11px] text-amber-600 mt-0.5">
                          健康 BMI 范围为 18.5 ~ 23.9，建议在该范围内设置目标。
                          当前设置仅供参考，请根据自身情况调整。
                        </p>
                      </div>
                    )}
                    {parseFloat(bmi) < 18.5 && profile.dietGoal.type === 'weight_gain' && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-700 text-[11px]">
                          💡 您当前 BMI 为 {bmi}（偏瘦），建议循序渐进增重，
                          已自动为您启用「温和健康档」，避免肠胃负担。
                          增重时以优质蛋白（鸡蛋、牛奶、瘦肉、豆制品）+ 主食为主，
                          避免高油高糖盲目堆热量。
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
            <button
              onClick={() => setShowGoalPicker(false)}
              className="w-full mt-4 bg-primary-500 text-white py-3 rounded-xl font-semibold"
            >
              完成设置
            </button>
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

      {/* 收藏菜系选择 */}
      {showFavCuisinePicker && (
        <div className={modalOverlayClass} onClick={() => setShowFavCuisinePicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">收藏喜欢的菜系</h3>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((item) => {
                const selected = (favorites?.cuisines || []).includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleFavoriteCuisine(item)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selected && '❤️ '}{item}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowFavCuisinePicker(false)}
              className="w-full mt-5 bg-primary-500 text-white py-3 rounded-xl font-semibold"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 收藏口味选择 */}
      {showFavTastePicker && (
        <div className={modalOverlayClass} onClick={() => setShowFavTastePicker(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">收藏喜欢的口味</h3>
            <div className="flex flex-wrap gap-2">
              {tasteOptions.map((item) => {
                const selected = (favorites?.tastes || []).includes(item)
                return (
                  <button
                    key={item}
                    onClick={() => toggleFavoriteTaste(item)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {selected && '❤️ '}{item}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowFavTastePicker(false)}
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

      {/* 登录弹窗 */}
      {showLoginModal && (
        <div className={modalOverlayClass} onClick={() => setShowLoginModal(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">🔐 登录账户</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="用户名"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                placeholder="密码"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              {authMsg && (
                <p className={`text-sm ${authMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {authMsg}
                </p>
              )}
              <button
                onClick={() => {
                  const res = loginAccount(loginUsername.trim(), loginPassword)
                  setAuthMsg(res.success ? `✅ ${res.msg}` : `❌ ${res.msg}`)
                  if (res.success) {
                    setTimeout(() => setShowLoginModal(false), 800)
                    setLoginUsername('')
                    setLoginPassword('')
                  }
                }}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition-transform"
              >
                登录
              </button>
              <p className="text-xs text-center text-gray-500">
                还没有账户？
                <button
                  onClick={() => {
                    setShowLoginModal(false)
                    setShowRegisterModal(true)
                    setAuthMsg('')
                  }}
                  className="text-primary-600 ml-1"
                >
                  去注册
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 注册弹窗 */}
      {showRegisterModal && (
        <div className={modalOverlayClass} onClick={() => setShowRegisterModal(false)}>
          <div className={modalContainerClass} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">✨ 注册账户</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="用户名（至少2个字符）"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                placeholder="密码（至少4个字符）"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              <input
                type="password"
                placeholder="确认密码"
                value={regPassword2}
                onChange={(e) => setRegPassword2(e.target.value)}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-300"
              />
              {authMsg && (
                <p className={`text-sm ${authMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {authMsg}
                </p>
              )}
              <button
                onClick={() => {
                  if (regPassword !== regPassword2) {
                    setAuthMsg('❌ 两次输入的密码不一致')
                    return
                  }
                  const res = registerAccount(regUsername.trim(), regPassword)
                  setAuthMsg(res.success ? `✅ ${res.msg}` : `❌ ${res.msg}`)
                  if (res.success) {
                    setTimeout(() => {
                      setShowRegisterModal(false)
                      setShowLoginModal(true)
                      setLoginUsername(regUsername.trim())
                    }, 800)
                    setRegUsername('')
                    setRegPassword('')
                    setRegPassword2('')
                  }
                }}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition-transform"
              >
                注册
              </button>
              <p className="text-xs text-center text-gray-500">
                已有账户？
                <button
                  onClick={() => {
                    setShowRegisterModal(false)
                    setShowLoginModal(true)
                    setAuthMsg('')
                  }}
                  className="text-primary-600 ml-1"
                >
                  去登录
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
