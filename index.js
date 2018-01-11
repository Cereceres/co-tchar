const cotchar = module.exports = function(gen, ...args) {
    if (gen instanceof Promise) return gen;
    if (typeof gen.next !== 'function' && typeof gen === 'function') gen = gen.apply(this, args);

    if(gen.constructor === Object) return Promise.all(Object.keys(gen).map(cotchar));

    if (Array.isArray(gen)) return Promise.all(gen.map(cotchar));
    if (typeof gen.next !== 'function') return gen;

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


