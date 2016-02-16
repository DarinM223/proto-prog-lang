'use strict'

/* global TODO */

/*
 * Expression translating
 */

/* global Lit, Var, BinOp, This, InstVar, New, Send, SuperSend */

Lit.prototype.trans = function () {
  return this.primValue + ''
}

Var.prototype.trans = function () {
  return this.x
}

BinOp.prototype.trans = function () {
  var str = '('
  str += this.e1.trans()
  str += this.op
  str += this.e2.trans()
  str += ')'
  return str
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
  str += 'this.' + this.x
  str += ')'
  return str
}

New.prototype.trans = function () {
  var str = ''
  str += 'new '
  str += this.C

  var inputExpressions = this.es.map(function (exp) {
    return exp.trans()
  }).join(',')

  str += '(' + inputExpressions + ')'
  return str
}

Send.prototype.trans = function () {
  var str = ''
  str += this.erecv.trans()
  str += '.'
  str += this.m

  var inputExpressions = this.es.map(function (exp) {
    return exp.trans()
  }).join(',')

  str += '(' + inputExpressions + ')'
  return str
}

SuperSend.prototype.trans = function () {
  throw new TODO('Not implemented yet!')
}

/*
 * Statement translating
 */

/* global ClassDecl, MethodDecl, VarDecl, VarAssign, InstVarAssign, Return, ExpStmt */

ClassDecl.prototype.trans = function () {
  var str = ''
  str += 'function '
  str += this.C
  // TODO(DarinM223): account for inheritance
  str += ' () {'

  for (var i = 0; i < this.xs.length; i++) {
    str += 'this.' + this.xs[i] + ' = null;'
  }
  str += 'if (typeof this.init !== "undefined" && this.init !== null) {'
  str += 'this.init.apply(this, arguments);'
  str += '}'
  str += '}'
  return str
}

MethodDecl.prototype.trans = function () {
  var str = ''
  str += this.C
  str += '.prototype.'
  str += this.m
  str += ' = function '
  str += '(' + this.xs.join(',') + ') {'

  var hasReturn = false

  for (var i = 0; i < this.ss.length; i++) {
    var statement = this.ss[i]
    if (statement instanceof Return) {
      hasReturn = true
    }
    str += statement.trans()
  }

  if (!hasReturn) {
    str += 'return this;'
  }

  str += '};'
  return str
}

VarDecl.prototype.trans = function () {
  var str = ''
  str += 'var '
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
  return 'this.' + this.x + ' = ' + this.e.trans() + ';'
}

Return.prototype.trans = function () {
  return 'return ' + this.e.trans() + ';'
}

ExpStmt.prototype.trans = function () {
  return this.e.trans() + ';'
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

class Obj {}

function trans (ast) {
  return ast.trans()
}

