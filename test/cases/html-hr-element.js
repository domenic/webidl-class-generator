import conversions from "webidl-conversions";
import reflector from "webidl-html-reflector";
export default class HTMLHRElement extends HTMLElement {
  get align() {
    return reflector["DOMString"].get(this, "align");
  }
  set align(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "align", v);
  }
  get color() {
    return reflector["DOMString"].get(this, "color");
  }
  set color(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "color", v);
  }
  get noShade() {
    return reflector["boolean"].get(this, "noshade");
  }
  set noShade(v) {
    v = conversions["boolean"](v);
    reflector["boolean"].set(this, "noshade", v);
  }
  get size() {
    return reflector["DOMString"].get(this, "size");
  }
  set size(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "size", v);
  }
  get width() {
    return reflector["DOMString"].get(this, "width");
  }
  set width(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "width", v);
  }
}
