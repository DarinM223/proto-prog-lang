'use strict';

class IndentingOutputStream {
  constructor() {
    this.baseCols = [0];
    this.lines = [[]];
    this.indentSpaces = 2;
  }

  _currLine() {
    return this.lines[this.lines.length - 1];
  }

  baseCol() {
    return this.baseCols[this.baseCols.length - 1];
  }

  indent() {
    this.baseCols.push(this.baseCol() + this.indentSpaces);
  }

  indentToHere() {
    var currLineLength = this._currLine().join('').length;
    this.baseCols.push(currLineLength);
  }

  indentFromHere() {
    var currLineLength = this._currLine().join('').length;
    this.baseCols.push(currLineLength + this.indentSpaces);
  }

  dedent() {
    this.baseCols.pop();
  }

  nl() {
    var newLine = [];
    for (var idx = 0; idx < this.baseCol(); idx++) {
      newLine.push(' ');
    }
    this.lines.push(newLine);
  }

  write(str) {
    this._currLine().push(str);
  }

  contents() {
    var lines = this.lines.map(function(line) { return line.join(''); });
    return lines.join('\n');
  }
}

