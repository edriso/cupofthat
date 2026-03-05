<script setup>
import { ref, watch } from 'vue'
import { usePostStore } from '@/stores/post'

const postStore = usePostStore()
const dismissCountDown = ref(0)
let timer = null

watch(dismissCountDown, (val) => {
  if (timer) clearTimeout(timer)
  if (val > 0) {
    timer = setTimeout(() => { dismissCountDown.value = 0 }, val * 1000)
  }
})

function showReport(postId) {
  postStore.reportPost(postId).then(() => {
    dismissCountDown.value = 4
  })
}

defineExpose({ showReport })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="dismissCountDown > 0" class="fixed bottom-5 right-5 z-50 bg-nav text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium">
        Thanks for helping us! We'll review this post soon.
      </div>
    </Transition>
  </Teleport>
</template>
