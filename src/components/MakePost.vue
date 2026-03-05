<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { usePostStore } from '@/stores/post'
import { useUsersStore } from '@/stores/users'
import { useAppStore } from '@/stores/app'
import { createPost } from '@/models/post'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseFileInput from '@/components/ui/BaseFileInput.vue'

const route = useRoute()
const auth = useAuthStore()
const postStore = usePostStore()
const usersStore = useUsersStore()
const app = useAppStore()

const showModal = ref(false)
const maxLetters = 220
const errorMsg = ref('')
const postImage = ref(null)
const tag = ref('')

const schema = yup.object({
  content: yup.string().required("Humm, tell us what you've done awesome today!").max(220, 'Keep your post as brief as 220 chars'),
})

const { handleSubmit, errors, resetForm } = useForm({ validationSchema: schema })
const { value: content } = useField('content')

const handlePost = handleSubmit(async (values) => {
  errorMsg.value = ''
  const post = createPost({
    content: values.content,
    tag: tag.value,
    newImage: postImage.value,
  })
  try {
    await postStore.storePost(post.request())
    auth.user.last_post_date = new Date()
    if (route.name === 'profile') {
      usersStore.fetchUserPosts(route.params.username)
    } else {
      postStore.fetchPosts()
    }
    showModal.value = false
    resetForm()
    tag.value = ''
    postImage.value = null
  } catch (err) {
    errorMsg.value = err?.response?.data?.message || 'Failed to create post'
  }
})
</script>

<template>
  <div>
    <button
      class="fixed bottom-6 right-6 z-30 btn btn-yellow rounded-full w-14 h-14 text-2xl shadow-lg flex items-center justify-center p-0"
      @click="showModal = true"
    >
      <i class="icon icon-plus"></i>
    </button>

    <BaseModal v-model="showModal" :title="`Day #${auth.user.postsCount + 1}`">
      <p v-if="errorMsg" class="invalid-feedback mb-2">{{ errorMsg }}</p>
      <form id="new-post-form" @submit.prevent="handlePost">
        <p v-if="errors.content" class="invalid-feedback">{{ errors.content }}</p>
        <textarea
          class="form-control"
          :maxlength="maxLetters"
          rows="5"
          placeholder="Yay! You've did something today!"
          v-model="content"
        ></textarea>
        <p v-if="(content?.length || 0) > maxLetters - 40" class="text-right text-gray-500 text-sm mt-1">
          {{ content?.length || 0 }} letters
        </p>
        <div class="mt-2">
          <BaseFileInput
            accept="image/jpeg, image/png, image/gif"
            placeholder="Choose a photo"
            v-model="postImage"
          />
        </div>
      </form>

      <template #footer>
        <div class="w-full">
          <div class="flex justify-between items-center">
            <input type="text" class="form-control w-1/4" maxlength="30" placeholder="Tag" v-model.trim="tag" />
            <button class="btn btn-yellow" :disabled="app.loading" type="submit" form="new-post-form">
              {{ app.loading ? 'Posting...' : 'Post' }}
            </button>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
