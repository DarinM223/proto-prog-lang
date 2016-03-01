'use strict'

/*
 * Predefined classes
 */

class Obj {
  constructor (val) {
    this.val = val
  }
}

Obj.prototype['=='] = function (_, obj) {
  if (this.val === obj.val) {
    return new True(true)
  }
  return new False(false)
}

Obj.prototype['>'] = function (_, obj) {
  if (this.val > obj.val) {
    return new True(true)
  }
  return new False(false)
}

Obj.prototype['>='] = function (_, obj) {
  if (this.val >= obj.val) {
    return new True(true)
  }
  return new False(false)
}

Obj.prototype['<'] = function (_, obj) {
  if (this.val < obj.val) {
    return new True(true)
  }
  return new False(false)
}

Obj.prototype['<='] = function (_, obj) {
  if (this.val <= obj.val) {
    return new True(true)
  }
  return new False(false)
}

class Num extends Obj {}

Num.prototype['+'] = function (_, obj) {
  return new Num(this.val + obj.val)
}

Num.prototype['-'] = function (_, obj) {
  return new Num(this.val - obj.val)
}

Num.prototype['*'] = function (_, obj) {
  return new Num(this.val * obj.val)
}

Num.prototype['/'] = function (_, obj) {
  return new Num(this.val / obj.val)
}

class Str extends Obj {}

Str.prototype['+'] = function (_, obj) {
  return new Str(this.val + obj.val)
}

class Null extends Obj {}
class Bool extends Obj {}
class True extends Bool {}
class False extends Bool {}
class Block extends Obj {
  constructor (obj, fn) {
    super()
    this.obj = obj
    this.fn = fn
  }
}

Block.prototype.call = function (_) {
  return this.fn.apply(this.obj, arguments)
}

function BlockException (id, val) {
  this.id = id
  this.val = val
}

/**
 * A global counter for generating unique ids for methods
 */
var _globalCounter = 0;

/*
 * Expression translating
 */

/* global Lit, Var, BinOp, This, InstVar, New, Send, SuperSend, BlockLit */

Lit.prototype.trans = function () {
  if (typeof this.primValue === 'string') {
    return '(new Str("' + this.primValue + '"))'
  } else if (typeof this.primValue === 'number') {
    return '(new Num(' + this.primValue + '))'
  } else if (typeof this.primValue === 'boolean') {
    if (this.primValue === true) {
      return '(new True(' + this.primValue + '))'
    } else {
      return '(new False(' + this.primValue + '))'
    }
  } else if (this.primValue === null) {
    return '(new Null(' + this.primValue + '))'
  }

  return this.primValue
}

Var.prototype.trans = function () {
  return this.x
}

BinOp.prototype.trans = function () {
  var send = new Send(this.e1, this.op.trim(), [this.e2])
  return send.trans()
}

This.prototype.trans = function () {
  return 'this'
}

InstVar.prototype.trans = function () {
  var str = '(function (x) {'
  str += 'if (typeof x !== "undefined") {'
  str += 'return x;'
  str += '} else {'
  str += 'throw new EvalError("this.' + this.x + ' is not defined!");'
  str += '}'
  str += '})('
  str += 'this._' + this.x
  str += ')'
  return str
}

New.prototype.trans = function () {
  var str = 'new '
  str += this.C

  var inputExpressions = this.es.map(function (exp) {
    return exp.trans()
  }).join(',')

  str += '(' + inputExpressions + ')'
  return str
}

Send.prototype.trans = function () {
  var str = '(() => {'
  str += 'var _counter = _globalCounter;'
  str += '_globalCounter += 1;'
  str += 'var result = ' + this.erecv.trans()
  str += '["'
  str += this.m
  str += '"]'

  var inputExpressions = ['_counter'].concat(this.es.map(function (exp) {
    return exp.trans()
  })).join(',')

  str += '(' + inputExpressions + ');'
  str += 'return result;'
  str += '})()'
  return str
}

