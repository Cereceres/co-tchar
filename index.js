const slice = Array.prototype.slice

const cotchar = function(gen) {
  if (typeof gen.next !== 'function') gen = gen.apply(this, slice.call(arguments, 0))

  if (typeof gen.next !== 'function') return gen

  return new Promise((resolve) => {
    const next = function(response) {
      try {
        const result = gen.next(response)
        if (result.done) return resolve(result.value)

        if (result.value instanceof Promise) return result.value.then(next).catch((error) => next({ error }))

        if (result.value && result.value.then) return result.value.then(next)

        return cotchar(result.value)
      } catch (error) {
        return next({ error })
      }
    }
    return next()
  })
}

module.exports = cotchar
