<script setup>
import { ref, computed } from 'vue'

const search = ref('')
const launched = false
const bootcamps = ref([
  {
    id: 1,
    name: 'Frontend development',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    link: 'https://slack.com/intl/en-eg/',
    img: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?w=400',
    intro: 'https://youtu.be/8w_kHIAkucA',
    fee: '10',
    long: '3 Months',
  },
])

const filteredBootcamps = computed(() =>
  bootcamps.value.filter((item) => item.name.toLowerCase().includes(search.value.toLowerCase()))
)
</script>

<template>
  <main class="page-container">
    <div class="max-w-xl mx-auto">
      <div v-if="bootcamps.length && launched">
        <input v-if="bootcamps.length" type="text" placeholder="Search" class="form-control mb-4" v-model="search" />
        <ul class="text-center space-y-2">
          <li v-for="item in filteredBootcamps" :key="item.id">
            <router-link :to="{ name: 'bootcamp', params: { id: item.id } }" class="text-cyan hover:underline">
              {{ item.name }}
            </router-link>
          </li>
        </ul>
      </div>
      <div v-else class="text-center mt-8">
        <h2 class="text-4xl font-bold mb-4">Coming soon!</h2>
        <router-link :to="{ name: 'feeds' }" class="btn btn-sm btn-success">Back to Feeds</router-link>
      </div>
    </div>
  </main>
</template>
