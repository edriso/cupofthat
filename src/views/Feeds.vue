<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import MakePost from '@/components/MakePost.vue'
import Post from '@/components/Post.vue'
import ReportPost from '@/components/ReportPost.vue'
import PostImageModal from '@/components/PostImageModal.vue'

const auth = useAuthStore()
const postStore = usePostStore()

const sortBy = ref('global')
const reporting = ref(null)
const showImageModal = ref(null)

const filteredPosts = computed(() => {
  if (sortBy.value === 'following') {
    return postStore.posts.filter((post) => {
      const ownerFollowers = (post.owner.followers || []).map((f) => f.username)
      return ownerFollowers.includes(auth.user.username) || post.owner.username === auth.user.username
    })
  }
  return postStore.posts
})

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<template>
  <main class="container mx-auto px-4 pt-20 pb-8">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <div class="flex justify-center gap-2 mb-5">
        <button
          class="btn btn-sm rounded-full px-5 transition-all"
          :class="sortBy === 'global' ? 'btn-cta shadow' : 'btn-white hover:shadow'"
          @click="sortBy = 'global'"
        >
          Global
        </button>
        <button
          class="btn btn-sm rounded-full px-5 transition-all"
          :class="sortBy === 'following' ? 'btn-cta shadow' : 'btn-white hover:shadow'"
          @click="sortBy = 'following'"
        >
          Following
        </button>
      </div>

      <div v-if="filteredPosts.length">
        <Post
          v-for="post in filteredPosts"
          :key="post.id"
          :post="post"
          @report="reporting?.showReport(post.id)"
          @showPostImage="showImageModal?.showModal(post.image)"
        />
        <ReportPost ref="reporting" />
        <PostImageModal ref="showImageModal" />
      </div>

      <div v-else class="text-center py-12">
        <i class="icon icon-newspaper text-4xl text-gray/70 mb-3 block"></i>
        <p class="text-gray">No posts yet</p>
      </div>
    </div>
  </main>
</template>
