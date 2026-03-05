<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import { useUserImage } from '@/composables/useUserImage'
import ChangeProfilePicture from '@/components/ChangeProfilePicture.vue'
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

    <!-- Website -->
    <div>
      <label class="block text-sm mb-1 text-darkgray">Website</label>
      <input type="text" class="form-control" v-model.trim="auth.user.socials.website" placeholder="https://yourwebsite.com" />
    </div>

    <!-- Preferences -->
    <section class="space-y-4">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">Preferences</h3>

      <div>
        <label class="block text-sm mb-1 text-darkgray">Calendar starts on</label>
        <select class="form-control" v-model="auth.user.calendar_start">
          <option value="6">Saturday</option>
          <option value="0">Sunday</option>
          <option value="1">Monday</option>
        </select>
      </div>
    </section>

    <!-- Save -->
    <button type="submit" class="btn btn-cta btn-block" :disabled="app.loading">
      {{ app.loading ? 'Saving...' : 'Save Changes' }}
    </button>
  </form>

  <!-- Toast -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="dismissCountDown > 0 && !alertMsg" class="fixed bottom-5 right-5 z-50 bg-nav text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium">
        Profile updated
      </div>
    </Transition>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="alertMsg" class="fixed bottom-5 right-5 z-50 bg-react text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium">
        {{ alertMsg }}
      </div>
    </Transition>
  </Teleport>
</template>
