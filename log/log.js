/* global Rule, Clause, Var, Subst, Program, TODO */

// -----------------------------------------------------------------------------
// Part I: Rule.prototype.makeCopyWithFreshVarNames() and
//         {Clause, Var}.prototype.rewrite(subst)
// -----------------------------------------------------------------------------

Rule.prototype.makeCopyWithFreshVarNames = function () {
  return new Rule(this.head.makeCopyWithFreshVarNames(), this.body.map(function (arg) {
    return arg.makeCopyWithFreshVarNames()
  }))
}

Clause.prototype.makeCopyWithFreshVarNames = function () {
  return new Clause(this.name, this.args.map(function (arg) {
    return arg.makeCopyWithFreshVarNames()
  }))
}

Var.prototype.makeCopyWithFreshVarNames = function () {
  return new Var(this.name + '_')
}

Clause.prototype.rewrite = function (subst) {
  return new Clause(this.name, this.args.map(function (arg) {
    return arg.rewrite(subst)
  }))
}

Var.prototype.rewrite = function (subst) {
  var result = null

  for (var varName in subst.bindings) {
    if (varName === this.name) {
      result = subst.bindings[varName]
    }
  }

  if (result !== null) {
    return result
  } else {
    return this
  }
}

// -----------------------------------------------------------------------------
// Part II: Subst.prototype.unify(term1, term2)
// -----------------------------------------------------------------------------

Var.prototype.unifyClause = function (subst, clause) {
  return subst.bind(this.name, clause)
}

Var.prototype.unifyVar = function (subst, variable) {
  return subst.bind(this.name, variable)
}

Clause.prototype.unifyClause = function (subst, clause) {
  if (this.name !== clause.name || this.args.length !== clause.args.length) {
    throw new EvalError('Unification failed!')
  }

  for (var i = 0; i < this.args.length; i++) {
    var arg1 = this.args[i]
    var arg2 = clause.args[i]

    subst = subst.unify(arg1, arg2)
  }

  return subst
}

Clause.prototype.unifyVar = function (subst, variable) {
  return subst.bind(variable.name, this)
}

Subst.prototype.unify = function (term1, term2) {
  term1 = term1.rewrite(this)
  term2 = term2.rewrite(this)

  switch (term2.constructor) {
    case Var:
      return term1.unifyVar(this, term2)
    case Clause:
      return term1.unifyClause(this, term2)
    default:
      throw new EvalError('Unification type not a variable or clause')
  }
}

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

Var.prototype.equals = function (term) {
  if (term instanceof Var) {
    return this.name === term.name
  }

  return false
}

Clause.prototype.equals = function (term) {
  if (term instanceof Clause) {
    if (this.name === term.name &&
        this.args.length === term.args.length) {
      for (var i = 0; i < this.args.length; i++) {
        var arg1 = this.args[i]
        var arg2 = term.args[i]

        if (!arg1.equals(arg2)) {
          return false
        }
      }

      return true
    }
  }

  return false
}

Subst.prototype.contains = function (subst) {
  for (var name in this.bindings) {
    if (!this.lookup(name).equals(subst.lookup(name))) {
      return false
    }
  }

  return true
}

Subst.prototype.equals = function (subst) {
  return this.contains(subst) && subst.contains(subst)
}

Subst.prototype.rewrite = function () {
  var substClone = this.clone()

  for (var name in substClone.bindings) {
    var term = substClone.lookup(name)
    substClone.bindings[name] = term.rewrite(substClone)
  }

  var subst = this
  while (!subst.equals(substClone)) {
    subst = substClone
    for (name in substClone.bindings) {
      term = substClone.lookup(name)
      substClone.bindings[name] = term.rewrite(substClone)
    }
  }

  return subst
}

function Iterator (rules, query) {
  this.rules = rules
  this.query = query
  this.substList = []
}

Iterator.prototype.next = function () {
  try {
    var ans = solve(this.rules, this.query, 0, new Subst(), this.substList)
    this.substList.push(ans)
    return ans.rewrite().rewrite()
  } catch (e) {
    return false
  }
}

function solve (rules, query, index, subst, substList) {
  var tempQuery = query[index].rewrite(subst)

  for (var i = 0; i < rules.length; i++) {
    var substClone = subst.clone()
    var tempRule = rules[i].makeCopyWithFreshVarNames()
    var newRules = rules.map(function (rule) {
      return rule.makeCopyWithFreshVarNames()
    })

    try {
      substClone.unify(tempRule.head, tempQuery)

      if (tempRule.body.length !== 0) {
        substClone = solve(newRules, tempRule.body, 0, substClone, substList)
      }

      var containsSubst = false
      for (var j = 0; j < substList.length; j++) {
        if (substList[j].equals(substClone)) {
          containsSubst = true
          break
        }
      }
      if (containsSubst === true) {
        continue
      }

      if (index < query.length - 1) {
        substClone = solve(newRules, query, index + 1, substClone, substList)
      }

      return substClone
    } catch (e) {
      continue
    }
  }

  throw new EvalError('Solve failure')
}

Program.prototype.solve = function () {
  return new Iterator(this.rules, this.query)
}

