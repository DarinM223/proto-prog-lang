'use strict';

C.prettyPrintAST =
C.prettyPrintValue = function(x) {
  var out = Object.create(new IndentingOutputStream());
  out.visited = [];
  prettyPrint(x, out);
  return out.contents();
}

function prettyPrint(x, out) {
  if (out.visited.indexOf(x) >= 0) {
    out.write('...');
  } else if (x instanceof AST) {
    x.prettyPrint(out);
  } else if (x instanceof Array) {
    out.write('[');
    if (x.length > 1) {
      out.indentToHere();
    }
    x.forEach(function(xi, idx) {
      if (idx > 0) {
        out.write(', ');
        if (x.length > 1) {
          out.nl();
        }
      }
      prettyPrint(xi, out);
    });
    out.write(']');
    if (x.length > 1) {
      out.dedent();
    }
  } else {
    out.write(JS.prettyPrintValue(x));
  }
}

AST.prototype.prettyPrint = function(out) {
  out.indentFromHere();
  out.write('new ' + this.constructor.name + '(');
  var self = this;
  var keys = Object.keys(this);
  if (keys.length > 1) {
    out.nl();
  }
  Object.keys(this).forEach(function(key, idx) {
    if (idx > 0) {
      out.write(',');
      out.nl();
    }
    prettyPrint(self[key], out);
  });
  out.write(')');
  out.dedent();
}

