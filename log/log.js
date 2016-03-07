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
  throw new TODO('Clause.prototype.rewrite not implemented')
}

Var.prototype.rewrite = function (subst) {
  throw new TODO('Var.prototype.rewrite not implemented')
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

