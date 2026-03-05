<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { createPost } from '@/models/post'
import MakePost from '@/components/MakePost.vue'
import PostProfile from '@/components/PostProfile.vue'
import PostImageModal from '@/components/PostImageModal.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()

const currentDate = ref(new Date())
const showPost = ref(false)
const selectedPost = ref({})
const showImageModal = ref(null)

const monthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month, 1).getDay()
})

const calendarDays = computed(() => {
  const days = []
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()

  for (let i = 0; i < firstDayOfWeek.value; i++) {
    days.push({ day: '', empty: true })
  }

  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const calEntry = usersStore.userCalendar.find((c) => c.date === dateStr)
    const isToday =
      d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

    days.push({
      day: d,
      date: dateStr,
      active: !!calEntry,
      count: calEntry?.count || 0,
      isToday,
    })
  }
  return days
})

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

function dayClicked(day) {
  if (day.active) {
    showPost.value = !showPost.value
    if (showPost.value) {
      selectedPost.value = createPost({
        id: 1,
        content: `Post from ${day.date}`,
        created_at: day.date,
        owner: auth.user,
      })
    }
  }
}

onMounted(() => {
  usersStore.getCalendar()
})
</script>

<template>
  <main class="container mx-auto px-4 pt-20 pb-8">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center justify-between mb-4">
          <button class="btn btn-sm" @click="prevMonth">&laquo;</button>
          <h3 class="text-lg font-medium">{{ monthName }}</h3>
          <button class="btn btn-sm" @click="nextMonth">&raquo;</button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-sm">
          <div v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d" class="font-medium text-gray-500 py-1">
            {{ d }}
          </div>
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            class="py-2 rounded cursor-pointer transition-colors"
            :class="{
              'bg-green/20 text-green font-bold': day.active,
              'bg-yellow/20 border border-yellow': day.isToday,
              'hover:bg-gray-100': !day.empty && !day.active,
            }"
            @click="day.day && dayClicked(day)"
          >
            {{ day.day }}
          </div>
        </div>
      </div>

      <div v-if="showPost && selectedPost.id" class="mt-4">
        <hr class="mb-4" />
        <PostProfile
          :post="selectedPost"
          @showPostImage="showImageModal?.showModal(selectedPost.image)"
        />
        <PostImageModal ref="showImageModal" />
      </div>
    </div>
  </main>
</template>
