tests(O,
  {
    name: 'simple exprs 1',
    code: '1 + 2 * 3',
    expected: 7
  },
  {
    name: 'simple exprs 2',
    code: '(1 + 2) * 3',
    expected: 9
  },
  {
    name: 'prog w/o ExpStmt @ end',
    code: 'var v = 1 + 2;',
    expected: null
  },
  {
    name: 'prog w/ ExpStmt @ end 1',
    code: 'var v = 1 + 2;\n' +
          'v - 5',
    expected: -2
  },
  {
    name: 'prog w/ ExpStmt @ end 2',
    code: 'var v = 1 + 2;\n' +
          'v - 5;\n' +
          '8 - 1',
    expected: 7
  },
  {
    name: 'simple method decl, new, and send',
    code: 'def Obj.mul(x, y) {\n' +
          '  return x * y;\n' +
          '}\n' +
          'new Obj().mul(6, 7)',
    expected: 42
  },
  {
    name: 'method without explicit return should return this',
    code: 'class Ref with val;\n' +
          'def Ref.init(val) { this.val = val; }\n' +
          'def Ref.inc() { this.val = this.val + 1; }\n' +
          'def Ref.get() { return this.val; }\n' +
          'new Ref(0).inc().inc().inc().get()',
    expected: 3
  },
  {
    name: 'simple inheritance and dynamic dispatch',
    code: 'class C;\n' +
          'class D extends C;\n' +
          'class E extends D;\n' +
          'def C.m1() { return 1; }\n' +
          'def C.m2() { return this.m1(); }\n' +
          'def E.m1() { return 3; }\n' +
          'new C().m2() * 100 + new D().m2() * 10 + new E().m2()',
    expected: 113
  },
  {
    name: 'Point class',
    code: 'class Point with x, y;\n' +
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.toString() {\n' +
          '  return "Point(" + this.x + ", " + this.y + ")";\n' +
          '}\n' +
          'new Point(1, 2).toString()',
    expected: 'Point(1, 2)'
  },
  {
    name: "inst vars and method names don't conflict",
    code: 'class Point with x, y;\n' +
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.x() { return this.x; }\n' +
          'def Point.y() { return this.y; }\n' +
          'new Point(1, 2).x() + 3',
    expected: 4
  },
  {
    name: 'accessing a non-existent inst var is an error',
    code: 'class C with a, b, c;\n' +
          'def C.m() { this.d; }\n' +
          'new C().m()',
    shouldThrow: true
  },
  {
    name: 'Point.plus',
    code: 'class Point with x, y;\n' +
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.x() { return this.x; }\n' +
          'def Point.y() { return this.y; }\n' +
          'def Point.toString() {\n' +
          '  return "Point(" + this.x + ", " + this.y + ")";\n' +
          '}\n' +
          'def Point.plus(that) {\n' +
          '  return new Point(this.x + that.x(), this.y + that.y());\n' +
          '}\n' +
          'var p1 = new Point(1, 2);\n' +
          'var p2 = new Point(3, 4);\n' +
          'p1.plus(p2).toString()',
    expected: 'Point(4, 6)'
  },
  {
    name: 'ThreeDeePoint class',
    code: 'class Point with x, y;\n' +
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.toString() {\n' +
          '  return "Point(" + this.x + ", " + this.y + ")";\n' +
          '}\n' +
          'class ThreeDeePoint extends Point with z;\n' +
          'def ThreeDeePoint.init(x, y, z) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '  this.z = z;\n' +
          '}\n' +
          'def ThreeDeePoint.toString() {\n' +
          '  return "ThreeDeePoint(" +\n' +
          '      this.x + ", " +\n' +
          '      this.y + ", " +\n' +
          '      this.z + ")";\n' +
          '}\n' +
          'new ThreeDeePoint(5, 7, -2).toString()',
    expected: 'ThreeDeePoint(5, 7, -2)'
  },
  {
    name: 'ThreeDeePoint class, init w/ super',
    code: 'class Point with x, y;\n' + 
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.toString() {\n' +
          '  return "Point(" + this.x + ", " + this.y + ")";\n' +
          '}\n' +
          'class ThreeDeePoint extends Point with z;\n' +
          'def ThreeDeePoint.init(x, y, z) {\n' +
          '  super.init(x, y);\n' +
          '  this.z = z;\n' +
          '}\n' +
          'def ThreeDeePoint.toString() {\n' +
          '  return "ThreeDeePoint(" +\n' +
          '      this.x + ", " +\n' +
          '      this.y + ", " +\n' +
          '      this.z + ")";\n' +
          '}\n' +
          'new ThreeDeePoint(1, 2, 3).toString()',
    expected: 'ThreeDeePoint(1, 2, 3)'
  },
  {
    name: 'another super test',
    code: 'class C;\n' +
          'class D extends C;\n' +
          'class E extends D;\n' +
          'def C.m1() { return 1; }\n' +
          'def D.m1() { return super.m1() + 1; }\n' +
          'def E.m2() { return this.m1() * 10; }\n' +
          'new E().m2()',
    expected: 20
  }
);

