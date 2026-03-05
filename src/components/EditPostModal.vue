<script setup>
import { ref, watch, computed } from 'vue'
import { usePostStore } from '@/stores/post'
import { useAppStore } from '@/stores/app'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseFileInput from '@/components/ui/BaseFileInput.vue'
import BaseAlert from '@/components/ui/BaseAlert.vue'

const props = defineProps({
  modelValue: Boolean,
  post: Object,
  postId: Number,
  postContent: { type: String, default: '' },
  postTag: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'postUpdated'])

const postStore = usePostStore()
const app = useAppStore()

const maxLetters = 220
const editContent = ref('')
const postImage = ref(null)
const errorMsg = ref('')

const charCount = computed(() => editContent.value?.length || 0)
const charRatio = computed(() => charCount.value / maxLetters)

watch(() => props.modelValue, (val) => {
  if (val) {
    editContent.value = props.postContent
    postImage.value = null
    errorMsg.value = ''
  }
})

async function handlePostUpdate() {
  props.post.newImage = postImage.value
  props.post.content = editContent.value

  try {
    const res = await postStore.updatePost(props.post.request ? props.post.request() : props.post)
    const updatedPost = res.data.post
    props.post.content = updatedPost.content
    if (updatedPost.image !== undefined) props.post.image = updatedPost.image
    if (updatedPost.tag !== undefined) props.post.tag = updatedPost.tag
    emit('postUpdated', updatedPost)
    emit('update:modelValue', false)
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || 'Update failed'
  }
}
</script>

<template>
  <BaseModal
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    title="Edit Post"
  >
    <BaseAlert v-if="errorMsg" :show="true" variant="danger">{{ errorMsg }}</BaseAlert>
    <form :id="`post${postId}-form`" @submit.prevent="handlePostUpdate">
      <textarea
        class="form-control resize-none"
        :maxlength="maxLetters"
        rows="4"
        v-model="editContent"
        required
      ></textarea>
      <div v-if="charCount > 0" class="flex items-center gap-2 mt-1.5">
        <div class="w-16 h-1 rounded-full bg-border overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="charRatio > 0.9 ? 'bg-react' : charRatio > 0.7 ? 'bg-yellow' : 'bg-green'"
            :style="{ width: `${charRatio * 100}%` }"
          ></div>
        </div>
        <span class="text-xs" :class="charRatio > 0.9 ? 'text-react' : 'text-gray'">
          {{ charCount }}/{{ maxLetters }}
        </span>
      </div>
      <div class="mt-3">
        <BaseFileInput
          accept="image/jpeg, image/png, image/gif"
          placeholder="Change photo"
          v-model="postImage"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <input type="text" class="form-control w-32 text-sm" maxlength="30" placeholder="# Tag" v-model.trim="post.tag" />
        <button :disabled="app.loading" class="btn btn-sm btn-cta" type="submit" :form="`post${postId}-form`">
          {{ app.loading ? 'Updating...' : 'Update' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
