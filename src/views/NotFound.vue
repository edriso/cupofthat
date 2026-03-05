<template>
  <main class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <p class="text-8xl font-bold text-nav/20">404</p>
      <h2 class="text-2xl font-bold mt-4 text-font">Page Not Found</h2>
      <p class="text-darkgray mt-2 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <router-link :to="{ name: 'feeds' }" class="btn btn-cta">
        Back to Feeds
      </router-link>
    </div>
  </main>
</template>
