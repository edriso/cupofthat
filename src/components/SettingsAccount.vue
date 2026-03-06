<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useAppStore } from '@/stores/app'
import { createGuest } from '@/models/guest'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import ListBlocked from '@/components/ListBlocked.vue'

const auth = useAuthStore()
const settings = useSettingsStore()
const app = useAppStore()

const guest = ref(createGuest())
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

const accountItems = [
  { label: 'Change Password', icon: 'icon-cog', action: () => (showPassword.value = true) },
  { label: 'Change Username', icon: 'icon-user', action: () => openUsername() },
  { label: 'Change Email', icon: 'icon-link', action: () => (showEmail.value = true) },
]

const listItems = [
  { label: 'Blocked', icon: 'icon-cancel-circled', count: () => auth.user.blocklist.length, action: () => (showBlocked.value = true) },
]
</script>

<template>
  <div class="space-y-6">
    <!-- Account -->
    <section class="space-y-2">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">Account</h3>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden divide-y divide-border-light">
        <button
          v-for="item in accountItems"
          :key="item.label"
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg transition-colors text-left"
          @click="item.action"
        >
          <i :class="['icon', item.icon, 'text-darkgray']"></i>
          <span class="text-sm">{{ item.label }}</span>
        </button>
      </div>
    </section>

    <!-- People Lists -->
    <section class="space-y-2">
      <h3 class="text-sm font-semibold text-darkgray uppercase tracking-wide">People</h3>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden divide-y divide-border-light">
        <button
          v-for="item in listItems"
          :key="item.label"
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg transition-colors text-left"
          @click="item.action"
        >
          <i :class="['icon', item.icon, 'text-darkgray']"></i>
          <span class="text-sm">{{ item.label }}</span>
          <span class="ml-auto bg-bg text-darkgray text-xs font-medium px-2 py-0.5 rounded-full">{{ item.count() }}</span>
        </button>
      </div>
    </section>
  </div>

  <!-- Modals -->
  <BaseModal v-model="showBlocked" :title="`Blocked (${auth.user.blocklist.length})`" hideFooter>
    <ListBlocked />
  </BaseModal>

  <BaseModal v-model="showPassword" title="Change Password">
    <BaseAlert v-if="showPasswordAlert" :show="true" variant="danger" dismissible @dismissed="showPasswordAlert = false">
      {{ msgAlert }}
    </BaseAlert>
    <div class="space-y-3">
      <input type="password" class="form-control" placeholder="Current Password" v-model="guest.old_password" />
      <input type="password" class="form-control" placeholder="New Password" v-model="guest.password" />
      <input type="password" class="form-control" placeholder="Confirm New Password" v-model="guest.password_confirmation" />
    </div>
    <template #footer>
      <button class="btn btn-sm btn-cta" :disabled="app.loading" @click="handlePassword">
        {{ app.loading ? 'Updating...' : 'Update Password' }}
      </button>
    </template>
  </BaseModal>

  <BaseModal v-model="showUsername" title="Change Username">
    <BaseAlert v-if="showUsernameAlert" :show="true" variant="danger" dismissible @dismissed="showUsernameAlert = false">
      {{ msgAlert }}
    </BaseAlert>
    <div class="space-y-2">
      <input type="text" class="form-control" minlength="6" maxlength="20" placeholder="New username" v-model.trim="guest.username" />
      <p class="text-xs text-darkgray">cupofthat.com/profile/{{ guest.username || '...' }}</p>
    </div>
    <template #footer>
      <button class="btn btn-sm btn-cta" :disabled="app.loading" @click="handleUsername">
        {{ app.loading ? 'Updating...' : 'Update Username' }}
      </button>
    </template>
  </BaseModal>

  <BaseModal v-model="showEmail" title="Change Email">
    <BaseAlert v-if="showEmailAlert" :show="true" variant="danger" dismissible @dismissed="showEmailAlert = false">
      {{ msgAlert }}
    </BaseAlert>
    <div class="space-y-3">
      <input type="email" class="form-control" placeholder="Current Email" v-model.trim="guest.email" />
      <input type="email" class="form-control" placeholder="New Email" v-model.trim="guest.new_email" />
      <input type="password" class="form-control" placeholder="Confirm Password" v-model.trim="guest.password" />
    </div>
    <template #footer>
      <button class="btn btn-sm btn-cta" :disabled="app.loading" @click="handleEmail">
        {{ app.loading ? 'Updating...' : 'Update Email' }}
      </button>
    </template>
  </BaseModal>
</template>
