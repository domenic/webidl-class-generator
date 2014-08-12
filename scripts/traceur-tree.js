// Usage: `node scripts/traceur-tree test/cases/empty-interface.js` will output the Traceur tree for the given ES6
// file. You can then use this to guide your tree-generation logic.

"use strict";
var fs = require("fs");
var traceur = require("traceur");
var ErrorReporter = traceur.util.ErrorReporter;
var SourceFile = traceur.syntax.SourceFile;
var Parser = traceur.syntax.Parser;

var filename = process.argv[2];
var contents = fs.readFileSync(filename, { encoding: "utf8" });

var errorReporter = new ErrorReporter();
var sourceFile = new SourceFile(filename, contents);
var parser = new Parser(sourceFile, errorReporter);
var tree = parser.parseModule();

function cleanTreeRecurser(treeFragment) {
  if (typeof treeFragment !== "object" || treeFragment === null) {
    return;
  }

  cleanNode(treeFragment);

  Object.keys(treeFragment).forEach(function (key) {
    if (Array.isArray(treeFragment[key])) {
      treeFragment[key].forEach(cleanTreeRecurser);
    } else {
      cleanTreeRecurser(treeFragment[key]);
    }
  })
}

function cleanNode(node) {
  delete node.location;
  delete node.annotations;
  node.nodeType = node.constructor.name;
}

tree = tree.scriptItemList;
cleanTreeRecurser(tree);

console.log(require("util").inspect(tree, { depth: Infinity, colors: true }));
