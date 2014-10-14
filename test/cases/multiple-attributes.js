import conversions from "webidl-conversions";
import Impl from "./multiple-attributes-impl.js";
export default class MultipleAttributes {
  get attribute1() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "attribute1").get;
    const implResult = implGetter.call(this);
    return conversions["unsigned long"](implResult);
  }
  set attribute1(v) {
    v = conversions["unsigned long"](v);
    const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, "attribute1").set;
    implSetter.call(this, v);
  }
  get attribute2() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "attribute2").get;
    const implResult = implGetter.call(this);
    return conversions["DOMString"](implResult);
  }
  get attribute3() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "attribute3").get;
    const implResult = implGetter.call(this);
    return conversions["short"](implResult);
  }
  set attribute3(v) {
    v = conversions["short"](v);
    const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, "attribute3").set;
    implSetter.call(this, v);
  }
}
window.MultipleAttributes = MultipleAttributes;
