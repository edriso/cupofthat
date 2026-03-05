import { defineStore } from 'pinia'
import { USE_MOCKS } from '@/helpers/config'
import api from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
  async function updateProfile(request) {
    if (USE_MOCKS) return { data: { message: 'Profile updated' } }
    const { data } = await api.put('/profile', request)
    return { data }
  }

  async function updateEmail(request) {
    if (USE_MOCKS) return { data: { message: 'Email updated' } }
    const { data } = await api.put('/profile/email', request)
    return { data }
  }

  async function updateUsername(request) {
    if (USE_MOCKS) return { data: { message: 'Username updated' } }
    const { data } = await api.put('/profile/username', request)
    return { data }
  }

  async function updatePassword(request) {
    if (USE_MOCKS) return { data: { message: 'Password updated' } }
    const { data } = await api.put('/profile/password', request)
    return { data }
  }

  return { updateProfile, updateEmail, updateUsername, updatePassword }
})
