import conversions from "webidl-conversions";
import Impl from "./methods-impl.js";
export default class Methods {
  theMethod(arg1, arg2) {
    arg1 = conversions["DOMString"](arg1);
    arg2 = conversions["unsigned long"](arg2);
    const implMethod = Impl.prototype.theMethod;
    const implResult = implMethod.call(this, arg1, arg2);
    return conversions["boolean"](implResult);
  }
  otherMethod(otherMethodArg) {
    otherMethodArg = conversions["double"](otherMethodArg);
    const implMethod = Impl.prototype.otherMethod;
    const implResult = implMethod.call(this, otherMethodArg);
    return conversions["void"](implResult);
  }
}
window.Methods = Methods;
