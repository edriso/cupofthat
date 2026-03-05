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
      <p class="mb-4 text-darkgray">Select a new cover photo (2:1 ratio recommended)</p>
      <label class="btn btn-success cursor-pointer">
        Choose File
        <input type="file" accept="image/jpeg, image/png, image/gif" class="hidden" @change="handleFile" />
      </label>
    </div>
  </BaseModal>
</template>
