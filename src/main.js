import Vue from 'vue'
import VueRouter from "vue-router";

import Home from "@/components/Home";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Account from "@/components/Account";
import Unauthorized from "@/components/Unauthorized";
import Forgot from "@/components/Forgot-Password";

import Message from "@/components/Message";
import Input from "@/components/Input";
import Training from "@/components/Training";
import Course from "@/components/Course";
import NotFound from "@/components/NotFound";

Vue.component("message", Message);
Vue.component("input-field", Input);
Vue.component("course", Course);

Vue.config.productionTip = false
Vue.use(VueRouter);

const routes = [
  {path: '*', component: NotFound},
  {path: '/', component: Home},
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/forgot', component: Forgot},
  {path: '/account', component: Account},
  {path: '/unauthorized', component: Unauthorized},
  {path: '/training', component: Training},
]
const router = new VueRouter({
  mode: "history",
  routes
})

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  router
}).$mount('#app')
