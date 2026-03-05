<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import { useUserImage } from '@/composables/useUserImage'
import ChangeProfilePicture from '@/components/ChangeProfilePicture.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const auth = useAuthStore()
const settings = useSettingsStore()
const app = useAppStore()
const { getProfileImage } = useUserImage()

const changeProfile = ref(null)
const dismissCountDown = ref(0)
const alertMsg = ref('')

const profileImage = computed(() => getProfileImage(auth.user))

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
  <form @submit.prevent="showUpdatedAlert" class="space-y-6">
    <!-- Profile Picture -->
    <div class="flex items-center gap-4">
      <img
        :src="profileImage"
        alt="profile picture"
        class="w-20 h-20 rounded-full object-cover border-2 border-border cursor-pointer hover:opacity-80 transition-opacity"
        @click="changeProfile?.openPicker()"
      />
      <div>
        <h2 class="text-lg font-semibold">{{ auth.user.name || 'Your Name' }}</h2>
        <button type="button" class="text-sm text-cyan hover:text-cyan-dark transition-colors" @click="changeProfile?.openPicker()">
          Change photo
        </button>
      </div>
      <ChangeProfilePicture ref="changeProfile" />
    </div>

    <!-- Personal Info -->
    <section class="space-y-4">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">Personal Info</h3>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1 text-darkgray">First Name</label>
          <input type="text" class="form-control" maxlength="14" v-model.trim="auth.user.firstname" placeholder="First name" />
        </div>
        <div>
          <label class="block text-sm mb-1 text-darkgray">Last Name</label>
          <input type="text" class="form-control" maxlength="14" v-model.trim="auth.user.lastname" placeholder="Optional" />
        </div>
      </div>

      <div>
        <label class="block text-sm mb-1 text-darkgray">Your Craft</label>
        <input type="text" class="form-control" maxlength="30" v-model.trim="auth.user.craft" placeholder="Artist, Developer, Teacher..." />
      </div>

      <div>
        <label class="block text-sm mb-1 text-darkgray">Bio</label>
        <textarea class="form-control" rows="3" maxlength="420" v-model.trim="auth.user.bio" placeholder="A few words about you"></textarea>
      </div>

      <div>
        <label class="block text-sm mb-1 text-darkgray">Birthday</label>
        <input type="date" class="form-control" v-model="auth.user.birthday" />
      </div>
    </section>

    <!-- Social Links -->
    <section class="space-y-4">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">Social Links</h3>

      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <i class="icon icon-facebook text-blue w-5 text-center"></i>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.facebook" placeholder="Facebook URL" />
        </div>
        <div class="flex items-center gap-2">
          <i class="icon icon-twitter text-cyan w-5 text-center"></i>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.twitter" placeholder="Twitter URL" />
        </div>
        <div class="flex items-center gap-2">
          <i class="icon icon-linkedin text-blue w-5 text-center"></i>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.linkedin" placeholder="LinkedIn URL" />
        </div>
        <div class="flex items-center gap-2">
          <i class="icon icon-globe text-darkgray w-5 text-center"></i>
          <input type="text" class="form-control" v-model.trim="auth.user.socials.website" placeholder="Website URL" />
        </div>
      </div>
    </section>

    <!-- Preferences -->
    <section class="space-y-4">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">Preferences</h3>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1 text-darkgray">Calendar starts on</label>
          <select class="form-control" v-model="auth.user.calendar_start">
            <option value="6">Saturday</option>
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1 text-darkgray">Calendar display</label>
          <select class="form-control" v-model="auth.user.calendar_display">
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Save -->
    <button type="submit" class="btn btn-cta btn-block" :disabled="app.loading">
      {{ app.loading ? 'Saving...' : 'Save Changes' }}
    </button>
  </form>

  <!-- Alerts -->
  <div class="fixed bottom-4 right-4 z-50">
    <BaseAlert v-if="!alertMsg" :show="dismissCountDown" variant="success" @dismissed="dismissCountDown = 0">
      Profile Updated!
    </BaseAlert>
    <BaseAlert v-if="alertMsg" :show="true" variant="danger">
      {{ alertMsg }}
    </BaseAlert>
  </div>
</template>
