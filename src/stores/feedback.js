import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createFeedback } from '@/models/feedback'
import { USE_MOCKS } from '@/helpers/config'
import api from '@/services/api'

export const useFeedbackStore = defineStore('feedback', () => {
  const feedback = ref(createFeedback())

  async function sendFeedback(request) {
    if (USE_MOCKS) return { data: { message: 'Feedback sent' } }
    const { data } = await api.post('/feedback', request)
    return { data }
  }

  function resetFeedback() {
    feedback.value = createFeedback()
  }

  return { feedback, sendFeedback, resetFeedback }
})
