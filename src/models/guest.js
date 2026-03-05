export function createGuest(attrs = {}) {
  return {
    old_password: attrs.old_password || '',
    name: attrs.name || '',
    username: attrs.username || '',
    email: attrs.email || '',
    new_email: attrs.new_email || '',
    password: attrs.password || '',
    password_confirmation: attrs.password_confirmation || '',
    verification_code: attrs.verification_code || '',

    loginRequest() {
      return { email: this.email, password: this.password }
    },
    registerRequest() {
      return {
        name: this.name,
        username: this.username,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation,
      }
    },
    forgotPasswordRequest() {
      return { email: this.email }
    },
    resetPasswordRequest() {
      return {
        email: this.email,
        verification_code: this.verification_code,
        password: this.password,
        password_confirmation: this.password_confirmation,
      }
    },
    emailVerificationRequest() {
      return { email: this.email, verification_code: this.verification_code }
    },
    resendNewCodeRequest() {
      return { email: this.email }
    },
    updateUsernameRequest() {
      return { username: this.username }
    },
    updatePasswordRequest() {
      return {
        old_password: this.old_password,
        password: this.password,
        password_confirmation: this.password_confirmation,
      }
    },
    updateEmailRequest() {
      return {
        email: this.email,
        new_email: this.new_email,
        password: this.password,
      }
    },
  }
}
