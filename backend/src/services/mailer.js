import mailgun from 'mailgun-js'
import config from '../config'

const MailerService = class MailerService {
  constructor (emailClient) {
    this.emailClient = emailClient
  }

  async SendWelcomeEmail (email) {
    this.emailClient = mailgun({
      apiKey: config.emails.apikey,
      domain: config.emails.domain
    })
    const data = {
      from: 'SeeSee ❤️ <noreply@seesee.com>',
      to: email,
      subject: 'Hello',
      text: 'Testing some Mailgun awesomness!'
    }
    this.emailClient.messages().send(data)
    return { delivered: 1, status: 'ok' }
  }

  StartEmailSequence (sequence, user) {
    if (!user.email) {
      throw new Error('No email provided')
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' }
  }
}

export default MailerService
