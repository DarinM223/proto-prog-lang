'use strict';

var g = ohm.grammarFromScriptElement();
var C = new Language(g, g.semantics().addOperation('toAST', {

  Prog: function(es) {
    return new Prog(es.toAST());
  },

  SetExpr_set: function(x, _, e) {
    return new Assign(x.toAST().x, e.toAST());
  },

  AddExpr_plus: function(x, _, y) {
    return new Add(x.toAST(), y.toAST());
  },

  AddExpr_minus: function(x, _, y) {
    return new Sub(x.toAST(), y.toAST());
  },

  MulExpr_times: function(x, _, y) {
    return new Mul(x.toAST(), y.toAST());
  },

  MulExpr_divide: function(x, _, y) {
    return new Div(x.toAST(), y.toAST());
  },

  ExpExpr_exp: function(x, _, y) {
    return new Pow(x.toAST(), y.toAST());
  },

  PriExpr_paren: function(_op, e, _cp) {
    return e.toAST();
  },

  number: function(_) {
    return new Num(parseFloat(this.interval.contents));
  },

  ident: function(_x, _xs) {
    return new Ref(this.interval.contents);
  },

  NonemptyListOf: function(x, _, xs) {
    return [x.toAST()].concat(xs.toAST());
  },

  EmptyListOf: function() {
    return [];
  }

}));

