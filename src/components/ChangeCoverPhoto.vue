<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import BaseModal from '@/components/ui/BaseModal.vue'

const usersStore = useUsersStore()
const showModal = ref(false)

function openPicker() {
  showModal.value = true
}

async function handleFile(e) {
  const file = e.target.files[0]
  if (!file) return
  await usersStore.setCoverImage(file)
  showModal.value = false
}

defineExpose({ openPicker })
</script>

<template>
  <BaseModal v-model="showModal" title="Change Cover Photo" hideFooter>
    <div class="text-center">
      <p class="mb-4 text-darkgray text-sm">Select a new cover photo (2:1 ratio recommended)</p>
      <label class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-dashed border-gray/50 cursor-pointer text-darkgray hover:border-cyan hover:text-cyan hover:bg-cyan/5 transition-all">
        <i class="icon icon-plus-circled"></i>
        <span class="text-sm font-medium">Browse photos</span>
        <input type="file" accept="image/jpeg, image/png, image/gif" class="hidden" @change="handleFile" />
      </label>
    </div>
  </BaseModal>
</template>
