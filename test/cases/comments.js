import conversions from "webidl-conversions";
import Impl from "./comments-impl.js";
export default class Comments {
  get bar() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "bar").get;
    const implResult = implGetter.call(this);
    return conversions["DOMString"](implResult);
  }
}
window.Comments = Comments;