SuperSend.prototype.trans = function () {
  var str = '(() => {'
  str += 'var _counter = _globalCounter;'
  str += '_globalCounter += 1;'

  var inputExpressions = ['_counter'].concat(this.es.map(function (exp) {
    return exp.trans()
  })).join(',')

  var comma = (inputExpressions.length <= 0 ? '' : ',')

  str += 'var result = _thisClass.prototype.derived.prototype.' + this.m + '.call(this ' + comma + inputExpressions + ');'
  str += 'return result;'
  str += '})()'
  return str
}

BlockLit.prototype.trans = function () {
  var str = ''
  str += '((_fnCounter) => {'
  str += 'return (new Block(this, ('
  str += ['_'].concat(this.xs).join(',')
  str += ') => {'

  for (var i = 0; i < this.ss.length - 1; i++) {
    var statement = this.ss[i]
    if (statement instanceof Return) {
      str += 'throw new BlockException(_fnCounter, ' + statement.e.trans() + ');'
    } else {
      str += statement.trans()
    }
  }

  var lastStatement = this.ss[i]
  if (lastStatement instanceof Return) {
    str += 'throw new BlockException(_fnCounter, ' + lastStatement.e.trans() + ');'
  } else if (lastStatement instanceof ExpStmt) {
    str += 'return ' + lastStatement.e.trans() + ';'
  } else {
    str += lastStatement.trans()
    str += 'return new Null(null);'
  }

  str += '}))'
  str += '})(typeof _fnCounter !== "undefined" ? _fnCounter : null)'
  return str
}

/*
 * Statement translating
 */

/* global ClassDecl, MethodDecl, VarDecl, VarAssign, InstVarAssign, Return, ExpStmt */

ClassDecl.prototype.trans = function () {
  var str = ''
  str += this.C + '.prototype = Object.create(' + this.S + '.prototype);'
  str += this.C + '.prototype.derived = ' + this.S + ';'
  str += this.C + '.constructor = ' + this.C + ';'
  str += 'function ' + this.C + ' () {'

  for (var i = 0; i < this.xs.length; i++) {
    str += 'this._' + this.xs[i] + ' = null;'
  }

  str += 'this._rootClass = ' + this.C + ';'
  str += 'if (typeof this.init !== "undefined" && this.init !== null) {'
  str += 'var _counter = _globalCounter;'
  str += '_globalCounter += 1;'
  str += 'var args = [_counter].concat(Array.prototype.slice.call(arguments));'
  str += 'this.init.apply(this, args);'
  str += '}'
  str += '}'
  return str
}

MethodDecl.prototype.trans = function () {
  var str = ''
  str += this.C
  str += '.prototype["'
  str += this.m
  str += '"]'
  str += ' = function '

  var comma = this.xs.length > 0 ? ',' : ''
  str += '(_fnCounter' + comma + this.xs.join(',') + ') {'
  str += 'var _thisClass = ' + this.C + ';'

  var hasReturn = false

  for (var i = 0; i < this.ss.length; i++) {
    var statement = this.ss[i]
    if (statement instanceof Return) {
      hasReturn = true
    }

    str += 'try {'
    str += statement.trans()
    str += '} catch (e) {'
    str += 'if (e instanceof BlockException && e.id === _fnCounter) {'
    str += 'return e.val;'
    str += '} else {'
    str += 'throw e;'
    str += '}'
    str += '}'
  }

  if (!hasReturn) {
    str += 'return this;'
  }

  str += '};'
  return str
}

VarDecl.prototype.trans = function () {
  var str = 'var '
  str += this.x
  str += ' = '
  str += this.e.trans()
  str += ';'
  str += 'null;'
  return str
}

VarAssign.prototype.trans = function () {
  return this.x + ' = ' + this.e.trans() + ';'
}

InstVarAssign.prototype.trans = function () {
  return 'this._' + this.x + ' = ' + this.e.trans() + ';'
}

Return.prototype.trans = function () {
  return 'return ' + this.e.trans() + ';'
}

ExpStmt.prototype.trans = function () {
  return this.e.trans() + '.val;'
}

/*
 * Program translating
 */

/* global Program */

Program.prototype.trans = function () {
  var str = ''
  for (var i = 0; i < this.ss.length; i++) {
    var statement = this.ss[i]
    str += statement.trans()
  }
  return str
}

function trans (ast) {
  return ast.trans()
}

