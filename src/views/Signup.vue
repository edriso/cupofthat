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

const router = useRouter()
const auth = useAuthStore()
const app = useAppStore()

const alertMsg = ref('')
const showAlert = ref(false)

const schema = yup.object({
  name: yup.string().required('Please enter your first name or nickname').max(14, 'Max 14 characters'),
  username: yup.string().required('Please enter your Username').min(8, 'Username should be at least 8 chars'),
  email: yup.string().required('Please enter your email').email('Please enter a valid email'),
  password: yup.string().required('Please enter your password').min(8, 'Password should be at least 8 chars'),
  password_confirmation: yup.string().required('Please confirm your password').oneOf([yup.ref('password')], 'Passwords do not match'),
})

const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: name } = useField('name')
const { value: username } = useField('username')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: password_confirmation } = useField('password_confirmation')

const handleRegister = handleSubmit(async (values) => {
  alertMsg.value = ''
  auth.guest = createGuest(values)
  try {
    await auth.signup()
    storejs.set(common.EMAIL_TO_BE_VERIFIED, values.email)
    router.replace({ name: 'verify' })
  } catch (err) {
    alertMsg.value = err?.response?.data?.message || 'Registration failed'
    showAlert.value = true
  }
})
</script>

<template>
  <LoginTemplate>
    <template #header>
      <p class="text-center text-white mb-2">
        &ldquo;Join us and start your learning journey!&rdquo;
      </p>
    </template>

    <template #default>
      <BaseAlert v-if="alertMsg" :show="showAlert" variant="danger">
        <p>{{ alertMsg }}</p>
      </BaseAlert>
      <BaseAlert v-else-if="app.loading" :show="true" variant="success">
        <p>Welcome on board<span v-if="name">, {{ name }}</span>!</p>
      </BaseAlert>

      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <input class="form-control" type="text" v-model="name" placeholder="First name or Nickname" maxlength="14" />
          <p v-if="errors.name" class="invalid-feedback">{{ errors.name }}</p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="text" v-model="username" placeholder="Username" minlength="8" maxlength="20" />
          <p v-if="errors.username" class="invalid-feedback">{{ errors.username }}</p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="text" v-model="email" placeholder="Email Address" />
          <p v-if="errors.email" class="invalid-feedback">{{ errors.email }}</p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="password" v-model="password" placeholder="Password" />
          <p v-if="errors.password" class="invalid-feedback">{{ errors.password }}</p>
        </div>
        <div class="mb-3">
          <input class="form-control" type="password" v-model="password_confirmation" placeholder="Confirm Password" />
          <p v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation }}</p>
        </div>
        <button class="btn btn-cta btn-block" type="submit" :disabled="app.loading">
          {{ app.loading ? 'Signing you up...' : 'Sign Up' }}
        </button>
      </form>
      <div class="text-center mt-2 pt-1">
        <router-link :to="{ name: 'login' }" class="gray-text text-sm">
          Already have an account? <span class="text-white">Login</span>
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
