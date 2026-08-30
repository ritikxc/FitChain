// ============================================================
// api.js — All API calls to the FitChain backend
// ============================================================

const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://fitchain.onrender.com')).trim().replace(/\/$/, '')
const BASE_URL = API_BASE.endsWith('/api') ? API_BASE.replace(/\/api$/, '') : API_BASE

// ---------- Token Management ----------

export function getToken() {
  return localStorage.getItem('fitchain_token')
}

export function setToken(token) {
  localStorage.setItem('fitchain_token', token)
}

export function removeToken() {
  localStorage.removeItem('fitchain_token')
  localStorage.removeItem('fitchain_user')
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('fitchain_user')) || null
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  localStorage.setItem('fitchain_user', JSON.stringify(user))
}

// ---------- Core Fetch Helper ----------

async function request(endpoint, options = {}) {
  const token = getToken()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const normalizedEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`
  const res = await fetch(`${BASE_URL}${normalizedEndpoint}`, config)

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

// ---------- Auth ----------

export async function signUp({ name, email, password }) {
  const data = await request('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
  setToken(data.token)
  setStoredUser(data.user)
  return data.user
}

export async function login({ email, password }) {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  setStoredUser(data.user)
  return data.user
}

export function logout() {
  localStorage.removeItem('fitchain_onboarded')
  removeToken()
}

export async function getCurrentUser() {
  const cached = getStoredUser()
  if (!cached || !getToken()) return null

  try {
    const data = await request('/api/auth/me')
    setStoredUser(data.user)
    return data.user
  } catch (err) {
    if (err.message && (err.message.includes('authorized') || err.message.includes('expired') || err.message.includes('jwt') || err.message.includes('token'))) {
      removeToken()
      return null
    }
    // Return cached user on network / cold start errors so user is not logged out or blocked
    return cached
  }
}

export async function updateProfile(profileData = {}) {
  const data = await request('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  })
  const prevUser = getStoredUser() || {}
  const mergedUser = {
    ...prevUser,
    ...(data.user || {}),
    profile: {
      ...(prevUser.profile || {}),
      ...(data.user?.profile || {}),
      ...profileData,
    },
  }
  setStoredUser(mergedUser)
  if (profileData.profileCompleted || profileData.setupComplete) {
    localStorage.setItem('fitchain_onboarded', 'true')
  }
  return mergedUser
}

// ---------- Meals ----------

export async function getMealsForDate(date) {
  const data = await request(`/api/meals?date=${date}`)
  return data.meals
}

export async function addMeal(mealData) {
  const data = await request('/api/meals', {
    method: 'POST',
    body: JSON.stringify(mealData),
  })
  return data.meal
}

export async function deleteMeal(mealId) {
  await request(`/api/meals/${mealId}`, { method: 'DELETE' })
}

export async function getWeeklyData() {
  const data = await request('/api/meals/weekly')
  return data.weekly
}

// ---------- Workouts ----------

export async function getTodayWorkout(date) {
  const queryDate = date || getTodayString()
  try {
    const data = await request(`/api/workouts/today?date=${queryDate}`)
    return data.workout
  } catch {
    try {
      const local = JSON.parse(localStorage.getItem(`fitchain_workout_${queryDate}`))
      return local || null
    } catch {
      return null
    }
  }
}

export async function getWorkoutHistory() {
  try {
    const data = await request('/api/workouts/history')
    return data.workouts || []
  } catch {
    try {
      return JSON.parse(localStorage.getItem('fitchain_workout_history')) || []
    } catch {
      return []
    }
  }
}

export async function getMonthlyWorkouts() {
  try {
    const data = await request('/api/workouts/monthly')
    return data
  } catch {
    try {
      const history = JSON.parse(localStorage.getItem('fitchain_workout_history') || '[]')
      return { workouts: history, monthlyVolume: 0, totalWorkouts: history.length }
    } catch {
      return { workouts: [], monthlyVolume: 0, totalWorkouts: 0 }
    }
  }
}

export async function logWorkout(workoutData) {
  const queryDate = workoutData.date || getTodayString()
  const setsTotal = workoutData.exercises?.reduce((sum, ex) => {
    const sets = Number(ex.sets) || 0
    const reps = Number(String(ex.reps).match(/\d+/)?.[0]) || 10
    const weight = Number(ex.weight) || 0
    return sum + sets * reps * weight
  }, 0) || 0
  const completedCount = workoutData.exercises?.filter((ex) => ex.completed).length || 0

  const localObj = {
    ...workoutData,
    totalVolume: setsTotal,
    completedExercises: completedCount,
    totalExercises: workoutData.exercises?.length || 0,
    isCompleted: workoutData.isCompleted ?? false,
  }

  try {
    localStorage.setItem(`fitchain_workout_${queryDate}`, JSON.stringify(localObj))
    const history = JSON.parse(localStorage.getItem('fitchain_workout_history') || '[]')
    const existingIdx = history.findIndex((h) => h.date === queryDate)
    if (existingIdx >= 0) history[existingIdx] = localObj
    else history.unshift(localObj)
    localStorage.setItem('fitchain_workout_history', JSON.stringify(history.slice(0, 30)))
  } catch {}

  try {
    const data = await request('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    })
    return data.workout || localObj
  } catch {
    return localObj
  }
}

// ---------- Water ----------

export async function getTodayWater(date) {
  const queryDate = date || getTodayString()
  try {
    const data = await request(`/api/water?date=${queryDate}`)
    return data.amount || 0
  } catch {
    try {
      const val = localStorage.getItem(`fitchain_water_${queryDate}`)
      return val ? Number(val) : 0
    } catch {
      return 0
    }
  }
}

export async function logWater(amount, date) {
  const queryDate = date || getTodayString()
  const num = Number(amount)
  try {
    localStorage.setItem(`fitchain_water_${queryDate}`, String(num))
  } catch {}

  try {
    const data = await request('/api/water', {
      method: 'POST',
      body: JSON.stringify({ amount: num, date: queryDate }),
    })
    return data.amount ?? num
  } catch {
    return num
  }
}

export async function getMonthlyWater() {
  try {
    const data = await request('/api/water/monthly')
    return data.monthly || []
  } catch {
    return []
  }
}

// ---------- Utilities ----------

export function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

export function sumMacros(meals) {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  )
}