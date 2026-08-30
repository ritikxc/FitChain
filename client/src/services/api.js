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
  setStoredUser(data.user)
  return data.user
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
  const data = await request(`/api/workouts/today?date=${queryDate}`)
  return data.workout
}

export async function getWorkoutHistory() {
  const data = await request('/api/workouts/history')
  return data.workouts || []
}

export async function getMonthlyWorkouts() {
  const data = await request('/api/workouts/monthly')
  return data
}

export async function logWorkout(workoutData) {
  const data = await request('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(workoutData),
  })
  return data.workout
}

// ---------- Water ----------

export async function getTodayWater(date) {
  const queryDate = date || getTodayString()
  const data = await request(`/api/water?date=${queryDate}`)
  return data.amount || 0
}

export async function logWater(amount, date) {
  const queryDate = date || getTodayString()
  const data = await request('/api/water', {
    method: 'POST',
    body: JSON.stringify({ amount: Number(amount), date: queryDate }),
  })
  return data.amount
}

export async function getMonthlyWater() {
  const data = await request('/api/water/monthly')
  return data.monthly || []
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