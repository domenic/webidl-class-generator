# WebIDL Class Generator

The goal of this project is to take as input

```js
// foo.idl
interface Foo : Bar {
    [Reflect] attribute unsigned long x;
    readonly attribute long y;
    boolean method(DOMString arg);
}
```

plus

```js
// foo-impl.js
export default class FooImpl {
    get y() { return Math.random() * 1000; }
    method(arg) { return arg.toLowerCase(); }
}
```

and produce something like

```js
// foo.js
import reflector from "webidl-html-reflector";
import conversions from "webidl-conversions";
import FooImpl from "./foo-impl";

export default class Foo extends Bar {
    get x() {
        return reflector["unsigned long"].get(this, "x");
    }
    set x(v) {
        v = conversions["unsigned long"](v);
        reflector["unsigned long"].set(this, "x", v);
    }

    get y() {
        var implGetter = Object.getOwnPropertyDescriptor(FooImpl.prototype, "y").get;
        var implResult = implGetter.call(this);
        return conversions["long"](implResult);
    }

    method(arg) {
        arg = conversions["DOMString"](arg);
        var implMethod = FooImpl.prototype.method;
        var implResult = implMethod.call(this, arg);
        return conversions["boolean"](implResult);
    }
}
```

(Although since `[Reflect]` is not part of standard WebIDL, ideally that would be done in a second pass, perhaps by a "plugin.")
