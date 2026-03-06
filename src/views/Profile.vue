<script setup>
import { ref, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useUserImage } from '@/composables/useUserImage'
import MakePost from '@/components/MakePost.vue'
import PostProfile from '@/components/PostProfile.vue'
import PostProfileOther from '@/components/PostProfileOther.vue'
import ReportPost from '@/components/ReportPost.vue'
import PostImageModal from '@/components/PostImageModal.vue'
import ChangeCoverPhoto from '@/components/ChangeCoverPhoto.vue'
import ChangeProfilePicture from '@/components/ChangeProfilePicture.vue'
import BaseDropdown from '@/components/ui/BaseDropdown.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const usersStore = useUsersStore()
const { getProfileImage, getCoverImage } = useUserImage()

const isBlocked = ref(false)
const showBlockModal = ref(false)
const reporting = ref(null)
const showImageModal = ref(null)
const changeCover = ref(null)
const changeProfile = ref(null)

const currentUsername = computed(() => route.params.username)
const authorPhoto = computed(() => getProfileImage(usersStore.author))
const authorCover = computed(() => getCoverImage(usersStore.author))
const myProfile = computed(() => usersStore.author.id === auth.user.id)

const authorHasBioOrWebsite = computed(() => {
  const a = usersStore.author
  return a.bio || a.socials?.website
})

watch(currentUsername, () => setUserProfile())

watch(() => usersStore.author, (author) => {
  if (author) {
    isBlocked.value = !!auth.user.blocklist?.find((b) => b.username === author.username)
  }
})

function setUserProfile() {
  const username = currentUsername.value
  if (username) {
    usersStore.fetchUserProfile(username).then(() => {
      if (!usersStore.author.id) {
        router.replace({ name: 'notFound' })
        return
      }
      document.title = `Cup Of That | ${usersStore.author.name}'s Profile`
      usersStore.fetchUserPosts(username)
    })
  }
}

function handleBlock() {
  if (isBlocked.value) {
    isBlocked.value = false
    usersStore.unblockUser(usersStore.author.username).then(() => {
      auth.user.blocklist = auth.user.blocklist.filter((b) => b.id !== usersStore.author.id)
      showBlockModal.value = false
    })
  } else {
    isBlocked.value = true
    usersStore.blockUser(usersStore.author.username).then(() => {
      auth.user.blocklist.push(usersStore.author)
      showBlockModal.value = false
      router.replace({ name: 'feeds' })
    })
  }
}

onBeforeMount(() => {
  const username = route.params.username
  usersStore.fetchUserProfile(username).then(() => {
    const iAmBlocked = usersStore.author.blocklist?.find((b) => b.username === auth.user.username)
    const iBlockedThem = auth.user.blocklist?.find((b) => b.username === usersStore.author.username)
    if (iAmBlocked || iBlockedThem) {
      router.replace({ name: 'notFound' })
    }
  })
})

onMounted(() => setUserProfile())
</script>

