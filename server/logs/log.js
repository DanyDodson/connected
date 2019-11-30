const chalk = require('chalk')

const log = {}

log.err = i => console.error(chalk.red(i))
log.note = i => console.log(chalk.blue(i))
log.warn = i => console.log(chalk.yellow(i))
log.data = i => console.info(chalk.cyan(i))
log.exp = i => console.log(chalk.yellow(i))
log.start = i => console.time(chalk.yellow(i))
log.end = i => console.timeEnd(chalk.yellow(i))

module.exports = log