# co-tchar
co routines using generators

# co-tchar(generator || interator) -> Promise


# yieldable

support thenable, promises, generators and iterators.

# Usage

```js
const cotchar = require('co-tchar')

cotchar(function*(){
    const res = yield Promise.resolve(1)
    assert(res === 1)
    const {error} = yield Promise.reject(new Error('testing'))
    assert(error.message === 'testing')
})
```