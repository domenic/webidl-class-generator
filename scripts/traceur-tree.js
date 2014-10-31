// Usage: `node scripts/traceur-tree test/cases/empty-interface.js` will output the Traceur tree for the given ES6
// file. You can then use this to guide your tree-generation logic.

"use strict";
const fs = require("fs");
const traceur = require("traceur");
const util = require("util");
const ErrorReporter = traceur.util.ErrorReporter;
const SourceFile = traceur.syntax.SourceFile;
const Parser = traceur.syntax.Parser;

const filename = process.argv[2];
const contents = fs.readFileSync(filename, { encoding: "utf8" });

const errorReporter = new ErrorReporter();
const sourceFile = new SourceFile(filename, contents);
const parser = new Parser(sourceFile, errorReporter);
const tree = parser.parseModule();

console.log(util.inspect(tree.toJSON().scriptItemList,  { depth: Infinity, colors: true }));
