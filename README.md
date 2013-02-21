dynargs = Dynamic Arguments
===========================

Specify and process JavaScript dynamic argument lists simply.

It's common to see functions in JavaScript that accept a list of
arguments where some are optional and others can take different types of
value (string, array, number, etc.). This module helps to write and
process these argument lists in a consistent way.

Example
-------

```
var dynargs = require('dynargs');

var T = dynargs.type;

function batchGetItem() {
  var argSpec =
    [ ['tableName', T.string]
    , ['items', T.array]
    , ['attributesToGet', T.optional(T.arrayOf(T.string))]
    , ['consistentRead', T.boolean]
    , ['callback', T.fn]
    ];
  var parsed = dynargs.parse(arguments, argSpec);
  if (parsed.attributesToGet) {
    /* ... */
  }
}

batchGetItem("MyTable", [1, 2, 3], true, function(err, res){/* ... */});

```

How it works
------------

We convert the arguments into an array and shift the first entry. For
each entry in the argument specification (argSpec), we check this
argument validates, using the validation function specified. If it
validates then we store it to the results, pop another argument and
continue. If it doesn't but is optional then we continue. If it doesn't
and it isn't optional then we throw a `new Error`.

### Argument specification (argSpec)

This is a simple list of 2-tuples (pairs) where the first value is the
name for the argument and the second is a function used to validate it.
Optional arguments' functions expose `fn.isOptional == true`. You can
create an optional version of a validator by passing it to
`dynargs.type.optional()`.

NOTE: this would be a lot prettier as just a JavaScript object, but
unfortunately JavaScript objects are not guaranteed to be ordered, so
we cannot rely on this.

Exceptions
----------

dynargs will throw a `new Error` if it cannot successfully match the
arguments of a function against the argument spec.

Creating your own validation
----------------------------

Each validation function simply takes the value to validate as it's only
argument and returns `true` on success and `false` on failure, so
they're very simple to implement:

```
function isArray(val) {
  return Array.isArray(val);
}
```

Optional arguments' functions need to have the `isOptional` property
set, but you can do this very simply by calling
`dynargs.type.optional()` on your validator:

```
var optionalArray = dynargs.type.optional(isArray);
// or:
function optionalArray(val) {
  return Array.isArray(val);
}
optionalArray.isOptional = true;
```

Built in validators
-------------------

 * string
 * number
 * boolean
 * array
 * fn
 * arrayOf(type)
 * oneOf(type, type, ...)

### arrayOf

```
var arrayOfStrings = dynargs.type.arrayOf(dynargs.type.string);
```

### oneOf

```
var T = dynargs.type;
var numberOrString = T.oneOf(T.string, T.number);
var optionalNumberOrString = T.optional(T.oneOf(T.string, T.number));
```
