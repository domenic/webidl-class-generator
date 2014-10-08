var parseWebIDL = require("webidl2").parse;
import * as codeGen from "./code-generation.js";

export default function generate(webIdlString) {
    var theInterface = getInterface(webIdlString);
    var attributes = theInterface.members.filter(m => m.type === "attribute");
    var operations = theInterface.members.filter(m => m.type === "operation");
    var constants = theInterface.members.filter(m => m.type === "const");

    var includeReflector = attributes.some(a => a.extAttrs.findIndex(xa => xa.name === "Reflect") !== -1);
    var includeConversions = attributes.some(a => !a.readonly) || operations.some(o => o.arguments.length > 0);
    var moduleTree = codeGen.moduleTree(theInterface.name, {
        includeReflector,
        includeConversions,
        includeDefineProperty: constants.length > 0,
        baseClassName: theInterface.inheritance
    });

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
        var args = o.arguments.map(arg => ({ name: arg.name, type: arg.idlType.idlType }));
        classTree.elements.push(codeGen.methodTree(o.name, args));
    });

    constants.forEach(c => {
        moduleTree.scriptItemList.push(...codeGen.constantTrees(theInterface.name, c.name, c.value.value));
    });

    var addToWindow = !theInterface.extAttrs.some(ea => ea.name === "NoInterfaceObject");
    if (addToWindow) {
        moduleTree.scriptItemList.push(codeGen.addToWindowTree(theInterface.name));
    }

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
