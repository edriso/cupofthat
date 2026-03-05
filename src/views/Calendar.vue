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
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const year = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
  return new Date(year.value, currentDate.value.getMonth() + 1, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(year.value, currentDate.value.getMonth(), 1).getDay()
})

const activeDaysCount = computed(() => {
  return calendarDays.value.filter((d) => d.active).length
})

const calendarDays = computed(() => {
  const days = []
  const y = year.value
  const month = currentDate.value.getMonth()
  const today = new Date()

  for (let i = 0; i < firstDayOfWeek.value; i++) {
    days.push({ day: '', empty: true })
  }

  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${y}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const calEntry = usersStore.userCalendar.find((c) => c.date === dateStr)
    const isToday =
      d === today.getDate() && month === today.getMonth() && y === today.getFullYear()

    days.push({
      day: d,
      date: dateStr,
      active: !!calEntry,
      isToday,
    })
  }
  return days
})

const selectedDateLabel = computed(() => {
  if (!selectedDay.value) return ''
  const d = new Date(selectedDay.value + 'T00:00:00')
  return d.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })
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
  <main class="page-container">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-4">
        <!-- Header -->
        <div class="px-5 pt-5 pb-3">
          <div class="flex items-center justify-between mb-1">
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full text-gray hover:text-font hover:bg-lightgray transition-colors cursor-pointer text-lg"
              @click="prevMonth"
            >
              &lsaquo;
            </button>
            <h3 class="text-xl font-bold text-font tracking-tight">
              {{ monthName }} <span class="text-gray font-normal">{{ year }}</span>
            </h3>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full text-gray hover:text-font hover:bg-lightgray transition-colors cursor-pointer text-lg"
              @click="nextMonth"
            >
              &rsaquo;
            </button>
          </div>
          <p v-if="activeDaysCount" class="text-center text-xs text-cyan">
            <i class="icon icon-cup"></i>
            {{ activeDaysCount }} {{ activeDaysCount === 1 ? 'day' : 'days' }} this month
          </p>
        </div>

        <!-- Weekday labels -->
        <div class="grid grid-cols-7 px-4">
          <div
            v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
            :key="d"
            class="text-center text-[10px] font-medium text-gray uppercase tracking-wider py-2"
          >
            {{ d }}
          </div>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 px-4 pb-5">
          <div
            v-for="(day, i) in calendarDays"
            :key="i"
            class="flex items-center justify-center py-1"
          >
            <button
              v-if="!day.empty"
              class="w-10 h-10 rounded-full text-sm flex items-center justify-center transition-all duration-150"
              :class="[
                day.active ? 'cursor-pointer' : 'cursor-default',
                day.active && selectedDay === day.date
                  ? 'bg-nav text-white font-bold scale-110 shadow-md'
                  : day.active
                    ? 'bg-cyan/15 text-nav font-semibold hover:bg-cyan/30 hover:scale-105'
                    : day.isToday
                      ? 'font-bold text-nav border-2 border-nav/25'
                      : 'text-darkgray hover:bg-bg',
              ]"
              @click="dayClicked(day)"
            >
              {{ day.day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Selected post -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div v-if="selectedDay && selectedPost.id" class="mt-4">
          <div class="flex items-center justify-between mb-2 px-1">
            <p class="text-sm font-medium text-darkgray">
              <i class="icon icon-calendar text-cyan"></i>
              {{ selectedDateLabel }}
            </p>
            <button
              class="text-xs text-gray hover:text-darkgray cursor-pointer"
              @click="selectedDay = null; selectedPost = {}"
            >
              <i class="icon icon-cancel-circled"></i>
            </button>
          </div>
          <PostProfile
            :post="selectedPost"
            hideDate
            @showPostImage="showImageModal?.showModal(selectedPost.image)"
          />
          <PostImageModal ref="showImageModal" />
        </div>
      </Transition>
    </div>
  </main>
</template>
