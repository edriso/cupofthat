<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'info' },
  show: { type: [Boolean, Number], default: false },
  dismissible: { type: Boolean, default: false },
})

const emit = defineEmits(['dismissed'])
const visible = ref(false)
let timer = null

const variantClasses = {
  success: 'bg-green/10 text-green-dark border-green/30',
  danger: 'bg-react/10 text-react-dark border-react/30',
  info: 'bg-blue/10 text-nav border-blue/30',
  warning: 'bg-yellow/15 text-font border-yellow/40',
}

watch(
  () => props.show,
  (val) => {
    if (timer) clearTimeout(timer)
    if (typeof val === 'number' && val > 0) {
      visible.value = true
      timer = setTimeout(() => {
        visible.value = false
        emit('dismissed')
      }, val * 1000)
    } else {
      visible.value = !!val
    }
  },
  { immediate: true }
)

function dismiss() {
  visible.value = false
  if (timer) clearTimeout(timer)
  emit('dismissed')
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    v-if="visible"
    class="border rounded px-4 py-3 mb-3 relative"
    :class="variantClasses[variant] || variantClasses.info"
  >
    <slot></slot>
    <button
      v-if="dismissible"
      class="absolute top-2 right-3 text-lg leading-none opacity-60 hover:opacity-100"
      @click="dismiss"
    >
      &times;
    </button>
  </div>
</template>
