// const logger = require('../loaders/logger')
// const mailerService = require('../services/mailer')

// module.exports = function(agenda) {
//   agenda.define('welcome', function(job, done) {
//     // mailerService.sendWelcomeEmail({

//     // })

//     Job.findOneAndUpdate({ _id: job.attrs.data.rideId },
//       { $set: { status: 'expired' } }, function(err) {
//         if (!err) {
//           done()
//         }
//       })

//   })
// }