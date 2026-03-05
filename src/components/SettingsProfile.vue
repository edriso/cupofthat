<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const settings = useSettingsStore()
const app = useAppStore()

const dismissCountDown = ref(0)
const alertMsg = ref('')

async function showUpdatedAlert() {
  alertMsg.value = ''
  try {
    await settings.updateProfile(auth.user.updateRequest ? auth.user.updateRequest() : auth.user)
    dismissCountDown.value = 2
  } catch (err) {
    alertMsg.value = err?.response?.data?.message || 'Update failed'
  }
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <form @submit.prevent="showUpdatedAlert">
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">First Name or Nickname</label>
          <input type="text" class="form-control" maxlength="14" v-model.trim="auth.user.firstname" placeholder="What's your first name or nickname?" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Last Name</label>
          <input type="text" class="form-control" maxlength="14" v-model.trim="auth.user.lastname" placeholder="Your last name *Optional*" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Your Thing <small class="text-gray">(What is your craft?)</small></label>
          <input type="text" class="form-control" maxlength="30" v-model.trim="auth.user.craft" placeholder="Artist, Doctor, Teacher, Web Developer, etc.." />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Bio</label>
          <textarea class="form-control" rows="3" maxlength="420" v-model.trim="auth.user.bio" placeholder="Tell us about you"></textarea>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Facebook</label>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.facebook" placeholder="https://www.facebook.com/username" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Twitter</label>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.twitter" placeholder="https://www.twitter.com/username" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">LinkedIn</label>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.linkedin" placeholder="https://www.linkedin.com/in/username" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Website or Portfolio</label>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.website" placeholder="https://www.website.com" />
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Calendar Starts on</label>
          <select class="form-control" v-model="auth.user.calendar_start">
            <option value="6">Saturday</option>
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Calendar Display</label>
          <select class="form-control" v-model="auth.user.calendar_display">
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Birthday</label>
          <input type="date" class="form-control" v-model="auth.user.birthday" />
        </div>
        <button type="submit" class="btn btn-success btn-block">
          {{ app.loading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
    </div>

    <div class="fixed bottom-4 right-4 z-50">
      <BaseAlert v-if="!alertMsg" :show="dismissCountDown" variant="success" @dismissed="dismissCountDown = 0">
        <span>Profile Updated!</span>
      </BaseAlert>
      <BaseAlert v-if="alertMsg" :show="true" variant="danger">
        <span>{{ alertMsg }}</span>
      </BaseAlert>
    </div>
  </div>
</template>
