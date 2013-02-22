var type =
  { string: function isString(val) {
      return typeof val === 'string';
    }
  , number: function isNumber(val) {
      return typeof val === 'number'
    }
  , boolean: function isNumber(val) {
      return typeof val === 'boolean'
    }
  , array: function isArray(val) {
      return Array.isArray(val);
    }
  , object: function isObject(val) {
      return val && typeof val === 'object';
    }
  , fn: function isFunction(val) {
      return typeof val === 'function';
    }
  , arrayOf: function isArrayOf(isType) {
      return function isArrayOfType(val) {
        if (!type.array(val)) return false;
        for (var i = 0, l = val.length; i < l; i++) {
          if (!isType(val[i])) return false;
        }
        return true;
      };
    }
  , oneOf: function isOneOf() {
      var isTypes = Array.prototype.slice.call(arguments);
      return function isOneOfTypes(val) {
        for (var i = 0, l = isTypes.length; i < l; i++) {
          if (isTypes[i](val)) {
            return true;
          }
        }
        return false
      }
    }
  , optional: function optional(isType) {
      function optionalType(val) {
        return isType(val);
      }
      optionalType.isOptional = true;
      return optionalType;
    }
  };


function parse(args, spec) {
  args = Array.prototype.slice.call(args);
  var result = {};
  var next = args.shift();
  for (var i = 0, l = spec.length; i < l; i++) {
    if (!Array.isArray(spec[i]) || spec[i].length != 2) {
      throw new Error("Invalid argSpec");
    }
    var name = spec[i][0];
    var validator = spec[i][1];
    if (validator(next)) {
      result[name] = next;
      next = args.shift();
    } else if (validator.isOptional) {
      if (typeof next === 'undefined') {
        // Soak up the undefined placeholder for this optional argument
        next = args.shift();
      }
      // Do nothing
    } else {
      throw new Error("Invalid value for '"+name+"': '"+next+"'");
    }
  }
  if (args.length && typeof result.unprocessedArguments === 'undefined') {
    result.unprocessedArguments = args;
  }
  return result;
}

exports.type = type;
exports.parse = parse;
