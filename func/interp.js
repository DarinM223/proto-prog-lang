'use strict'

/* global Val, Var, If, Fun, Call, Let, BinOp, Closure, Datum, Match, Wildcard, ListComp, Delay, Force */

/*
 * Code follows Javascript Standard Style https://github.com/feross/standard
 */

/**
 * Checks the operator and arguments to a binary operation
 * and throws a TypeError if they are not valid
 */
function checkArguments (op, v1, v2) {
  var op_checks = {
    '+': ['number', 'number'],
    '-': ['number', 'number'],
    '*': ['number', 'number'],
    '/': ['number', 'number'],
    '<': ['number', 'number'],
    '>': ['number', 'number'],
    '%': ['number', 'number'],
    '||': ['boolean', 'boolean'],
    '&&': ['boolean', 'boolean']
  }

  var op_rule = op_checks[op]

  if (typeof op_rule !== 'undefined' && op_rule !== null) {
    var v1_expected = op_rule[0]
    var v2_expected = op_rule[1]

    if (typeof v1 !== v1_expected ||
        typeof v2 !== v2_expected) {
      throw new TypeError('Operator check failed: Expected ' + v1_expected +
                          ' and ' + v2_expected + ', instead found ' + (typeof v1) +
                          ' and ' + (typeof v2))
    }
  }
}

/**
 * Does a shallow clone of an environment
 * (environments don't need a deep clone)
 */
function cloneEnvironment (env) {
  var clonedEnv = {}

  for (var key in env) {
    if (env.hasOwnProperty(key)) {
      clonedEnv[key] = env[key]
    }
  }

  return clonedEnv
}

Val.prototype.eval = function (env) {
  return this.primValue
}

Var.prototype.eval = function (env) {
  var value = env[this.x]

  if (typeof value === 'undefined' || value === null) {
    throw new EvalError('Variable \'' + this.x + '\' is not defined')
  }

  return value
}

If.prototype.eval = function (env) {
  if (this.e1.eval(env) === true) {
    return this.e2.eval(env)
  }

  return this.e3.eval(env)
}

Let.prototype.eval = function (env) {
  var dummyEnv = cloneEnvironment(env)
  if (this.e1 instanceof Fun) {
    dummyEnv[this.x] = new Closure(this.e1.xs, this.e1.e, dummyEnv)
  } else if (this.e1 instanceof Datum) {
    dummyEnv[this.x] = new Closure([], this.e1, dummyEnv)
  }

  var clonedEnv = cloneEnvironment(dummyEnv)
  clonedEnv[this.x] = this.e1.eval(dummyEnv)
  return this.e2.eval(clonedEnv)
}

Fun.prototype.eval = function (env) {
  var clonedEnv = cloneEnvironment(env)

  return new Closure(this.xs, this.e, clonedEnv)
}

Call.prototype.eval = function (env) {
  var fn = this.ef.eval(env)

  if (typeof fn === 'object' &&
      typeof fn.xs !== 'undefined' &&
      fn.xs !== null &&
      typeof fn.e !== 'undefined' &&
      fn.e !== null) {
    if (fn.xs.length === this.es.length) {
      // for each parameter, override the closure environment
      for (var i = 0; i < this.es.length; i++) {
        var paramKey = fn.xs[i]
        var paramValue = this.es[i].eval(env)

        fn.env[paramKey] = paramValue
      }

      return fn.e.eval(fn.env)
    } else if (fn.xs.length > this.es.length) {
      var newArgs = []
      var clonedEnv = cloneEnvironment(fn.env)

      for (var j = 0; j < this.es.length; j++) {
        var argKey = fn.xs[j]
        var argValue = this.es[j].eval(env)

        clonedEnv[argKey] = argValue
      }

      for (var k = this.es.length; k < fn.xs.length; k++) {
        newArgs.push(fn.xs[k])
      }

      return new Closure(newArgs, fn.e, clonedEnv)
    } else {
      throw new EvalError('Params don\'t match')
    }
  } else {
    throw new EvalError('Evaluated function is not a function')
  }
}

