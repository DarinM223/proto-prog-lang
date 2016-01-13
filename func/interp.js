'use strict';

/**
 * Checks the operator and arguments to a binary operation
 * and throws a TypeError if they are not valid
 */
function checkArguments(op, v1, v2) {
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
  };

  var op_rule = op_checks[op];

  if (typeof op_rule !== 'undefined' && op_rule !== null) {
    var v1_expected = op_rule[0];
    var v2_expected = op_rule[1];

    if (typeof v1 !== v1_expected || 
        typeof v2 !== v2_expected) {
      throw new TypeError('Operator check failed: Expected ' + v1_expected + 
                          ' and ' + v2_expected + ', instead found ' + (typeof v1) +
                          ' and ' + (typeof v2));
    }
  }
}

/**
 * Does a shallow clone of an environment 
 * (environments don't need a deep clone)
 */
function cloneEnvironment(env) {
  var clonedEnv = {};

  for (var key in env) {
    if (env.hasOwnProperty(key)) {
      clonedEnv[key] = env[key];
    }
  }

  return clonedEnv;
}

Val.prototype.eval = function(env) {
  return this.primValue;
};

Var.prototype.eval = function(env) {
  var value = env[this.x];
  if (typeof value === 'undefined' || value === null) {
    throw new EvalError('Variable \'' + this.x + '\' is not defined');
  }

  return value;
};

If.prototype.eval = function(env) {
  if (this.e1.eval(env) === true) {
    return this.e2.eval(env);
  }

  return this.e3.eval(env);
};

Let.prototype.eval = function(env) {
  var clonedEnv = cloneEnvironment(env);
  clonedEnv[this.x] = this.e1.eval(env);
  return this.e2.eval(clonedEnv);
};

Fun.prototype.eval = function(env) {
  var clonedEnv = cloneEnvironment(env);

  return {
    params: this.xs,
    e: this.e,
    env: clonedEnv
  };
};

Call.prototype.eval = function(env) {
  var fn = this.ef.eval(env);

  if (typeof fn === 'object' && 
      typeof fn.params !== 'undefined' &&
      fn.params !== null &&
      typeof fn.e !== 'undefined' &&
      fn.e !== null) {

    if (fn.params.length === this.es.length) {
      // for each parameter, override the closure environment
      for (var i = 0; i < this.es.length; i++) {
        var paramKey = fn.params[i]
          , paramValue = this.es[i].eval(env);

        fn.env[paramKey] = paramValue;
      }

      return fn.e.eval(fn.env);
    } else {
      // TODO(DarinM223): fix this
      throw new EvalError('Params don\'t match');
    }
  } else {
    throw new EvalError('Evaluated function is not a function');
  }
};

BinOp.prototype.eval = function(env) {
  var v1 = this.e1.eval(env)
    , v2 = this.e2.eval(env);

  checkArguments(this.op, v1, v2);

  switch (this.op) {
    case '+':
      return this.e1.eval(env) + this.e2.eval(env);
    case '-':
      return this.e1.eval(env) - this.e2.eval(env);
    case '*':
      return this.e1.eval(env) * this.e2.eval(env);
    case '/':
      return this.e1.eval(env) / this.e2.eval(env);
    case '%':
      return this.e1.eval(env) % this.e2.eval(env);
    case '=':
      return this.e1.eval(env) === this.e2.eval(env);
    case '!=':
      return this.e1.eval(env) !== this.e2.eval(env);
    case '<':
      return this.e1.eval(env) < this.e2.eval(env);
    case '>':
      return this.e1.eval(env) > this.e2.eval(env);
    case '&&':
      return this.e1.eval(env) && this.e2.eval(env);
    case '||':
      return this.e1.eval(env) || this.e2.eval(env);
    default:
      throw new EvalError('Operator not defined');
  }
};

function interp(ast) {
  return ast.eval({});
}

