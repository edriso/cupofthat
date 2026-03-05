<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const show = ref(false)
const image = ref('')

function showModal(img) {
  image.value = img
  show.value = true
}

defineExpose({ showModal })
</script>

<template>
  <BaseModal v-model="show" hideHeader hideFooter>
    <img :src="image" alt="Post image" class="w-full" @dblclick="show = false" />
  </BaseModal>
</template>
