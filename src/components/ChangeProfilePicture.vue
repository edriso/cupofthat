<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import BaseModal from '@/components/ui/BaseModal.vue'

const usersStore = useUsersStore()
const auth = useAuthStore()

const showModal = ref(false)
const fileInput = ref(null)

function openPicker() {
  showModal.value = true
}

async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const res = await usersStore.setProfileImage(file)
  if (usersStore.author.id === auth.user.id) {
    auth.updateUserProfileImage(res.data.message)
  }
  showModal.value = false
}

defineExpose({ openPicker })
</script>

<template>
  <BaseModal v-model="showModal" title="Change Profile Picture" hideFooter>
    <div class="text-center">
      <p class="mb-4 text-darkgray">Select a new profile picture</p>
      <label class="btn btn-success cursor-pointer">
        Choose File
        <input ref="fileInput" type="file" accept="image/jpeg, image/png, image/gif" class="hidden" @change="handleFile" />
      </label>
    </div>
  </BaseModal>
</template>
