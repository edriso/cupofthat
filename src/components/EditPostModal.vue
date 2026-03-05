<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePostStore } from '@/stores/post'
import { useUsersStore } from '@/stores/users'
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

const route = useRoute()
const postStore = usePostStore()
const usersStore = useUsersStore()
const app = useAppStore()

const maxLetters = 220
const editContent = ref('')
const postImage = ref(null)
const errorMsg = ref('')

onMounted(() => {
  editContent.value = props.postContent
})

async function handlePostUpdate() {
  props.post.newImage = postImage.value
  props.post.content = editContent.value

  try {
    const res = await postStore.updatePost(props.post.request ? props.post.request() : props.post)
    if (route.params.username) {
      usersStore.fetchUserPosts(route.params.username)
    } else if (route.params.postId || route.name === 'calendar') {
      const updatedPost = res.data.post
      props.post.content = updatedPost.content
      props.post.image = updatedPost.image
      emit('postUpdated', updatedPost)
    } else {
      postStore.fetchPosts()
    }
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
      <p v-if="editContent.length > maxLetters - 40" class="text-right text-sm mt-1" :class="editContent.length > maxLetters - 10 ? 'text-react' : 'text-gray-400'">
        {{ editContent.length }}/{{ maxLetters }}
      </p>
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
        <button :disabled="app.loading" class="btn btn-sm btn-cta cursor-pointer" type="submit" :form="`post${postId}-form`">
          {{ app.loading ? 'Updating...' : 'Update' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>
