<script setup>
import { ref } from 'vue'

const show = ref(false)
const image = ref('')

function showModal(img) {
  image.value = img
  show.value = true
}

defineExpose({ showModal })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="show = false">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
        <button class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <i class="icon icon-cancel-circled text-xl"></i>
        </button>
        <img :src="image" alt="Post image" class="relative z-10 max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain" @click.stop />
      </div>
    </Transition>
  </Teleport>
</template>
