import conversions from "webidl-conversions";
import Impl from "./no-argument-method-impl.js";
export default class NoArgumentMethod {
  theMethod() {
    const implMethod = Impl.prototype.theMethod;
    const implResult = implMethod.call(this);
    return conversions["boolean"](implResult);
  }
}
Object.defineProperty(NoArgumentMethod.prototype, "theMethod", {enumerable: false});
window.NoArgumentMethod = NoArgumentMethod;
