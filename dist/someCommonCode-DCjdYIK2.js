var a = Object.defineProperty;
var t = (l, s, e) => s in l ? a(l, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : l[s] = e;
var o = (l, s, e) => (t(l, typeof s != "symbol" ? s + "" : s, e), e);
class i {
  constructor() {
    o(this, "some_class_field");
    this.some_class_field = "Hello world";
  }
  getSomeClassField() {
    return this.some_class_field;
  }
}
export {
  i as M
};
//# sourceMappingURL=someCommonCode-DCjdYIK2.js.map
