import config from '../config'

export default class PostService {

  constructor (container) {
    this.logger = container.get('logger')
    this.messageModel = container.get('messageModel')
    this.agendaJob = container.get('agendaInstance')
  }

  async testingService () {
    this.logger.debug('0️⃣  calling messages test endpoint')
    return { msg: 'messages test route working' }
  }

}