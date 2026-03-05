<script setup>
import { ref, computed } from 'vue'
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
  content: yup.string().required("Tell us what you've done awesome today!").max(maxLetters, `Keep your post under ${maxLetters} characters`),
})

const { handleSubmit, errors, resetForm } = useForm({ validationSchema: schema })
const { value: content } = useField('content')

const charCount = computed(() => content.value?.length || 0)
const charRatio = computed(() => charCount.value / maxLetters)

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
    if (route.name === 'profile' || route.name === 'myaccount') {
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
      class="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-nav text-white shadow-lg hover:bg-nav-dark hover:shadow-xl active:scale-95 transition-all flex items-center justify-center cursor-pointer"
      @click="showModal = true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>

    <BaseModal v-model="showModal" hideHeader hideFooter>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-font">Day #{{ auth.user.postsCount + 1 }}</h3>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            @click="showModal = false"
          >
            <i class="icon icon-cancel-circled"></i>
          </button>
        </div>

        <p v-if="errorMsg" class="invalid-feedback">{{ errorMsg }}</p>

        <form id="new-post-form" @submit.prevent="handlePost">
          <p v-if="errors.content" class="invalid-feedback mb-2">{{ errors.content }}</p>
          <textarea
            class="form-control resize-none"
            :maxlength="maxLetters"
            rows="4"
            placeholder="What did you accomplish today?"
            v-model="content"
          ></textarea>

          <div class="flex justify-between items-center mt-1.5">
            <div v-if="charCount > 0" class="flex items-center gap-2">
              <div class="w-16 h-1 rounded-full bg-gray-200 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="charRatio > 0.9 ? 'bg-react' : charRatio > 0.7 ? 'bg-yellow' : 'bg-green'"
                  :style="{ width: `${charRatio * 100}%` }"
                ></div>
              </div>
              <span class="text-xs" :class="charRatio > 0.9 ? 'text-react' : 'text-gray-400'">
                {{ charCount }}/{{ maxLetters }}
              </span>
            </div>
            <div v-else></div>
          </div>

          <div class="mt-3">
            <BaseFileInput
              accept="image/jpeg, image/png, image/gif"
              placeholder="Add a photo"
              v-model="postImage"
            />
          </div>
        </form>

        <div class="flex items-center justify-between pt-2 border-t border-border-light">
          <input
            type="text"
            class="form-control w-32 text-sm"
            maxlength="30"
            placeholder="# Tag"
            v-model.trim="tag"
          />
          <button
            class="btn btn-cta"
            :disabled="app.loading"
            type="submit"
            form="new-post-form"
          >
            {{ app.loading ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
