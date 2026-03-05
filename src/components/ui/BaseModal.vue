<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  hideFooter: { type: Boolean, default: false },
  hideHeader: { type: Boolean, default: false },
  hideBackdrop: { type: Boolean, default: false },
  size: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <div
        class="fixed inset-0"
        :class="hideBackdrop ? '' : 'bg-black/50'"
        @click="close"
      ></div>
      <div
        class="relative bg-white rounded-lg shadow-xl z-10 w-full mx-4"
        :class="size === 'sm' ? 'max-w-sm' : 'max-w-lg'"
      >
        <div v-if="!hideHeader" class="flex items-center justify-between p-4 border-b">
          <h5 class="text-lg font-medium">{{ title }}</h5>
          <button
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            @click="close"
          >
            &times;
          </button>
        </div>

        <div class="p-4">
          <slot></slot>
        </div>

        <div v-if="!hideFooter" class="flex justify-end p-4 border-t">
          <slot name="footer">
            <button class="btn btn-light" @click="close">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
