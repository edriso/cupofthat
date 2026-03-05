<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: { type: String, default: 'image/*' },
  placeholder: { type: String, default: 'Choose a file' },
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
    class="flex items-center border rounded cursor-pointer bg-white overflow-hidden"
    :class="size === 'sm' ? 'text-sm' : ''"
  >
    <span class="px-3 py-1.5 bg-gray-100 border-r text-gray-600 whitespace-nowrap">
      Browse
    </span>
    <span class="px-3 py-1.5 text-gray-500 truncate flex-1">
      {{ fileName || placeholder }}
    </span>
    <input type="file" :accept="accept" class="hidden" @change="handleChange" />
  </label>
</template>
