<script setup>
import { useUserImage } from '@/composables/useUserImage'

const props = defineProps({
  match: Object,
})

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
  </li>
</template>
