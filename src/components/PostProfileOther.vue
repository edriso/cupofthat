<script setup>
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useDatetime } from '@/composables/useDatetime'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'

const props = defineProps({ post: Object })
const emit = defineEmits(['report', 'showPostImage'])

const postStore = usePostStore()
const { formatDate } = useDatetime()

const longContent = ref(false)
const contentText = ref(null)

function handleLikes() {
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
      <img :src="post.image" alt="Post photo" class="w-full object-cover max-h-80" loading="lazy" />
    </div>

    <div class="p-4">
      <div class="flex justify-between items-center mb-2">
        <router-link
          :to="{ name: 'preview', params: { postId: post.id } }"
          class="text-sm text-darkgray hover:text-cyan"
          :title="formatDate(post.created_at, false)"
        >
          {{ formatDate(post.created_at) }}
        </router-link>

        <div class="flex items-center gap-2">
          <button
            class="transition-colors"
            :class="post.liked ? 'text-react' : 'text-gray hover:text-react'"
            @click="handleLikes"
          >
            <i :class="post.liked ? 'icon icon-heart' : 'icon icon-heart-empty'"></i>
            <span v-if="post.likesCount > 0" class="text-sm ml-0.5">{{ post.likesCount }}</span>
          </button>
          <BaseDropdown noCaret dropleft>
            <template #button-content>
              <i class="icon icon-dot-3"></i>
            </template>
            <button class="block w-full text-left px-4 py-2 hover:bg-bg text-sm" @click="emit('report')">
              Report Abuse
            </button>
          </BaseDropdown>
        </div>
      </div>

      <p ref="contentText" class="text-font mb-2" :class="{ 'max-h-64 overflow-hidden': longContent }">
        {{ post.content }}
      </p>

      <span v-if="post.tag" class="inline-block text-xs text-nav font-medium bg-nav/10 px-2.5 py-0.5 rounded-full">
        #{{ post.tag }}
      </span>
    </div>
  </div>
</template>
