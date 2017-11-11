const slice = Array.prototype.slice;

const cotchar = function(gen, ...args) {
  if (typeof gen.next !== 'function' && typeof gen === 'function') gen = gen.apply(this, args);

  if (typeof gen.next !== 'function') return Promise.all(gen);

  return new Promise((resolve, reject) => {
    let onError = null
    let next = null
    let onFull = null
    onError = (error) => {
      try {
        gen.throw(error)
      } catch (e) {
        reject(e)
      }
    }

    onFull = (value) => {
      console.log('value ', value instanceof Promise)
      if (value instanceof Promise) return value.then(next).catch((error) => next({ error }));
      console.log(' is not promise')
      if (value && value.then) return value.then(next);
      console.log(' is not then')
      process.nextTick(onFull, cotchar(value));
    }

    next = (response) => {
      try {
        const result = gen.next(response);

        if (!result.done) return process.nextTick(onFull, result.value)

        resolve(response);
      } catch (error) {
        process.nextTick(onError, error)
      }
    };
    return process.nextTick(next);
  });
};

module.exports = cotchar;
