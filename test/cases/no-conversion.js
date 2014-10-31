import reflector from "webidl-html-reflector";
import Impl from "./no-conversion-impl.js";
export default class NoConversion {
  get origin() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "origin").get;
    const implResult = implGetter.call(this);
    return implResult;
  }
  get protocol() {
    const implGetter = Object.getOwnPropertyDescriptor(Impl.prototype, "protocol").get;
    const implResult = implGetter.call(this);
    return implResult;
  }
  set protocol(v) {
    const implSetter = Object.getOwnPropertyDescriptor(Impl.prototype, "protocol").set;
    implSetter.call(this, v);
  }
  get foo() {
    return reflector["boolean"].get(this, "foo");
  }
  set foo(v) {
    reflector["boolean"].set(this, "foo", v);
  }
}
window.NoConversion = NoConversion;
