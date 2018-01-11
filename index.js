const { isArray } = Array;
const cotchar = module.exports = function(gen, ...args) {
    if (gen instanceof Promise) return gen;
    const isGenerator = typeof gen.next !== 'function' &&
        typeof gen === 'function';
    if (isGenerator) gen = gen.apply(this, args);

    if(gen.constructor === Object) return Promise.all(Object.keys(gen).map(cotchar));

    if (isArray(gen)) return Promise.all(gen.map(cotchar));
    const isIterator = typeof gen.next === 'function';
    if (!isIterator) return Promise.resolve(gen);

    return new Promise((resolve, reject) => {
        const onError = (error) => {
            try {
                gen.throw(error);
            } catch (err) {
                reject(err);
            }
        };

        const onFull = (value) => {
            if (value instanceof Promise) return value.then(next).catch((error) => next({ error }));
            if (value && value.then) return value.then(next);
            onFull(cotchar(value));
        };

        const next = (response) => {
            try {
                const result = gen.next(response);

                if (!result.done) return onFull(result.value);

                resolve(response);
            } catch (error) {
                onError(error);
            }
        };
        next();
    });
};


