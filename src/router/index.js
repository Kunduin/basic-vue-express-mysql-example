import Vue from "vue";
import Router from "vue-router";
import { LOGIN_ROUTER, REGISTER_ROUTER, HOME_ROUTER } from "@/router/name";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: () => import("@/layout/LoginLayout"),
      meta: { requiresAuth: false },
      children: [
        {
          name: REGISTER_ROUTER,
          path: "/register",
          component: () => import("@/views/Register"),
          meta: { requiresAuth: false }
        },
        {
          name: LOGIN_ROUTER,
          path: "",
          component: () => import("@/views/Login"),
          meta: { requiresAuth: false }
        }
      ]
    },
    {
      name: HOME_ROUTER,
      path: "/",
      component: () => import("@/views/Home"),
      meta: { requiresAuth: true }
    }
  ]
});
