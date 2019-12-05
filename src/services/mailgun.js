const mailgun = require('mailgun-js')
const config = require('config')
const api_key = config.get('mailgun.api_key')
const DOMAIN = config.get('mailgun.domain')

const mg = mailgun({ apiKey: api_key, domain: DOMAIN })
const data = {
    from: 'SeeSee ❤️ <noreply@seesee.com>',
    to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
}
mg.messages().send(data, function (error, body) {
    console.log(body)
})