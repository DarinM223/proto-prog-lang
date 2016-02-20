// Tests for Homework 5

tests(O,
  {
    name: 'BinOps should still work',
    code: '6 * 7',
    expected: 42
  },
  {
    name: 'a number is a Num',
    code: 'def Num.isNum() { return true; }\n' +
          'def Obj.isNum() { return false; }\n' +
          '123.isNum()',
    expected: true
  },
  {
    name: 'an Obj is not a Num',
    code: 'def Num.isNum() { return true; }\n' +
          'def Obj.isNum() { return false; }\n' +
          'new Obj().isNum()',
    expected: false
  },
  {
    name: 'Bool.not',
    code: 'def True.not() { return false; }\n' +
          'def False.not() { return true; }\n' +
          'true.not().not().not()',
    expected: false
  },
  {
    name: 'null can have methods, too',
    code: 'def Null.m() { return 1234; }\n' +
          'null.m() * 2',
    expected: 2468
  },
  {
    name: 'Point.+',
    code: 'class Point with x, y;\n' +
          'def Point.init(x, y) {\n' +
          '  this.x = x;\n' +
          '  this.y = y;\n' +
          '}\n' +
          'def Point.x() { return this.x; }\n' +
          'def Point.y() { return this.y; }\n' +
          'def Point + that {\n' +
          '  return new Point(this.x + that.x(), this.y + that.y());\n' +
          '}\n' +
          'def Point.toString() { return "Point(" + this.x + ", " + this.y + ")"; }\n' +
          '(new Point(1, 2) + new Point(3, 4)).toString()',
    expected: 'Point(4, 6)'
  }
);

