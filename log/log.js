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

Program.prototype.solve = function () {
  throw new TODO('Program.prototype.solve not implemented')
}

