<script setup>
</script>

<template>
  <main class="container mx-auto px-4 pt-24">
    <div class="text-center mt-4">
      <h2 class="text-4xl font-bold">Whoops</h2>
      <p class="text-lg mb-6 mt-2">Page is Not Found!</p>
      <router-link :to="{ name: 'feeds' }" class="btn btn-sm btn-success">
        Back to Feeds
      </router-link>
    </div>
  </main>
</template>
