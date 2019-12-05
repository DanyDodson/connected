import { Container } from 'typedi'
import MailerService from '../services/mailer'

export default class EmailSequenceJob {
    async handler(job, done) {
        const Logger = Container.get('logger')
        try {
            Logger.debug('✌️ Email Sequence Job triggered!')
            const { email, name } = job.attrs.data
            const mailerServiceInstance = Container.get(MailerService)
            await mailerServiceInstance.SendWelcomeEmail(email)
            done()
        }
        catch (e) {
            Logger.error('🔥 Error with Email Sequence Job: %o', e)
            done(e)
        }
    }
}
