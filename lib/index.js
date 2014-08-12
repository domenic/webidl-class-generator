var parseWebIDL = require("webidl2").parse;
import * as codeGen from "./code-generation.js";

export default function generate(webIdlString) {
    var theInterface = getInterface(webIdlString);
    var attributes = theInterface.members.filter(m => m.type === "attribute");

    var moduleTree = codeGen.moduleTree(theInterface.name);
    var classTree = moduleTree.scriptItemList[0].declaration.expression;

    // The parsed module tree will be cached, so we need to be careful to reset elements before modifying it.
    classTree.elements = [];
    attributes.forEach(a => {
        classTree.elements.push(codeGen.getterTree(a.name));

        if (!a.readonly) {
            classTree.elements.push(codeGen.setterTree(a.name));
        }
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
