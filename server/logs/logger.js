const rfs = require('rotating-file-stream')
const path = require('path')
const morgan = require('morgan')
const chalk = require('chalk')

var rotate = rfs('access.log', { interval: '1d', path: path.join(__dirname, '') })

const reqlogs = () => morgan(function (tokens, req, res) {
    return [
        chalk.magenta(tokens.method(req, res)),
        chalk.yellow(tokens.status(req, res)),
        chalk.hex('#EC7063')(tokens.url(req, res)),
        chalk.cyan(tokens.res(req, res, 'content-length')),
        chalk.cyan('in'),
        chalk.green(tokens['response-time'](req, res) + 'ms'),
        chalk.hex('#fffa65')(tokens['remote-addr'](req, res)),
        chalk.cyan('from'),
        // chalk.yellow(tokens.referrer(req, res)),
    ].join(' ')
})

const reqstream = () => morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.status(req, res),
        tokens.url(req, res),
        tokens['response-time'](req, res) + 'ms',
        // 'from ' + tokens.referrer(req, res),
        '@ ' + tokens.date(req, res),
    ].join(' ')
}, { stream: rotate })

module.exports = reqlogs
module.exports = reqstream
