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
    <ul>
      <li v-for="follow in auth.user.following" :key="follow.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
        <router-link :to="{ name: 'profile', params: { username: follow.username } }" class="flex items-center gap-3 hover:opacity-80">
          <img :src="getProfileImage(follow)" class="w-8 h-8 rounded-full object-cover" />
          <span>{{ follow.name }}</span>
        </router-link>
        <span class="icon icon-ok-circled text-green cursor-pointer" @click="handleRemove(follow)"></span>
      </li>
    </ul>

    <BaseModal v-model="showConfirm" size="sm">
      <p v-if="selectedUser">Remove {{ selectedUser.name }}?</p>
      <template #footer>
        <button class="btn btn-sm" @click="showConfirm = false">cancel</button>
        <button class="btn btn-sm btn-pink ml-2" @click="handleFollow">Yes</button>
      </template>
    </BaseModal>
  </div>
</template>
