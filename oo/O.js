'use strict';

var g = ohm.grammarFromScriptElement();
var O = new Language(g, g.semantics().addOperation('toAST', {

  Program: function(stmts) {
    return new Program(stmts.toAST());
  },

  Stmts: function(ss, optE) {
    var e = optE.toAST()[0];
    return ss.toAST().concat(e ? new ExpStmt(e) : []);
  },

  Stmt_classDecl: function(_class, C, _optExtends, optS, _optWith, optXs, _sc) {
    return new ClassDecl(
       C.toAST(),
       optS.toAST()[0] || 'Obj',
       optXs.toAST()[0] || []);
  },

  Stmt_methodDeclJava: function(_def, C, _dot, m, _op, xs, _cp, b) {
    return new MethodDecl(
        C.toAST(),
        m.toAST(),
        xs.toAST(),
        b.toAST());
  },

  Stmt_methodDeclKeyword: function(_def, C, ms, _commas, xs, b) {
    return new MethodDecl(
        C.toAST(),
        ms.toAST().reduce((m, part) => m + part.charAt(0).toUpperCase() + part.substr(1)),
        xs.toAST(),
        b.toAST());
  },

  Stmt_methodDeclBinary: function(_def, C, m, x, b) {
    return new MethodDecl(
        C.toAST(),
        m.toAST(),
        [x.toAST()],
        b.toAST());
  },

  Stmt_methodDeclCall: function(_def, C, _op, xs, _cp, b) {
    return new MethodDecl(
        C.toAST(),
        'call',
        xs.toAST(),
        b.toAST());
  },

  Stmt_varDecl: function(_var, x, _eq, e, _sc) {
    return new VarDecl(x.toAST(), e.toAST());
  },

  Stmt_varAssign: function(x, _eq, e, _sc) {
    return new VarAssign(x.toAST(), e.toAST());
  },

  Stmt_instVarAssign: function(_this, _dot, x, _eq, e, _sc) {
    return new InstVarAssign(x.toAST(), e.toAST());
  },

  Stmt_return: function(_return, e, _sc) {
    return new Return(e.toAST());
  },

  Stmt_exp: function(e, _sc) {
    return new ExpStmt(e.toAST());
  },

  MethodBody_exp: function(_eq, e, _sc) {
    return [new Return(e.toAST())];
  },

  MethodBody_stmt: function(_oc, ss, _cc) {
    return ss.toAST();
  },

  KWSendExp_send: function(e, ms, _colons, es) {
    return new Send(
        e.toAST(),
        ms.toAST().reduce((m, part) => m + part.charAt(0).toUpperCase() + part.substr(1)),
        es.toAST());
  },

  KWSendExp_super: function(_this, ms, _colons, es) {
    return new SuperSend(
        ms.toAST().reduce((m, part) => m + part.charAt(0).toUpperCase() + part.substr(1)),
        es.toAST());
  },

  EqExp_eq: function(x, op, y) {
    return new BinOp(op.toAST(), x.toAST(), y.toAST());
  },

  RelExp_rel: function(x, op, y) {
    return new BinOp(op.toAST(), x.toAST(), y.toAST());
  },

  AddExp_add: function(x, op, y) {
    return new BinOp(op.toAST(), x.toAST(), y.toAST());
  },

  MulExp_mul: function(x, op, y) {
    return new BinOp(op.toAST(), x.toAST(), y.toAST());
  },

  DotExp_send: function(e, _dot, m, _op, es, _cp) {
    return new Send(e.toAST(), m.toAST(), es.toAST());
  },

  DotExp_super: function(_super, _dot, m, _op, es, _cp) {
    return new SuperSend(m.toAST(), es.toAST());
  },

  DotExp_instVarAccess: function(_this, _dot, x) {
    return new InstVar(x.toAST());
  },

  UnExp_neg: function(_minus, x) {
    return new BinOp('-', new Lit(0), x.toAST());
  },

  CallExp_call: function(b, _op, es, _cp) {
    return new Send(b.toAST(), 'call', es.toAST());
  },

  PriExp_paren: function(_op, e, _cp) {
    return e.toAST();
  },

  PriExp_block: function(_oc, xs, ss, _cc) {
    return new BlockLit(xs.toAST(), ss.toAST());
  },

  PriExp_new: function(_new, C, _op, es, _cp) {
    return new New(C.toAST(), es.toAST());
  },

  PriExp_str: function(s) {
    return new Lit(s.toAST());
  },

  PriExp_ident: function(n) {
    return new Var(n.toAST());
  },

  PriExp_number: function(_) {
    return new Lit(parseFloat(this.interval.contents));
  },

  PriExp_this: function(_) {
    return new This();
  },

  PriExp_true: function(_) {
    return new Lit(true);
  },

  PriExp_false: function(_) {
    return new Lit(false);
  },

  PriExp_null: function(_) {
    return new Lit(null);
  },

  BlockArgNames_some: function(xs, _bar) {
    return xs.toAST();
  },

  BlockArgNames_none: function() {
    return [];
  },

  ident: function(_first, _rest) {
    return this.interval.contents;
  },

  string: function(_oq, cs, _cq) {
    var chars = [];
    var idx = 0;
    cs = cs.toAST();
    while (idx < cs.length) {
      var c = cs[idx++];
      if (c === '\\' && idx < cs.length) {
        c = cs[idx++];
        switch (c) {
          case 'n': c = '\n'; break;
          case 't': c = '\t'; break;
          default: idx--;
        }
      }
      chars.push(c);
    }
    return chars.join('');
  },

  NonemptyListOf: function(x, _seps, xs) {
    return [x.toAST()].concat(xs.toAST());
  },

  EmptyListOf: function() {
    return [];
  }

}));

// O.prettyPrintAST is declared in prettyPrint.js

