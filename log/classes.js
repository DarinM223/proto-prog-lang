'use strict';

// Classes that represent AST nodes

class Program extends AST {
  constructor(rules, query) {
    super();
    this.rules = rules;
    this.query = query;
  }
}

class Rule extends AST {
  constructor(head, body) {
    super();
    this.head = head;
    this.body = body;
  }
}

class Clause extends AST {
  constructor(name, args) {
    super();
    this.name = name;
    this.args = args;
  }
}

class Var extends AST {
  constructor(name) {
    super();
    this.name = name;
  }
}

// Substitutions

class Subst {
  constructor() {
    this.bindings = Object.create(null);
  }

  lookup(varName) {
    return this.bindings[varName];
  }

  bind(varName, term) {
    this.bindings[varName] = term;
    return this;
  }

  clone() {
    var clone = new Subst();
    for (var varName in this.bindings) {
      clone.bind(varName, this.lookup(varName));
    }
    return clone;
  }
}

// -------------------------------------------------------------------------------------------------

// Note: the rest of this file is not really part of your prototype -- it's all just "plumbing"
// that's required to hook up your prototype to our test harness and playground.

Subst.prototype.toString = function() {
  var varNames = Object.keys(this.bindings);
  return varNames.length === 0 ?
      'yes' :
      varNames.map(v => v + ' = ' + this.bindings[v]).join(', ');
};

Subst.prototype.filter = function(names) {
  var ans = new Subst();
  names.forEach(name => {
    var term = this.lookup(name);
    if (term) {
      ans.bind(name, term);
    }
  });
  return ans;
};

// You will have to implement `Program.prototype.solve()`, which should return an iterator of
// substitutions. The implementation of the `evalAST` method below calls that method, and filters
// out the bindings that don't have anything to do with the query. It also wraps the iterator in
// order to support a `rewind` method that is used by the test harness.

L.evalAST = function(progAST) {
  var iter = progAST.solve();
  if (!iter || !iter.next) {
    throw new Error('expected an iterator but got ' + JSON.stringify(iter));
  }
  var noMoreSolutions = false;
  var solutions = [];
  var idx = 0;
  return {
    next: function() {
      if (idx < solutions.length) {
        return solutions[idx++];
      } else if (noMoreSolutions) {
        return false;
      }

      var solution = iter.next();
      if (solution) {
        solution = solution.filter(progAST.getQueryVarNames());
        solutions[idx++] = solution;
      } else {
        noMoreSolutions = true;
      }
      return solution;
    },
    rewind: function() {
      idx = 0;
    }
  };
};

Program.prototype.getQueryVarNames = function() {
  var varNames = Object.create(null);
  this.query.forEach(function(clause) {
    clause.recordVarNames(varNames);
  });
  return Object.keys(varNames);
};

Clause.prototype.recordVarNames = function(varNames) {
  this.args.forEach(function(arg) {
    arg.recordVarNames(varNames);
  });
};

Var.prototype.recordVarNames = function(varNames) {
  varNames[this.name] = true;
};

