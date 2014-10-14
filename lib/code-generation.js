import { parseModule, parsePropertyDefinition, parseStatement, parseStatements } from "./traceur-parsing.js";
var { ParseTreeWriter } = require("traceur").get("outputgeneration/ParseTreeWriter");
var { createIdentifierExpression: id, createFunctionBody } = require("traceur").get("codegeneration/ParseTreeFactory");

export function moduleTree(className, {
  includeReflector = false,
  includeConversions = false,
  implModuleName,
  baseClassName } = {}) {
    var moduleTree = baseClassName ?
        parseModule`export default class ${className} extends ${id(baseClassName)} { }` :
        parseModule`export default class ${className} { }`;

    if (implModuleName !== undefined) {
        moduleTree.scriptItemList.unshift(importImplTree(implModuleName));
    }

    if (includeReflector) {
        moduleTree.scriptItemList.unshift(parseStatement`import reflector from "webidl-html-reflector";`);
    }

    if (includeConversions) {
        moduleTree.scriptItemList.unshift(parseStatement`import conversions from "webidl-conversions";`);
    }

    return moduleTree;
}

export function getterTree(name, type) {
    return parsePropertyDefinition`get ${name}() {
        const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, ${name}).get;
        const implResult = implGetter.call(this);
        return conversions[${type}](implResult);
    }`;
}

export function reflectGetterTree(name, type, as = name.toLowerCase()) {
    return parsePropertyDefinition`get ${name}() {
        return reflector[${type}].get(this, ${as});
    }`;
}

export function setterTree(name, type) {
    return parsePropertyDefinition`set ${name}(v) {
        v = conversions[${type}](v);
        const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, ${name}).set;
        implSetter.call(this, v);
    }`;
}

export function reflectSetterTree(name, type, as = name.toLowerCase()) {
    return parsePropertyDefinition`set ${name}(v) {
        v = conversions[${type}](v);
        reflector[${type}].set(this, ${as}, v);
    }`;
}

export function methodTree(name, args, returnType) {
    var argNames = args.map(a => a.name);
    var methodTree = parsePropertyDefinition`${name}(${argNames.join(", ")}) { }`;

    methodTree.body.statements = args.map(arg => {
        var identifier = id(arg.name);
        return parseStatement`${identifier} = conversions[${arg.type}](${identifier});`;
    });

    methodTree.body.statements.push(parseStatement`const implMethod = Impl.prototype.${name};`);

    var callStatement = parseStatement`const implResult = implMethod.call(this);`
    callStatement.declarations.declarations[0].initializer.args.args.push(...argNames.map(id));
    methodTree.body.statements.push(callStatement);

    methodTree.body.statements.push(parseStatement`return conversions[${returnType}](implResult);`);

    return methodTree;
}

export function constantTrees(className, propertyName, value) {
    return parseStatements`
        Object.defineProperty(${id(className)}, ${propertyName}, { value: ${value}, enumerable: true });
        Object.defineProperty(${id(className)}.prototype, ${propertyName}, { value: ${value}, enumerable: true });
    `;
}

export function addToWindowTree(className) {
    return parseStatement`window.${className} = ${id(className)};`
}

export function treeToString(tree) {
    var writer = new ParseTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
}

function importImplTree(implModuleName) {
    // Working around https://github.com/google/traceur-compiler/issues/1414
    var statement = parseStatement`import Impl from "__placeholder__";`;
    statement.moduleSpecifier.token.value = `"${implModuleName}"`;
    return statement;
}
