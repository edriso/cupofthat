<script setup>
import { useAuthStore } from '@/stores/auth'
import { useUserImage } from '@/composables/useUserImage'

const auth = useAuthStore()
const { getProfileImage } = useUserImage()
</script>

<template>
  <div>
    <ul>
      <li v-for="follow in auth.user.followers" :key="follow.id" class="flex items-center justify-between py-2 border-b last:border-b-0">
        <router-link :to="{ name: 'profile', params: { username: follow.username } }" class="flex items-center gap-3 hover:opacity-80">
          <img :src="getProfileImage(follow)" class="w-8 h-8 rounded-full object-cover" />
          <span>{{ follow.name }}</span>
        </router-link>
        <span class="icon icon-ok-circled text-green"></span>
      </li>
    </ul>
  </div>
</template>
