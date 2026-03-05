<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFeedbackStore } from '@/stores/feedback'
import { useAppStore } from '@/stores/app'
import Navbar from '@/components/Navbar.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import BaseTab from '@/components/ui/BaseTab.vue'
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

    <div class="container mx-auto px-4 pt-20 pb-8">
      <div class="max-w-2xl mx-auto text-center mb-8">
        <h4 class="text-xl font-bold">About Us</h4>
        <h5 class="text-lg font-bold mt-2">We Share One Little Achievement Every Day!</h5>
        <p class="text-darkgray mt-2">
          We are a productive community that our daily habit is sharing one little achievement of that goal in mind while the time of drinking one cup of coffee or something. So it's about 5, 10 minutes or so to learn, practice, do, or make something new!
        </p>
        <p class="text-sm text-gray mt-1">(1.01)<sup>365</sup> = 37.8</p>
      </div>

      <h4 class="text-xl font-bold text-center mb-4">How it Works</h4>

      <BaseTabs fill>
        <BaseTab title="Feeds" active>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><img class="w-full rounded-lg shadow" :src="aboutFeeds" /></div>
            <div>
              <ul class="space-y-3">
                <li class="flex gap-3"><span class="font-bold text-yellow">1</span> We can make only 1 post daily from here, which can include a photo related to what we did, with maximum text 220 letters.</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">2</span> You can choose between global posts or posts from the people you're following.</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">3</span> Here is where you can report a post, or edit it if it's yours.</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">4</span> And this is the like button.</li>
              </ul>
            </div>
          </div>
        </BaseTab>

        <BaseTab title="Profile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><img class="w-full rounded-lg shadow" :src="aboutProfile" /></div>
            <div>
              <ul class="space-y-3">
                <li class="flex gap-3"><span class="font-bold text-yellow">1</span> You can change your profile picture or cover photo from here.</li>
                <li class="flex gap-3">
                  <span class="font-bold text-yellow">2</span>
                  <div>You'll get a badge if you've been active:
                    <ul class="mt-1 ml-4 space-y-1 text-sm">
                      <li>- Star (15 days active)</li>
                      <li>- Ribbon (30 days active)</li>
                      <li>- Rockstar (45 days active)</li>
                      <li>- Trophy (100 days active)</li>
                    </ul>
                  </div>
                </li>
                <li class="flex gap-3"><span class="font-bold text-yellow">3</span> You'll get a cup of coffee for each active day!</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">4</span> And you can link your social media accounts or your website.</li>
              </ul>
            </div>
          </div>
        </BaseTab>

        <BaseTab title="Calendar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><img class="w-full rounded-lg shadow" :src="aboutCalendar" /></div>
            <div>
              <ul class="space-y-3">
                <li class="flex gap-3"><span class="font-bold text-yellow">1</span> The green day means you did something on this day, and when you click on it, your post on this day will pop up.</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">2</span> This means you've lost the day, and there's no little achievement you've done :(</li>
                <li class="flex gap-3"><span class="font-bold text-yellow">3</span> And this is today, make sure to get a cup of that!</li>
              </ul>
            </div>
          </div>
        </BaseTab>

        <BaseTab title="Notes!">
          <div class="max-w-lg mx-auto">
            <ul class="space-y-3">
              <li class="flex gap-3"><span class="font-bold text-yellow">1</span> Posts are for those little achievements only, so please don't make a post that is not related and contains ads!</li>
              <li class="flex gap-3"><span class="font-bold text-yellow">2</span> Why there's no chat, comments, or notifications? You're welcome for saving your time.</li>
              <li class="flex gap-3">
                <span class="font-bold text-yellow">3</span>
                <span>Please, don't hesitate to <span class="text-cyan cursor-pointer hover:underline" @click="showFeedback = true">Contact us</span> for any feedback.</span>
              </li>
              <li class="flex gap-3">
                <span class="font-bold text-yellow">4</span>
                <span>And if you would like to support us, you could <a href="https://ko-fi.com/cupofthat" target="_blank" rel="noopener noreferrer" class="text-react hover:underline">buy us coffee</a> <i class="icon-heart text-react"></i>!</span>
              </li>
            </ul>
          </div>
        </BaseTab>
      </BaseTabs>

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
    </div>
  </main>
</template>
