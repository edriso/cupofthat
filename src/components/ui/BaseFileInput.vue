<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: { type: String, default: 'image/*' },
  placeholder: { type: String, default: 'Add a photo' },
  size: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const fileName = ref('')

function handleChange(e) {
  const file = e.target.files[0] || null
  fileName.value = file ? file.name : ''
  emit('update:modelValue', file)
}
</script>

<template>
  <label
    class="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray/50 cursor-pointer text-darkgray hover:border-cyan hover:text-cyan hover:bg-cyan/5 transition-all"
    :class="[
      size === 'sm' ? 'text-xs py-1.5 px-2.5' : 'text-sm',
      fileName ? 'border-cyan/40 bg-cyan/5 text-cyan' : '',
    ]"
  >
    <i class="icon" :class="fileName ? 'icon-ok-circled' : 'icon-plus-circled'"></i>
    <span class="truncate">{{ fileName || placeholder }}</span>
    <input type="file" :accept="accept" class="hidden" @change="handleChange" />
  </label>
</template>
