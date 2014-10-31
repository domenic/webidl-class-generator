// This file wraps Traceur's PlaceholderParser helpers so that they don't cache. This is only necessary because we are
// doing a bad thing and mutating ASTs frequently. See discussion at
// https://github.com/google/traceur-compiler/issues/1407

const PlaceholderParser = require("traceur").get("codegeneration/PlaceholderParser");
const { CloneTreeTransformer: { cloneTree } } = require("traceur").get("codegeneration/CloneTreeTransformer");

export const parseModule = makeCloningParser("parseModule");
export const parseStatement = makeCloningParser("parseStatement");
export const parsePropertyDefinition = makeCloningParser("parsePropertyDefinition");

export function parseStatements(...args) {
    return PlaceholderParser.parseStatements(...args).map(cloneTree);
}

function makeCloningParser(parserMethodName) {
    return (...args) => cloneTree(PlaceholderParser[parserMethodName](...args));
}
