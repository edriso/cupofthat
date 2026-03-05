<script setup>
import { ref, onMounted } from 'vue'
import { usePostStore } from '@/stores/post'
import { useDatetime } from '@/composables/useDatetime'
import EditPostModal from '@/components/EditPostModal.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'

const props = defineProps({
  post: Object,
  hideDate: { type: Boolean, default: false },
})
const emit = defineEmits(['showPostImage', 'updatePost'])

const postStore = usePostStore()
const { formatDate } = useDatetime()

const longContent = ref(false)
const expanded = ref(false)
const contentText = ref(null)
const showEdit = ref(false)

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
  <div class="bg-white rounded-lg shadow mb-4 hover:shadow-md transition-shadow">
    <div v-if="post.image" class="cursor-pointer overflow-hidden rounded-t-lg" @click="emit('showPostImage')">
      <img :src="post.image" alt="Post photo" class="w-full object-cover max-h-80 hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
    </div>

    <div class="px-4 pt-3 pb-4">
      <div class="flex items-start justify-between gap-2">
        <p
          ref="contentText"
          class="text-font leading-relaxed flex-1"
          :class="{ 'max-h-64 overflow-hidden': longContent && !expanded }"
        >
          {{ post.content }}
        </p>

        <div class="flex items-center gap-0.5 shrink-0 -mt-0.5">
          <button
            class="flex items-center gap-1 transition-colors p-1"
            :class="post.liked ? 'text-react' : 'text-gray hover:text-react'"
            @click="handleLikes"
          >
            <i class="text-sm" :class="post.liked ? 'icon icon-heart' : 'icon icon-heart-empty'"></i>
            <span v-if="post.likesCount > 0" class="text-xs">{{ post.likesCount }}</span>
          </button>
          <BaseDropdown noCaret dropleft dropup>
            <template #button-content>
              <i class="icon icon-dot-3 text-gray text-sm"></i>
            </template>
            <button class="block w-full text-left px-4 py-2 hover:bg-bg text-xs" @click="showEdit = true">
              Edit Post
            </button>
          </BaseDropdown>
        </div>
      </div>

      <button v-if="longContent" class="text-xs text-cyan hover:underline mt-1" @click="expanded = !expanded">
        {{ expanded ? 'Show less' : 'Read more' }}
      </button>

      <div v-if="post.tag || !hideDate" class="flex items-center gap-2 mt-2">
        <span v-if="post.tag" class="inline-block text-xs text-cyan font-medium bg-cyan/10 px-2.5 py-0.5 rounded-full">
          #{{ post.tag }}
        </span>
        <router-link
          v-if="!hideDate"
          :to="{ name: 'preview', params: { postId: post.id } }"
          class="text-xs text-gray hover:text-cyan transition-colors"
          :title="formatDate(post.created_at, false)"
        >
          {{ formatDate(post.created_at) }}
        </router-link>
      </div>
    </div>

    <EditPostModal
      v-model="showEdit"
      :postId="post.id"
      :post="post"
      :postContent="post.content"
      :postTag="post.tag"
      @postUpdated="emit('updatePost', $event)"
    />
  </div>
</template>
