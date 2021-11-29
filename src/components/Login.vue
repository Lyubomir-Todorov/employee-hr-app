<template>
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
          <button type="submit" class="button is-link has-text-weight-bold" id="submit" v-bind:class="{'is-loading' : loading}">Login</button>
        </div>
        <div class="control">
          <router-link to="/forgot">
          <button class="button is-link is-light has-text-weight-bold" id="forgotPassword">Forgot password</button>
          </router-link>
        </div>
      </div>

      <router-link to="/register">Not a user yet? Create a new account now</router-link>
    </form>
  </div>
</template>

<script>
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
        }
      };
  },
  methods: {
    validate: function () {
      this.helper.username.visible = !this.username
      this.helper.password.visible = !this.password
      this.error.visible = false

      if (this.username.trim() && this.password.trim()) {
        this.post_login()
      }
    },
    post_login: function () {
      this.loading = true;

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password
        })
      }

      fetch('/login', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              this.$router.push(data.redirect)
            } else {
              this.error.visible = true
              this.error.text = data.errors

              const element = document.getElementById('app')
              element.classList.add('animate__animated', 'animate__shakeX')

              element.addEventListener('animationend', () => {
                element.classList.remove('animate__animated', 'animate__shakeX')
              })
            }
            this.loading = false;
          })
    }
  }
}
</script>
