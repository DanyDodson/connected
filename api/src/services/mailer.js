import config from '../config'

export default class MailerService {

  constructor (container) {
    this.emailClient = container.get('emailClient')
    this.setMailData = (email, template, subject, text, html, tag1, tag2, client, token) => {
      return {
        to: email,
        from: `Dany Dodson ❤️ ${config.mailgun.name}`,
        template: template,
        subject: subject,
        text: text,
        html: html,
        'o:tag': [`${tag1}`, `${tag2}`],
        'v:client': client,
        'v:verifyToken': token,
      }
    }

  }

  async sendVerifyEmail (email, client, token) {
    const data = this.setMailData(
      email,
      'verify_email',
      'Welocome, Verify your account !',
      null,
      null,
      'automated',
      'signup',
      client,
      token,
    )
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendVerifiedEmail (email) {
    const data = this.setMailData(
      email,
      null,
      'Your accounts been verified !',
      'Your accounts been verified !',
      '<p>Your accounts been verified !</p>',
      'automated',
      'verified',
      null,
      null,
    )
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendForgotPasswordEmail (email, client, token) {
    const data = this.setMailData(
      email,
      null,
      'Request to reset password ?',
      `Reset password link: ${client}/verify${token}`,
      `<p>Reset password link:</p> <p>${client}/reset/${token}</p>`,
      'automated',
      'forgot password',
      client,
      token,
    )
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendPasswordResetEmail (email) {
    const data = this.setMailData(
      email,
      null,
      'Your password has been reset !',
      'Password has been reset !',
      '<p>Password has been reset !</p>',
      'automated',
      'reset password',
      null,
      null,
    )
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