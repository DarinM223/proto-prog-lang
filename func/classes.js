'use strict';

// ---------------------------------------------------------
// "Classes" that represent AST nodes
// ---------------------------------------------------------

// Classes for Homework 1

class Val extends AST {
  constructor(primValue) {
    super();
    this.primValue = primValue;
  }
}

class Var extends AST {
  constructor(x) {
    super();
    this.x = x;
  }
}

class If extends AST {
  constructor(e1, e2, e3) {
    super();
    this.e1 = e1;
    this.e2 = e2;
    this.e3 = e3;
  }
}

class Fun extends AST {
  constructor(xs, e) {
    super();
    this.xs = xs;
    this.e = e;
  }
}

class Call extends AST {
  constructor(ef, es) {
    super();
    this.ef = ef;
    this.es = es;
  }
}

class Let extends AST {
  constructor(x, e1, e2) {
    super();
    this.x = x;
    this.e1 = e1;
    this.e2 = e2;
  }
}

class BinOp extends AST {
  constructor(op, e1, e2) {
    super();
    this.op = op;
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Closure {
  constructor(xs, e, env) {
    this.xs = xs;
    this.e = e;
    this.env = env;
  }
}


// Classes for Homework 2

class Datum extends AST {
  constructor(C, es) {
    super();
    this.C = C;
    this.es = es;
  }

  get vs() {
    return this.es;
  }

  get ps() {
    return this.es;
  }
}

class Match extends AST {
  constructor(e, ps, es) {
    super();
    this.e = e;
    this.ps = ps;
    this.es = es;
  }
}

class Wildcard extends AST {
  constructor() {
    super();
  }
}

class ListComp extends AST {
  constructor(e, x, elist, epred) {
    super();
    this.e = e;
    this.x = x;
    this.elist = elist;
    this.epred = epred;
  }
}

class Delay extends AST {
  constructor(e) {
    super();
    this.e = e;
  }
}

class Force extends AST {
  constructor(e) {
    super();
    this.e = e;
  }
}

