import defaultProfile from '@/assets/default-profile.svg'
import defaultCover from '@/assets/default-cover.svg'

export function useUserImage() {
  function getProfileImage(user) {
    if (user?.images?.length) {
      const img = user.images.find((i) => i.type === 'user_profiles')
      if (img?.image) return img.image
    }
    return defaultProfile
  }

  function getCoverImage(user) {
    if (user?.images?.length) {
      const img = user.images.find((i) => i.type === 'user_covers')
      if (img?.image) return img.image
    }
    return defaultCover
  }

  return { getProfileImage, getCoverImage, defaultProfile, defaultCover }
}
