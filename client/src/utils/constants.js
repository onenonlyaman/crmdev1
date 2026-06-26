/**
 * utils/constants.js
 * Shared utility helpers for localStorage persistence.
 */

export const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    console.warn('localStorage save failed:', key)
  }
}
