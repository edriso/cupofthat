<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  hideFooter: { type: Boolean, default: false },
  hideHeader: { type: Boolean, default: false },
  hideBackdrop: { type: Boolean, default: false },
  size: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0"
          :class="hideBackdrop ? '' : 'bg-black/50 backdrop-blur-[2px]'"
          @click="close"
        ></div>
        <div
          class="relative bg-white rounded-xl shadow-2xl z-10 w-full mx-auto transform transition-all"
          :class="size === 'sm' ? 'max-w-sm' : 'max-w-lg'"
        >
          <div v-if="!hideHeader" class="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h5 class="text-lg font-semibold">{{ title }}</h5>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full text-gray hover:text-darkgray hover:bg-lightgray transition-colors cursor-pointer"
              @click="close"
            >
              <i class="icon icon-cancel-circled"></i>
            </button>
          </div>

          <div class="px-5 py-4">
            <slot></slot>
          </div>

          <div v-if="!hideFooter" class="flex justify-end px-5 py-3 border-t border-border-light bg-bg/50 rounded-b-xl">
            <slot name="footer">
              <button class="btn btn-light" @click="close">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
