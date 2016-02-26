// Tests for Part II

tests(O,
  {
    name: 'thenElse (1/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n' +
          '1 > 2 then: {111} else: {222}',
    expected: 222
  },
  {
    name: 'thenElse (2/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n' +
          '1 < 2 then: {111} else: {222}',
    expected: 111
  },
  {
    name: 'non-local return (1/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n\n' +
          'def Num.fact() {\n' +
          '  this == 0\n' +
          '    then: { return 1; }\n' +
          '    else: { return this * (this - 1).fact(); }\n' +
          '}\n\n' +
          '5.fact()',
    expected: 120
  },
  {
    name: 'non-local return (2/2)',
    code: 'def Obj.m() {\n' +
          '  var b = { return 5; };\n' +
          '  return this.n(b) * 2;\n' +
          '}\n\n' +
          'def Obj.n(aBlock) {\n' +
          '  aBlock.call();\n' +
          '  return 42;\n' +
          '}\n\n' +
          'new Obj().m()',
    expected: 5
  },
  {
    name: 'inst vs local',
    code: 'class C with a, b, c;\n' +
      'def C.m() {\n' +
        'this.a = 1000000;\n' + 
          'var b = 4000;\n' +
            'var m = {\n' +
              '\tthis.b = 1;\n' + 
                '\tthis.a = 6000;\n' + 
                  '\tvar b = 100;\n' +
                    '};\n' +
                      'var x = { return this.a + b + this.c; };\n' +
                        'm.call();\n' +
                          'this.c = 86;\n' +
                            'return x.call();\n' +
                              '}\n' +
                                'new C().m();',
                                expected: 10086
  },
  {
    name: 'implicit return',
    code: 'class A with b;\n' +
      'def A.init(b) { this.b = b; }\n' +
        'def A.set(b) { \n' +
          ' { this.b = b;}.call()\n' +
            '}\n' +
              'def A.get() {return this.b; }\n' +
                'var a = new A(100);\n' +
                  'a.set(10086);\n' +
                    'a.get();\n',
                    expected: 10086
  },
  {
    name: 'while loop',
    code: 'def True then: tb else: fb = tb.call();\n' +
      'def False then: tb else: fb = fb.call();\n' +
        'def Block while: body = this.call()\n' +
          '\tthen: { body.call();\n' +
            '\t\tthis while: body;\n' +
              '\t} else: {};\n' +
                'var i = 1;\n' +
                  'var fac = 1;\n' +
                    '{i < 11} while: {\n' +
                      '    fac = fac * i;\n' +
                        '    i = i + 1;\n' +
                          '};\n' +
                            'fac;\n',
                            expected: 3628800
  },
  {
    name: 'do while',
    code: 'def True then: tb else: fb = tb.call();\n' +
      'def False then: tb else: fb = fb.call();\n' +
        'def Block doWhile: condition {\n' +
          '\tthis.call();\n' +
            '\tcondition.call()\n' +
              'then: {this doWhile: condition;}\n' +
                'else: {};\n' +
                  '}\n' +
                    'var i = 1;\n' +
                      'var fac = 1;\n' +
                        '{\n' +
                          '    fac = fac * i;\n' +
                            '    i = i + 1;\n' +
                              '} doWhile: {i < 11};\n' +
                                'fac;\n',
                                expected: 3628800
  },
  { 
    name: "exception thrown, should not be catched by return",
    code : 
      `def Obj.m() {
      return { this.x }.call();
      }
      new Obj().m() 
      `,
      shouldThrow: true
  },
  { 
    name: "should not return to first same value",
    code : 
      `def Num.m1() {
      return this.m2({ return 2; }) + 1;
      }
      def Num.m2 (bl) {
      return bl.call();
      }
      0.m1();
      `,
      expected: 2
  }, 
  { 
    name: "super in blocks should work",
    code:
      `class Point with x, y;
      class Point3D extends Point with z;
      def Point.init(x,y) {
      this.x = x;
      this.y = y;
      }
      def Point3D.init(x,y,z) {
      super.init(x,y);
      this.z = z;
      }
      def Point.getx() = this.x; 
      def Point3D.getx() {
      return { super.getx();}.call();
      }
      new Point3D(3,1,2).getx();
      `,
      expected: 3
  },
  { 
    name: "call block with args",
    code: "{x, y| x + y}.call(1,3)",
    expected: 4
  },
  {
      name: 'global scope non-local return',
        code: '{ return 42; }.call()',
          shouldThrow: true
  },
  {
      name: 'non-local super return',
        code: 'class A;\n' +
                  'class B extends A;\n' +
                            'def A.m() { { return 42; }.call(); }\n' +
                                      'def B.n() { return super.m(); }\n' +
                                                '(new B()).n()',
                                                  expected: 42
  }
);

