'use strict';

// Helper functions used in the tests

function greaterThan(n) {
  return x => x > n;
}

function isNumber(x) {
  return typeof x === 'number';
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  deconstruct() {
    return [this.x, this.y];
  }
}

class Point3D extends Point {
  constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }

  deconstruct() {
    return super.deconstruct().concat([this.z]);
  }
}


// Tests!

tests(JS,
      {
        name: 'wildcard',
        code: 'match(123,\n' +
          '  _,\n' +
            '   x => x + 2\n' +
              ')',
              expected: 125
      },
      {
        name: 'literal pattern',
        code: 'match(123,\n' +
          '  42,\n' +
            '    () => "aaa",\n' +
              '  123,\n' +
                '    () => "bbb",\n' +
                  '  444,\n' +
                    '    () => "ccc"\n' +
                      ')',
                      expected: "bbb"
      },
      {
        name: 'array pattern',
        code: 'match(["+", 5, 7],\n' +
          '  ["+", _, _],\n' +
            '    (x, y) => x + y\n' +
              ')',
              expected: 12
      },
      {
        name: 'class pattern',
        code: 'match(new Point3D(1, 2, 3),\n' +
          '  instof(Point3D, _, 2, _),\n' +
            '    (x, z) => x + z\n' +
              ')',
              expected: 4
      },
      {
        name: 'many',
        code: 'match([[1, 2], [3, 4], [5, 6]],\n' +
          '  [many([_, _])],\n' +
            '    (xs,ys) => [xs, ys]\n' +
              ')',
              expected: [[1,3,5], [2,4,6]]
      },
      {
        name: 'pred',
        code: 'match(5,\n' +
          '  pred(greaterThan(8)),\n' +
            '    x => x + " is greater than 8",\n' +
              '  pred(greaterThan(2)),\n' +
                '    x => x + " is greater than 2"\n' +
                  ')',
                  expected: "5 is greater than 2"
      },
      {
        name: 'many and pred',
        code: 'match(["sum", 1, 2, 3, 4],\n' +
          '  ["sum", many(pred(isNumber))],\n' +
            '    ns => ns.reduce((x, y) => x + y)\n' +
              ')',
              expected: 10
      },
      {
        name: 'first match wins',
        code: 'match(123,\n' +
          '  _,\n' +
            '   x => x,\n' +
              '  123,\n' +
                '    () => 4\n' +
                  ')',
                  expected: 123
      },
      {
        name: 'match failed',
        code: 'match(3,\n' +
          '  1,\n' +
            '    () => 1,\n' +
              '  2,\n' +
                '    () => 2,\n' +
                  '  [3],\n' +
                    '    () => 3\n' +
                      ')',
                      shouldThrow: true
      },
      {
        name: 'remains pattern',
        code: 'match([1, 2, 3, "and", 4],\n'+
          '[many(_), "and", _],\n'+
            '(xs, x) => xs\n'+
              ')',
              shouldThrow: true
       },
      {
        name: 'many and wildcard',
        code: 'match([1, 2, 3, "and", 4],\n'+
          '[many(pred(isNumber)), "and", _],\n'+
            '(xs, x) => xs.concat(x)\n'+
              ')',
              expected:[1,2,3,4]
      },
      {
        name: 'null match',
        code: 'match([],[many([_,_])],(x,y) => [x,y])',
        expected:[[],[]]
      },
      {
        name: 'many with pred',
        code: 'match([1, 2, 3, "and", 4],\n'+
          '[many(pred(isNumber)), "or"],\n'+
            '(xs, x) => xs\n'+
              ')',
              shouldThrow: true
      },
      {
        name: 'many pred and many wildcard',
        code: 'match([1, 2, 3, "and", 4],\n'+
          '[many(pred(isNumber)), many(_)],\n'+
            '(xs, x) => xs\n'+
              ')',
              expected:[1,2,3]
      },
      {
        name: 'arity check',
        code: 'match(new Point3D(1, 2, 3),\n'+
          'instof(Point3D, _, 2, _),\n'+
            '(x,y,z) => x + y + z\n'+
              ')',
              shouldThrow: true
      },
      {
        name: 'wildcard, many pred and many wildcard',
        code: 'match([1, 2, 3, "and", 4],\n'+
          '[_,2,many(pred(isNumber)), many(_)],\n'+
            '(x, xs, y) => xs\n'+
              ')',
              expected:[3]
      },
      {
        name: 'nested many',
        code: 'match([[1,2], [4,5,6], [7]],\n' +
          '  [many([many(pred(isNumber))])],\n' +
            '   x => x\n' +
              ')',
              expected: [[1,2], [4,5,6], [7]]
      }
     );

