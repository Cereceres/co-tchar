const assert = require('assert')

const co = require('../index')

describe('test to cotchar', () => {
  it('should catchar the promise', (done) => {
    co(function *() {
      const res = yield Promise.resolve(1)
      assert(res === 1)
    })
      .then(done)
  });

  it('should catchar the promise', (done) => {
    co(function *() {
      const { error } = yield Promise.reject(new Error('test'))
      assert(error.message === 'test')
    })
      .then(done)
  });

  it('should catchar the promise', (done) => {
    co(function *() {
      throw new Error('throw')
      const { error } = yield
      assert(error.message === 'throw')
      return yield Promise.resolve()
    })
      .then(done)
  });
});
