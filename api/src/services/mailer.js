import config from '../config'

export default class MailerService {

  constructor (container) {
    this.emailClient = container.get('emailClient')
    this.mailData = {
      from: `Dany Dodson ❤️ ${config.mailgun.name}`,
    }
  }

  async sendVerifyEmail (email, client, verifyToken) {
    const data = {
      from: this.mailData.from,
      to: email,
      subject: 'Welocome, Please verify your email address to get started !',
      template: 'verify_email',
      'v:client': client,
      'v:verifyToken': verifyToken,
      'o:tag': ['automated', 'signup'],
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendVerifiedEmail (email) {
    const data = {
      from: this.mailData.from,
      to: email,
      subject: 'Your accounts been verified !',
      text: 'Your accounts been verified',
      html: '<p>Your accounts been verified</p>',
      'o:tag': ['automated', 'verified'],
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendForgotPasswordEmail (email, client, resetPassToken) {
    const data = {
      from: this.mailData.from,
      to: email,
      subject: 'Request to reset password ?',
      text: `Reset password link: ${client}/verify${resetPassToken}`,
      html: `<p>Reset password link:</p> <p>${client}/reset/${resetPassToken}</p>`,
      'o:tag': ['automated', 'forgot password']
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendPasswordResetEmail (email) {
    const data = {
      from: this.mailData.from,
      to: email,
      subject: 'Your password has been reset !',
      text: 'Password has been reset !',
      html: '<p>Password has been reset !</p>',
      'o:tag': ['automated', 'reset password']
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async startEmailSequence (sequence, user) {
    if (!user.email) {
      throw new Error('no email provided')
    }
    /** @TODO Add example of an email sequence implementation
     * Something like
     * 1 - Send first email of the sequence
     * 2 - Save the step of the sequence in database
     * 3 - Schedule job for second email in 1-3 days or whatever
     * Every sequence can have its own behavior so maybe
     * the pattern Chain of Responsibility can help here.
     * return { delivered: 1, status: 'ok' }
   */
  }
}