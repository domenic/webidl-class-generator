var parseWebIDL = require("webidl2").parse;
import * as codeGen from "./code-generation.js";

export default function generate(webIdlString) {
    var theInterface = getInterface(webIdlString);
    var attributes = theInterface.members.filter(m => m.type === "attribute");
    var operations = theInterface.members.filter(m => m.type === "operation");

    var includeReflector = attributes.some(a => a.extAttrs.findIndex(xa => xa.name === "Reflect") !== -1);
    var includeConversions = attributes.some(a => !a.readonly) || operations.some(o => o.arguments.length > 0);
    var baseClassName = theInterface.inheritance;
    var moduleTree = codeGen.moduleTree(theInterface.name, { includeReflector, includeConversions, baseClassName });

    var classTree = moduleTree.scriptItemList[moduleTree.scriptItemList.length - 1].declaration.expression;

    // The parsed module tree will be cached, so we need to be careful to reset elements before modifying it.
    classTree.elements = [];

    attributes.forEach(a => {
        var reflect = getReflect(a);
        if (reflect) {
            classTree.elements.push(codeGen.reflectGetterTree(a.name, a.idlType.idlType));

            if (!a.readonly) {
                classTree.elements.push(codeGen.reflectSetterTree(a.name, a.idlType.idlType));
            }
        } else {
            classTree.elements.push(codeGen.getterTree(a.name));

            if (!a.readonly) {
                classTree.elements.push(codeGen.setterTree(a.name, a.idlType.idlType));
            }
        }
    });

    operations.forEach(o => {
        var argNames = o.arguments.map(arg => arg.name);
        classTree.elements.push(codeGen.methodTree(o.name, argNames));
    });

    return codeGen.treeToString(moduleTree);
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

function getReflect(webIdlAttribute) {
    return webIdlAttribute.extAttrs.find(xa => xa.name === "Reflect");
}
