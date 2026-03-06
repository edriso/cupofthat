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

    <!-- Hero -->
    <div class="container mx-auto px-4">
      <div class="flex items-center gap-12 py-20">
        <div class="hidden lg:block lg:w-1/2">
          <img :src="landingImg" class="rounded-2xl w-full shadow-lg" alt="get things done" />
        </div>
        <div class="w-full lg:w-1/2">
          <span class="inline-block text-sm font-semibold text-cyan tracking-wider uppercase mb-3">Welcome to Cupofthat</span>
          <h1 class="text-4xl md:text-5xl font-bold text-nav leading-tight">
            The best, easy &amp; exciting way to stop procrastinating
          </h1>
          <p class="text-lg text-darkgray mt-5 leading-relaxed">
            You don't have to go big to achieve your goals. 10 minutes a day is all you need!
          </p>
          <router-link :to="{ name: 'signup' }" class="btn btn-pink mt-8 inline-block px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow">
            Join Our Community
          </router-link>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="bg-bg py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-nav">Things we do with Cupofthat</h2>
          <div class="w-12 h-1 bg-cyan rounded-full mx-auto mt-3"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-14 h-14 rounded-full bg-cyan/10 flex items-center justify-center mx-auto mb-4">
              <i class="icon icon-newspaper text-cyan text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-nav mb-2">Share Achievements</h3>
            <p class="text-darkgray text-sm leading-relaxed">
              Our community is full of little daily achievements that boost productivity.
            </p>
          </div>
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-14 h-14 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
              <i class="icon icon-calendar text-green text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-nav mb-2">Track Your Days</h3>
            <p class="text-darkgray text-sm leading-relaxed">
              We track each day and whether you've done something productive or not.
            </p>
          </div>
          <div class="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
            <div class="w-14 h-14 rounded-full bg-yellow/10 flex items-center justify-center mx-auto mb-4">
              <i class="icon icon-cup text-yellow text-2xl"></i>
            </div>
            <h3 class="text-lg font-bold text-nav mb-2">Collect Cups</h3>
            <p class="text-darkgray text-sm leading-relaxed">
              Every post earns you a cup. Stay active and watch your collection grow.
            </p>
          </div>
        </div>
        <div class="text-center mt-10">
          <router-link :to="{ name: 'about' }" class="text-cyan font-medium hover:underline">
            Learn how it works &rarr;
          </router-link>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="py-16 text-center">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold text-nav mb-3">Ready to start?</h2>
        <p class="text-darkgray mb-6">Join our community and share your first achievement today.</p>
        <router-link :to="{ name: 'signup' }" class="btn btn-cta px-8 py-3">
          Get Started
        </router-link>
      </div>
    </div>

    <footer class="border-t border-border py-6 text-center text-sm text-darkgray">
      <p>Cupofthat &copy; {{ year }}</p>
    </footer>
  </div>
</template>
