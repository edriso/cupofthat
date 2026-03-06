export function createPost(attrs = {}) {
  return {
    id: attrs.id || null,
    content: attrs.content || '',
    tag: attrs.tag || '',
    image: attrs.image || null,
    newImage: attrs.newImage || null,
    owner: attrs.owner || {},
    created_at: attrs.created_at || '',
    liked: attrs.liked || false,
    likesCount: attrs.likesCount || 0,

    request() {
      const formData = new FormData()
      formData.append('id', this.id)
      formData.append('content', this.content)
      formData.append('tag', this.tag)
      if (this.newImage) {
        formData.append('image', this.newImage)
      }
      return formData
    },
  }
}
