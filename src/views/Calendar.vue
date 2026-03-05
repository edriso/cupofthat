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

const activeDaysCount = computed(() => {
  return calendarDays.value.filter((d) => d.active).length
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

function formatSelectedDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' })
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
        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4">
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="prevMonth"
          >
            &lsaquo;
          </button>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-font">{{ monthName }}</h3>
            <p v-if="activeDaysCount" class="text-xs text-gray-400 mt-0.5">
              {{ activeDaysCount }} active {{ activeDaysCount === 1 ? 'day' : 'days' }}
            </p>
          </div>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="nextMonth"
          >
            &rsaquo;
          </button>
        </div>

        <!-- Weekday labels -->
        <div class="grid grid-cols-7 px-3 pb-1">
          <div
            v-for="d in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
            :key="d"
            class="text-center text-[11px] font-semibold text-gray-400 uppercase py-1"
          >
            {{ d }}
          </div>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 gap-px px-3 pb-4">
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            class="flex items-center justify-center py-2"
          >
            <button
              v-if="!day.empty"
              class="relative w-9 h-9 rounded-full text-sm flex items-center justify-center transition-all"
              :class="[
                day.active ? 'cursor-pointer' : 'cursor-default',
                day.active && selectedDay === day.date
                  ? 'bg-nav text-white font-bold shadow-md'
                  : day.active
                    ? 'bg-green/15 text-green font-semibold hover:bg-green/30'
                    : day.isToday
                      ? 'font-semibold text-nav ring-2 ring-nav/30'
                      : 'text-gray-500 hover:bg-gray-50',
              ]"
              @click="dayClicked(day)"
            >
              {{ day.day }}
              <span
                v-if="day.active && day.count > 1"
                class="absolute -top-1 -right-1 w-4 h-4 bg-nav text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none"
              >
                {{ day.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Selected day info bar -->
        <div
          v-if="selectedDay"
          class="border-t px-5 py-3 bg-gray-50 flex items-center justify-between"
        >
          <p class="text-sm text-gray-600">{{ formatSelectedDate(selectedDay) }}</p>
          <button
            class="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="selectedDay = null; selectedPost = {}"
          >
            <i class="icon icon-cancel-circled"></i>
          </button>
        </div>
      </div>

      <!-- Selected post -->
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
