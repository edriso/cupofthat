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

export const useUsersStore = defineStore('users', () => {
  const author = ref(createUser())
  const authorPosts = ref([])
  const userCalendar = ref([])
  const userBadge = ref(null)

  async function fetchUserProfile(username) {
    const userData = username === MOCK_USER.username ? MOCK_USER : MOCK_OTHER_USER
    author.value = createUser(userData)
    return { data: { user: userData } }
  }

  async function fetchUserPosts(username) {
    const filtered = MOCK_POSTS.filter((p) => p.owner.username === username)
    authorPosts.value = filtered.map((p) => createPost(p))
    return { data: { posts: filtered } }
  }

  async function getCalendar() {
    userCalendar.value = MOCK_CALENDAR
    return { data: { data: MOCK_CALENDAR } }
  }

  async function getBadge() {
    userBadge.value = MOCK_BADGE
    return { data: { data: MOCK_BADGE } }
  }

  async function followUser() {
    return { data: { message: 'Followed' } }
  }

  async function unfollowUser() {
    return { data: { message: 'Unfollowed' } }
  }

  async function blockUser() {
    return { data: { message: 'Blocked' } }
  }

  async function unblockUser() {
    return { data: { message: 'Unblocked' } }
  }

  async function setCoverImage() {
    const fakeUrl = 'https://picsum.photos/seed/newcover/1200/400'
    const idx = author.value.images.findIndex((i) => i.type === 'user_covers')
    if (idx !== -1) author.value.images[idx].image = fakeUrl
    return { data: { message: fakeUrl } }
  }

  async function setProfileImage() {
    const fakeUrl = 'https://i.pravatar.cc/200?u=newprofile'
    const idx = author.value.images.findIndex((i) => i.type === 'user_profiles')
    if (idx !== -1) author.value.images[idx].image = fakeUrl
    return { data: { message: fakeUrl } }
  }

  async function searchUsers() {
    return { data: { users: [MOCK_USER, MOCK_OTHER_USER] } }
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
