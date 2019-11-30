const mongoose = require('mongoose')
const casual = require('casual')
const logs = require('../logs/chalk')
const User = require('../models/User')
const Artist = require('../models/Artist')
const Post = require('../models/Post')
const Note = require('../models/Note')
const Upload = require('../models/Upload')

function populate(req, res) {
    // create some events
    const events = [{ name: casual.name, email: casual.email }]
    // use the Event model to insert/save
    for (event of events) {
        var user = new User(event)
        user.save()
    }
    // seeded!
    res.send('Database seeded!');
}

async function clean(amount) {
    logs.data(`[mongodb] cleaning items from db...`)
    await Promise.all(
        [User.deleteMany({})],
        [Artist.insertMany({})],
    )
    logs.data(`[mongodb] cleaning complete`)
}

async function restart(amount) {
    logs.data(`[mongodb] seeding items to db...`)
    await populate(amount)
    logs.data(`[mongodb] seeding complete`)
}

async function seed(amount) {
    try {
        await clean(amount)
        await restart(amount)

        const query = { age: { $gt: 22 } }
        // const query = { favoriteFruit: 'potato' }

        time('default_query')
        await Age.find(query)
        timeEnd('default_query')

        time('query_with_index')
        await AgeWithIndex.find(query)
        timeEnd('query_with_index')

        time('query_with_select')
        await Age.find(query).select({ name: 1, _id: 1, age: 1, email: 1 })
        timeEnd('query_with_select')

        time('query_with_select_index')
        await AgeWithIndex.find(query).select({ name: 1, _id: 1, age: 1, email: 1 })
        timeEnd('query_with_select_index')

        time('lean_query')
        await Age.find(query).lean()
        timeEnd('lean_query')

        time('lean_with_index')
        await AgeWithIndex.find(query).lean()
        timeEnd('lean_with_index')

        time('lean_with_select')
        await Age.find(query).select({ name: 1, _id: 1, age: 1, email: 1 }).lean()
        timeEnd('lean_with_select')

        time('lean_select_index')
        await AgeWithIndex.find(query).select({ name: 1, _id: 1, age: 1, email: 1 }).lean()
        timeEnd('lean_select_index')

        process.exit(0)
    } catch (err) {
        logs.err(err)
    }
}

module.exports = seed
