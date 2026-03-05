<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import Navbar from '@/components/Navbar.vue'
import Loading from '@/components/Loading.vue'

const route = useRoute()
const appStore = useAppStore()
</script>

<template>
  <div id="app">
    <Navbar v-if="route.meta.requiresAuth" />
    <Loading v-if="appStore.loading" />
    <router-view />
  </div>
</template>
