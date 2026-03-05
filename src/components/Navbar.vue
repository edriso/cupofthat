<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserImage } from '@/composables/useUserImage'
import logoSvg from '@/assets/logo.svg'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { getProfileImage } = useUserImage()

const time = ref('to see you')
const mobileOpen = ref(false)
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

onMounted(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) time.value = 'Morning'
  else if (hour >= 12 && hour < 17) time.value = 'Afternoon'
  else time.value = 'Evening'

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(() => route.path, () => {
  mobileOpen.value = false
  dropdownOpen.value = false
})

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    dropdownOpen.value = false
  }
}

function logout() {
  auth.signout().then(() => router.replace({ name: 'login' }))
}
</script>

<template>
  <nav
    v-if="auth.user"
    class="fixed top-0 left-0 right-0 z-40 bg-nav text-white h-[4.375rem] flex items-center px-4 shadow-md"
  >
    <router-link :to="{ name: 'feeds' }" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <img :src="logoSvg" class="h-8" alt="logo" />
    </router-link>

    <span class="ml-3 text-sm hidden md:inline opacity-80">
      Good {{ time }}, {{ auth.user.firstname }}!
    </span>

    <button class="md:hidden ml-auto text-white text-2xl p-1 cursor-pointer" @click="mobileOpen = !mobileOpen">
      <i :class="mobileOpen ? 'icon icon-cancel-circled' : 'icon icon-dot-3'"></i>
    </button>

    <div
      class="ml-auto items-center gap-4"
      :class="[
        mobileOpen
          ? 'flex flex-col absolute top-[4.375rem] left-0 right-0 bg-nav p-4 shadow-lg border-t border-white/10'
          : 'hidden md:flex',
      ]"
    >
      <router-link
        :to="{ name: 'feeds' }"
        class="md:hidden hover:text-cyan transition-colors flex items-center gap-2 py-1"
      >
        <i class="icon icon-newspaper"></i> Feeds
      </router-link>

      <router-link
        :to="{ name: 'profile', params: { username: auth.user.username } }"
        class="md:hidden hover:text-cyan transition-colors flex items-center gap-2 py-1"
      >
        <i class="icon icon-user"></i> Profile
      </router-link>

      <router-link
        :to="{ name: 'calendar' }"
        class="hover:text-cyan transition-colors flex items-center gap-2 py-1"
      >
        <i class="icon icon-calendar"></i>
        <span class="md:hidden">Calendar</span>
      </router-link>

      <div ref="dropdownRef" class="relative">
        <button @click="dropdownOpen = !dropdownOpen" class="hover:text-cyan transition-colors p-1 cursor-pointer">
          <i class="icon icon-dot-3"></i>
        </button>
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 bg-white text-font rounded-lg shadow-lg min-w-[10rem] py-1 z-50 overflow-hidden"
          >
            <router-link :to="{ name: 'settings' }" class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm">
              <i class="icon icon-cog"></i> Settings
            </router-link>
            <router-link :to="{ name: 'about' }" class="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm">
              <i class="icon icon-info"></i> About
            </router-link>
            <hr class="my-1" />
            <button class="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-react cursor-pointer" @click="logout">
              <i class="icon icon-logout"></i> Logout
            </button>
          </div>
        </Transition>
      </div>

      <router-link
        :to="{ name: 'profile', params: { username: auth.user.username } }"
        class="hidden md:block"
      >
        <img
          :src="getProfileImage(auth.user)"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 hover:ring-cyan transition-all"
          :alt="auth.user.username + ' profile'"
        />
      </router-link>
    </div>
  </nav>
</template>
