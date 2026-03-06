<script setup>
import { ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useAppStore } from '@/stores/app'
import SearchResult from '@/components/SearchResult.vue'

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
</script>

<template>
  <main class="page-container pt-4">
    <div class="max-w-xl mx-auto">
      <form @submit.prevent="handleSearch" class="mb-4">
        <div class="flex bg-white rounded-lg shadow overflow-hidden">
          <div class="flex items-center pl-4 text-gray">
            <i class="icon icon-search"></i>
          </div>
          <input
            type="text"
            class="flex-1 px-3 py-3 outline-none bg-transparent text-font placeholder-gray"
            placeholder="Search by name or username"
            autocomplete="off"
            v-model.lazy="searchKey"
          />
          <button class="px-5 text-sm font-medium text-cyan hover:bg-bg transition-colors" type="submit">Search</button>
        </div>
      </form>

      <ul v-if="usersMatch.length && searchKey" class="bg-white rounded-lg shadow divide-y divide-border-light">
        <SearchResult
          v-for="match in usersMatch"
          :key="match.id"
          :match="match"
        />
      </ul>

      <div v-if="searchKey && !usersMatch.length && !app.loading" class="text-center py-12">
        <i class="icon icon-search text-3xl text-gray/50 mb-3 block"></i>
        <p class="text-darkgray">No results for "{{ searchKey }}"</p>
      </div>
    </div>
  </main>
</template>
