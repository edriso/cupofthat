const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const profilePictureUpload = API_URL + '/profile/profile-picture'
export const coverImageUpload = API_URL + '/profile/profile-cover'
