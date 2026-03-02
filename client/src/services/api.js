// ============================================================
// api.js — All API calls to the FitChain backend
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'https://fitchain.onrender.com'

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

  const res = await fetch(`${BASE_URL}${endpoint}`, config)

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
  } catch {
    removeToken()
    return null
  }
}

export async function updateProfile({ goal, location, calorieGoal }) {
  const data = await request('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify({ goal, location, calorieGoal }),
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