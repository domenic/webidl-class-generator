import conversions from "webidl-conversions";
import reflector from "webidl-html-reflector";
export default class ReflectAttributes {
  get attribute1() {
    return reflector["unsigned long"].get(this, "attribute1");
  }
  get attribute2() {
    return reflector["DOMString"].get(this, "attribute2");
  }
  set attribute2(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "attribute2", v);
  }
  get attribute3() {
    return reflector["boolean"].get(this, "attribute3");
  }
}
