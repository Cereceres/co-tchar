const slice = Array.prototype.slice;

const cotchar = function(gen) {
  if (typeof gen.next !== 'function') gen = gen.apply(this, slice.call(arguments, 0));

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
      console.log('value = ', value)
      if (value instanceof Promise) return value.then(next).catch((error) => next({ error }));

      if (value && value.then) return value.then(next);

      onFull(cotchar(value));
    }

    next = (response) => {
      try {
        const result = gen.next(response);
        if (!result.done) return onFull(result.value)
        console.log('response ', response)
        resolve(response);
      } catch (error) {
        onError(error)
      }
    };
    return next();
  });
};

module.exports = cotchar;
