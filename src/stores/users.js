import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createUser } from '@/models/user'
import { createPost } from '@/models/post'
import {
  MOCK_USER,
  MOCK_OTHER_USER,
  MOCK_POSTS,
  MOCK_CALENDAR,
  MOCK_BADGE,
} from '@/mock/data'
import { USE_MOCKS } from '@/helpers/config'
import api from '@/services/api'

export const useUsersStore = defineStore('users', () => {
  const author = ref(createUser())
  const authorPosts = ref([])
  const userCalendar = ref([])
  const userBadge = ref(null)

  async function fetchUserProfile(username) {
    if (USE_MOCKS) {
      const userData = username === MOCK_USER.username ? MOCK_USER : MOCK_OTHER_USER
      author.value = createUser(userData)
      return { data: { user: userData } }
    }
    const { data } = await api.get(`/users/${username}`)
    author.value = createUser(data.user)
    return { data }
  }

  async function fetchUserPosts(username) {
    if (USE_MOCKS) {
      const filtered = MOCK_POSTS.filter((p) => p.owner.username === username)
      authorPosts.value = filtered.map((p) => createPost(p))
      return { data: { posts: filtered } }
    }
    const { data } = await api.get(`/users/${username}/posts`)
    authorPosts.value = data.posts.map((p) => createPost(p))
    return { data }
  }

  async function getCalendar() {
    if (USE_MOCKS) {
      userCalendar.value = MOCK_CALENDAR
      return { data: { data: MOCK_CALENDAR } }
    }
    const { data } = await api.get('/calendar')
    userCalendar.value = data.data
    return { data }
  }

  async function getBadge() {
    if (USE_MOCKS) {
      userBadge.value = MOCK_BADGE
      return { data: { data: MOCK_BADGE } }
    }
    const { data } = await api.get('/badge')
    userBadge.value = data.data
    return { data }
  }

  async function followUser(username) {
    if (USE_MOCKS) return { data: { message: 'Followed' } }
    const { data } = await api.post(`/users/${username}/follow`)
    return { data }
  }

  async function unfollowUser(username) {
    if (USE_MOCKS) return { data: { message: 'Unfollowed' } }
    const { data } = await api.post(`/users/${username}/unfollow`)
    return { data }
  }

  async function blockUser(username) {
    if (USE_MOCKS) return { data: { message: 'Blocked' } }
    const { data } = await api.post(`/users/${username}/block`)
    return { data }
  }

  async function unblockUser(username) {
    if (USE_MOCKS) return { data: { message: 'Unblocked' } }
    const { data } = await api.post(`/users/${username}/unblock`)
    return { data }
  }

  async function setCoverImage(formData) {
    if (USE_MOCKS) {
      const fakeUrl = 'https://picsum.photos/seed/newcover/1200/400'
      const idx = author.value.images.findIndex((i) => i.type === 'user_covers')
      if (idx !== -1) author.value.images[idx].image = fakeUrl
      return { data: { message: fakeUrl } }
    }
    const { data } = await api.post('/profile/profile-cover', formData)
    return { data }
  }

  async function setProfileImage(formData) {
    if (USE_MOCKS) {
      const fakeUrl = 'https://i.pravatar.cc/200?u=newprofile'
      const idx = author.value.images.findIndex((i) => i.type === 'user_profiles')
      if (idx !== -1) author.value.images[idx].image = fakeUrl
      return { data: { message: fakeUrl } }
    }
    const { data } = await api.post('/profile/profile-picture', formData)
    return { data }
  }

  async function searchUsers(query) {
    if (USE_MOCKS) return { data: { users: [MOCK_USER, MOCK_OTHER_USER] } }
    const { data } = await api.get('/users/search', { params: { q: query } })
    return { data }
  }

  return {
    author,
    authorPosts,
    userCalendar,
    userBadge,
    fetchUserProfile,
    fetchUserPosts,
    getCalendar,
    getBadge,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
    setCoverImage,
    setProfileImage,
    searchUsers,
  }
})
