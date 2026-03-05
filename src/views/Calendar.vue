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
const selectedDay = ref(null)
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
  selectedDay.value = null
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
  selectedDay.value = null
}

function dayClicked(day) {
  if (!day.active) return

  if (selectedDay.value === day.date) {
    selectedDay.value = null
    selectedPost.value = {}
  } else {
    selectedDay.value = day.date
    selectedPost.value = createPost({
      id: 1,
      content: `Post from ${day.date}`,
      created_at: day.date,
      owner: auth.user,
    })
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

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-nav text-white">
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg" @click="prevMonth">
            &laquo;
          </button>
          <h3 class="text-lg font-medium">{{ monthName }}</h3>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-lg" @click="nextMonth">
            &raquo;
          </button>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            <div v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d" class="font-semibold text-gray-400 uppercase tracking-wide py-1">
              {{ d }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1 text-center text-sm">
            <div
              v-for="(day, i) in calendarDays"
              :key="i"
              class="relative aspect-square flex items-center justify-center rounded-lg transition-all"
              :class="[
                day.empty ? '' : 'cursor-pointer',
                day.active && selectedDay === day.date
                  ? 'bg-green text-white font-bold shadow-md scale-105'
                  : day.active
                    ? 'bg-green/15 text-green font-bold hover:bg-green/25'
                    : day.isToday
                      ? 'ring-2 ring-yellow font-semibold'
                      : !day.empty
                        ? 'hover:bg-gray-100 text-gray-600'
                        : '',
              ]"
              @click="day.day && dayClicked(day)"
            >
              {{ day.day }}
              <span v-if="day.active && day.count > 1" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {{ day.count }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="selectedDay" class="border-t bg-gray-50 px-4 py-3">
          <p class="text-xs text-gray-400 uppercase tracking-wide">{{ selectedDay }}</p>
        </div>
      </div>

      <div v-if="selectedDay && selectedPost.id" class="mt-4">
        <PostProfile
          :post="selectedPost"
          @showPostImage="showImageModal?.showModal(selectedPost.image)"
        />
        <PostImageModal ref="showImageModal" />
      </div>
    </div>
  </main>
</template>
