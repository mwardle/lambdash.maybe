var assert = require('assert');

var _ = require('lambdash');
var Maybe = require('../src/Maybe');

describe('Maybe', function(){
    describe('#member', function() {
        it ('should return true if a value is a member of Maybe', function(){
            assert.equal(Maybe.member(Maybe()), true);
            assert.equal(Maybe.member(Maybe(1)), true);
            assert.equal(Maybe.member(Maybe.Nothing), true);
            assert.equal(Maybe.member(Maybe.Just(true)), true);
        });

        it ('should return false if a value is not a member of Maybe', function() {
            assert.equal(Maybe.member(1), false);
            assert.equal(Maybe.member(true), false);
            assert.equal(Maybe.member(false), false);
            assert.equal(Maybe.member({}), false);
            assert.equal(Maybe.member(''), false);
            assert.equal(Maybe.member([]), false);
        });
    });

    describe('#isJust', function() {
        it('should return whether or not a value is an instance of Maybe.Just', function() {

            assert.equal(Maybe.isJust(Maybe.Just(1)), true);
            assert.equal(Maybe.isJust(Maybe(1)), true);
            assert.equal(Maybe.isJust(Maybe({})), true);

            assert.equal(Maybe.isJust(Maybe()), false);
            assert.equal(Maybe.isJust(Maybe.Nothing), false);
            assert.equal(Maybe.isJust(Maybe(null)), false);
            assert.equal(Maybe.isJust(Maybe(undefined)), false);
        });
    });

    describe('#isNothing', function() {
        it('should return whether or not a value is Maybe.Nothing', function() {

            assert.equal(Maybe.isNothing(Maybe.Just(1)), false);
            assert.equal(Maybe.isNothing(Maybe(1)), false);
            assert.equal(Maybe.isNothing(Maybe({})), false);

            assert.equal(Maybe.isNothing(Maybe()), true);
            assert.equal(Maybe.isNothing(Maybe.Nothing), true);
            assert.equal(Maybe.isNothing(Maybe(null)), true);
            assert.equal(Maybe.isNothing(Maybe(undefined)), true);
        });
    });

    describe('#compare', function() {
        it('should return _.LT if the left value is less than the right value', function(){
            assert.equal(Maybe.compare(Maybe(), Maybe(1)), _.LT);
            assert.equal(Maybe.compare(Maybe(1), Maybe(2)), _.LT);
            assert.equal(Maybe.compare(Maybe(Maybe(1)), Maybe(Maybe(2))), _.LT);
        });

        it('should return _.GT if the left value is greater than the right value', function(){
            assert.equal(Maybe.compare(Maybe(1), Maybe()), _.GT);
            assert.equal(Maybe.compare(Maybe(2), Maybe(1)), _.GT);
            assert.equal(Maybe.compare(Maybe(Maybe(2)), Maybe(Maybe(1))), _.GT);
        });

        it('should return _.EQ if the left value is equal to the right value', function(){
            assert.equal(Maybe.compare(Maybe(), Maybe()), _.EQ);
            assert.equal(Maybe.compare(Maybe(2), Maybe(2)), _.EQ);
            assert.equal(Maybe.compare(Maybe(Maybe(2)), Maybe(Maybe(2))), _.EQ);
        });
    });

    describe('#map', function() {
        it('should return Maybe.Nothing if the maybe is Maybe.Nothing', function(){
            var fn = function(v){return v + 1};
            assert.equal(Maybe.map(fn, Maybe()), Maybe.Nothing);
        });

        it('should map over a Just value', function() {
            var fn = function(v){return v + 1};
            var result = Maybe.map(fn, Maybe(1));
            assert(Maybe.isJust(result));
            assert.equal(result.value, 2);
        });
    });

    describe('#concat', function(){
        it('should return Nothing if both values are Nothing', function(){
            assert.equal(Maybe.concat(Maybe(), Maybe()), Maybe.Nothing);
        });

        it('should return the right value if the left is Nothing', function(){
            var left = Maybe();
            var right = Maybe([1]);

            var joined = Maybe.concat(left, right);
            assert(Maybe.isJust(joined));
            assert.equal(joined.value, right.value);
        });

        it('should return the left value if the right is Nothing', function(){
            var left = Maybe([1]);
            var right = Maybe();

            var joined = Maybe.concat(left, right);
            assert(Maybe.isJust(joined));
            assert.equal(joined.value, left.value);
        });

        it('should concatenate the left and right contents if both are Just', function(){
            var left = Maybe([1]);
            var right = Maybe([2]);

            var joined = Maybe.concat(left, right);
            assert(Maybe.isJust(joined));
            assert.equal(joined.value.length, 2);
            assert.equal(joined.value[0], 1);
            assert.equal(joined.value[1], 2);
        });
    });

    describe('#foldl, #foldr, #fold', function(){
        it('should return the accum value if the maybe is Nothing', function(){
            var fn = function(accum, value){return accum + value};

            assert.equal(Maybe.fold(fn, 1, Maybe()), 1);
            assert.equal(Maybe.foldl(fn, 1, Maybe()), 1);
            assert.equal(Maybe.foldr(fn, 1, Maybe()), 1);
        });

        it('should reduce the value if the maybe is Just', function(){
            var fn = function(accum, value){return accum + value};

            assert.equal(Maybe.fold(fn, 1, Maybe(2)), 3);
            assert.equal(Maybe.foldl(fn, 1, Maybe(2)), 3);
            assert.equal(Maybe.foldr(fn, 1, Maybe(2)), 3);
        });

    });

    describe('#ap', function() {
        it('should return Nothing if the apply is Nothing', function(){
            assert.equal(Maybe.ap(Maybe(), Maybe(1)), Maybe.Nothing);
        });

        it('should return Nothing if the value being applied to is Nothing', function(){
            var fn = function(v){return v + 1};
            assert.equal(Maybe.ap(Maybe(fn), Maybe()), Maybe.Nothing);
        });

        it('should return a mapping of the function in the applied value to the applied to value if both are Just', function(){
            var fn = function(v){return v + 1};
            var result = Maybe.ap(Maybe(fn), Maybe(1));
            assert(Maybe.isJust(result));
            assert.equal(result.value, 2);
        });
    });

    describe('#flatten', function(){
        it('should return Nothing if the value is Nothing', function(){
            assert.equal(Maybe.flatten(Maybe()), Maybe.Nothing);
        });

        it('should return the contained value if the value is Just', function(){
            var m1 = Maybe(Maybe());
            var m2 = Maybe(Maybe(1));

            var r1 = Maybe.flatten(m1);
            var r2 = Maybe.flatten(m2);

            assert.equal(r1, Maybe.Nothing);
            assert(Maybe.isJust(r2));
            assert.equal(r2.value, 1);
        });
    });

    describe('#show', function(){
        it('should return a string representation of the maybe', function(){
            var res1 = Maybe.show(Maybe());
            var res2 = Maybe.show(Maybe(1));

            assert.equal(res1, "Maybe.Nothing");
            assert.equal(res2, "Maybe.Just(1)");
        });
    });
});