export function createUser(attrs = {}) {
  return {
    id: attrs.id || null,
    firstname: attrs.firstname || '',
    lastname: attrs.lastname || '',
    username: attrs.username || '',
    craft: attrs.craft || '',
    about: attrs.about || '',
    bio: attrs.bio || '',
    email: attrs.email || '',
    birthday: attrs.birthday || '',
    password: attrs.password || '',
    images: attrs.images || [],
    postsCount: attrs.postsCount || 0,
    activeDays: attrs.activeDays || 0,
    blocklist: attrs.blocklist || [],
    calendar_start: attrs.calendar_start ?? 1,
    is_verified: attrs.is_verified ?? false,
    last_post_date: attrs.last_post_date || '',
    socials: {
      website: attrs.socials?.website || '',
    },

    get name() {
      return `${this.firstname} ${this.lastname}`.trim()
    },

    updateRequest() {
      return {
        firstname: this.firstname,
        lastname: this.lastname,
        craft: this.craft,
        bio: this.bio,
        birthday: this.birthday,
        socials: this.socials,
        calendar_start: this.calendar_start,
      }
    },
  }
}
