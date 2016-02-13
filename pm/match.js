'use strict'

function Wildcard () {}

function InstanceOf (C, ps) {
  this.C = C
  this.ps = ps
}

function Predicate (fn) {
  this.fn = fn
}

function Many (ps) {
  this.ps = ps
}

var _ = new Wildcard()

function instof () {
  if (arguments.length < 1) {
    throw new EvalError('instof needs at least one argument')
  }

  var args = [].slice.call(arguments)

  var C = args.shift()
  var ps = args

  return new InstanceOf(C, ps)
}

function pred (fn) {
  return new Predicate(fn)
}

function many () {
  if (arguments.length === 0) {
    return new Many([])
  } else {
    var args = arguments[0]
    if (args.constructor === Array) {
      return new Many(args)
    } else {
      return new Many([args])
    }
  }
}

function matchMany (manyPattern, value) {
  var patternIndex = 0
  var args = []

  // initalize the array of arrays
  for (var i = 0; i < manyPattern.ps.length; i++) {
    args.push([])
  }

  while (value.length > 0) {
    var subvalue = value[0]
    var subpattern = manyPattern.ps[patternIndex]
    var subargs = null
    if (subpattern instanceof Many) {
      subargs = matchMany(subpattern, subvalue)
      if (subargs === null) {
        // return the rest of values
        return args
      } else {
        // consume first element if pattern matches
        value.shift()

        for (var x = 0; x < subargs.length; x++) {
          args[patternIndex].push(subargs[x])
        }
      }
    } else {
      subargs = matchPattern(subpattern, subvalue)
      if (subargs === null) {
        // return the rest of values
        return args
      } else {
        // consume first element if pattern matches
        value.shift()

        for (var j = 0; j < subargs.length; j++) {
          if (subargs[j].constructor === Array) {
            for (var k = 0; k < subargs[j].length; k++) {
              args[k].push(subargs[j][k])
            }
          } else {
            args[j].push(subargs[j])
          }
        }
      }
    }

    patternIndex += 1
    if (patternIndex >= manyPattern.ps.length) {
      patternIndex = 0
    }
  }

  return args
}

function matchPattern (pattern, value) {
  var args = null
  if (pattern instanceof Wildcard) {
    args = [value]
  } else if (pattern instanceof Predicate) {
    if (pattern.fn(value) === true) {
      args = [value]
    }
  } else if (pattern instanceof InstanceOf) {
    var instanceCheck = value instanceof pattern.C
    args = matchPattern(pattern.ps, pattern.C.prototype.deconstruct.call(value))

    if (instanceCheck !== true) {
      args = null
    }
  } else if (pattern.constructor === Array && value.constructor === Array) {
    var newArgs = []
    var matched = true

    for (var i = 0; i < pattern.length; i++) {
      var subpattern = pattern[i]
      var subvalue = value[i]
      var subargs = []

      if (subpattern instanceof Many) {
        var subarray = value.slice(i, value.length)
        subargs = matchMany(subpattern, subarray)
        value = value.slice(0, i + 1).concat(subarray)

        if (pattern.slice(i + 1, pattern.length).length >
            value.slice(i + 1, value.length).length) {
          throw new EvalError('There are more patterns than values')
        }
      }

      subargs.push.apply(subargs, matchPattern(subpattern, subvalue))

      if (subargs === null) {
        matched = false
        break
      }

      newArgs.push.apply(newArgs, subargs)
    }

    if (matched === true) {
      args = newArgs
    }
  } else {
    if (pattern === value) {
      args = []
    }
  }

  return args
}

function match () {
  if (arguments.length <= 0) {
    throw new EvalError('Argument\'s length is too small')
  }

  var value = arguments[0]

  for (var i = 1; i < arguments.length; i += 2) {
    var pattern = arguments[i]
    var expression = arguments[i + 1]

    // Handle patterns
    var args = matchPattern(pattern, value)

    if (args === null) {
      continue
    }

    if (args.length === expression.length) {
      return expression.apply(null, args)
    } else {
      throw new EvalError('Arity doesn\'t match for function')
    }
  }
}

