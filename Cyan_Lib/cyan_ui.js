import { defineAsyncComponent as c } from "vue";
const a = /* @__PURE__ */ Object.assign({ "./Button/button.vue": () => import("./button-BgXPdMJQ.js") }), m = (t, e = "c-") => {
  for (const [n, o] of Object.entries(a)) {
    const s = e + n.slice(n.lastIndexOf("/") + 1, n.lastIndexOf("."));
    t.component(s, c(o));
  }
};
export {
  m as default
};
