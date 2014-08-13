import conversions from "webidl-conversions";
export default class MultipleAttributes {
  get attribute1() {}
  set attribute1(v) {
    v = conversions["unsigned long"](v);
  }
  get attribute2() {}
  get attribute3() {}
  set attribute3(v) {
    v = conversions["short"](v);
  }
}
