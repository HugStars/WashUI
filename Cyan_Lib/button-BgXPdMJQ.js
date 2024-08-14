import { openBlock as e, createElementBlock as o, renderSlot as r } from "vue";
const s = {
  __name: "button",
  props: {
    // 接受传参
    Text: {
      // 传参的类名
      type: String,
      default: "Test"
    }
  },
  setup(n) {
    return (t, l) => (e(), o("button", null, [
      r(t.$slots, "default")
    ]));
  }
};
export {
  s as default
};
