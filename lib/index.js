const parseWebIDL = require("webidl2").parse;
import * as codeGen from "./code-generation.js";

export default function generate(webIdlString, implModuleName, implementsModuleNameGetter = defaultImplements) {
    const { theInterface, implemented } = getInterfaceAndImplemented(webIdlString);
    const attributes = theInterface.members.filter(m => m.type === "attribute");
    const operations = theInterface.members.filter(m => m.type === "operation");
    const constants = theInterface.members.filter(m => m.type === "const");

    const transferCustomElementCallbacks = theInterface.extAttrs.some(xa => xa.name === "CustomElementCallbacks");
    const includeReflector = attributes.some(hasReflect);
    const hasNonReflectedAttributes = attributes.some(a => !hasReflect(a));
    const includeImpl = transferCustomElementCallbacks || operations.length > 0 || hasNonReflectedAttributes;
    const includeConversions = operations.length > 0 ||
            attributes.some(a => (!hasReflect(a) || !a.readonly) && !hasNoConversion(a));
    const implementedMap = new Map(implemented.map(name => [name, implementsModuleNameGetter(name)]));
    const moduleTree = codeGen.moduleTree(theInterface.name, {
        includeReflector,
        includeConversions,
        baseClassName: theInterface.inheritance,
        implModuleName: includeImpl ? implModuleName : undefined,
        implemented: implementedMap
    });

    const classTree = moduleTree.scriptItemList[moduleTree.scriptItemList.length - 1].declaration.expression;

    attributes.forEach(a => {
        const reflect = getReflect(a);
        const noConversion = a.extAttrs.some(xa => xa.name === "NoConversion");
        if (reflect.shouldReflect) {
            const getterTree = codeGen.reflectGetterTree(a.name, a.idlType.idlType, reflect.as, { noConversion });
            classTree.elements.push(getterTree);

            if (!a.readonly) {
                const setterTree = codeGen.reflectSetterTree(a.name, a.idlType.idlType, reflect.as, { noConversion });
                classTree.elements.push(setterTree);
            }
        } else {
            classTree.elements.push(codeGen.getterTree(a.name, a.idlType.idlType, { noConversion }));

            if (!a.readonly) {
                classTree.elements.push(codeGen.setterTree(a.name, a.idlType.idlType, { noConversion }));
            }
        }

        if (a.stringifier) {
            classTree.elements.push(codeGen.attributeStringifierTree(a.name));
        }
    });

    operations.forEach(o => {
        let name, args, returnType;
        if (o.stringifier) {
            if (o.name) {
                classTree.elements.push(codeGen.methodStringifierTree(o.name));
                return;
            }

            name = 'toString';
            args = [];
            returnType = 'DOMString';
        } else {
            name = o.name;
            args = o.arguments.map(arg => ({ name: arg.name, type: arg.idlType.idlType }));
            returnType = o.idlType.idlType;
        }

        classTree.elements.push(codeGen.methodTree(name, args, returnType));
    });

    for (const mixinName of implemented) {
        moduleTree.scriptItemList.push(...codeGen.mixinTrees(theInterface.name, mixinName));
    }

    constants.forEach(c => {
        moduleTree.scriptItemList.push(...codeGen.constantTrees(theInterface.name, c.name, c.value.value));
    });

    if (transferCustomElementCallbacks) {
        moduleTree.scriptItemList.push(...codeGen.transferCustomElementCallbacksTrees(theInterface.name));
    }

    const addToWindow = !theInterface.extAttrs.some(xa => xa.name === "NoInterfaceObject");
    if (addToWindow) {
        moduleTree.scriptItemList.push(codeGen.addToWindowTree(theInterface.name));
    }

    return codeGen.treeToString(moduleTree);
};

function getInterfaceAndImplemented(webIdlString) {
    const idlTree = parseWebIDL(webIdlString);
    if (idlTree.length === 0) {
        throw new Error("IDL file must contain an interface");
    }

    const implementsNodes = idlTree.filter(n => n.type === "implements");
    const rest = idlTree.filter(n => n.type !== "implements");

    if (rest.length > 1) {
        throw new Error("IDL file must contain only a single interface, potentially with implements statements");
    }
    const theInterface = rest[0];
    if (theInterface.type !== "interface") {
        throw new Error("IDL file must contain an interface, not a " + theInterface.type);
    }

    if (theInterface.partial) {
        throw new Error("IDL file must not contain a partial interface");
    }

    const implemented = implementsNodes.map(n => {
        if (n.target !== theInterface.name) {
            throw new Error("IDL file must only contain implements statements for the single interface present");
        }
        return n.implements;
    });

    return { theInterface, implemented };
}

function getReflect(webIdlAttribute) {
    const reflectXAttr = webIdlAttribute.extAttrs.find(xa => xa.name === "Reflect");
    if (!reflectXAttr) {
        return { shouldReflect: false };
    }

    if (reflectXAttr.rhs) {
        return { shouldReflect: true, as: reflectXAttr.rhs.value.replace(/_/g, '-') };
    }

    return { shouldReflect: true };
}

function hasReflect(attribute) {
    return attribute.extAttrs.some(xa => xa.name === "Reflect");
}

function hasNoConversion(attribute) {
    return attribute.extAttrs.some(xa => xa.name === "NoConversion");
}

function defaultImplements(interfaceName) {
    return `./${interfaceName}.js`;
}
