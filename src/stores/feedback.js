import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createFeedback } from '@/models/feedback'

export const useFeedbackStore = defineStore('feedback', () => {
  const feedback = ref(createFeedback())

  async function sendFeedback() {
    return { data: { message: 'Feedback sent' } }
  }

  function resetFeedback() {
    feedback.value = createFeedback()
  }

  return { feedback, sendFeedback, resetFeedback }
})
