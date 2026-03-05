<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import { createGuest } from '@/models/guest'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import ListFollowing from '@/components/ListFollowing.vue'
import ListFollowers from '@/components/ListFollowers.vue'
import ListBlocked from '@/components/ListBlocked.vue'

const auth = useAuthStore()
const settings = useSettingsStore()
const app = useAppStore()

const guest = ref(createGuest())
const showFollowing = ref(false)
const showFollowers = ref(false)
const showBlocked = ref(false)
const showPassword = ref(false)
const showUsername = ref(false)
const showEmail = ref(false)
const msgAlert = ref('')
const showPasswordAlert = ref(false)
const showUsernameAlert = ref(false)
const showEmailAlert = ref(false)

async function handlePassword() {
  try {
    await settings.updatePassword(guest.value.updatePasswordRequest())
    guest.value = createGuest()
    showPasswordAlert.value = false
    showPassword.value = false
  } catch (err) {
    showPasswordAlert.value = true
    msgAlert.value = err?.response?.data?.message || 'Update failed'
  }
}

async function handleUsername() {
  try {
    await settings.updateUsername(guest.value.updateUsernameRequest())
    auth.user.username = guest.value.username
    guest.value = createGuest()
    showUsernameAlert.value = false
    showUsername.value = false
  } catch (err) {
    showUsernameAlert.value = true
    msgAlert.value = err?.response?.data?.message || 'Update failed'
  }
}

async function handleEmail() {
  try {
    await settings.updateEmail(guest.value.updateEmailRequest())
    guest.value = createGuest()
    showEmailAlert.value = false
    showEmail.value = false
  } catch (err) {
    showEmailAlert.value = true
    msgAlert.value = err?.response?.data?.message || 'Update failed'
  }
}

function openUsername() {
  guest.value.username = auth.user.username
  showUsername.value = true
}
</script>

<template>
  <div>
    <div class="max-w-md mx-auto">
      <ul class="bg-white rounded-lg shadow divide-y">
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="showFollowing = true">Following List</li>
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="showFollowers = true">Followers List</li>
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="showBlocked = true">Blocked List</li>
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="showPassword = true">Change Password</li>
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="openUsername">Change Username</li>
        <li class="px-4 py-3 cursor-pointer hover:bg-gray-50" @click="showEmail = true">Change Email</li>
      </ul>
    </div>

    <BaseModal v-model="showFollowing" :title="`Following List (${auth.user.following.length})`" hideFooter hideBackdrop>
      <ListFollowing />
    </BaseModal>

    <BaseModal v-model="showFollowers" :title="`Followers List (${auth.user.followers.length})`" hideFooter hideBackdrop>
      <ListFollowers />
    </BaseModal>

    <BaseModal v-model="showBlocked" :title="`Blocked List (${auth.user.blocklist.length})`" hideFooter hideBackdrop>
      <ListBlocked />
    </BaseModal>

    <BaseModal v-model="showPassword" title="Change Password" hideBackdrop>
      <BaseAlert v-if="showPasswordAlert" :show="true" variant="danger" dismissible @dismissed="showPasswordAlert = false">
        {{ msgAlert }}
      </BaseAlert>
      <div class="space-y-3">
        <input type="password" class="form-control" placeholder="Current Password" v-model="guest.old_password" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="password" class="form-control" placeholder="New Password" v-model="guest.password" />
          <input type="password" class="form-control" placeholder="Confirm New Password" v-model="guest.password_confirmation" />
        </div>
      </div>
      <template #footer>
        <button class="btn btn-sm btn-success" :disabled="app.loading" @click="handlePassword">
          {{ app.loading ? 'Updating...' : 'Update' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="showUsername" title="Change Username" hideBackdrop>
      <BaseAlert v-if="showUsernameAlert" :show="true" variant="danger" dismissible @dismissed="showUsernameAlert = false">
        {{ msgAlert }}
      </BaseAlert>
      <input type="text" class="form-control" minlength="6" maxlength="20" placeholder="Cupofthat.com/username" v-model.trim="guest.username" />
      <template #footer>
        <button class="btn btn-sm btn-success" :disabled="app.loading" @click="handleUsername">
          {{ app.loading ? 'Updating...' : 'Update' }}
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="showEmail" title="Change Email" hideBackdrop>
      <BaseAlert v-if="showEmailAlert" :show="true" variant="danger" dismissible @dismissed="showEmailAlert = false">
        {{ msgAlert }}
      </BaseAlert>
      <div class="space-y-3">
        <input type="email" class="form-control" placeholder="Current Email" v-model.trim="guest.email" />
        <input type="email" class="form-control" placeholder="New Email" v-model.trim="guest.new_email" />
        <input type="password" class="form-control" placeholder="Confirm Password" v-model.trim="guest.password" />
      </div>
      <template #footer>
        <button class="btn btn-sm btn-success" :disabled="app.loading" @click="handleEmail">
          {{ app.loading ? 'Updating...' : 'Update' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>
