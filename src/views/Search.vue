<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useAppStore } from '@/stores/app'
import SearchResult from '@/components/SearchResult.vue'

const auth = useAuthStore()
const usersStore = useUsersStore()
const app = useAppStore()

const searchKey = ref('')
const usersMatch = ref([])

function handleSearch() {
  if (searchKey.value) {
    usersStore.searchUsers(searchKey.value).then((res) => {
      usersMatch.value = res.data.users || []
    })
  }
}

function isFollowingMatch(match) {
  return !!match.followers?.find((f) => f.username === auth.user.username)
}

function handleToggleFollow(match) {
  const following = isFollowingMatch(match)
  if (following) {
    match.followers = match.followers.filter((f) => f.id !== auth.user.id)
    usersStore.unfollowUser(match.username).then(() => {
      auth.user.following = auth.user.following.filter((f) => f.id !== match.id)
    })
  } else {
    match.followers.push(auth.user)
    usersStore.followUser(match.username).then(() => {
      auth.user.following.push(match)
    })
  }
}
</script>

<template>
  <main class="page-container">
    <div class="max-w-xl mx-auto">
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <form @submit.prevent="handleSearch">
          <div class="flex border rounded overflow-hidden">
            <input
              type="text"
              class="form-control flex-1 border-0"
              placeholder="Write a name or username"
              autocomplete="off"
              v-model.lazy="searchKey"
            />
            <button class="btn btn-light px-6" type="submit">Search</button>
          </div>
        </form>
      </div>

      <div class="mt-3">
        <ul v-if="usersMatch.length && searchKey" class="bg-white rounded-lg shadow p-4">
          <SearchResult
            v-for="match in usersMatch"
            :key="match.id"
            :match="match"
            :isFollowing="isFollowingMatch(match)"
            @toggleFollow="handleToggleFollow(match)"
          />
        </ul>

        <h5 v-if="searchKey && !usersMatch.length && !app.loading" class="text-center text-darkgray mt-4">
          We couldn't find "{{ searchKey }}"
        </h5>
      </div>
    </div>
  </main>
</template>
