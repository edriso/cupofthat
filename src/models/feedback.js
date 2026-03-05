export function createFeedback(attrs = {}) {
  return {
    id: attrs.id || null,
    content: attrs.content || '',
    email: attrs.email || '',

    isEmpty() {
      return !this.content
    },
    request() {
      return { content: this.content, email: this.email }
    },
  }
}
