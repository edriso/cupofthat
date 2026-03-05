<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUserImage } from '@/composables/useUserImage'

const auth = useAuthStore()
const { getProfileImage } = useUserImage()
</script>

<template>
  <div>
    <p v-if="!auth.user.followers.length" class="text-sm text-darkgray text-center py-4">No followers yet.</p>

    <ul class="divide-y divide-border-light">
      <li v-for="follow in auth.user.followers" :key="follow.id" class="flex items-center gap-3 py-3">
        <router-link :to="{ name: 'profile', params: { username: follow.username } }" class="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80">
          <img :src="getProfileImage(follow)" class="w-10 h-10 rounded-full object-cover shrink-0" />
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ follow.name }}</p>
            <p class="text-xs text-darkgray truncate">@{{ follow.username }}</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
