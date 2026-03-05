<script setup>
import { ref } from 'vue'
import logoSvg from '@/assets/logo.svg'
import landingImg from '@/assets/landing.jpeg'

const year = ref(new Date().getFullYear())
</script>

<template>
  <div class="min-h-screen bg-white">
    <nav class="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      <router-link :to="{ name: 'login' }">
        <img :src="logoSvg" class="h-10" alt="logo" />
      </router-link>
      <div class="flex gap-2">
        <router-link :to="{ name: 'login' }" class="btn btn-sm">Login</router-link>
        <router-link :to="{ name: 'signup' }" class="btn btn-sm btn-pink">Sign Up</router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4">
      <div class="flex items-center gap-8 py-16">
        <div class="hidden lg:block lg:w-1/2">
          <img :src="landingImg" class="rounded-lg w-full" alt="get things done" />
        </div>
        <div class="w-full lg:w-1/2">
          <h2 class="text-4xl font-bold text-nav leading-tight">
            The best, easy &amp; exciting way to stop procrastinating and get things done
          </h2>
          <p class="text-lg text-gray-600 mt-4">
            You don't have to go big to achieve your goals, 10 minutes a day is all you need!
          </p>
          <router-link :to="{ name: 'signup' }" class="btn btn-pink mt-6 inline-block">
            Join Our Community
          </router-link>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16">
      <h2 class="text-2xl font-bold text-center mb-8">Things we do with Cupofthat</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6">
          <p class="text-4xl font-bold text-cyan">01</p>
          <h3 class="text-xl font-medium mt-2">Share Achievements</h3>
          <p class="text-gray-600 mt-2">
            Our community is full of little achievements that boost our productivity.
          </p>
        </div>
        <div class="text-center p-6">
          <p class="text-4xl font-bold text-cyan">02</p>
          <h3 class="text-xl font-medium mt-2">Days Count</h3>
          <p class="text-gray-600 mt-2">
            We track each day and its record whether you've did something on that day or not.
          </p>
        </div>
        <div class="text-center p-6">
          <p class="text-4xl font-bold text-cyan">03</p>
          <h3 class="text-xl font-medium mt-2">Get Badges</h3>
          <p class="text-gray-600 mt-2">
            We are challenging each other, and there are badges for the active members.
          </p>
        </div>
      </div>
      <div class="text-center mt-8">
        <router-link :to="{ name: 'about' }" class="btn btn-sm text-cyan hover:underline">
          How it works
        </router-link>
      </div>
    </div>

    <footer class="text-center py-6 text-gray-500">
      <p>Cupofthat &copy; {{ year }} | All rights reserved</p>
    </footer>
  </div>
</template>
