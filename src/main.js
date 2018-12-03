import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "@/store";
import "normalize.css";
import "@/style/cropperjs.css";
import "./style/main.scss";
import { getToken, getUserProfile } from "@/util/token";
import { LOGIN_ROUTER } from "@/router/name";
import { SET_PROFILE } from "@/store/type/mutations.type";
import BaiduMap from "vue-baidu-map";

Vue.config.productionTip = false;

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "8PoS5stgfRwCdnLiLsEBYRi6Tvut3qiB"
});

router.beforeEach((to, from, next) => {
  // document.body.style.overflow = "auto";

  if (to.meta && to.meta.requiresAuth && !getToken()) {
    next({ name: LOGIN_ROUTER });
  } else {
    next();
  }
});

store.commit(SET_PROFILE, getUserProfile() || {});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
