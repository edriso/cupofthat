<script setup>
import { ref, onMounted } from 'vue'
import logoSvg from '@/assets/logo.svg'
import defaultBg from '@/assets/login.jpg'

defineProps({
  bgImage: {
    type: String,
    default: '',
  },
})

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
    class="login-page relative overflow-hidden"
    :style="{
      minHeight: deviceHeight,
      paddingTop: topPadding,
      paddingBottom: '1rem',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url(${bgImage || defaultBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#333',
    }"
  >
    <div class="container mx-auto px-4 h-full">
      <div class="text-center mb-2">
        <router-link :to="{ name: 'login' }">
          <img :src="logoSvg" alt="Cup of That" class="w-[6.25rem] h-[6.25rem] mx-auto mb-0.5" />
        </router-link>
      </div>

      <slot name="header"></slot>

      <div class="flex justify-center">
        <div class="w-full max-w-[26rem] px-4 sm:px-0">
          <div class="login-card rounded-xl p-6 border border-white/[0.08]" style="background-color: rgba(0, 0, 0, 0.45); backdrop-filter: blur(8px);">
            <slot></slot>
          </div>
        </div>
      </div>

      <slot name="footer"></slot>
    </div>
  </main>
</template>

<style scoped>
.login-page :deep(.form-control) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
  color: #fff;
  border-radius: 0.375rem;
}

.login-page :deep(.form-control::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.login-page :deep(.form-control:focus) {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  box-shadow: 0 0 0 0.15rem rgba(255, 255, 255, 0.1);
}

.login-page :deep(.btn-block) {
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.02rem;
}

.login-page :deep(.gray-text) {
  color: #b0b0b0;
  transition: color 0.15s ease-in-out;
}

.login-page :deep(.gray-text:hover) {
  color: #fff;
}
</style>
