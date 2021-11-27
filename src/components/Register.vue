<template>
  <div class="box m-5 p-5">
    <h1 class="title is-2 has-text-weight-bold">Create an account</h1>
    <form v-on:submit.prevent="validate" id="form-register">

      <error-message class="is-danger" id="error" v-bind:visible="errorVisible" v-bind:text="errorMessage"></error-message>

      <div class="field">
        <label for="username" class="label">Username</label>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
          </span>
          <input type="text" name="username" id="username" class="input" placeholder="Username"
                 v-on:input="helperUsernameVisible=false" v-model="username"
          />
        </div>
        <p class="help is-danger" v-show="helperUsernameVisible">{{helperUsername}}</p>
      </div>

      <div class="field-body">
        <div class="field">
          <label for="password" class="label">Password</label>
          <div class="control has-icons-left">
            <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
            </span>
            <input type="password" name="password" id="password" class="input" placeholder="Password"
                   v-on:input="helperPasswordVisible=false" v-model="password"
            />
          </div>
          <p class="help is-danger" v-show="helperPasswordVisible">{{helperPassword}}</p>
        </div>

        <div class="field">
          <label for="passwordConfirm" class="label">Confirm Password</label>
          <div class="control has-icons-left">
            <span class="icon is-small is-left">
                <i class="fas fa-key"></i>
            </span>
            <input type="password" name="password" id="passwordConfirm" class="input" placeholder="Confirm Password"
                   v-on:input="helperPasswordConfirmVisible=false" v-model="passwordConfirm"
            />
          </div>
          <p class="help is-danger" v-show="helperPasswordConfirmVisible">{{helperPasswordConfirm}}</p>
        </div>
      </div>

      <div class="field mt-3">
        <label for="email" class="label">Email Address</label>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
              <i class="fas fa-at"></i>
          </span>
          <input type="email" name="email" id="email" class="input" placeholder="Email Address"
                 v-on:input="helperEmailVisible=false" v-model="email"
          />
        </div>
        <p class="help is-danger" v-show="helperEmailVisible">{{helperEmail}}</p>
      </div>

      <div class="field-body">
        <div class="field">
          <label for="firstName" class="label">First Name</label>
          <div class="control has-icons-left">
            <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
            </span>
            <input type="text" name="firstName" id="firstName" class="input" placeholder="First Name"
                   v-on:input="helperFirstNameVisible=false" v-model="firstName"
            />
          </div>
          <p class="help is-danger" v-show="helperFirstNameVisible">{{helperFirstName}}</p>
        </div>

        <div class="field">
          <label for="lastName" class="label">Last Name</label>
          <div class="control has-icons-left">
            <span class="icon is-small is-left">
                <i class="fas fa-user"></i>
            </span>
            <input type="text" name="lastName" id="lastName" class="input" placeholder="Last Name"
                   v-on:input="helperLastNameVisible=false" v-model="lastName"
            />
          </div>
          <p class="help is-danger" v-show="helperLastNameVisible">{{helperLastName}}</p>
        </div>
      </div>

      <div class="field mt-3">
        <label for="phone" class="label">Phone Number</label>
        <div class="control has-icons-left">
          <span class="icon is-small is-left">
              <i class="fas fa-phone-alt"></i>
          </span>
          <input type="tel" name="phone" id="phone" class="input" placeholder="Phone Number"
                 v-on:input="helperPhoneVisible=false" v-model="phone"
          />
        </div>
        <p class="help is-danger" v-show="helperPhoneVisible">{{helperPhone}}</p>
      </div>

      <div class="field mt-5">
        <div class="control">
          <button type="submit" class="button is-link" id="submit">Create Account</button>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: function() {
    return {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',

      helperUsernameVisible: false,
      helperPasswordVisible: false,
      helperPasswordConfirmVisible: false,
      helperEmailVisible: false,
      helperPhoneVisible: false,
      helperFirstNameVisible: false,
      helperLastNameVisible: false,

      helperUsername: '',
      helperPassword: '',
      helperPasswordConfirm: '',
      helperEmail: '',
      helperPhone: '',
      helperFirstName: '',
      helperLastName: '',

      errorVisible: false,
      errorMessage: ''
    };
  },

  methods: {
    validate: function () {
      let valid = true
      const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const phoneValidation = /[0-9]{10}/

      if (!this.username) {
        this.helperUsernameVisible = true
        this.helperUsername = 'Username must be provided'
        valid = false
      } else if (this.username.length < 6) {
        this.helperUsernameVisible = true
        this.helperUsername = 'Username must be longer than 6 characters'
        valid = false
      }

      if (!this.password) {
        this.helperPasswordVisible = true
        this.helperPassword = 'Password must be provided'
        valid = false
      }

      if (!this.passwordConfirm) {
        this.helperPasswordConfirmVisible = true
        this.helperPasswordConfirm = 'Password must be provided'
        valid = false
      }

      if (this.password && this.passwordConfirm && (this.password !== this.passwordConfirm)) {
        this.helperPasswordConfirmVisible = true
        this.helperPasswordConfirm = 'Passwords must match'
        valid = false
      }
      if (this.password && !passwordValidation.test(this.password)) {
        this.helperPasswordVisible = true
        this.helperPassword = 'Passwords must have an uppercase, digit, special symbol, and be at least 8 characters long'
        valid = false
      }

      if (!this.email) {
        this.helperEmailVisible = true
        this.helperEmail = 'Email address must be provided'
        valid = false
      } else if (!emailValidation.test(this.email)) {
        this.helperEmailVisible = true
        this.helperEmail = 'Invalid email address'
        valid = false
      }

      if (!this.firstName) {
        this.helperFirstNameVisible = true
        this.helperFirstName = 'First name must be provided'
        valid = false
      }
      if (!this.lastName) {
        this.helperLastNameVisible = true
        this.helperLastName = 'Last name must be provided'
        valid = false
      }
      if (!this.phone) {
        this.helperPhoneVisible = true
        this.helperPhone = 'Phone number must be provided'
        valid = false
      } else if (!phoneValidation.test(this.phone)) {
        this.helperPhoneVisible = true
        this.helperPhone = 'Invalid phone number'
        valid = false
      }

      if (valid) {
        this.post_register()
      }
    },
    post_register: function () {
      //const form = document.getElementById('form-register')
      const submit = document.getElementById('submit')
      submit.classList.add('is-loading')

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          passwordConfirm: this.passwordConfirm,
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone
        })
      }

      fetch('/register', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              window.location.href = data.redirect
            } else {
              const err = data['errors']['errors']
              for (let i = 0; i < (err.length); i++) {
                switch (err[i]['param']) {
                  case ('username'):
                    this.helperUsernameVisible = true
                    this.helperUsername = err[i]['msg']
                    break
                  case ('password'):
                    this.helperPasswordVisible = true
                    this.helperPassword = err[i]['msg']
                    break
                  case ('email'):
                    this.helperEmailVisible = true
                    this.helperEmail = err[i]['msg']
                    break
                  case ('firstName'):
                    this.helperFirstNameVisible = true
                    this.helperFirstName = err[i]['msg']
                    break
                  case ('lastName'):
                    this.helperLastNameVisible = true
                    this.helperLastName = err[i]['msg']
                    break
                  case ('phone'):
                    this.helperPhoneVisible = true
                    this.helperPhone = err[i]['msg']
                    break
                }
              }
            }
            submit.classList.remove('is-loading')
          })
    }
  }
}
</script>
