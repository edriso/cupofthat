<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useUserImage } from '@/composables/useUserImage'
import { useDatetime } from '@/composables/useDatetime'
import { createUser } from '@/models/user'
import EditPostModal from '@/components/EditPostModal.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'

const props = defineProps({ post: Object })
const emit = defineEmits(['report', 'showPostImage'])

const auth = useAuthStore()
const postStore = usePostStore()
const { getProfileImage } = useUserImage()
const { formatDate } = useDatetime()

const longContent = ref(false)
const contentText = ref(null)
const showEdit = ref(false)

const postOwner = computed(() => createUser(props.post.owner))
const isUserPostOwner = computed(() => postOwner.value.id === auth.user.id)
const postTags = computed(() => {
  if (typeof props.post.tags === 'string') return props.post.tags
  return Array.isArray(props.post.tags) ? props.post.tags.map((t) => t.name).join(',') : ''
})

function handlePostLikes() {
  if (!props.post.liked) {
    props.post.liked = true
    props.post.likesCount += 1
    postStore.postLike(props.post.id)
  } else {
    props.post.liked = false
    props.post.likesCount -= 1
    postStore.postDislike(props.post.id)
  }
}

onMounted(() => {
  if (contentText.value) {
    longContent.value = contentText.value.offsetHeight > 250
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow mb-4 overflow-hidden">
    <div v-if="post.image" class="cursor-pointer" @click="emit('showPostImage')">
      <img :src="post.image" alt="post img" class="w-full object-cover max-h-80" loading="lazy" />
    </div>

    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <router-link
          v-if="post.created_at"
          :to="{ name: 'preview', params: { postId: post.id } }"
          class="text-sm text-gray-500 hover:text-cyan"
          :title="formatDate(post.created_at, false)"
        >
          {{ formatDate(post.created_at) }}
        </router-link>

        <BaseDropdown noCaret dropleft>
          <template #button-content>
            <i class="icon icon-dot-3"></i>
          </template>
          <button v-if="isUserPostOwner" class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" @click="showEdit = true">
            Edit Post
          </button>
          <button v-else class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm" @click="emit('report')">
            Report Abuse
          </button>
        </BaseDropdown>
      </div>

      <p ref="contentText" class="text-font mb-2" :class="{ 'max-h-64 overflow-hidden': longContent }">
        {{ post.content }}
      </p>

      <p v-if="post.tag" class="text-xs text-cyan font-medium mb-3">{{ post.tag }}</p>

      <div class="flex justify-between items-center">
        <router-link
          :to="{ name: 'profile', params: { username: postOwner.username } }"
          class="flex items-center gap-2 hover:opacity-80"
        >
          <img :src="getProfileImage(postOwner)" :alt="postOwner.username" class="w-8 h-8 rounded-full object-cover" />
          <span class="text-sm font-medium">{{ postOwner.firstname }} {{ postOwner.lastname }}</span>
        </router-link>

        <span
          class="cursor-pointer transition-colors"
          :class="post.liked ? 'text-react' : 'text-gray-400'"
          @click="handlePostLikes"
        >
          <i class="icon icon-heart-empty"></i>
          <span v-if="post.likesCount > 0" class="text-sm ml-0.5">{{ post.likesCount }}</span>
        </span>
      </div>
    </div>

    <EditPostModal
      v-if="isUserPostOwner"
      v-model="showEdit"
      :post="post"
      :postId="post.id"
      :postContent="post.content"
      :postTag="postTags"
    />
  </div>
</template>
