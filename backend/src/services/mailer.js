const config = require('../config')
const mailgun = require('mailgun-js')(config.mailgun)

exports.sendWelcomeEmail = (email, client, token) => {
  const data = {
    from: 'Dany <dany@mg.dany.codes>',
    to: email,
    subject: 'Hello',
    // inline: attachment,
    text: `Please use the following link to verify this email for your account: ${client}/verify${token}`,
    html: `<p>Please use the following link to verify this email for your account:</p> <p>${client}/verify/${token}</p>`
  }
  mailgun.messages().send(data)
  return { delivered: 1, status: 'ok' }
}

exports.sendVerifiedEmail = (email) => {
  const data = {
    from: 'Dany <dany@mg.dany.codes>',
    to: email,
    subject: 'Hello',
    // inline: attachment,
    text: 'Your accounts been verified',
    html: '<p>Your accounts been verified</p>'
  }
  mailgun.messages().send(data)
  return { delivered: 1, status: 'ok' }
}

exports.sendForgotPassEmail = (email, client, token) => {
  const data = {
    from: 'Dany <dany@mg.dany.codes>',
    to: email,
    subject: 'Request to reset password!',
    // inline: attachment,
    text: `Reset password link: ${client}/verify${token}`,
    html: `<p>Reset password link:</p> <p>${client}/reset/${token}</p>`
  }
  mailgun.messages().send(data)
  return { delivered: 1, status: 'ok' }
}

exports.sendResetPassEmail = (email) => {
  const data = {
    from: 'Dany <dany@mg.dany.codes>',
    to: email,
    subject: 'Password has been reset!',
    // inline: attachment,
    text: 'Password has been reset!',
    html: '<p>Password has been reset!</p>'
  }
  mailgun.messages().send(data)
  return { delivered: 1, status: 'ok' }
}

exports.startEmailSequence = (sequence, user) => {
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