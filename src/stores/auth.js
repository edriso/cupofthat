import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createUser } from '@/models/user'
import { createGuest } from '@/models/guest'
import { MOCK_TOKEN, MOCK_USER } from '@/mock/data'
import { USE_MOCKS } from '@/helpers/config'
import { useDatetime } from '@/composables/useDatetime'
import api from '@/services/api'
import storejs from 'storejs'
import common from '@/helpers/common'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(createUser())
  const guest = ref(createGuest())

  const { hasPostedToday } = useDatetime()

  const authenticated = computed(() => token.value !== null && user.value.id !== null)

  const hasNotPostedToday = computed(() => {
    if (user.value.last_post_date) {
      return !hasPostedToday(user.value.last_post_date)
    }
    return true
  })

  async function signup(request) {
    if (USE_MOCKS) {
      token.value = MOCK_TOKEN
      user.value = createUser(MOCK_USER)
      storejs.set(common.STORAGE_TOKEN_KEY, MOCK_TOKEN)
      return { data: { token: MOCK_TOKEN, user: MOCK_USER } }
    }
    const { data } = await api.post('/register', request)
    token.value = data.token
    user.value = createUser(data.user)
    storejs.set(common.STORAGE_TOKEN_KEY, data.token)
    return { data }
  }

  async function signin(request) {
    if (USE_MOCKS) {
      token.value = MOCK_TOKEN
      user.value = createUser(MOCK_USER)
      storejs.set(common.STORAGE_TOKEN_KEY, MOCK_TOKEN)
      return { data: { token: MOCK_TOKEN, user: MOCK_USER } }
    }
    const { data } = await api.post('/login', request)
    token.value = data.token
    user.value = createUser(data.user)
    storejs.set(common.STORAGE_TOKEN_KEY, data.token)
    return { data }
  }

  async function attempt(t) {
    if (t) token.value = t
    if (USE_MOCKS) {
      user.value = createUser(MOCK_USER)
      return
    }
    const { data } = await api.get('/me')
    user.value = createUser(data.user)
  }

  async function verifyEmail(request) {
    if (USE_MOCKS) return { data: { message: 'Email verified' } }
    const { data } = await api.post('/verify-email', request)
    return { data }
  }

  async function resendVerificationCode(request) {
    if (USE_MOCKS) return { data: { message: 'Code resent' } }
    const { data } = await api.post('/resend-code', request)
    return { data }
  }

  async function forgotPassword(request) {
    if (USE_MOCKS) return { data: { message: 'Reset link sent' } }
    const { data } = await api.post('/forgot-password', request)
    return { data }
  }

  async function resetGuestPassword(request) {
    if (USE_MOCKS) return { data: { message: 'Password reset' } }
    const { data } = await api.post('/reset-password', request)
    return { data }
  }

  async function signout() {
    if (!USE_MOCKS) {
      await api.post('/logout').catch(() => {})
    }
    token.value = null
    user.value = createUser()
    storejs.remove(common.STORAGE_TOKEN_KEY)
    return { data: { message: 'Signed out' } }
  }

  function setGuest(g) {
    guest.value = g
  }

  function updateUserProfileImage(image) {
    const idx = user.value.images.findIndex((i) => i.type === 'user_profiles')
    if (idx !== -1) user.value.images[idx].image = image
  }

  return {
    token,
    user,
    guest,
    authenticated,
    hasNotPostedToday,
    signup,
    signin,
    attempt,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetGuestPassword,
    signout,
    setGuest,
    updateUserProfileImage,
  }
})
