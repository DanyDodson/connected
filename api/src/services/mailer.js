import config from '../config'

export default class MailerService {

  constructor (container) {
    this.emailClient = container.get('emailClient')
  }

  async sendVerifyEmail (email, client, verifyToken) {
    // sendWelcomeEmail (email) {
    const data = {
      from: 'Dany ❤️ <dany@mg.dany.codes>',
      // from: `Dany <${this.emailClient.domain}>`,
      to: email,
      subject: 'Welocome, Please verify your email address to get started !',
      // inline: attachment,
      // text: `Please use the following link to verify this email for your account: ${client}/verify${verifyToken}`,
      // html: `<p>Please use the following link to verify this email for your account:</p> <p>${client}/verify/${verifyToken}</p>`,
      template: "verify_email",
      // 'h:X-Mailgun-Variables': { "verifyToken": `${verifyToken}`, "client": `${client}` },
      'v:verifyToken': verifyToken,
      'v:client': client,
      'o:tag': ['automated', 'signup'],
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendVerifiedEmail (email) {
    const data = {
      from: 'Dany <dany@mg.dany.codes>',
      to: email,
      subject: 'Hello',
      // inline: attachment,
      text: 'Your accounts been verified',
      html: '<p>Your accounts been verified</p>',
      'o:tag': ['automated', 'verified'],
    }
    this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendForgotPassEmail (email, client, token) {
    const data = {
      from: 'Dany <dany@mg.dany.codes>',
      to: email,
      subject: 'Request to reset password!',
      // inline: attachment,
      text: `Reset password link: ${client}/verify${token}`,
      html: `<p>Reset password link:</p> <p>${client}/reset/${token}</p>`,
      'o:tag': ['automated', 'forgot password']
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  async sendResetPassEmail (email) {
    const data = {
      from: 'Dany <dany@mg.dany.codes>',
      to: email,
      subject: 'Password has been reset!',
      // inline: attachment,
      text: 'Password has been reset!',
      html: '<p>Password has been reset!</p>',
      'o:tag': ['automated', 'reset password']
    }
    await this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  // startEmailSequence (sequence, user) {

  //   if (!user.email) {
  //     throw new Error('No email provided')
  //   }
  //   // @TODO Add example of an email sequence implementation
  //   // Something like
  //   // 1 - Send first email of the sequence
  //   // 2 - Save the step of the sequence in database
  //   // 3 - Schedule job for second email in 1-3 days or whatever
  //   // Every sequence can have its own behavior so maybe
  //   // the pattern Chain of Responsibility can help here.
  //   return { delivered: 1, status: 'ok' }
  // }
}

// export default MailerService