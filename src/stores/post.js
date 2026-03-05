import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createPost } from '@/models/post'
import { createUser } from '@/models/user'
import { MOCK_POSTS } from '@/mock/data'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const post = ref(createPost())

  const postOwner = computed(() => createUser(post.value.owner))

  async function fetchPosts() {
    posts.value = MOCK_POSTS.map((p) => createPost(p))
    return { data: { posts: MOCK_POSTS } }
  }

  async function fetchPost(postId) {
    const found = MOCK_POSTS.find((p) => p.id == postId) || MOCK_POSTS[0]
    post.value = createPost(found)
    return { data: { post: found } }
  }

  async function storePost() {
    return { data: { message: 'Post created' } }
  }

  async function updatePost(request) {
    const found = MOCK_POSTS.find((p) => p.id === request?.id) || MOCK_POSTS[0]
    post.value = createPost(found)
    return { data: { post: found } }
  }

  async function postLike() {
    return { data: { message: 'Liked' } }
  }

  async function postDislike() {
    return { data: { message: 'Disliked' } }
  }

  async function reportPost() {
    return { data: { message: 'Reported' } }
  }

  function setPost(p) {
    post.value = p
  }

  return {
    posts,
    post,
    postOwner,
    fetchPosts,
    fetchPost,
    storePost,
    updatePost,
    postLike,
    postDislike,
    reportPost,
    setPost,
  }
})
