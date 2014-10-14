import conversions from "webidl-conversions";
import Impl from "./readonly-attribute-impl.js";
export default class ReadonlyAttribute {
  get theAttribute() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "theAttribute").get;
    const implResult = implGetter.call(this);
    return conversions["DOMString"](implResult);
  }
}
window.ReadonlyAttribute = ReadonlyAttribute;
