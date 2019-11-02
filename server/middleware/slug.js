const slug = {}

const getDate = new Date
const timeString = getDate.toUTCString()
const date = timeString.split(' ').slice(0, 5).join(' ')

const a = '·/_,:;'
const b = '------'
const p = new RegExp(a.split('').join('|'), 'g')

slug.create = str => {
  return str.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(p, c => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/%/g, '-percent-')
    .replace(/hash/g, '-hashtag-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

slug.createTime = () => slug.create(date)
slug.createRandom = () => (Math.random() * Math.pow(36, 6) | 0).toString(36)
slug.createSlug = str => slug.create(str) + '::' + slug.createRandom()
slug.postSlug = str => slug.create(str) + '::' + slug.createTime()

module.exports = slug
