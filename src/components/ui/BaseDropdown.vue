<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  noCaret: { type: Boolean, default: false },
  dropleft: { type: Boolean, default: false },
  variant: { type: String, default: '' },
  size: { type: String, default: '' },
})

const open = ref(false)
const dropdownRef = ref(null)

function toggle() {
  open.value = !open.value
}

function handleClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block">
    <button
      class="btn cursor-pointer"
      :class="[
        size === 'sm' ? 'btn-sm' : '',
        variant === 'white' ? 'btn-white' : '',
      ]"
      @click="toggle"
    >
      <slot name="button-content">
        <span v-if="!noCaret">&#9662;</span>
      </slot>
    </button>
    <div
      v-if="open"
      class="absolute z-20 mt-1 bg-white border border-gray-200 rounded shadow-lg min-w-[10rem] py-1"
      :class="dropleft ? 'right-0' : 'left-0'"
      @click="open = false"
    >
      <slot></slot>
    </div>
  </div>
</template>
