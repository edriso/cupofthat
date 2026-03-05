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
const successMsg = ref('')

auth.setGuest(createGuest())

async function handleSubmit() {
  const g = auth.guest
  if (g.verification_code && g.password && g.password_confirmation) {
    alertMsg.value = ''
    showAlert.value = false
    try {
      await auth.resetGuestPassword()
      successMsg.value = 'Your password has successfully been reset. You will be redirected to Login.'
      setTimeout(() => router.replace({ name: 'login' }), 2000)
    } catch (err) {
      alertMsg.value = err?.response?.data?.message || 'Reset failed'
      showAlert.value = true
    }
  } else {
    showAlert.value = true
    alertMsg.value = 'Please fill all the fields below'
  }
}
</script>

<template>
  <LoginTemplate>
    <template #default>
      <BaseAlert v-if="alertMsg" :show="showAlert" variant="danger" dismissible @dismissed="showAlert = false">
        {{ alertMsg }}
      </BaseAlert>
      <BaseAlert v-if="successMsg" :show="true" variant="success" dismissible>
        {{ successMsg }}
      </BaseAlert>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <p class="text-white/80"><span>{{ auth.guest.email }}</span></p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="text" v-model.lazy="auth.guest.verification_code" placeholder="Verification Code" maxlength="8" autocomplete="off" />
        </div>
        <div class="mb-3">
          <input class="form-control" type="password" v-model.lazy="auth.guest.password" placeholder="Password" autocomplete="off" />
        </div>
        <div class="mb-3">
          <input class="form-control" type="password" v-model.lazy="auth.guest.password_confirmation" placeholder="Confirm Password" autocomplete="off" />
        </div>
        <button class="btn btn-cta btn-block" type="submit">
          {{ app.loading ? 'Resetting...' : 'Reset Password' }}
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
