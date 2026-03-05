<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUserImage } from '@/composables/useUserImage'

const props = defineProps({
  match: Object,
  isFollowing: Boolean,
})

const emit = defineEmits(['toggleFollow'])
const auth = useAuthStore()
const { getProfileImage } = useUserImage()
</script>

<template>
  <li class="flex items-center justify-between py-2 border-b last:border-b-0">
    <router-link
      :to="{ name: 'profile', params: { username: match.username } }"
      class="flex items-center gap-3 hover:opacity-80"
    >
      <img :src="getProfileImage(match)" class="w-10 h-10 rounded-full object-cover" />
      <span class="font-medium">{{ match.firstname }} {{ match.lastname }}</span>
    </router-link>
    <button
      v-if="match.username !== auth.user.username"
      class="btn btn-sm btn-white"
      :class="isFollowing ? 'text-green' : ''"
      @click="emit('toggleFollow', match)"
    >
      <i class="icon icon-plus-circled"></i>
      <span class="ml-1">{{ isFollowing ? 'Following' : 'Follow' }}</span>
    </button>
  </li>
</template>
