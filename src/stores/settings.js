import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  async function updateProfile() {
    return { data: { message: 'Profile updated' } }
  }

  async function updateEmail() {
    return { data: { message: 'Email updated' } }
  }

  async function updateUsername() {
    return { data: { message: 'Username updated' } }
  }

  async function updatePassword() {
    return { data: { message: 'Password updated' } }
  }

  return { updateProfile, updateEmail, updateUsername, updatePassword }
})
