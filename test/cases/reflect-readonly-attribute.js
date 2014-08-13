import reflector from "webidl-reflector";
export default class ReflectReadonlyAttribute {
  get reflectMe() {
    return reflector["unsigned long"].get(this, "reflectme");
  }
}
