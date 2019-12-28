
const movies = [
  { 'id': 1, 'name': 'Matrix' },
  { 'id': 2, 'name': 'Star Wars' },
  { 'id': 3, 'name': 'The wolf of Wall Street' }
]

const series = [
  { 'id': 4, 'name': 'South Park' },
  { 'id': 5, 'name': 'The Simpsons' },
  { 'id': 6, 'name': 'The Big Bang Theory' }
]

const get = property => object => object[property]

const getId = get('id')
const getName = get('name')

const getMovieIds = movies.map((movie) => movie.id)
const getSeriesIds = series.map((ep) => ep.id)

const getMovieIds2 = movies.map(getId)
const getSeriesIds2 = series.map(getId)

const getMovieNames = movies.map(getName)
const getSeriesNames = series.map(getName)



const users = [
  { name: 'Jeff', age: 14 },
  { name: 'Jack', age: 18 },
  { name: 'Milady', age: 22 },
]

const filter = (cb, arr) => arr.filter(cb)
const map = (cb, arr) => arr.map(cb)
const m = map(u => u.name, filter(u => u.age >= 18, users))

const compose = (...functions) => args => functions.reduceRight((arg, fn) => fn(arg), args)
const pipe =    (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)