var { ParseTreeWriter } = require("traceur").get("outputgeneration/ParseTreeWriter");
var { parseModule, parsePropertyDefinition } = require("traceur").get("codegeneration/PlaceholderParser");
var { createIdentifierExpression: id } = require("traceur").get("codegeneration/ParseTreeFactory");

export function moduleTree(className, { includeReflector = false, baseClassName } = {}) {
    var moduleTree = baseClassName ?
        parseModule`export default class ${className} extends ${id(baseClassName)} { }` :
        parseModule`export default class ${className} { }`;

    if (includeReflector) {
        var reflectorModuleTree = parseModule`import reflector from "webidl-reflector";`
        moduleTree.scriptItemList.unshift(reflectorModuleTree.scriptItemList[0]);
    }

    return moduleTree;
}

export function getterTree(name) {
    return parsePropertyDefinition`get ${name}() { }`;
}

export function reflectGetterTree(name, type) {
    return parsePropertyDefinition`get ${name}() { return reflector[${type}].get(this, ${name.toLowerCase()}); }`;
}

export function setterTree(name) {
    return parsePropertyDefinition`set ${name}(v) { }`;
}

export function reflectSetterTree(name, type) {
    return parsePropertyDefinition`set ${name}(v) { reflector[${type}].set(this, ${name.toLowerCase()}, v); }`;
}

export function methodTree(name, argNames) {
    return parsePropertyDefinition`${name}(${argNames.join(", ")}) { }`;
}

export function treeToString(tree) {
    var writer = new ParseTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
}
