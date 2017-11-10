const assert = require('assert')

const co = require('../index')

describe('test to cotchar', () => {
  it('should catchar the promise', (done) => {
    co(function *() {
      const res = yield Promise.resolve(1)
      assert(res === 1)
    })
      .then(() => done())
  });

  it('should catchar a promise rejected', (done) => {
    co(function *() {
      const { error } = yield Promise.reject(new Error('test'))
      assert(error.message === 'test')
    })
      .then(() => done())
  });

  it('should catch a error thrown', (done) => {
    co(function *() {
      throw new Error('throw')
      yield
    })
      .catch(() => done())
  });


  it('should catch a error thrown', (done) => {
    co(function *() {
      try {
        throw new Error('throw')
        yield
      } catch (error) {
        assert(error.message === 'throw')
        done()
      }
    })
  });

  it('should catch a error thrown', (done) => {
    co(function *() {
      const res = yield function *() {
        yield Promise.resolve(0)
      }
      assert(res === 0)
    })
      .then(() => done())
  });
});
