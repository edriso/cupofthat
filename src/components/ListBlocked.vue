<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import BaseModal from '@/components/ui/BaseModal.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()

const selectedUser = ref(null)
const showConfirm = ref(false)

function handleRemove(blocked) {
  selectedUser.value = blocked
  showConfirm.value = true
}

function handleUnblock() {
  usersStore.unblockUser(selectedUser.value.username).then(() => {
    auth.user.blocklist = auth.user.blocklist.filter((b) => b.username !== selectedUser.value.username)
    selectedUser.value = null
    showConfirm.value = false
  })
}
</script>

<template>
  <div>
    <ul>
      <li v-for="blocked in auth.user.blocklist" :key="blocked.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
        <span>{{ blocked.name }}</span>
        <span class="icon icon-cancel-circled text-react cursor-pointer" @click="handleRemove(blocked)"></span>
      </li>
    </ul>

    <BaseModal v-model="showConfirm" size="sm">
      <p v-if="selectedUser">Unblock {{ selectedUser.name }}?</p>
      <template #footer>
        <button class="btn btn-sm" @click="showConfirm = false">cancel</button>
        <button class="btn btn-sm btn-pink ml-2" @click="handleUnblock">Yes</button>
      </template>
    </BaseModal>
  </div>
</template>
