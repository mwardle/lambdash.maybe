const _ = require('lambdash');

const TypedMaybe = function(T) {
    const Constructor = function Maybe(value) {
        if (value == null) {
            return Maybe.Nothing;
        }
        return Maybe.Just(value);
    };

    const Maybe = _.Type.sum(Constructor, {Just: {value: T}, Nothing: []});

    Maybe.compare = _.curry(function(left, right) {
        if (Maybe.isNothing(left)) {
            if (Maybe.isNothing(right)) {
                return _.EQ;
            }

            return _.LT;
        }

        if (Maybe.isNothing(right)) {
            return _.GT;
        }

        return _.compare(left.value, right.value);
    });

    Maybe.map = _.curry(function(fn, maybe) {
        return Maybe.case({
            Nothing: _Maybe.Nothing,
            Just: function(value) {
                return _Maybe(fn(value));
            },
        }, maybe);
    });

    Maybe.concat = _.curry(function(left, right) {

        if (Maybe.isNothing(left) && Maybe.isNothing(right)) {
            return Maybe.Nothing;
        }

        if (Maybe.isNothing(left)) {
            return right;
        }

        if (Maybe.isNothing(right)) {
            return left;
        }

        return Maybe(_.concat(left.value, right.value));
    });

    Maybe.empty = Maybe.zero = _.always(Maybe.Nothing);
    Maybe.of = _.curry(v => Maybe.Just(v));

    Maybe.alt = _.curry((f, s) => Maybe.case({
        Nothing: s,
        Just: f,
    }, f));

    Maybe.traverse = _.curry((of, fn, m) => Maybe.case({
        Nothing: () => of(_Maybe.Nothing),
        Just: (v) => _.map(_Maybe.of, fn(Maybe.value)),
    }, m));

    Maybe.foldl = _.curry(function(fn, accum, maybe) {
        return Maybe.case({
            Nothing: accum,
            Just: function(value) {
                return fn(accum, value);
            },
        }, maybe);
    });

    Maybe.foldr = Maybe.foldl;

    Maybe.ap = _.curry(function(apply, functor) {
        return apply.isNothing() ? _Maybe.Nothing : Maybe.map(apply.value, functor);
    });

    Maybe.flatten = Maybe.case({
        Nothing: () => _Maybe.Nothing,
        Just: _.identity,
    });

    Maybe.extend = _.curry((fn, m) => Maybe.isNothing() ? _Maybe.Nothing : _Maybe.Just(fn(m)));

    Maybe.show = Maybe.case({
        Nothing: _.always('Maybe.Nothing'),
        Just: function(value) {
            return 'Maybe.Just(' + _.show(value) + ')';
        },
    });

    Maybe.hashWithSeed = _.curry((seed, maybe) => {
        if (Maybe.isNothing(maybe)) {
            return _.Hashable.hashWithSeed(seed, 0);
        }

        const newSeed = _.Hashable.hashWithSeed(seed, 1);

        return _.Hashable.hashWithSeed(newSeed, maybe.value);
    });

    Maybe.prototype.compare = function(r) { return Maybe.compare(this, r); };
    Maybe.prototype.concat = function(r) { return Maybe.concat(this, r); };
    Maybe.prototype.empty = Maybe.prototype.zero = Maybe.empty;
    Maybe.prototype.map = function(fn) { return Maybe.map(fn, this); };
    Maybe.prototype.ap = function(l) { return Maybe.ap(l, this); };
    Maybe.prototype.alt = function(s) { return Maybe.alt(this, s); };
    Maybe.prototype.foldl = function(fn, s) { return Maybe.foldl(fn, s, this); };
    Maybe.prototype.foldr = function(fn, s) { return Maybe.foldr(fn, s, this); };
    Maybe.prototype.traverse = function(of, fn) { return Maybe.traverse(of, fn, this); };
    Maybe.prototype.chain = function(fn) { return Maybe.chain(fn, this); };
    Maybe.prototype.extend = function(fn) { return Maybe.extend(fn, this); };

    _.Eq.deriveFor(Maybe);
    _.Ord.deriveFor(Maybe);
    _.Semigroup.deriveFor(Maybe);
    _.Monoid.deriveFor(Maybe);
    _.Functor.deriveFor(Maybe);
    _.Applicative.deriveFor(Maybe);
    _.Foldable.deriveFor(Maybe);
    _.Monad.deriveFor(Maybe);
    _.Show.deriveFor(Maybe);
    _.Hashable.deriveFor(Maybe);

    return Maybe;
};

const _Maybe = TypedMaybe(_.Any);
_Maybe.Typed = TypedMaybe;

module.exports = _Maybe;
