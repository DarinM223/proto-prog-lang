'use strict';

// ---------------------------------------------------------
// "Classes" that represent AST nodes
// ---------------------------------------------------------

class Prog extends AST {
  constructor(es) {
    super();
    this.es = es;
  }
}

class Num extends AST {
  constructor(n) {
    super();
    this.n = n;
  }
}

class Add extends AST {
  constructor(e1, e2) {
    super();
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Sub extends AST {
  constructor(e1, e2) {
    super();
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Mul extends AST {
  constructor(e1, e2) {
    super();
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Div extends AST {
  constructor(e1, e2) {
    super();
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Pow extends AST {
  constructor(e1, e2) {
    super();
    this.e1 = e1;
    this.e2 = e2;
  }
}

class Ref extends AST {
  constructor(x) {
    super();
    this.x = x;
  }
}

class Assign extends AST {
  constructor(x, e) {
    super();
    this.x = x;
    this.e = e;
  }
}

