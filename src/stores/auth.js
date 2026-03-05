import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createUser } from '@/models/user'
import { createGuest } from '@/models/guest'
import { MOCK_TOKEN, MOCK_USER } from '@/mock/data'
import { useDatetime } from '@/composables/useDatetime'
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

  async function signup() {
    token.value = MOCK_TOKEN
    user.value = createUser(MOCK_USER)
    storejs.set(common.STORAGE_TOKEN_KEY, MOCK_TOKEN)
    return { data: { token: MOCK_TOKEN, user: MOCK_USER } }
  }

  async function signin() {
    token.value = MOCK_TOKEN
    user.value = createUser(MOCK_USER)
    storejs.set(common.STORAGE_TOKEN_KEY, MOCK_TOKEN)
    return { data: { token: MOCK_TOKEN, user: MOCK_USER } }
  }

  async function attempt(t) {
    if (t) token.value = t
    user.value = createUser(MOCK_USER)
  }

  async function verifyEmail() {
    return { data: { message: 'Email verified' } }
  }

  async function resendVerificationCode() {
    return { data: { message: 'Code resent' } }
  }

  async function forgotPassword() {
    return { data: { message: 'Reset link sent' } }
  }

  async function resetGuestPassword() {
    return { data: { message: 'Password reset' } }
  }

  async function signout() {
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
