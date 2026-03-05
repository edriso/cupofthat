<script setup>
import SettingsProfile from '@/components/SettingsProfile.vue'
import SettingsAccount from '@/components/SettingsAccount.vue'
</script>

<template>
  <main class="page-container">
    <div class="max-w-lg mx-auto space-y-6 pt-4">
      <h1 class="text-2xl font-bold">Settings</h1>

      <SettingsProfile />

      <hr class="border-border" />

      <SettingsAccount />
    </div>
  </main>
</template>
