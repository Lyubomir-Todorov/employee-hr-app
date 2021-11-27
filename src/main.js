import Vue from 'vue'
import VueRouter from "vue-router";

import Home from "@/components/Home";
import Login from "@/components/Login";
import Register from "@/components/Register";

import Error from "@/components/Error";
import Input from "@/components/Input";

Vue.component("error-message", Error);
Vue.component("input-field", Input);


Vue.config.productionTip = false
Vue.use(VueRouter);


const routes = [
  {path: '/', component: Home},
  {path: '/login', component: Login},
  {path: '/register', component: Register},
]
const router = new VueRouter({
  mode: "history",
  routes
})

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  router
}).$mount('#app')
