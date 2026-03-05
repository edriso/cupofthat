<script setup>
import { ref, provide } from 'vue'

const props = defineProps({
  fill: { type: Boolean, default: false },
})

const tabs = ref([])
const activeIndex = ref(0)

function registerTab(tab) {
  const idx = tabs.value.length
  tabs.value.push(tab)
  if (tab.active) activeIndex.value = idx
  return idx
}

provide('baseTabs', { registerTab, activeIndex })
</script>

<template>
  <div>
    <ul class="flex border-b mb-4" :class="fill ? 'justify-around' : 'justify-center'">
      <li
        v-for="(tab, i) in tabs"
        :key="i"
        class="cursor-pointer px-4 py-2 -mb-px text-sm font-medium transition-colors"
        :class="
          activeIndex === i
            ? 'border-b-2 border-nav text-nav'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="activeIndex = i"
      >
        {{ tab.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>
