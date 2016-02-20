'use strict';

// ---------------------------------------------------------
// "Classes" that represent AST nodes
// ---------------------------------------------------------

class Program extends AST {
  constructor(ss) {
    super();
    this.ss = ss;
  }
}

// Statements

class Stmt extends AST {
  constructor() {
    super();
  }
}

class ClassDecl extends Stmt {
  constructor(C, S, xs) {
    super();
    this.C = C;
    this.S = S;
    this.xs = xs;
  }
}

class MethodDecl extends Stmt {
  constructor(C, m, xs, ss) {
    super();
    this.C = C;
    this.m = m;
    this.xs = xs;
    this.ss = ss;
  }
}

class VarDecl extends Stmt {
  constructor(x, e) {
    super();
    this.x = x;
    this.e = e;
  }
}

class VarAssign extends Stmt {
  constructor(x, e) {
    super();
    this.x = x;
    this.e = e;
  }
}

class InstVarAssign extends Stmt {
  constructor(x, e) {
    super();
    this.x = x;
    this.e = e;
  }
}

class Return extends Stmt {
  constructor(e) {
    super();
    this.e = e;
  }
}

class ExpStmt extends Stmt {
  constructor(e) {
    super();
    this.e = e;
  }
}

// Expressions

class Exp extends AST {
  constructor() {
    super();
  }
}

class Lit extends Exp {
  constructor(primValue) {
    super();
    this.primValue = primValue;
  }
}

class Var extends Exp {
  constructor(x) {
    super();
    this.x = x;
  }
}

class BinOp extends Exp {
  constructor(op, e1, e2) {
    super();
    this.op = op;
    this.e1 = e1;
    this.e2 = e2;
  }
}

class This extends Exp {
  constructor() {
    super();
  }
}

class InstVar extends Exp {
  constructor(x) {
    super();
    this.x = x;
  }
}

class New extends Exp {
  constructor(C, es) {
    super();
    this.C = C;
    this.es = es;
  }
}

class Send extends Exp {
  constructor(erecv, m, es) {
    super();
    this.erecv = erecv;
    this.m = m;
    this.es = es;
  }
}

class SuperSend extends Exp {
  constructor(m, es) {
    super();
    this.m = m;
    this.es = es;
  }
}

class BlockLit extends AST {
  constructor(xs, ss) {
    super();
    this.xs = xs;
    this.ss = ss;
  }
}

