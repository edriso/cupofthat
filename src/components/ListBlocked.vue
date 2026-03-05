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
    <p v-if="!auth.user.blocklist.length" class="text-sm text-darkgray text-center py-4">No blocked users.</p>

    <ul class="divide-y divide-border-light">
      <li v-for="blocked in auth.user.blocklist" :key="blocked.id" class="flex items-center gap-3 py-3">
        <div class="w-10 h-10 rounded-full bg-lightgray flex items-center justify-center shrink-0">
          <i class="icon icon-user text-gray"></i>
        </div>
        <p class="text-sm font-medium flex-1 min-w-0 truncate">{{ blocked.name }}</p>
        <button
          class="btn btn-sm btn-white text-xs shrink-0"
          @click="handleRemove(blocked)"
        >
          Unblock
        </button>
      </li>
    </ul>

    <BaseModal v-model="showConfirm" size="sm">
      <p v-if="selectedUser">Unblock <strong>{{ selectedUser.name }}</strong>?</p>
      <template #footer>
        <button class="btn btn-sm btn-light" @click="showConfirm = false">Cancel</button>
        <button class="btn btn-sm btn-pink ml-2" @click="handleUnblock">Unblock</button>
      </template>
    </BaseModal>
  </div>
</template>
