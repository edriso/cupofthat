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
const expanded = ref(false)
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
  <div class="bg-white rounded-lg shadow mb-4 overflow-hidden hover:shadow-md transition-shadow">
    <div v-if="post.image" class="cursor-pointer overflow-hidden" @click="emit('showPostImage')">
      <img :src="post.image" alt="post img" class="w-full object-cover max-h-80 hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
    </div>

    <div class="p-4">
      <div class="flex items-center gap-3 mb-3">
        <router-link
          :to="{ name: 'profile', params: { username: postOwner.username } }"
          class="shrink-0"
        >
          <img :src="getProfileImage(postOwner)" :alt="postOwner.username" class="w-10 h-10 rounded-full object-cover" />
        </router-link>
        <div class="flex-1 min-w-0">
          <router-link
            :to="{ name: 'profile', params: { username: postOwner.username } }"
            class="text-sm font-semibold hover:text-cyan transition-colors"
          >
            {{ postOwner.firstname }} {{ postOwner.lastname }}
          </router-link>
          <router-link
            v-if="post.created_at"
            :to="{ name: 'preview', params: { postId: post.id } }"
            class="block text-xs text-gray-400 hover:text-cyan transition-colors"
            :title="formatDate(post.created_at, false)"
          >
            {{ formatDate(post.created_at) }}
          </router-link>
        </div>
        <BaseDropdown noCaret dropleft>
          <template #button-content>
            <i class="icon icon-dot-3 text-gray-400"></i>
          </template>
          <button v-if="isUserPostOwner" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" @click="showEdit = true">
            Edit Post
          </button>
          <button v-else class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" @click="emit('report')">
            Report Abuse
          </button>
        </BaseDropdown>
      </div>

      <p
        ref="contentText"
        class="text-font leading-relaxed mb-2"
        :class="{ 'max-h-64 overflow-hidden': longContent && !expanded }"
      >
        {{ post.content }}
      </p>
      <button v-if="longContent" class="text-xs text-cyan hover:underline mb-2" @click="expanded = !expanded">
        {{ expanded ? 'Show less' : 'Read more' }}
      </button>

      <span v-if="post.tag" class="inline-block text-xs text-cyan font-medium bg-cyan/10 px-2.5 py-0.5 rounded-full mb-3">
        #{{ post.tag }}
      </span>

      <div class="flex items-center pt-2 border-t border-gray-100">
        <button
          class="flex items-center gap-1.5 transition-colors text-sm cursor-pointer"
          :class="post.liked ? 'text-react' : 'text-gray-400 hover:text-react'"
          @click="handlePostLikes"
        >
          <i :class="post.liked ? 'icon icon-heart' : 'icon icon-heart-empty'"></i>
          <span v-if="post.likesCount > 0">{{ post.likesCount }}</span>
        </button>
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
