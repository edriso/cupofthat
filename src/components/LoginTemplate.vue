<script setup>
import { ref, onMounted } from 'vue'
import logoSvg from '@/assets/logo.svg'

const deviceHeight = ref('100vh')
const topPadding = ref('16vh')

onMounted(() => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    deviceHeight.value = window.innerHeight + 'px'
    topPadding.value = window.innerHeight * 0.14 + 'px'
  }
})
</script>

<template>
  <main
    class="min-h-screen bg-cover bg-center bg-no-repeat"
    :style="{ minHeight: deviceHeight, paddingTop: topPadding, backgroundImage: `url(${$attrs.bgImage || ''})` }"
  >
    <div class="container mx-auto px-4 h-full">
      <div class="text-center mb-4">
        <router-link :to="{ name: 'login' }">
          <img :src="logoSvg" alt="Cup of That" class="h-12 mx-auto" />
        </router-link>
      </div>

      <slot name="header"></slot>

      <div class="flex justify-center">
        <div class="w-full max-w-md">
          <div class="bg-white/95 rounded-lg p-6 shadow-lg">
            <slot></slot>
          </div>
        </div>
      </div>

      <slot name="footer"></slot>
    </div>
  </main>
</template>
