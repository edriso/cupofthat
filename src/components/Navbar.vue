<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserImage } from '@/composables/useUserImage'
import logoSvg from '@/assets/logo.svg'

const router = useRouter()
const auth = useAuthStore()
const { getProfileImage } = useUserImage()

const time = ref('to see you')
const mobileOpen = ref(false)
const dropdownOpen = ref(false)

onMounted(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) time.value = 'Morning'
  else if (hour >= 12 && hour < 17) time.value = 'Afternoon'
  else time.value = 'Evening'
})

function logout() {
  auth.signout().then(() => router.replace({ name: 'login' }))
}
</script>

<template>
  <nav
    v-if="auth.user"
    class="fixed top-0 left-0 right-0 z-40 bg-nav text-white h-[4.375rem] flex items-center px-4"
  >
    <router-link :to="{ name: 'feeds' }">
      <img :src="logoSvg" class="h-8" alt="logo" />
    </router-link>

    <span class="ml-2 text-sm hidden md:inline">
      Good {{ time }}<span>, {{ auth.user.firstname }}</span>!
    </span>

    <button class="md:hidden ml-auto text-white text-2xl" @click="mobileOpen = !mobileOpen">
      <i class="icon icon-menu"></i>
    </button>

    <div
      class="ml-auto items-center gap-4"
      :class="[
        mobileOpen
          ? 'flex flex-col absolute top-[4.375rem] left-0 right-0 bg-nav p-4 shadow-lg'
          : 'hidden md:flex',
      ]"
    >
      <router-link
        :to="{ name: 'feeds' }"
        class="md:hidden hover:text-yellow transition-colors"
        @click="mobileOpen = false"
      >
        <i class="icon icon-newspaper"></i> Feeds
      </router-link>

      <router-link
        :to="{ name: 'profile', params: { username: auth.user.username } }"
        class="md:hidden hover:text-yellow transition-colors"
        @click="mobileOpen = false"
      >
        <i class="icon icon-user"></i> Profile
      </router-link>

      <router-link
        :to="{ name: 'calendar' }"
        class="hover:text-yellow transition-colors"
        @click="mobileOpen = false"
      >
        <i class="icon icon-calendar"></i>
        <span class="md:hidden"> Calendar</span>
      </router-link>

      <div class="relative">
        <button @click="dropdownOpen = !dropdownOpen" class="hover:text-yellow transition-colors">
          <i class="icon icon-dot-3"></i>
        </button>
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 bg-white text-font rounded shadow-lg min-w-[10rem] py-1 z-50"
          @click="dropdownOpen = false; mobileOpen = false"
        >
          <router-link :to="{ name: 'search' }" class="block px-4 py-2 hover:bg-gray-100">
            <i class="icon icon-search"></i> Search
          </router-link>
          <router-link :to="{ name: 'settings' }" class="block px-4 py-2 hover:bg-gray-100">
            <i class="icon icon-cog"></i> Settings
          </router-link>
          <button class="block w-full text-left px-4 py-2 hover:bg-gray-100" @click="logout">
            <i class="icon icon-logout"></i> Logout
          </button>
        </div>
      </div>

      <router-link
        :to="{ name: 'profile', params: { username: auth.user.username } }"
        class="hidden md:block"
        @click="mobileOpen = false"
      >
        <img
          :src="getProfileImage(auth.user)"
          class="w-8 h-8 rounded-full object-cover"
          :alt="auth.user.username + ' profile'"
        />
      </router-link>
    </div>
  </nav>
</template>
