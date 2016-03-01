// The parser

var g = ohm.grammarFromScriptElement();
var L = new Language(g, g.semantics().addOperation('toAST', {

  Program: function(rules, query) {
    return new Program(rules.toAST(), query.toAST());
  },

  Rule_body: function(head, _, body, _) {
    return new Rule(head.toAST(), body.toAST());
  },

  Rule_noBody: function(head, _) {
    return new Rule(head.toAST(), []);
  },

  Query: function(c, _) {
    return c.toAST();
  },

  Clause_args: function(sym, _, as, _) {
    return new Clause(sym.toAST(), as.toAST());
  },

  Clause_noArgs: function(sym) {
    return new Clause(sym.toAST(), []);
  },

  List: function(_, xs, _) {
    return xs.toAST()[0] || new Clause('_nil', []);
  },

  Contents_cons1: function(x, _, xs) {
    return new Clause('_cons', [x.toAST(), xs.toAST()]);
  },

  Contents_cons2:  function(x, _, xs) {
    return new Clause('_cons', [x.toAST(), xs.toAST()]);
  },

  Contents_single: function(x) {
    return new Clause('_cons', [x.toAST(), new Clause('_nil', [])]);
  },

  variable: function(_, _) {
    return new Var(this.interval.contents);
  },

  symbol: function(_, _) {
    return this.interval.contents;
  },

  NonemptyListOf: function(x, _, xs) {
    return [x.toAST()].concat(xs.toAST());
  },

  EmptyListOf: function() {
    return [];
  }

}));

// L.evalAST is declared in classes.js
// L.prettyPrintAST and L.prettyPrintValue are declared in prettyPrint.js

