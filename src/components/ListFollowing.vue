<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useUserImage } from '@/composables/useUserImage'
import BaseModal from '@/components/ui/BaseModal.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()
const { getProfileImage } = useUserImage()

const selectedUser = ref(null)
const showConfirm = ref(false)

function handleRemove(follow) {
  selectedUser.value = follow
  showConfirm.value = true
}

function handleFollow() {
  usersStore.unfollowUser(selectedUser.value.username).then(() => {
    auth.user.following = auth.user.following.filter((f) => f.id !== selectedUser.value.id)
    selectedUser.value = null
    showConfirm.value = false
  })
}
</script>

<template>
  <div>
    <p v-if="!auth.user.following.length" class="text-sm text-darkgray text-center py-4">You're not following anyone yet.</p>

    <ul class="divide-y divide-border-light">
      <li v-for="follow in auth.user.following" :key="follow.id" class="flex items-center gap-3 py-3">
        <router-link :to="{ name: 'profile', params: { username: follow.username } }" class="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80">
          <img :src="getProfileImage(follow)" class="w-10 h-10 rounded-full object-cover shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ follow.name }}</p>
            <p class="text-xs text-darkgray truncate">@{{ follow.username }}</p>
          </div>
        </router-link>
        <button
          class="btn btn-sm btn-white text-react text-xs shrink-0"
          @click="handleRemove(follow)"
        >
          Unfollow
        </button>
      </li>
    </ul>

    <BaseModal v-model="showConfirm" size="sm">
      <p v-if="selectedUser">Unfollow <strong>{{ selectedUser.name }}</strong>?</p>
      <template #footer>
        <button class="btn btn-sm btn-light" @click="showConfirm = false">Cancel</button>
        <button class="btn btn-sm btn-pink ml-2" @click="handleFollow">Unfollow</button>
      </template>
    </BaseModal>
  </div>
</template>
