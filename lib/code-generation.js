import { parseModule, parsePropertyDefinition, parseStatement } from "./traceur-parsing.js";
var { ParseTreeWriter } = require("traceur").get("outputgeneration/ParseTreeWriter");
var { createIdentifierExpression: id, createFunctionBody } = require("traceur").get("codegeneration/ParseTreeFactory");

export function moduleTree(className, {
  includeReflector = false,
  includeConversions = false,
  includeDefineProperty = false,
  baseClassName } = {}) {
    var moduleTree = baseClassName ?
        parseModule`export default class ${className} extends ${id(baseClassName)} { }` :
        parseModule`export default class ${className} { }`;

    if (includeDefineProperty) {
        moduleTree.scriptItemList.unshift(parseStatement`var defineProperty = Object.defineProperty;`);
    }

    if (includeReflector) {
        moduleTree.scriptItemList.unshift(parseStatement`import reflector from "webidl-html-reflector";`);
    }

    if (includeConversions) {
        moduleTree.scriptItemList.unshift(parseStatement`import conversions from "webidl-conversions";`);
    }

    return moduleTree;
}

export function getterTree(name) {
    return parsePropertyDefinition`get ${name}() { }`;
}

export function reflectGetterTree(name, type, as = name.toLowerCase()) {
    return parsePropertyDefinition`get ${name}() { return reflector[${type}].get(this, ${as}); }`;
}

export function setterTree(name, type) {
    return parsePropertyDefinition`set ${name}(v) {
        v = conversions[${type}](v);
    }`;
}

export function reflectSetterTree(name, type, as = name.toLowerCase()) {
    return parsePropertyDefinition`set ${name}(v) {
        v = conversions[${type}](v);
        reflector[${type}].set(this, ${as}, v);
    }`;
}

export function methodTree(name, args) {
    var argNames = args.map(a => a.name);
    var methodTree = parsePropertyDefinition`${name}(${argNames.join(", ")}) { }`;

    methodTree.body.statements = args.map(arg => {
        var identifier = id(arg.name);
        return parseStatement`${identifier} = conversions[${arg.type}](${identifier});`;
    });

    return methodTree;
}

export function constantTrees(className, propertyName, value) {
    return [
        parseStatement`defineProperty(${id(className)}, ${propertyName},
            { value: ${value}, enumerable: true });`,
        parseStatement`defineProperty(${id(className)}.prototype, ${propertyName},
            { value: ${value}, enumerable: true });`
    ];
}

export function addToWindowTree(className) {
    return parseStatement`window.${className} = ${id(className)};`
}

export function treeToString(tree) {
    var writer = new ParseTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
}
