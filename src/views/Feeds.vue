<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import MakePost from '@/components/MakePost.vue'
import Post from '@/components/Post.vue'
import ReportPost from '@/components/ReportPost.vue'
import PostImageModal from '@/components/PostImageModal.vue'

const auth = useAuthStore()
const postStore = usePostStore()

const reporting = ref(null)
const showImageModal = ref(null)

onMounted(() => {
  postStore.fetchPosts()
})
</script>

<template>
  <main class="page-container">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <div v-if="postStore.posts.length" class="mt-4">
        <Post
          v-for="post in postStore.posts"
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
