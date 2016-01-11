'use strict';

// prettyPrintAST

F.prettyPrintAST = function(x) {
  var out = Object.create(new IndentingOutputStream());
  out.visited = [];
  prettyPrintAST(x, out);
  return out.contents();
};

function prettyPrintAST(x, out) {
  if (out.visited.indexOf(x) >= 0) {
    out.write('...');
  } else if (x instanceof AST) {
    x.prettyPrintAST(out);
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
      prettyPrintAST(xi, out);
    });
    out.write(']');
    if (x.length > 1) {
      out.dedent();
    }
  } else {
    out.write(JS.prettyPrintValue(x));
  }
}

AST.prototype.prettyPrintAST = function(out) {
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
    prettyPrintAST(self[key], out);
  });
  out.write(')');
  out.dedent();
};


// prettyPrintValue

F.prettyPrintValue = function(x) {
  var out = Object.create(new IndentingOutputStream());
  out.visited = [];
  prettyPrintValue(x, out);
  return out.contents();
};

function prettyPrintValue(x, out) {
  if (out.visited.indexOf(x) >= 0) {
    out.write('...');
  } else if (x instanceof AST || typeof x === 'object' && x.prettyPrintValue) {
    x.prettyPrintValue(out);
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
      prettyPrintValue(xi, out);
    });
    out.write(']');
    if (x.length > 1) {
      out.dedent();
    }
  } else {
    out.write(JS.prettyPrintValue(x));
  }
}

AST.prototype.prettyPrintValue = function(out) {
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
    prettyPrintValue(self[key], out);
  });
  out.write(')');
  out.dedent();
};

Closure.prototype.prettyPrintValue = function(out) {
  out.indentFromHere();
  out.write('fun');
  this.xs.forEach(function(x, idx) {
    out.write(' ' + x);
  });
  out.write(' -> ');
  this.e.prettyPrintCode(out);
};

Datum.prototype.prettyPrintValue = function(out) {
  out.indentFromHere();
  out.write(this.C);
  if (this.vs.length === 0) {
    return;
  }
  out.write('(');
  this.vs.forEach(function(v, idx) {
    if (idx > 0) {
      out.write(', ');
    }
    prettyPrintValue(v, out);
  });
  out.write(')');
  out.dedent();
};


// prettyPrintCode (TODO)
// For now, this will just print `...` but ideally it should print the expression,
// reasonably formatted. I wouldn't have been happy with unnecessary parentheses,
// and didn't have time to write the code for that, so I didn't do it.

AST.prototype.prettyPrintCode = function(out) {
  // Should never be called, but we'll print something just in case.
  // (That way it won't prevent students from doing their work.)
  out.write('...');
};

