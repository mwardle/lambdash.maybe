# Maybe

This package implements a maybe type for [lambdash](https://github.com/mwardle/lambdash.git).

## Installation

Use npm.

```

npm install --save lambdash.maybe

```

## Implements

1. Eq
2. Ord
3. Functor
4. Semigroup
5. Monoid
6. Foldable
7. Applicative
8. Monad
9. Show

## Typed Maybe

By default the Maybe implementation accepts any value.
You can create typed list like so:

```javascript
    var _ = require('lambdash');
    var Maybe = require('lambdash.maybe');

    // A list that only accepts numbers
    var MaybeNum = Maybe.Typed(_.Num);
```
