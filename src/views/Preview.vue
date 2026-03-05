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

const selectedPost = ref({})
const reporting = ref(null)
const showImageModal = ref(null)

onMounted(() => {
  const postId = route.params.postId
  postStore.fetchPost(postId).then(() => {
    selectedPost.value = postStore.post
    if (selectedPost.value) {
      document.title = `CUP OF THAT | ${selectedPost.value.owner?.firstname || ''}'s Post`
    } else {
      router.push({ name: 'notFound' })
    }
  })
})
</script>

<template>
  <main class="page-container pt-4">
    <div class="max-w-xl mx-auto">
      <div v-if="postStore.postOwner.username">
        <Post
          :post="selectedPost"
          @report="reporting?.showReport(selectedPost.id)"
          @showPostImage="showImageModal?.showModal(selectedPost.image)"
        />
        <ReportPost ref="reporting" />
        <PostImageModal ref="showImageModal" />
      </div>
    </div>
  </main>
</template>
