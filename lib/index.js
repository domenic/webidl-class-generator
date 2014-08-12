var parseWebIDL = require("webidl2").parse;
var { codegeneration: { parseModule }, outputgeneration: { ParseTreeWriter } } = require("traceur");

export default function generate(webIdlString) {
    var theInterface = getInterface(webIdlString);

    return compileTraceurTree(getTraceurTreeSkeleton(theInterface.name));
};

function getInterface(webIdlString) {
    var idlTree = parseWebIDL(webIdlString);
    if (idlTree.length === 0) {
        throw new Error("IDL file must contain an interface");
    }
    if (idlTree.length > 1) {
        throw new Error("IDL file must contain only a single interface");
    }
    var theInterface = idlTree[0];
    if (theInterface.type !== "interface") {
        throw new Error("IDL file must contain an interface, not a " + theInterface.type);
    }

    if (theInterface.partial) {
        throw new Error("IDL file must not contain a partial interface");
    }

    return theInterface;
}

function getTraceurTreeSkeleton(className) {
    return parseModule`export default class ${className} { }`;
}

function compileTraceurTree(tree) {
    var writer = new ParseTreeWriter();
    writer.visitAny(tree);
    return writer.toString();
}
