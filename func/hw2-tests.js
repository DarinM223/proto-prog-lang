'use strict';

tests(
  F,
  {
    name: 'recursive let',
    code: 'let f = fun n -> if n = 0\n' +
          '                 then 1\n' +
          '                 else n * f (n - 1) in\n' +
          '  f 5',
    expected: 120
  },
  {
    name: 'currying',
    code: 'let add = fun x y -> x + y in\n' +
          '  let inc = add 1 in\n' +
          '    inc 10',
    expected: 11
  },
  {
    name: 'data constructors',
    code: 'C(5 + 4, D(false, E))',
    expected: new Datum('C', [9, new Datum('D', [false, new Datum('E', [])])])
  },
  {
    name: 'list sugar',
    code: '[5 + 4;0;6]',
    expected: new Datum('Cons', [9, new Datum('Cons', [0, new Datum('Cons', [6, new Datum('Nil', [])])])])
  },
  {
    name: 'match',
    code: 'let lst = [1; Pair(2, 3); 4] in\n' +
          '  match lst with\n' +
          '    [1; Pair(x, 3); y] -> y * 10 + x',
    expected: 42
  },
  {
    name: 'match failure should throw exception',
    code: 'match 5 with 6 -> 42',
    shouldThrow: true
  },
  {
    name: 'factorial w/ pattern matching',
    code: 'let f = fun n ->\n' +
          '          match n with\n' +
          '            0 -> 1\n' +
          '          | _ -> n * f (n - 1) in\n' +
          '  f 6',
    expected: 720
  },
  {
    name: 'map',
    code: 'let map = fun f l ->\n' +
          '            match l with\n' +
          '              Nil -> Nil\n' +
          '            | Cons(x, xs) -> Cons(f x, map f xs) in\n' +
          '  map (fun x -> x + 1) [1;2;3]',
    expected: new Datum('Cons', [2, new Datum('Cons', [3, new Datum('Cons', [4, new Datum('Nil', [])])])])
  },
  {
    name: 'list comprehension w/o predicate',
    code: 'let nats = [0;1;2;3;4] in\n' +
          '  [x * 2 | x <- nats]',
    expected: new Datum('Cons', [0, new Datum('Cons', [2, new Datum('Cons', [4, new Datum('Cons', [6, new Datum('Cons', [8, new Datum('Nil', [])])])])])])
  },
  {
    name: 'list comprehension w/ predicate',
    code: 'let nats = [0;1;2;3;4] in\n' +
          '  [x * 2 | x <- nats, x % 2 = 0]',
    expected: new Datum('Cons', [0, new Datum('Cons', [4, new Datum('Cons', [8, new Datum('Nil', [])])])])
  },
  {
    name: 'delay and force',
    code: 'let take = fun n s ->\n' +
          '  match n with\n' +
          '    0 -> Nil\n' +
          '  | _ -> match s with\n' +
          '           Cons(first, rest) -> Cons(first, take (n - 1) (force rest)) in\n' +
          'let ones = Cons(1, delay ones) in\n' +
          '  take 5 ones',
    expected:  new Datum('Cons', [1, new Datum('Cons', [1, new Datum('Cons', [1, new Datum('Cons', [1, new Datum('Cons', [1, new Datum('Nil', [])])])])])])
  }
);

