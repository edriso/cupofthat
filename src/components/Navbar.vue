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
    class="fixed top-0 left-0 right-0 z-40 bg-nav text-white h-[var(--spacing-navbar)] flex items-center px-4 shadow-md"
  >
    <router-link :to="{ name: 'feeds' }" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <img :src="logoSvg" class="h-8" alt="logo" />
    </router-link>

    <span class="ml-3 text-sm hidden md:inline opacity-80">
      Good {{ time }}, {{ auth.user.firstname }}!
    </span>

    <!-- Mobile toggle -->
    <button class="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer" @click="mobileOpen = !mobileOpen">
      <i :class="mobileOpen ? 'icon icon-cancel-circled' : 'icon icon-dot-3'"></i>
    </button>

    <!-- Desktop nav -->
    <div class="hidden md:flex ml-auto items-center gap-4">
      <router-link
        :to="{ name: 'calendar' }"
        class="hover:text-cyan transition-colors p-1"
      >
        <i class="icon icon-calendar"></i>
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
            <router-link :to="{ name: 'settings' }" class="flex items-center gap-2 px-4 py-2.5 hover:bg-bg text-sm">
              <i class="icon icon-cog"></i> Settings
            </router-link>
            <router-link :to="{ name: 'about' }" class="flex items-center gap-2 px-4 py-2.5 hover:bg-bg text-sm">
              <i class="icon icon-info"></i> About
            </router-link>
            <div class="my-1 border-t border-border-light"></div>
            <button class="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-bg text-sm text-react cursor-pointer" @click="logout">
              <i class="icon icon-logout"></i> Logout
            </button>
          </div>
        </Transition>
      </div>

      <router-link :to="{ name: 'myaccount' }">
        <img
          :src="getProfileImage(auth.user)"
          class="w-8 h-8 rounded-full object-cover ring-2 ring-white/30 hover:ring-cyan transition-all"
          :alt="auth.user.username + ' profile'"
        />
      </router-link>
    </div>

    <!-- Mobile menu overlay -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="mobileOpen" class="md:hidden fixed inset-0 z-30 bg-black/40" @click="mobileOpen = false"></div>
    </Transition>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="mobileOpen"
        class="md:hidden fixed top-[var(--spacing-navbar)] left-0 right-0 z-40 bg-nav shadow-xl"
      >
        <!-- Profile card -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <img
            :src="getProfileImage(auth.user)"
            class="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
            :alt="auth.user.username + ' profile'"
          />
          <div>
            <p class="font-semibold text-sm">{{ auth.user.firstname }} {{ auth.user.lastname }}</p>
            <p class="text-xs text-white/60">@{{ auth.user.username }}</p>
          </div>
        </div>

        <!-- Nav links -->
        <div class="py-2">
          <router-link
            :to="{ name: 'feeds' }"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
          >
            <i class="icon icon-newspaper w-5 text-center text-white/70"></i>
            <span class="text-sm">Feeds</span>
          </router-link>
          <router-link
            :to="{ name: 'myaccount' }"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
          >
            <i class="icon icon-user w-5 text-center text-white/70"></i>
            <span class="text-sm">My Profile</span>
          </router-link>
          <router-link
            :to="{ name: 'calendar' }"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
          >
            <i class="icon icon-calendar w-5 text-center text-white/70"></i>
            <span class="text-sm">Calendar</span>
          </router-link>
          <router-link
            :to="{ name: 'settings' }"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
          >
            <i class="icon icon-cog w-5 text-center text-white/70"></i>
            <span class="text-sm">Settings</span>
          </router-link>
          <router-link
            :to="{ name: 'about' }"
            class="flex items-center gap-3 px-5 py-3 hover:bg-white/10 transition-colors"
          >
            <i class="icon icon-info w-5 text-center text-white/70"></i>
            <span class="text-sm">About</span>
          </router-link>
        </div>

        <!-- Logout -->
        <div class="border-t border-white/10 py-2">
          <button
            class="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-white/10 transition-colors text-react/80 cursor-pointer"
            @click="logout"
          >
            <i class="icon icon-logout w-5 text-center"></i>
            <span class="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>
