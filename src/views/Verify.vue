<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginTemplate from '@/components/LoginTemplate.vue'
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
  <LoginTemplate>
    <template #header>
      <p class="text-center text-white mb-2">
        &ldquo;Almost there!&rdquo;
      </p>
    </template>

    <template #default>
      <BaseAlert v-if="alertMsg" :show="showAlert" variant="danger" dismissible @dismissed="showAlert = false">
        {{ alertMsg }}
      </BaseAlert>
      <BaseAlert v-else-if="successMsg" :show="showAlert" variant="success" dismissible @dismissed="showAlert = false">
        {{ successMsg }}
      </BaseAlert>

      <div class="text-center mb-4">
        <p class="text-white/80 text-sm">We sent a verification code to</p>
        <p class="text-white font-medium">{{ auth.guest.email }}</p>
        <p class="text-white/50 text-xs mt-1">Check your spam or junk folder too!</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <input type="text" class="form-control text-center tracking-widest" placeholder="Verification Code" v-model.trim="auth.guest.verification_code" maxlength="8" autocomplete="off" />
        </div>
        <button type="submit" class="btn btn-cta btn-block">Verify</button>
      </form>

      <div class="flex justify-between items-center mt-3 pt-1">
        <p class="text-sm cursor-pointer hover:underline gray-text" @click="resendCode">Resend code</p>
        <router-link :to="{ name: 'login' }" class="gray-text text-sm">
          Back to <span class="text-white">Login</span>
        </router-link>
      </div>
    </template>

    <template #footer>
      <h6 class="text-center text-sm mt-2">
        <router-link :to="{ name: 'about' }" class="gray-text">About Us</router-link>
      </h6>
    </template>
  </LoginTemplate>
</template>
