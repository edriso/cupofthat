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
    const id = request instanceof FormData ? Number(request.get('id')) : request?.id
    const content = request instanceof FormData ? request.get('content') : request?.content
    const tag = request instanceof FormData ? request.get('tag') : request?.tag
    const found = MOCK_POSTS.find((p) => p.id === id) || MOCK_POSTS[0]
    const updated = { ...found, content: content || found.content, tag: tag || found.tag }
    post.value = createPost(updated)
    return { data: { post: updated } }
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