<template>
  <main class="page-container">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <!-- Profile Card -->
      <div class="bg-white rounded-lg shadow overflow-hidden mt-4 mb-4">
        <!-- Cover Photo -->
        <div
          class="h-44 bg-cover bg-center relative bg-nav/10"
          :style="{ backgroundImage: `url(${authorCover})` }"
        >
          <!-- My profile menu (top-right on cover) -->
          <div v-if="myProfile" class="absolute top-3 right-3">
            <BaseDropdown noCaret dropleft size="sm" variant="white">
              <template #button-content>
                <i class="icon icon-dot-3"></i>
              </template>
              <button class="block w-full text-left px-4 py-2 hover:bg-bg text-xs whitespace-nowrap" @click="changeProfile?.openPicker()">
                Change profile picture
              </button>
              <button class="block w-full text-left px-4 py-2 hover:bg-bg text-xs whitespace-nowrap" @click="changeCover?.openPicker()">
                Change cover photo
              </button>
              <div class="my-0.5 border-t border-border-light"></div>
              <router-link :to="{ name: 'settings' }" class="block px-4 py-2 hover:bg-bg text-xs whitespace-nowrap">
                Edit profile
              </router-link>
            </BaseDropdown>
          </div>

          <!-- Other user: block menu (top-right on cover) -->
          <div v-if="!myProfile" class="absolute top-3 right-3">
            <BaseDropdown noCaret dropleft size="sm" variant="white">
              <template #button-content>
                <i class="icon icon-dot-3"></i>
              </template>
              <button
                class="block w-full text-left px-4 py-2 hover:bg-bg text-xs whitespace-nowrap text-react"
                @click="showBlockModal = true"
              >
                {{ isBlocked ? 'Unblock user' : 'Block user' }}
              </button>
            </BaseDropdown>
          </div>
        </div>

        <!-- Profile Info -->
        <div class="relative px-5 pb-5">
          <!-- Avatar -->
          <img
            :src="authorPhoto"
            alt="profile picture"
            class="w-24 h-24 rounded-full object-cover border-4 border-white relative z-10 shadow-sm -mt-12 mb-3"
          />

          <!-- Name & Craft -->
          <h3 class="text-xl font-bold">
            {{ usersStore.author.name }}
            <span v-if="usersStore.author.activeDays && myProfile" class="text-nav/60 text-sm font-medium ml-1" :title="`Active for ${usersStore.author.activeDays} days`">
              <i class="icon icon-cup"></i> {{ usersStore.author.activeDays }}
            </span>
          </h3>

          <p v-if="usersStore.author.craft" class="text-darkgray text-sm">{{ usersStore.author.craft }}</p>

          <!-- Stats row -->
          <div class="flex items-center gap-3 mt-3">
            <span class="inline-flex items-center gap-1 bg-nav/10 text-nav px-2.5 py-1 rounded-full text-sm font-medium">
              <i class="icon icon-cup"></i> {{ usersStore.author.postsCount }}
            </span>
          </div>

          <!-- Bio & Website -->
          <div v-if="authorHasBioOrWebsite" class="mt-4 pt-4 border-t border-border-light">
            <p v-if="usersStore.author.bio" class="text-sm text-darkgray leading-relaxed">{{ usersStore.author.bio }}</p>
            <a
              v-if="usersStore.author.socials?.website"
              :href="usersStore.author.socials.website"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm text-cyan hover:text-cyan-dark mt-2"
            >
              <i class="icon icon-globe"></i>
              {{ usersStore.author.socials.website.replace(/^https?:\/\//, '') }}
            </a>
          </div>
        </div>
      </div>

      <template v-if="myProfile">
        <ChangeCoverPhoto ref="changeCover" />
        <ChangeProfilePicture ref="changeProfile" />
      </template>

      <!-- Block Modal -->
      <BaseModal v-model="showBlockModal" size="sm">
        <div class="text-center py-2">
          <div class="w-12 h-12 rounded-full bg-react/10 flex items-center justify-center mx-auto mb-3">
            <i class="icon icon-cancel-circled text-react text-xl"></i>
          </div>
          <h5 class="font-semibold mb-1">
            {{ isBlocked ? 'Unblock' : 'Block' }} {{ usersStore.author.name }}?
          </h5>
          <p v-if="!isBlocked" class="text-sm text-darkgray">They won't be able to see your profile or posts.</p>
          <p v-else class="text-sm text-darkgray">They will be able to see your profile and posts again.</p>
        </div>
        <template #footer>
          <div class="flex gap-2 w-full">
            <button class="btn btn-light flex-1" @click="showBlockModal = false">Cancel</button>
            <button class="btn flex-1" :class="isBlocked ? 'btn-cta' : 'btn-pink'" @click="handleBlock">
              {{ isBlocked ? 'Unblock' : 'Block' }}
            </button>
          </div>
        </template>
      </BaseModal>

      <!-- Posts -->
      <div v-if="usersStore.authorPosts.length">
        <template v-if="myProfile">
          <PostProfile
            v-for="post in usersStore.authorPosts"
            :key="post.id"
            :post="post"
            @showPostImage="showImageModal?.showModal(post.image)"
          />
        </template>
        <template v-else>
          <PostProfileOther
            v-for="post in usersStore.authorPosts"
            :key="post.id"
            :post="post"
            @report="reporting?.showReport(post.id)"
            @showPostImage="showImageModal?.showModal(post.image)"
          />
          <ReportPost ref="reporting" />
        </template>
        <PostImageModal ref="showImageModal" />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12 text-darkgray">
        <i class="icon icon-cup text-3xl text-gray mb-2 block"></i>
        <p class="text-sm">No posts yet.</p>
      </div>
    </div>
  </main>
</template>
