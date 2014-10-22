# Generate JavaScript Classes from WebIDL Interfaces

The goal of this project is to take as input

```js
// foo.idl
interface Foo : Bar {
    [Reflect] attribute unsigned long x;
    readonly attribute long y;
    attribute DOMString z;
    boolean method(DOMString arg);

    constant unsigned short A_CONSTANT = 42;
}
```

plus

```js
// foo-impl.js
export default class FooImpl {
    get y() { return Math.random() * 1000; }
    get z() { return this._z; }
    set z(v) { this._z = v; }
    method(arg) { return arg.toLowerCase(); }
}

```

and produce something like

```js
// foo.js
import reflector from "webidl-html-reflector";
import conversions from "webidl-conversions";
import Impl from "./foo-impl";
var defineProperty = Object.defineProperty;

export default class Foo extends Bar {
    get x() {
        return reflector["unsigned long"].get(this, "x");
    }
    set x(v) {
        v = conversions["unsigned long"](v);
        reflector["unsigned long"].set(this, "x", v);
    }

    get y() {
        const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "y").get;
        const implResult = implGetter.call(this);
        return conversions["long"](implResult);
    }

    get z() {
        const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "z").get;
        const implResult = implGetter.call(this);
        return conversions["DOMString"](implResult);
    }
    set z(v) {
        v = conversions["DOMString"](v);
        const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, "z").set;
        implSetter.call(this, v);
    }

    method(arg) {
        arg = conversions["DOMString"](arg);
        const implMethod = Impl.prototype.method;
        const implResult = implMethod.call(this, arg);
        return conversions["boolean"](implResult);
    }
}

defineProperty(Foo, "A_CONSTANT", { value: 42, enumerable: true });
defineProperty(Foo.prototype, "A_CONSTANT", { value: 42, enumerable: true });

window.Foo = Foo;
```

(Although since `[Reflect]` is not part of standard WebIDL, ideally that would be done in a second pass, perhaps by a "plugin.")

## API

This package's main module's default export is a function that takes as input a WebIDL string and the implementation module name, and returns a string of JavaScript. It will parse the WebIDL, making sure that it contains a single (non-partial) interface, and then build up the resulting JavaScript. Any unsupported WebIDL features—which is most of them, right now—will generally be ignored. An example:

```js
var fs = require("fs");
import generate from "webidl-class-generator";

var idl = fs.readFileSync("html-hr-element.idl", { encoding: "utf-8" });
var js = generate(idl, "./html-hr-element-impl.js");

fs.writeFileSync("html-hr-element.js", js);
```

## Status

We only support a subset of WebIDL features; they are being added on an as-needed basis for [HTML as Custom Elements](https://github.com/dglazkov/html-as-custom-elements). Check out [the test cases](https://github.com/domenic/webidl-class-generator/tree/master/test/cases) for a sampling of what's supported, and [the issues](https://github.com/domenic/webidl-class-generator/labels/idl%20feature) for upcoming ones that need work.
