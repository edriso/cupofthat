<script setup>
import { ref } from 'vue'
import { usePostStore } from '@/stores/post'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const postStore = usePostStore()
const dismissCountDown = ref(0)

function showReport(postId) {
  postStore.reportPost(postId).then(() => {
    dismissCountDown.value = 4
  })
}

defineExpose({ showReport })
</script>

<template>
  <div>
    <BaseAlert :show="dismissCountDown" variant="danger" @dismissed="dismissCountDown = 0">
      <p class="font-medium">Thanks for helping us!</p>
      <p>We'll review this post as soon as possible</p>
    </BaseAlert>
  </div>
</template>
