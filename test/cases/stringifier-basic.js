import conversions from "webidl-conversions";
import Impl from "./stringifier-basic-impl.js";
export default class StringifierBasic {
  toString() {
    const implMethod = Impl.prototype.toString;
    const implResult = implMethod.call(this);
    return conversions["DOMString"](implResult);
  }
}
window.StringifierBasic = StringifierBasic;
