import reflector from "webidl-html-reflector";
export default class ReflectReadonlyAttribute {
  get reflectMe() {
    return reflector["unsigned long"].get(this, "reflectme");
  }
}
window.ReflectReadonlyAttribute = ReflectReadonlyAttribute;
