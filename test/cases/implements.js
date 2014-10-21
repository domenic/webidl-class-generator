import conversions from "webidl-conversions";
import Impl from "./implements-impl.js";
import Mixin from "./Mixin.js";
export default class Implements {
  get foo() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "foo").get;
    const implResult = implGetter.call(this);
    return conversions["DOMString"](implResult);
  }
}
Object.getOwnPropertyNames(Mixin.prototype).forEach((key) => {
  const propDesc = Object.getOwnPropertyDescriptor(Mixin.prototype, key);
  Object.defineProperty(Implements.prototype, key, propDesc);
});
window.Implements = Implements;
