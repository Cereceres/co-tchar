const assert = require('assert');

const co = require('../index');

describe('test to cotchar', () => {
    it('should catchar the promise', (done) => {
        co(function *() {
            const res = yield Promise.resolve(1);
            assert(res === 1);
        })
            .then(() => done())
            .catch(done);
    });

    it('should catchar a lot of loop', (done) => {
        co(function *() {
            for (let i = 0; i < 100; i++) {
                const res = yield Promise.resolve(i);
                assert(res === i);
            }
        })
            .then(() => done())
            .catch(done);
    });

    it('should catchar a promise rejected', (done) => {
        co(function *() {
            const { error } = yield Promise.reject(new Error('test'));
            assert(error.message === 'test');
        })
            .then(() => done());
    });

    it('should catch a error thrown', (done) => {
        co(function *() {
            throw new Error('throw');
            yield;
        })
            .catch(() => done());
    });


    it('should catch a error thrown', (done) => {
        co(function *() {
            try {
                throw new Error('throw');
                yield;
            } catch (error) {
                assert(error.message === 'throw');
                done();
            }
        });
    });

    it('should catch a error thrown', (done) => {
        co(function *() {
            const res = yield function *() {
                yield Promise.resolve(0);
            };
            assert(res === 0);
        })
            .then(() => done())
            .catch(done);
    });

    it('should pass the arguments pass to co routine', (done) => {
        co(function *(arg) {
            assert(arg === 1);
            const res = yield function *() {
                yield Promise.resolve(0);
            };
            assert(res === 0);
        }, 1)
            .then(() => done())
            .catch(done);
    });

    it('should exec all generator given', (done) => {
        let i = 0;
        co(function *(arg) {
            assert(arg === 1);
            const res = yield function *() {
                yield Promise.resolve(0);
                yield Promise.reject();
                i++;
                yield Promise.resolve('testing');
            };
            assert(res === 'testing');
        }, 1)
            .then(() => {
                if(i === 1) done();
            })
            .catch(done);
    });


    it('should catch the error throw in generator', (done) => {
        let i = 0;
        co(function *(arg) {
            assert(arg === 1);
            const { error } = yield function *() {
                yield Promise.resolve(0);
                yield Promise.reject();
                i++;
                throw new Error('testing');
            };
            assert(error.message === 'testing');
        }, 1)
            .then(() => {
                if(i === 1) done();
            })
            .catch(done);
    });

    it('should pass the arguments pass to co routine', (done) => {
        let i = 0;
        co(function *(arg) {
            assert(arg === 1);
            const { error } = yield (function *() {
                yield Promise.resolve(0);
                yield Promise.reject();
                i++;
                throw new Error('testing');
            }());
            assert(error.message === 'testing');
        }, 1)
            .then(() => {
                if(i === 1) done();
            })
            .catch(done);
    });

    it('should catch the iterator', (done) => {
        co(function *(arg) {
            assert(arg === 1);
            const res = yield function *() {
                yield Promise.resolve(0);
            };
            const { error } = yield [ 1, Promise.resolve(2), Promise.reject(new Error(3)) ];
            assert(error.message === '3');
            done();
        }, 1)
            .catch(done);
    });

    it('should catch the iterator', (done) => {
        co(function *(arg) {
            assert(arg === 1);
            const res = yield function *() {
                yield Promise.resolve(0);
            };
            const { error } = yield [ 1, Promise.resolve(2), Promise.reject(new Error(3)) ];
            assert(error.message === '3');
            done();
        }, 1)
            .catch(done);
    });

    it('should catch the iterator', (done) => {
        try {
            co();
        } catch (error) {
            assert(error.message === 'Generator is not defined');
            done();
        }
    });
});
