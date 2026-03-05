<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['id'])
const router = useRouter()

const selectedBootcamp = ref({
  id: 1,
  name: 'Frontend development',
  details: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  link: 'https://slack.com/intl/en-eg/',
  img: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?w=400',
  intro: 'https://youtu.be/8w_kHIAkucA',
  fee: '10',
  long: '3 Months',
})

onMounted(() => {
  if (!selectedBootcamp.value) {
    router.push({ name: 'notFound' })
  }
  document.title = `CUP OF THAT | ${selectedBootcamp.value.name}`
})
</script>

<template>
  <main class="page-container pt-4">
    <div class="max-w-xl mx-auto">
      <img :src="selectedBootcamp.img" :alt="selectedBootcamp.name" class="w-full rounded-lg shadow mb-4" />
      <h3 class="text-2xl font-bold">{{ selectedBootcamp.name }}</h3>
      <p v-if="selectedBootcamp.long" class="text-darkgray mt-1">Duration: {{ selectedBootcamp.long }}</p>
      <p v-if="selectedBootcamp.fee" class="text-darkgray">Fee: {{ selectedBootcamp.fee }}$</p>
      <p class="mt-3 text-darkgray">{{ selectedBootcamp.details }}</p>
      <a v-if="selectedBootcamp.intro" :href="selectedBootcamp.intro" target="_blank" rel="noopener" class="text-cyan hover:underline block mt-2">
        Introduction
      </a>
      <a :href="selectedBootcamp.link" target="_blank" rel="noopener" class="btn btn-primary btn-block mt-4">
        Join Bootcamp
      </a>
    </div>
  </main>
</template>
