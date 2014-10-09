import conversions from "webidl-conversions";
import reflector from "webidl-html-reflector";
export default class ReflectCustomName {
  get defaultFoo() {
    return reflector["DOMString"].get(this, "foo");
  }
  set defaultFoo(v) {
    v = conversions["DOMString"](v);
    reflector["DOMString"].set(this, "foo", v);
  }
  get anotherAttribute() {
    return reflector["unsigned long"].get(this, "with-underscores-as-dashes");
  }
}
window.ReflectCustomName = ReflectCustomName;
