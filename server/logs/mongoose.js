const colors = require('colors')

const dblog = function (collectionName, method, query, doc) {
    console.log(
        'Mongoose: '.cyan
        + collectionName.yellow + '.' + method.magenta
        + ' ('
        + JSON.stringify(query, null, 2)
        + ')'
    )
}

module.exports = dblog