var { ParseTreeWriter } = require("traceur").get("outputgeneration/ParseTreeWriter");
var { parseModule, parsePropertyDefinition } = require("traceur").get("codegeneration/PlaceholderParser");

export function moduleTree(className) {
    return parseModule`export default class ${className} { }`;
}

export function getterTree(name) {
    return parsePropertyDefinition`get ${name}() { }`;
}

export function reflectGetterTree(name, type) {
    return parsePropertyDefinition`get ${name}() { return reflector[${type}](this, ${name}); }`;
}

export function setterTree(name) {
    return parsePropertyDefinition`set ${name}(v) { }`;
}

export function methodTree(name, argNames) {
    return parsePropertyDefinition`${name}(${argNames.join(", ")}) { }`;
}

export function treeToString(tree) {
    var writer = new ParseTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
}