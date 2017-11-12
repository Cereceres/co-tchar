const co = require('co')
const cotchar = require('../index')

console.time('with co')

co(function *() {
  for (let i = 0; i < 100000; i++) {
    yield Promise.resolve(i)
  }
})
  .then(() => {
    console.timeEnd('with co')
    console.time('with cotchar')
    return cotchar(function *() {
      for (let i = 0; i < 100000; i++) {
        yield Promise.resolve(i)
      }
    })
  })
  .then(() => console.timeEnd('with cotchar'))
  .then(process.exit)


