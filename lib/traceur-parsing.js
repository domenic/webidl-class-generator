// This file wraps Traceur's PlaceholderParser helpers so that they don't cache. This is only necessary because we are
// doing a bad thing and mutating ASTs frequently. See discussion at
// https://github.com/google/traceur-compiler/issues/1407

var PlaceholderParser = require("traceur").get("codegeneration/PlaceholderParser");
var { CloneTreeTransformer: { cloneTree } } = require("traceur").get("codegeneration/CloneTreeTransformer");

export var parseModule = makeCloningParser("parseModule");
export var parseStatement = makeCloningParser("parseStatement");
export var parsePropertyDefinition = makeCloningParser("parsePropertyDefinition");

export function parseStatements(...args) {
    return PlaceholderParser.parseStatements(...args).map(cloneTree);
}

function makeCloningParser(parserMethodName) {
    return (...args) => cloneTree(PlaceholderParser[parserMethodName](...args));
}
