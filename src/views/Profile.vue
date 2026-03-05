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

const isFollowing = ref(false)
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

const authorHasBioOrSocials = computed(() => {
  const a = usersStore.author
  return a.bio || a.socials?.facebook || a.socials?.twitter || a.socials?.linkedin || a.socials?.website
})

watch(currentUsername, () => setUserProfile())

watch(() => usersStore.author, (author) => {
  if (author) {
    isFollowing.value = !!author.followers?.find((f) => f.username === auth.user.username)
    isBlocked.value = !!auth.user.blocklist?.find((b) => b.username === author.username)
  }
})

function setUserProfile() {
  let username = currentUsername.value
  if (!username && route.name === 'myaccount') {
    username = auth.user.username
  }
  if (username) {
    if (username === auth.user.username) usersStore.getBadge()
    usersStore.fetchUserProfile(username).then(() => {
      document.title = `Cup Of That | ${usersStore.author.name}'s Profile`
      usersStore.fetchUserPosts(username)
    })
  }
}

function toggleFollow() {
  if (isFollowing.value) {
    isFollowing.value = false
    usersStore.unfollowUser(usersStore.author.username).then(() => {
      auth.user.following = auth.user.following.filter((f) => f.id !== usersStore.author.id)
    })
  } else {
    isFollowing.value = true
    usersStore.followUser(usersStore.author.username).then(() => {
      auth.user.following.push(usersStore.author)
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
      auth.user.following = auth.user.following.filter((f) => f.id !== usersStore.author.id)
      showBlockModal.value = false
      router.replace({ name: 'feeds' })
    })
  }
}

onBeforeMount(() => {
  let username = route.params.username
  if (!username && route.name === 'myaccount') {
    username = auth.user.username
  }
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
  <main class="container mx-auto px-4 pt-20 pb-8">
    <div class="max-w-xl mx-auto">
      <MakePost v-if="auth.hasNotPostedToday" />

      <div class="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div
          class="h-40 bg-cover bg-center relative"
          :style="{ backgroundImage: `url(${authorCover})` }"
        ></div>

        <div class="relative px-4 pb-4">
          <img
            :src="authorPhoto"
            alt="profile picture"
            class="w-24 h-24 rounded-full object-cover border-4 border-white -mt-12 relative z-10"
          />

          <div v-if="myProfile" class="absolute top-2 right-2">
            <BaseDropdown noCaret dropleft size="sm">
              <template #button-content>
                <i class="icon icon-dot-3"></i>
              </template>
              <button class="block w-full text-left px-4 py-2 hover:bg-bg text-xs cursor-pointer whitespace-nowrap" @click="changeProfile?.openPicker()">
                Change profile picture
              </button>
              <button class="block w-full text-left px-4 py-2 hover:bg-bg text-xs cursor-pointer whitespace-nowrap" @click="changeCover?.openPicker()">
                Change cover photo
              </button>
              <div class="my-0.5 border-t border-border-light"></div>
              <router-link :to="{ name: 'settings' }" class="block px-4 py-2 hover:bg-bg text-xs whitespace-nowrap">
                Edit profile
              </router-link>
            </BaseDropdown>
          </div>

          <template v-if="myProfile">
            <ChangeCoverPhoto ref="changeCover" />
            <ChangeProfilePicture ref="changeProfile" />
          </template>

          <h3 class="text-xl font-bold mt-2">
            {{ usersStore.author.name }}
            <span v-if="usersStore.userBadge && myProfile" class="text-cyan" :title="`Active for ${usersStore.userBadge.value || ''} days`">
              <i :class="'icon icon-' + usersStore.userBadge.icon"></i>
            </span>
          </h3>

          <p class="text-darkgray">{{ usersStore.author.craft }}</p>

          <p class="mt-1">
            <span class="inline-flex items-center gap-1 bg-nav/10 text-nav px-2 py-0.5 rounded-full text-sm font-medium">
              <i class="icon icon-cup"></i> {{ usersStore.author.postsCount }}
            </span>
          </p>
        </div>
      </div>

      <div v-if="authorHasBioOrSocials" class="bg-white rounded-lg shadow p-4 mb-4">
        <h5 class="font-medium mb-2">About Me</h5>
        <p v-if="usersStore.author.bio" class="text-darkgray mb-3">{{ usersStore.author.bio }}</p>
        <ul class="flex gap-4">
          <li v-if="usersStore.author.socials?.facebook">
            <a :href="usersStore.author.socials.facebook" target="_blank" rel="noopener noreferrer" class="text-blue hover:opacity-70" title="Facebook">
              <i class="icon icon-facebook text-xl"></i>
            </a>
          </li>
          <li v-if="usersStore.author.socials?.twitter">
            <a :href="usersStore.author.socials.twitter" target="_blank" rel="noopener noreferrer" class="text-cyan hover:opacity-70" title="Twitter">
              <i class="icon icon-twitter text-xl"></i>
            </a>
          </li>
          <li v-if="usersStore.author.socials?.linkedin">
            <a :href="usersStore.author.socials.linkedin" target="_blank" rel="noopener noreferrer" class="text-blue hover:opacity-70" title="LinkedIn">
              <i class="icon icon-linkedin text-xl"></i>
            </a>
          </li>
          <li v-if="usersStore.author.socials?.website">
            <a :href="usersStore.author.socials.website" target="_blank" rel="noopener noreferrer" class="text-darkgray hover:opacity-70" title="Website">
              <i class="icon icon-globe text-xl"></i>
            </a>
          </li>
        </ul>
      </div>

      <div v-if="!myProfile" class="bg-white rounded-lg shadow p-4 mb-4 flex gap-2">
        <button
          v-if="!isBlocked"
          class="btn btn-sm"
          :class="isFollowing ? 'btn-success' : 'btn-white'"
          @click="toggleFollow"
        >
          <i class="icon icon-plus-circled"></i>
          <span class="ml-1">{{ isFollowing ? 'Following' : 'Follow' }}</span>
        </button>
        <button
          class="btn btn-sm text-react"
          :class="isBlocked ? 'btn-pink' : 'btn-white'"
          @click="showBlockModal = true"
        >
          <i class="icon icon-cancel-circled"></i>
          {{ isBlocked ? 'Unblock' : 'Block' }}
        </button>

        <BaseModal v-model="showBlockModal">
          <h5>
            <span v-if="!isBlocked">Block</span><span v-else>Unblock</span>
            {{ usersStore.author.name }}?
          </h5>
          <template #footer>
            <button class="btn btn-light" @click="showBlockModal = false">Cancel</button>
            <button class="btn btn-pink ml-2" @click="handleBlock">
              <span v-if="!isBlocked">Block</span><span v-else>Unblock</span>
            </button>
          </template>
        </BaseModal>
      </div>

      <hr class="my-4 border-border" />

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
    </div>
  </main>
</template>