Datum.prototype.eval = function (env) {
  return new Datum(this.C, this.es.map(function (e) {
    return e.eval(env)
  }))
}

/**
 * Returns true if the value matches the pattern and false otherwise
 * value: the evaluated value of the expression like a number or a data constructor
 * pattern: an AST object describing the pattern
 * env: a mutable environment that will bind variables with a Var pattern
 */
function matchesPattern (value, pattern, env) {
  if (pattern instanceof Val) {
    return pattern.eval() === value
  } else if (pattern instanceof Wildcard) {
    return true
  } else if (pattern instanceof Var) {
    // assign the variable the value
    env[pattern.x] = value
    return true
  } else if (pattern instanceof Datum && value instanceof Datum) {
    if (pattern.C !== value.C || pattern.es.length !== value.es.length) {
      return false
    }

    for (var i = 0; i < pattern.es.length; i++) {
      var patternExpr = pattern.es[i]

      if (matchesPattern(value.es[i], patternExpr, env) === false) {
        return false
      }
    }

    return true
  }

  return false
}

Match.prototype.eval = function (env) {
  var matchValue = this.e.eval(env)
  for (var i = 0; i < this.ps.length; i++) {
    var pattern = this.ps[i]
    var evalExpression = this.es[i]
    var clonedEnv = cloneEnvironment(env)

    if (matchesPattern(matchValue, pattern, clonedEnv)) {
      return evalExpression.eval(clonedEnv)
    }
  }

  throw new EvalError('Match failure: none of the patterns match the expression')
}

/**
 * Applies an expression on a list comprehension, filtering by predicate
 * expr: the expression to apply to each element of the list
 * pred: the predicate to filter the expressions by
 * x: the name of the variable binding to apply to the expression
 * datum: a list represented by a datum with Cons and Nil
 * env: the environment to apply the expression on
 */
function mapList (expr, pred, x, datum, env) {
  if (datum.C !== 'Cons' && datum.C !== 'Nil') {
    throw new EvalError('Datum is not a list')
  }

  if (datum.C === 'Cons') {
    var first = datum.es[0]
    var rest = datum.es[1]
    var matchesPredicate = true

    if (typeof pred !== 'undefined') {
      var tempEnv = cloneEnvironment(env)
      tempEnv[x] = first
      matchesPredicate = pred.eval(tempEnv)
    }

    if (matchesPredicate === true) {
      var clonedEnv = cloneEnvironment(env)
      clonedEnv[x] = first
      var evaluatedValue = expr.eval(clonedEnv)

      return new Datum('Cons', [evaluatedValue, mapList(expr, pred, x, rest, env)])
    } else {
      return mapList(expr, pred, x, rest, env)
    }
  } else {
    return new Datum('Nil', [])
  }
}

ListComp.prototype.eval = function (env) {
  return mapList(this.e, this.epred, this.x, this.elist.eval(env), env)
}

Delay.prototype.eval = function (env) {
  var clonedEnv = cloneEnvironment(env)
  return new Closure([], this.e.eval(clonedEnv), clonedEnv)
}

Force.prototype.eval = function (env) {
  var closure = this.e.eval(env)
  return closure.e.e.eval(closure.env)
}

BinOp.prototype.eval = function (env) {
  var v1 = this.e1.eval(env)
  var v2 = this.e2.eval(env)

  checkArguments(this.op, v1, v2)

  switch (this.op) {
    case '+':
      return v1 + v2
    case '-':
      return v1 - v2
    case '*':
      return v1 * v2
    case '/':
      return v1 / v2
    case '%':
      return v1 % v2
    case '=':
      return v1 === v2
    case '!=':
      return v1 !== v2
    case '<':
      return v1 < v2
    case '>':
      return v1 > v2
    case '&&':
      return v1 && v2
    case '||':
      return v1 || v2
    default:
      throw new EvalError('Operator not defined')
  }
}

function interp (ast) {
  return ast.eval({})
}

