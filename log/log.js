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

Subst.prototype.unify = function (term1, term2) {
  throw new TODO('Subst.prototype.unify not implemented')
}

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

Program.prototype.solve = function () {
  throw new TODO('Program.prototype.solve not implemented')
}

