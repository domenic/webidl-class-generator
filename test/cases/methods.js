import conversions from "webidl-conversions";
export default class Method {
  theMethod(arg1, arg2) {
    arg1 = conversions["DOMString"](arg1);
    arg2 = conversions["unsigned long"](arg2);
  }
  otherMethod(otherMethodArg) {
    otherMethodArg = conversions["double"](otherMethodArg);
  }
}
