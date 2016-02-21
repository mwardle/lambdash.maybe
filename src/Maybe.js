var _ = require('lambdash');

var Maybe = function Maybe(value) {
    if (value == null) {
        return Maybe.Nothing;
    }
    return Maybe.Just(value);
};

Maybe = _.Type.sum(Maybe, {Just: {value: null}, Nothing: []});

Maybe.isJust = Maybe.case({
    Just: true,
    Nothing: false
});

Maybe.isNothing = Maybe.case({
    Just: false,
    Nothing: true
});

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
        Nothing: Maybe.Nothing,
        Just: function(value) {
            return Maybe(fn(value));
        }
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

Maybe.empty = _.always(Maybe.Nothing);
Maybe.of = Maybe;

Maybe.foldl = _.curry(function(fn, accum, maybe) {
    return Maybe.case({
        "Nothing": accum,
        "Just": function(value) {
            return fn(accum, value);
        }
    }, maybe)
});

Maybe.foldr = Maybe.foldl;

Maybe.ap = _.curry(function(apply, functor){
    return Maybe.isNothing(apply) ? Maybe.Nothing : Maybe.map(apply.value, functor);
});

Maybe.flatten = Maybe.case({
    "Nothing": Maybe.Nothing,
    "Just": _.identity
});

Maybe.show = Maybe.case({
    "Nothing": _.always("Maybe.Nothing"),
    "Just": function(value) {
        return "Maybe.Just(" + _.show(value) + ")";
    }
});

module.exports = Maybe;
