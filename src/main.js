import Vue from 'vue'
import VueRouter from "vue-router";
import "./firebase-client";
import "./toast";

import Home from "@/components/pages/Home";
import Login from "@/components/Login";
import Register from "@/components/pages/Admin-Register";
import Account from "@/components/pages/Account";
import AccountInfo from "@/components/pages/Account-Info";
import AccountPasswordChange from "@/components/pages/Account-Password-Change"
import AccountTraining from "@/components/pages/Account-Training";
import AccountTrainingBrowse from "@/components/pages/Account-Training-Browse"
import Unauthorized from "@/components/Unauthorized";
import Forgot from "@/components/pages/Account-Forgot-Password";
import NotFound from "@/components/pages/Not-Found";

import Message from "@/components/Message";
import Input from "@/components/Input";
import Training from "@/components/pages/Admin-Manage-Courses";
import TrainingAdd from "@/components/pages/Admin-Add-Course";
import Course from "@/components/Course";
import CourseModified from "@/components/Course-Modified";
import Spinner from "@/components/Spinner";
import Back from "@/components/Back";
import PersonalInfoField from "@/components/Personal-Info-Field";
import InputButton from "@/components/InputButton";


Vue.component("message", Message);
Vue.component("input-field", Input);
Vue.component("course", Course);
Vue.component("course-modified", CourseModified);
Vue.component("spinner", Spinner);
Vue.component("unauthorized", Unauthorized);
Vue.component("personal-field", PersonalInfoField);
Vue.component("back", Back);
Vue.component("btn", InputButton);

Vue.config.productionTip = false
Vue.use(VueRouter);

const routes = [
  {path: '*', component: NotFound},
  {path: '/', component: Home},
  {path: '/login', component: Login},
  {path: '/account/register', component: Register},
  {path: '/forgot', component: Forgot},

  {path: '/account', component: Account},
  {path: '/account/info', component: AccountInfo},
  {path: '/account/password', component: AccountPasswordChange},
  {path: '/account/training', component: AccountTraining},
  {path: '/account/training/browse', component: AccountTrainingBrowse},

  {path: '/training/manage', component: Training},
  {path: '/training/add', component: TrainingAdd},
]
const router = new VueRouter({
  mode: "history",
  routes
})

// eslint-disable-next-line no-unused-vars
new Vue({
  router
}).$mount('#app')




