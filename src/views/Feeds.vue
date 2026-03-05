<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import MakePost from '@/components/MakePost.vue'
import Post from '@/components/Post.vue'
import ReportPost from '@/components/ReportPost.vue'
import PostImageModal from '@/components/PostImageModal.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'

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

      <div class="text-center mb-4">
        <BaseDropdown variant="white" noCaret size="sm">
          <template #button-content>
            <i class="icon icon-dot-2"></i>
          </template>
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            :class="{ 'font-bold text-cyan': sortBy === 'global' }"
            @click="sortBy = 'global'"
          >
            Global
          </button>
          <hr class="my-1" />
          <button
            class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            :class="{ 'font-bold text-cyan': sortBy === 'following' }"
            @click="sortBy = 'following'"
          >
            Following
          </button>
        </BaseDropdown>
      </div>

      <div v-if="postStore.posts.length">
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
    </div>
  </main>
</template>
