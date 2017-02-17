(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";
  var WRAP_CLASS = "CodeMirror-selectiveline";
  var BACK_CLASS = "CodeMirror-selectiveline-background";
  var GUTT_CLASS = "CodeMirror-selectiveline-gutter";

  CodeMirror.defineOption("styleSelectiveLine", false, function(cm, val, old) {
    var prev = old == CodeMirror.Init ? false : old;
    if (val == prev) return
    if (prev) {
      cm.off("beforeSelectionChange", selectionChange);
      clearSelectiveLines(cm);
      delete cm.state.selectiveLines;
    }
    if (val) {
      cm.state.selectiveLines = [];
      updateSelectiveLines(cm, cm.listSelections());
      cm.on("beforeSelectionChange", selectionChange);
    }
  });

  function clearSelectiveLines(cm) {
    for (var i = 0; i < cm.state.selectiveLines.length; i++) {
      cm.removeLineClass(cm.state.selectiveLines[i], "wrap", WRAP_CLASS);
      cm.removeLineClass(cm.state.selectiveLines[i], "background", BACK_CLASS);
      cm.removeLineClass(cm.state.selectiveLines[i], "gutter", GUTT_CLASS);
    }
  }

  function sameArray(a, b) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++)
      if (a[i] != b[i]) return false;
    return true;
  }

  function updateSelectiveLines(cm, ranges) {
    var active = [];
    var range = ranges[0];
    var lineCount = Math.abs(range.anchor.line - range.head.line);
    var startLine = Math.min(range.anchor.line, range.head.line);
    var endRange = (range.anchor.line > range.head.line) ? range.anchor : range.head;

    if(endRange.ch > 0) {
      lineCount++;
    }

    for (var i = 0; i < lineCount; i++) {
      var line = cm.getLineHandleVisualStart(startLine + i);
      if (active[active.length - 1] != line) active.push(line);
    }
    if (sameArray(cm.state.selectiveLines, active)) return;
    cm.operation(function() {
      clearSelectiveLines(cm);
      for (var i = 0; i < active.length; i++) {
        cm.addLineClass(active[i], "wrap", WRAP_CLASS);
        cm.addLineClass(active[i], "background", BACK_CLASS);
        cm.addLineClass(active[i], "gutter", GUTT_CLASS);
      }
      cm.state.selectiveLines = active;
    });
  }

  function selectionChange(cm, sel) {
    updateSelectiveLines(cm, sel.ranges);
  }
});
