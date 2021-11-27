<template>
  <div class="box m-5 p-5">
    <h1 class="title is-2 has-text-weight-bold">Login</h1>
    <form v-on:submit.prevent="validate" id="form-login">

      <error-message text="Incorrect username / password!"></error-message>
      <input-field icon="fa-user" placeholder=temp helper="Fart2!"></input-field>

      <div class="field">
        <label for="username" class="label">Username / Email-Address</label>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
          <input type="text" name="username" placeholder="username" id="username"
                 class="input" spellcheck="false"
                 v-on:input="helperUsernameVisible=false" v-model="username"
          />
        </div>
        <p class="help is-danger" v-show="helperUsernameVisible">Please enter a username or email-address</p>
      </div>

      <div class="field">
        <label for="password" class="label">Password</label>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
            <i class="fas fa-key"></i>
          </span>
          <input type="password" name="password" placeholder="password" id="password"
                 class="input" autocomplete="password" v-on:input="helperPasswordVisible=false"
                 v-model="password"
          />
        </div>
        <p class="help is-danger" v-show="helperPasswordVisible">Please enter a password</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link" id="submit">Login</button>
        </div>
        <div class="control">
          <button class="button is-link is-light" id="forgotPassword">Forgot password</button>
        </div>
      </div>

      <a href="/register">Not a user yet? Create a new account now</a>
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
        helperUsernameVisible: false,
        helperPasswordVisible: false,
        errorVisible: false,
        errorMessage: ''
      };
  },
  methods: {
    validate: function () {
      this.helperUsernameVisible = !this.username
      this.helperPasswordVisible = !this.password

      this.errorVisible = false

      if (this.username && this.password) {
        this.post_login()
      }
    },
    post_login: function () {
      const form = document.getElementById('form-login')
      const submit = document.getElementById('submit')
      submit.classList.add('is-loading')

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.value,
          password: form.password.value
        })
      }

      fetch('/login', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              window.location.href = data.redirect
            } else {
              this.errorVisible = true
              this.errorMessage = data.errors
              const element = document.getElementById('app')
              element.classList.add('animate__animated', 'animate__shakeX')

              element.addEventListener('animationend', () => {
                element.classList.remove('animate__animated', 'animate__shakeX')
              })
            }
            submit.classList.remove('is-loading')
          })
    }
  }
}
</script>
