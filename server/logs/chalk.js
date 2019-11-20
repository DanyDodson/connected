const chalk = require('chalk')

const logs = {}

logs.err = i => console.error(chalk.red(i))
logs.note = i => console.log(chalk.blue(i))
logs.warn = i => console.log(chalk.yellow(i))
logs.data = i => console.info(chalk.cyan(i))
logs.exp = i => console.log(chalk.yellow(i))
logs.start = i => console.time(chalk.yellow(i))
logs.end = i => console.timeEnd(chalk.yellow(i))

module.exports = logs