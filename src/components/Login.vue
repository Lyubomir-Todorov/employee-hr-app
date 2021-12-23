<template>
  <div>
    <div class = "container">
      <div class="box m-5 p-5">
        <h1 class="title is-2 has-text-weight-bold is-underlined">Login</h1>
        <form v-on:submit.prevent="validate" id="form-login">

          <message v-bind:visible="error.visible" v-bind:text="error.text" type="is-danger"></message>

          <input-field name="username" label="Username"
                       placeholder="Username" type="text" icon="fa-user"
                       v-bind:error="helper.username.visible"
                       v-bind:helper="helper.username.text"
                       v-model = "username"
                       @input="helper.username.visible=false"
          />

          <input-field name="password" label="Password"
                       placeholder="Password" type="password" icon="fa-key"
                       v-bind:error="helper.password.visible"
                       v-bind:helper="helper.password.text"
                       v-model="password"
                       @input="helper.password.visible=false"
          />

          <div class="field is-grouped">
            <div class="control">
              <btn text="Login" type="is-success" icon="fa-sign-in-alt" :is-loading="loading"/>
            </div>
            <div class="control">
              <router-link to="/forgot">
                <btn text="Forgot Password" type="is-link" icon="fa-question-circle"/>
              </router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

const bulmaToast = require("bulma-toast");
import { initializeApp } from 'firebase/app';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDv7e6FNIdthlx0bCmz5v2zeRCXnaG1J0",
  authDomain: "vuejs-backend-demo.firebaseapp.com",
  projectId: "vuejs-backend-demo",
  storageBucket: "vuejs-backend-demo.appspot.com",
  messagingSenderId: "1094637691283",
  appId: "1:1094637691283:web:99df984eb7ffe91a1e4866"
};

initializeApp(firebaseConfig);
const auth = getAuth();

export default {
  name: 'Login',
  data: function() {
    return {
        username: '',
        password: '',
        loading: false,
        helper: {
          username: {
            visible: false,
            text: "Username required",
          },
          password: {
            visible: false,
            text: "Password required",
          },
        },
        error: {
          visible: false,
          text: "",
        },
      };
  },
  created() {
    if (this.$route.query.logout) this.displayToast("You have been successfully logged out");
    this.is_logged_in_already()
  },
  methods: {
    displayToast: function (text) {
      bulmaToast.toast({ message: `<p class = "has-text-weight-bold">${text}</p>`,
        type: 'is-success',
        dismissible: true, position: "bottom-center",
        duration: 3000, animate: { in: 'fadeIn', out: 'fadeOut' }})
    },
    async is_logged_in_already() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.$router.push("/account").catch(()=>{});
        }
      });
    },
    async login () {
      const auth = getAuth();
      this.loading = true;
      signInWithEmailAndPassword(auth, this.username, this.password)
          .then(() => {
            this.$router.push("/account").catch(()=>{})
          })
          .catch((error) => {
            this.error.visible = true;
            this.error.text = error.message;

            const element = document.getElementById('app')
            element.classList.add('animate__animated', 'animate__shakeX')

            element.addEventListener('animationend', () => {
              element.classList.remove('animate__animated', 'animate__shakeX')
            })

            this.loading = false;
          });
    },

    validate: function () {
      this.helper.username.visible = !this.username
      this.helper.password.visible = !this.password
      this.error.visible = false

      if (this.username.trim() && this.password.trim()) {
        this.login();
      }
    },
  }
}
</script>
