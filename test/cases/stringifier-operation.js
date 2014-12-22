import conversions from "webidl-conversions";
import Impl from "./stringifier-operation-impl.js";
export default class StringifierOperation {
  foo() {
    const implMethod = Impl.prototype.foo;
    const implResult = implMethod.call(this);
    return conversions["boolean"](implResult);
  }
  toString() {
    return conversions["DOMString"](this.foo());
  }
}
Object.defineProperty(StringifierOperation.prototype, "foo", {enumerable: false});
Object.defineProperty(StringifierOperation.prototype, "toString", {enumerable: false});
window.StringifierOperation = StringifierOperation;
