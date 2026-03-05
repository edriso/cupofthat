import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createPost } from '@/models/post'
import { createUser } from '@/models/user'
import { MOCK_POSTS } from '@/mock/data'
import { USE_MOCKS } from '@/helpers/config'
import api from '@/services/api'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])
  const post = ref(createPost())

  const postOwner = computed(() => createUser(post.value.owner))

  async function fetchPosts() {
    if (USE_MOCKS) {
      posts.value = MOCK_POSTS.map((p) => createPost(p))
      return { data: { posts: MOCK_POSTS } }
    }
    const { data } = await api.get('/posts')
    posts.value = data.posts.map((p) => createPost(p))
    return { data }
  }

  async function fetchPost(postId) {
    if (USE_MOCKS) {
      const found = MOCK_POSTS.find((p) => p.id == postId) || MOCK_POSTS[0]
      post.value = createPost(found)
      return { data: { post: found } }
    }
    const { data } = await api.get(`/posts/${postId}`)
    post.value = createPost(data.post)
    return { data }
  }

  async function storePost(request) {
    if (USE_MOCKS) return { data: { message: 'Post created' } }
    const { data } = await api.post('/posts', request)
    return { data }
  }

  async function updatePost(request) {
    if (USE_MOCKS) {
      const id = request instanceof FormData ? Number(request.get('id')) : request?.id
      const content = request instanceof FormData ? request.get('content') : request?.content
      const tag = request instanceof FormData ? request.get('tag') : request?.tag
      const found = MOCK_POSTS.find((p) => p.id === id) || MOCK_POSTS[0]
      const updated = { ...found, content: content || found.content, tag: tag || found.tag }
      post.value = createPost(updated)
      return { data: { post: updated } }
    }
    const id = request instanceof FormData ? request.get('id') : request?.id
    const { data } = await api.post(`/posts/${id}`, request)
    post.value = createPost(data.post)
    return { data }
  }

  async function postLike(postId) {
    if (USE_MOCKS) return { data: { message: 'Liked' } }
    const { data } = await api.post(`/posts/${postId}/like`)
    return { data }
  }

  async function postDislike(postId) {
    if (USE_MOCKS) return { data: { message: 'Disliked' } }
    const { data } = await api.post(`/posts/${postId}/dislike`)
    return { data }
  }

  async function reportPost(postId) {
    if (USE_MOCKS) return { data: { message: 'Reported' } }
    const { data } = await api.post(`/posts/${postId}/report`)
    return { data }
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
