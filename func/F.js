'use strict';

var g = ohm.grammarFromScriptElement();
var F = new Language(g, g.semantics().addOperation('toAST', {

  Expr_let: function(_let, x, _eq, e1, _in, e2) {
    return new Let(x.toAST(), e1.toAST(), e2.toAST());
  },

  Expr_patLet: function(_let, p, _eq, e1, _in, e2) {
    return new Match(e1.toAST(), [p.toAST()], [e2.toAST()]);
  },

  Expr_fun: function(_fun, args, _arr, body) {
    return new Fun(args.toAST(), body.toAST());
  },

  Expr_if: function(_if, cond, _then, tb, _else, fb) {
    return new If(cond.toAST(), tb.toAST(), fb.toAST());
  },

  Expr_match: function(_match, e, _with, _optBar, pes) {
    var pesAST = pes.toAST();
    return new Match(
        e.toAST(),
        pesAST.map(function(pe) { return pe.p; }),
        pesAST.map(function(pe) { return pe.e; }));
  },

  PatAndExpr: function(p, _arr, e) {
    return {p: p.toAST(), e: e.toAST()};
  },

  Pat_datum: function(C, _op, es, _cp) {
    return new Datum(
        C.toAST(),
        es.toAST());
  },

  Pat_emptyDatum: function(C) {
    return new Datum(C.toAST(), []);
  },

  Pat_list: function(_os, ps, _cs) {
    return ps.toAST().reverse().reduce(
        function(lst, p) { return new Datum('Cons', [p, lst]); },
        new Datum('Nil', []));
  },

  Pat_wild: function(x) {
    return new Wildcard();
  },

  Pat_ident: function(x) {
    return new Var(x.toAST());
  },

  Pat_number: function(n) {
    return new Val(n.toAST());
  },

  Pat_true: function(_true) {
    return new Val(true);
  },

  Pat_false: function(_false) {
    return new Val(false);
  },

  OrExpr_or: function(x, _or, y) {
    return new BinOp('||', x.toAST(), y.toAST());
  },

  AndExpr_and: function(x, _and, y) {
    return new BinOp('&&', x.toAST(), y.toAST());
  },

  EqExpr_eq: function(x, _eq, y) {
    return new BinOp('=',  x.toAST(), y.toAST());
  },

  EqExpr_neq: function(x, _neq, y) {
    return new BinOp('!=', x.toAST(), y.toAST());
  },

  RelExpr_lt: function(x, _lt, y) {
    return new BinOp('<', x.toAST(), y.toAST());
  },

  RelExpr_gt: function(x, _gt, y) {
    return new BinOp('>', x.toAST(), y.toAST());
  },

  AddExpr_plus: function(x, _plus, y) {
    return new BinOp('+', x.toAST(), y.toAST());
  },

  AddExpr_minus: function(x, _minus, y) {
    return new BinOp('-', x.toAST(), y.toAST());
  },

  MulExpr_times: function(x, _times, y) {
    return new BinOp('*', x.toAST(), y.toAST());
  },

  MulExpr_divide: function(x, _div, y) {
    return new BinOp('/', x.toAST(), y.toAST());
  },

  MulExpr_modulus: function(x, _mod, y) {
    return new BinOp('%', x.toAST(), y.toAST());
  },

  CallExpr_args: function(f, args) {
    return new Call(f.toAST(), args.toAST());
  },

  CallExpr_noArgs: function(f, _op, _cp) {
    return new Call(f.toAST(), []);
  },

  UnExpr_pos: function(_plus, e) {
    return e.toAST();
  },

  UnExpr_neg: function(_minus, e) {
    return new BinOp('-', new Val(0), e.toAST());
  },

  UnExpr_delay: function(_delay, e) {
    return new Delay(e.toAST());
  },

  UnExpr_force: function(_force, e) {
    return new Force(e.toAST());
  },

  PriExpr_paren: function(_op, e, _cp) {
    return e.toAST();
  },

  PriExpr_datum: function(C, _op, es, _cp) {
    return new Datum(
        C.toAST(),
        es.toAST());
  },

  PriExpr_emptyDatum: function(C) {
    return new Datum(C.toAST(), []);
  },

  PriExpr_listComp: function(_os, e, _bar, x, _arr, el, _optComma, optEp, _cs) {
    return new ListComp(
        e.toAST(),
        x.toAST(),
        el.toAST(),
        optEp.toAST()[0]);
  },

  PriExpr_list: function(_os, es, _cs) {
    return es.toAST().reverse().reduce(
        function(lst, e) { return new Datum('Cons', [e, lst]); },
        new Datum('Nil', []));
  },

  PriExpr_ident: function(x) {
    return new Var(x.toAST());
  },

  PriExpr_number: function(n) {
    return new Val(n.toAST());
  },

  PriExpr_true: function(_true) {
    return new Val(true);
  },

  PriExpr_false: function(_false) {
    return new Val(false);
  },

  ident: function(_first, _rest) {
    return this.interval.contents;
  },

  ctor: function(_first, _rest) {
    return this.interval.contents;
  },

  number: function(_) {
    return parseFloat(this.interval.contents);
  },

  NonemptyListOf: function(x, _sep, xs) {
    return [x.toAST()].concat(xs.toAST());
  },

  EmptyListOf: function() {
    return [];
  }

}));

// F.prettyPrintAST and F.prettyPrintValue are declared in prettyPrint.js
