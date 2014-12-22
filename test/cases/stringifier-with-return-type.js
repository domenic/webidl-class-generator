import conversions from "webidl-conversions";
import Impl from "./stringifier-with-return-type-impl.js";
export default class StringifierWithReturnType {
  toString() {
    const implMethod = Impl.prototype.toString;
    const implResult = implMethod.call(this);
    return conversions["DOMString"](implResult);
  }
}
Object.defineProperty(StringifierWithReturnType.prototype, "toString", {enumerable: false});
window.StringifierWithReturnType = StringifierWithReturnType;
