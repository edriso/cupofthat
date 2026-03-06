<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '@/stores/post'
import Post from '@/components/Post.vue'
import ReportPost from '@/components/ReportPost.vue'
import PostImageModal from '@/components/PostImageModal.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()

const reporting = ref(null)
const showImageModal = ref(null)
const loaded = ref(false)

onMounted(() => {
  const postId = route.params.postId
  postStore.fetchPost(postId).then(() => {
    if (!postStore.post.id) {
      router.replace({ name: 'notFound' })
      return
    }
    document.title = `Cup Of That | ${postStore.postOwner.firstname || ''}'s Post`
    loaded.value = true
  })
})
</script>

<template>
  <main class="page-container pt-4">
    <div class="max-w-xl mx-auto">
      <div v-if="loaded">
        <Post
          :post="postStore.post"
          @report="reporting?.showReport(postStore.post.id)"
          @showPostImage="showImageModal?.showModal(postStore.post.image)"
        />
        <ReportPost ref="reporting" />
        <PostImageModal ref="showImageModal" />
      </div>
    </div>
  </main>
</template>
