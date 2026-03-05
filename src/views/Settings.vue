<script setup>
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTab from '@/components/ui/BaseTab.vue'
import SettingsProfile from '@/components/SettingsProfile.vue'
import SettingsAccount from '@/components/SettingsAccount.vue'
</script>

<template>
  <main class="container mx-auto px-4 pt-20 pb-8">
    <BaseTabs>
      <BaseTab title="Profile" active>
        <SettingsProfile />
      </BaseTab>
      <BaseTab title="Account">
        <SettingsAccount />
      </BaseTab>
    </BaseTabs>
  </main>
</template>
