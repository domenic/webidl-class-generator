import conversions from "webidl-conversions";
import Impl from "./stringifier-attribute-impl.js";
export default class StringifierAttribute {
  get href() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "href").get;
    const implResult = implGetter.call(this);
    return conversions["USVString"](implResult);
  }
  set href(v) {
    v = conversions["USVString"](v);
    const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, "href").set;
    implSetter.call(this, v);
  }
  toString() {
    return this.href;
  }
}
window.StringifierAttribute = StringifierAttribute;
