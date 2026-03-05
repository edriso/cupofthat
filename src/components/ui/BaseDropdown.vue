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
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute z-20 mt-1.5 bg-white rounded-lg shadow-lg ring-1 ring-black/5 min-w-[11rem] py-1.5 origin-top-right"
        :class="dropleft ? 'right-0' : 'left-0'"
        @click="open = false"
      >
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>
