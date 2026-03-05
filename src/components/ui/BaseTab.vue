<script setup>
import { inject, ref, onMounted, computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  active: { type: Boolean, default: false },
})

const { registerTab, activeIndex } = inject('baseTabs')
const myIndex = ref(-1)

onMounted(() => {
  myIndex.value = registerTab({ title: props.title, active: props.active })
})

const isVisible = computed(() => activeIndex.value === myIndex.value)
</script>

<template>
  <div v-show="isVisible">
    <slot></slot>
  </div>
</template>
