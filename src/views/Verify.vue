<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { createGuest } from '@/models/guest'
import storejs from 'storejs'
import common from '@/helpers/common'

const router = useRouter()
const auth = useAuthStore()

const successMsg = ref('')
const alertMsg = ref('')
const showAlert = ref(false)

const emailToBeVerified = storejs.get(common.EMAIL_TO_BE_VERIFIED)

onBeforeMount(() => {
  if (!emailToBeVerified) {
    storejs.remove(common.EMAIL_TO_BE_VERIFIED)
    router.replace({ name: 'login' })
  }
})

onMounted(() => {
  if (emailToBeVerified) {
    auth.guest.email = emailToBeVerified
  }
})

async function handleSubmit() {
  showAlert.value = false
  try {
    await auth.verifyEmail()
    storejs.remove(common.EMAIL_TO_BE_VERIFIED)
    auth.setGuest(createGuest())
    router.replace({ name: 'feeds' })
  } catch (err) {
    alertMsg.value = err?.response?.data?.message || 'Verification failed'
    showAlert.value = true
  }
}

async function resendCode() {
  showAlert.value = false
  try {
    await auth.resendVerificationCode()
    successMsg.value = "We've sent a new code to: " + emailToBeVerified
    showAlert.value = true
  } catch (err) {
    alertMsg.value = err?.response?.data?.message || 'Failed to resend code'
    showAlert.value = true
  }
}
</script>

<template>
  <main class="min-h-screen bg-nav pt-20 px-4">
    <div class="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
      <h3 class="text-lg font-medium mb-3">Please verify your email address</h3>
      <p>
        We sent the verification code to
        <span class="font-medium text-cyan">{{ auth.guest.email }}</span>
      </p>
      <p class="text-sm text-gray-500 mt-1">Please check your spam or junk mail folder too!</p>

      <form @submit.prevent="handleSubmit" class="mt-4">
        <input type="text" class="form-control mb-3" placeholder="Verification Code" v-model.trim="auth.guest.verification_code" />
        <button type="submit" class="btn btn-cta">Submit</button>
      </form>

      <hr class="my-4" />

      <BaseAlert v-if="alertMsg" :show="showAlert" variant="danger" dismissible @dismissed="showAlert = false">
        {{ alertMsg }}
      </BaseAlert>
      <BaseAlert v-else-if="successMsg" :show="showAlert" variant="success" dismissible @dismissed="showAlert = false">
        {{ successMsg }}
      </BaseAlert>

      <p class="text-cyan cursor-pointer hover:underline" @click="resendCode">Resend code?</p>
      <p class="my-1">or</p>
      <router-link :to="{ name: 'login' }" class="text-cyan hover:underline">Go back</router-link>
    </div>
  </main>
</template>
