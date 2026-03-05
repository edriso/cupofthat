<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFeedbackStore } from '@/stores/feedback'
import { useAppStore } from '@/stores/app'
import Navbar from '@/components/Navbar.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'
import { createFeedback } from '@/models/feedback'
import logoSvg from '@/assets/logo.svg'
import aboutFeeds from '@/assets/about-feeds.jpg'
import aboutProfile from '@/assets/about-profile.jpg'
import aboutCalendar from '@/assets/about-calendar.jpg'

const auth = useAuthStore()
const feedbackStore = useFeedbackStore()
const app = useAppStore()

const errorMsg = ref('')
const successMsg = ref('')
const showFeedback = ref(false)

async function handleFeedback() {
  if (!feedbackStore.feedback.isEmpty()) {
    errorMsg.value = ''
    try {
      await feedbackStore.sendFeedback(feedbackStore.feedback.request())
      successMsg.value = 'Your message has successfully been recorded. Thanks a lot for your help.'
      feedbackStore.resetFeedback()
    } catch (err) {
      errorMsg.value = err?.response?.data?.message || 'Failed to send feedback'
    }
  } else {
    errorMsg.value = 'Please fill all the fields below'
  }
}
</script>

<template>
  <main class="min-h-screen bg-bg">
    <Navbar v-if="auth.authenticated" />
    <nav v-else class="fixed top-0 left-0 right-0 z-40 bg-nav text-white h-[4.375rem] flex items-center px-4 justify-between">
      <router-link :to="{ name: 'login' }">
        <img :src="logoSvg" class="h-8" alt="logo" />
      </router-link>
      <div class="flex gap-2">
        <router-link :to="{ name: 'login' }" class="btn btn-sm text-white">Login</router-link>
        <router-link :to="{ name: 'signup' }" class="btn btn-sm bg-white text-nav">Sign Up</router-link>
      </div>
    </nav>

    <div class="page-container">
      <!-- Hero -->
      <div class="max-w-3xl mx-auto text-center pt-4 mb-16">
        <span class="inline-block text-sm font-semibold text-cyan tracking-wider uppercase mb-3">About Us</span>
        <h1 class="text-3xl md:text-4xl font-bold text-nav leading-tight">
          We Share One Little Achievement Every Day!
        </h1>
        <p class="text-darkgray mt-4 text-lg leading-relaxed max-w-xl mx-auto">
          A productive community where sharing one little daily achievement — in the time it takes to drink a cup of coffee — adds up to something remarkable.
        </p>
        <p class="mt-3 text-sm text-gray font-medium tracking-wide">(1.01)<sup>365</sup> = 37.8</p>
      </div>

      <!-- How it Works heading -->
      <div class="text-center mb-10">
        <h2 class="text-2xl font-bold text-nav">How it Works</h2>
        <div class="w-12 h-1 bg-cyan rounded-full mx-auto mt-2"></div>
      </div>

      <!-- Feature Sections -->
      <div class="max-w-4xl mx-auto space-y-20">

        <!-- Feeds -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="order-2 md:order-1">
            <img class="w-full rounded-xl shadow-lg" :src="aboutFeeds" alt="Feeds screenshot" />
          </div>
          <div class="order-1 md:order-2">
            <span class="text-xs font-bold text-white bg-cyan px-3 py-1 rounded-full uppercase tracking-wider">Feeds</span>
            <ul class="mt-5 space-y-4">
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">1</span>
                <span>Make 1 post daily — include a photo and up to 220 characters about what you did.</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">2</span>
                <span>Switch between global posts or posts from people you follow.</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">3</span>
                <span>Report a post or edit yours from the post menu.</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">4</span>
                <span>Show some love with the like button.</span>
              </li>
            </ul>
          </div>
        </section>

        <!-- Profile -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span class="text-xs font-bold text-white bg-nav px-3 py-1 rounded-full uppercase tracking-wider">Profile</span>
            <ul class="mt-5 space-y-4">
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">1</span>
                <span>Customize your profile picture and cover photo.</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">2</span>
                <div>Earn badges as you stay active:
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span class="text-xs bg-bg px-2.5 py-1 rounded-full font-medium">Star — 15 days</span>
                    <span class="text-xs bg-bg px-2.5 py-1 rounded-full font-medium">Ribbon — 30 days</span>
                    <span class="text-xs bg-bg px-2.5 py-1 rounded-full font-medium">Rockstar — 45 days</span>
                    <span class="text-xs bg-bg px-2.5 py-1 rounded-full font-medium">Trophy — 100 days</span>
                  </div>
                </div>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">3</span>
                <span>Collect a cup of coffee for each active day!</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-yellow/20 text-yellow font-bold text-sm flex items-center justify-center">4</span>
                <span>Link your social media accounts or website.</span>
              </li>
            </ul>
          </div>
          <div>
            <img class="w-full rounded-xl shadow-lg" :src="aboutProfile" alt="Profile screenshot" />
          </div>
        </section>

        <!-- Calendar -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div class="order-2 md:order-1">
            <img class="w-full rounded-xl shadow-lg" :src="aboutCalendar" alt="Calendar screenshot" />
          </div>
          <div class="order-1 md:order-2">
            <span class="text-xs font-bold text-white bg-green px-3 py-1 rounded-full uppercase tracking-wider">Calendar</span>
            <ul class="mt-5 space-y-4">
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-green/20 text-green-dark font-bold text-sm flex items-center justify-center">1</span>
                <span>Green days mean you achieved something — click to see your post from that day.</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-react/20 text-react font-bold text-sm flex items-center justify-center">2</span>
                <span>A missed day means no achievement was logged — keep your streak going!</span>
              </li>
              <li class="flex gap-3 items-start">
                <span class="shrink-0 w-7 h-7 rounded-full bg-cyan/20 text-cyan-dark font-bold text-sm flex items-center justify-center">3</span>
                <span>Today is highlighted — make sure to get your cup of that!</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <!-- Notes -->
      <div class="max-w-2xl mx-auto mt-20">
        <div class="bg-white rounded-xl p-8 shadow-sm border border-border-light">
          <h3 class="text-lg font-bold text-nav mb-4 text-center">Good to Know</h3>
          <ul class="space-y-4">
            <li class="flex gap-3 items-start">
              <span class="shrink-0 w-7 h-7 rounded-full bg-react/10 text-react font-bold text-sm flex items-center justify-center">!</span>
              <span>Posts are for little achievements only — no ads or unrelated content please.</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="shrink-0 w-7 h-7 rounded-full bg-cyan/10 text-cyan font-bold text-sm flex items-center justify-center">?</span>
              <span>No chat, comments, or notifications? You're welcome — we're saving your time.</span>
            </li>
            <li class="flex gap-3 items-start">
              <span class="shrink-0 w-7 h-7 rounded-full bg-green/10 text-green-dark font-bold text-sm flex items-center justify-center">
                <i class="icon icon-mail text-xs"></i>
              </span>
              <span>
                Got feedback? We'd love to hear it.
                <button class="text-cyan font-semibold hover:underline cursor-pointer ml-1" @click="showFeedback = true">Contact us</button>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <BaseModal v-model="showFeedback" title="Feedback or Suggestions" hideBackdrop>
      <p v-if="errorMsg" class="invalid-feedback mb-2">{{ errorMsg }}</p>
      <BaseAlert v-if="successMsg" :show="true" variant="success" dismissible>{{ successMsg }}</BaseAlert>
      <textarea v-model="feedbackStore.feedback.content" class="form-control mb-3" rows="5" placeholder="We really appreciate your help, Thanks a lot!"></textarea>
      <input autocomplete="off" class="form-control" type="email" v-model="feedbackStore.feedback.email" placeholder="Email Address *optional*" />
      <template #footer>
        <button class="btn btn-sm btn-primary" :disabled="app.loading" @click="handleFeedback">
          {{ app.loading ? 'Sending...' : 'Send' }}
        </button>
      </template>
    </BaseModal>
  </main>
</template>
