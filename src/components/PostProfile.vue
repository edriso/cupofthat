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
  <div class="bg-white rounded-lg shadow mb-4 overflow-hidden hover:shadow-md transition-shadow">
    <div v-if="post.image" class="cursor-pointer overflow-hidden" @click="emit('showPostImage')">
      <img :src="post.image" alt="Post photo" class="w-full object-cover max-h-80 hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
    </div>

    <div class="p-4">
      <p
        ref="contentText"
        class="text-font leading-relaxed"
        :class="{ 'max-h-64 overflow-hidden': longContent && !expanded }"
      >
        {{ post.content }}
      </p>
      <button v-if="longContent" class="text-xs text-cyan hover:underline mt-1" @click="expanded = !expanded">
        {{ expanded ? 'Show less' : 'Read more' }}
      </button>

      <div class="flex items-center justify-between mt-3">
        <div class="flex items-center gap-2">
          <span v-if="post.tag" class="inline-block text-xs text-cyan font-medium bg-cyan/10 px-2.5 py-0.5 rounded-full">
            #{{ post.tag }}
          </span>
          <router-link
            v-if="!hideDate"
            :to="{ name: 'preview', params: { postId: post.id } }"
            class="text-xs text-gray-400 hover:text-cyan transition-colors"
            :title="formatDate(post.created_at, false)"
          >
            {{ formatDate(post.created_at) }}
          </router-link>
        </div>

        <div class="flex items-center gap-1">
          <button
            class="flex items-center gap-1 transition-colors text-sm cursor-pointer p-1"
            :class="post.liked ? 'text-react' : 'text-gray-400 hover:text-react'"
            @click="handleLikes"
          >
            <i :class="post.liked ? 'icon icon-heart' : 'icon icon-heart-empty'"></i>
            <span v-if="post.likesCount > 0" class="text-xs">{{ post.likesCount }}</span>
          </button>
          <BaseDropdown noCaret dropleft>
            <template #button-content>
              <i class="icon icon-dot-3 text-gray-400"></i>
            </template>
            <button class="block w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm cursor-pointer" @click="showEdit = true">
              Edit Post
            </button>
          </BaseDropdown>
        </div>
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
