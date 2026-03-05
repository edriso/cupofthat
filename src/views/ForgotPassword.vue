<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import LoginTemplate from '@/components/LoginTemplate.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { createGuest } from '@/models/guest'

const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const alertMsg = ref('')
const showAlert = ref(false)
const errMsg = ref('')

auth.setGuest(createGuest())

async function handleSubmit() {
  if (auth.guest.email) {
    errMsg.value = ''
    try {
      await auth.forgotPassword()
      alertMsg.value = "We've sent you a reset link!"
      showAlert.value = true
      setTimeout(() => {
        router.replace({ name: 'resetPassword' })
      }, 2000)
    } catch (err) {
      errMsg.value = err?.response?.data?.message || 'Failed to send reset link'
    }
  } else {
    errMsg.value = 'Please enter your email'
  }
}
</script>

<template>
  <LoginTemplate>
    <template #header>
      <p class="text-center text-white mb-2">
        &ldquo;Don't worry, we've got you covered!&rdquo;
      </p>
    </template>

    <template #default>
      <BaseAlert v-if="alertMsg" :show="showAlert" variant="success" dismissible @dismissed="showAlert = false">
        {{ alertMsg }}
      </BaseAlert>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3 text-center">
          <h5 class="text-white/80">It's ok if you forgot your password!</h5>
          <p v-if="errMsg" class="invalid-feedback">{{ errMsg }}</p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="email" v-model.trim="auth.guest.email" placeholder="Email Address" autocomplete="off" />
        </div>
        <button class="btn btn-cta btn-block" type="submit">
          {{ app.loading ? 'Processing...' : 'Reset Password' }}
        </button>
      </form>
      <div class="text-center mt-2 pt-1">
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
