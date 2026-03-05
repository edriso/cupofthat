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
  <li class="flex items-center gap-3 px-4 py-3">
    <router-link
      :to="{ name: 'profile', params: { username: match.username } }"
      class="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80"
    >
      <img :src="getProfileImage(match)" class="w-10 h-10 rounded-full object-cover shrink-0" />
      <div class="min-w-0">
        <p class="text-sm font-medium truncate">{{ match.firstname }} {{ match.lastname }}</p>
        <p class="text-xs text-darkgray truncate">@{{ match.username }}</p>
      </div>
    </router-link>
    <button
      v-if="match.username !== auth.user.username"
      class="btn btn-sm text-xs shrink-0"
      :class="isFollowing ? 'bg-nav/10 text-nav' : 'btn-white'"
      @click="emit('toggleFollow', match)"
    >
      {{ isFollowing ? 'Following' : 'Follow' }}
    </button>
  </li>
</template>
