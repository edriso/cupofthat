<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import LoginTemplate from '@/components/LoginTemplate.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { createGuest } from '@/models/guest'
import storejs from 'storejs'
import common from '@/helpers/common'
import loginBg from '@/assets/login.jpg'

const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const alertMsg = ref('')
const photographer = 'Vlada Karpovich'

const schema = yup.object({
  email: yup.string().required('Please enter your email').email('Please enter a valid email'),
  password: yup.string().required('Please enter your password').min(8, 'Password should be at least 8 chars'),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: email } = useField('email')
const { value: password } = useField('password')

const handleLogin = handleSubmit(async (values) => {
  alertMsg.value = ''
  auth.guest = createGuest({ email: values.email, password: values.password })
  try {
    await auth.signin()
    if (auth.user.is_verified) {
      router.replace({ name: 'feeds' })
    } else {
      storejs.set(common.EMAIL_TO_BE_VERIFIED, auth.user.email)
      router.replace({ name: 'verify' })
    }
  } catch (err) {
    alertMsg.value = err?.response?.data?.message || 'Login failed'
  }
})
</script>

<template>
  <LoginTemplate :bgImage="loginBg">
    <template #header>
      <p class="text-center text-white mb-2">
        &ldquo;5-Minute of learning today is better than none!&rdquo;
      </p>
    </template>

    <template #default>
      <BaseAlert v-if="alertMsg" :show="true" variant="danger">
        {{ alertMsg }}
      </BaseAlert>
      <BaseAlert v-else-if="app.loading" :show="true" variant="success">
        Welcome back!
      </BaseAlert>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <input
            class="form-control"
            type="text"
            v-model="email"
            placeholder="Email Address"
          />
          <p v-if="errors.email" class="invalid-feedback">{{ errors.email }}</p>
        </div>
        <div class="mb-3">
          <input
            class="form-control"
            type="password"
            autocomplete="off"
            v-model="password"
            placeholder="Password"
          />
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <button
          class="btn btn-yellow btn-block"
          type="submit"
          :disabled="app.loading"
        >
          {{ app.loading ? 'Login...' : 'Login' }}
        </button>
      </form>
      <div class="flex justify-between items-center mt-2 pt-1">
        <router-link :to="{ name: 'forgotPassword' }" class="text-sm gray-text">
          Forgot Password?
        </router-link>
        <router-link :to="{ name: 'signup' }" class="text-sm gray-text">
          New?<span class="text-nav font-medium"> Sign Up!</span>
        </router-link>
      </div>
    </template>

    <template #footer>
      <h6 class="text-center text-sm mt-2">
        <router-link :to="{ name: 'about' }" class="gray-text">About Us</router-link>
      </h6>
      <p v-if="photographer" class="text-center text-xs text-gray-400 mt-1">
        Photo by {{ photographer }}
      </p>
    </template>
  </LoginTemplate>
</template>
