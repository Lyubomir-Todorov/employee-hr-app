<template>
  <div class = "container">
    <div class="box m-5 p-5">

      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/login">Login</router-link></li>
          <li class="is-active"><router-link to="#" aria-current="page">Register</router-link></li>
        </ul>
      </nav>

      <h1 class="title is-2 has-text-weight-bold is-underlined">Create an Account</h1>
      <form @submit.prevent="validate" id="form-register">

        <message v-bind:visible="error.visible" v-bind:text="error.text" type="is-danger"></message>

        <input-field name="username" label="Username"
                     placeholder="Username" type="text" icon="fa-user"
                     v-bind:error="helper.username.visible"
                     v-bind:helper="helper.username.text"
                     v-model = "username"
                     @input="helper.username.visible=false"
        />

        <div class = "field-body mb-3">
          <input-field name="password" label="Password"
                       placeholder="Password" type="password" icon="fa-key"
                       v-bind:error="helper.password.visible"
                       v-bind:helper="helper.password.text"
                       v-model = "password"
                       @input="helper.password.visible=false"
          />

          <input-field name="passwordConfirm" label="Confirm password"
                       placeholder="Confirm Password" type="password" icon="fa-key"
                       v-bind:error="helper.passwordConfirm.visible"
                       v-bind:helper="helper.passwordConfirm.text"
                       v-model = "passwordConfirm"
                       @input="helper.passwordConfirm.visible=false"
          />
        </div>

        <input-field name="email" label="Email Address"
                     placeholder="Email Address" type="email" icon="fa-at"
                     v-bind:error="helper.email.visible"
                     v-bind:helper="helper.email.text"
                     v-model = "email"
                     @input="helper.email.visible=false"
        />

        <div class = "field-body mb-3">
          <input-field name="firstName" label="First Name"
                       placeholder="First Name" type="text" icon="fa-user"
                       v-bind:error="helper.firstName.visible"
                       v-bind:helper="helper.firstName.text"
                       v-model = "firstName"
                       @input="helper.firstName.visible=false"
          />

          <input-field name="lastName" label="Last Name"
                       placeholder="First Name" type="text" icon="fa-user"
                       v-bind:error="helper.lastName.visible"
                       v-bind:helper="helper.lastName.text"
                       v-model = "lastName"
                       @input="helper.lastName.visible=false"
          />
        </div>

        <input-field name="phone" label="Phone Number"
                     placeholder="1234567890" type="tel" icon="fa-phone-alt"
                     v-bind:error="helper.phone.visible"
                     v-bind:helper="helper.phone.text"
                     v-model = "phone"
                     @input="helper.phone.visible=false"
        />

        <div class="field mt-5">
          <div class="control">
            <button type="submit" class="button is-link" id="submit" v-bind:class="{'is-loading' : loading}">Create Account</button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: function() {
    return {
      loading: false,
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',

      helper: {
        username: {visible: false, text: ""},
        password: {visible: false, text: ""},
        passwordConfirm: {visible: false, text: ""},
        email: {visible: false, text: ""},
        phone: {visible: false, text: ""},
        firstName: {visible: false, text: ""},
        lastName: {visible: false, text: ""}
      },
      error: {visible: false, text: ""}
    };
  },

  methods: {
    validate: function () {
      const passwordValidation = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const phoneValidation = /[0-9]{10}/

      this.username.trim();
      this.password.trim();
      this.passwordConfirm.trim();
      this.email.trim();
      this.firstName.trim();
      this.lastName.trim();
      this.phone.trim();

      //Validate username, must be provided, and more than 6 characters
      this.helper.username.visible = !this.username || (this.username.length < 6);
      if (!this.username) this.helper.username.text = 'Username must be provided';
      else if (this.username.length < 6) this.helper.username.text = 'Username must be longer than 6 characters';

      //Validate password, must be provided, and match requirements
      this.helper.password.visible = !this.password || (this.password && !passwordValidation.test(this.password));
      if (!this.password) this.helper.password.text = 'Password must be provided';
      else if (this.password && !passwordValidation.test(this.password)) this.helper.password.text = 'Password must have an uppercase, lowercase, number, special symbol, and be at least 8 characters long'

      //Validate confirmation password, must be provided, and match other password
      this.helper.passwordConfirm.visible = (!this.passwordConfirm) || (this.password && this.passwordConfirm && (this.password !== this.passwordConfirm));
      if (!this.passwordConfirm) this.helper.passwordConfirm.text = 'Password must be provided';
      if (this.password && this.passwordConfirm && (this.password !== this.passwordConfirm)) this.helper.passwordConfirm.text  = 'Passwords must match';

      //Validate email, must be provided, must match pattern
      this.helper.email.visible = !this.email || (!emailValidation.test(this.email));
      if (!this.email) this.helper.email.text = 'Email address must be provided';
      else if (!emailValidation.test(this.email)) this.helper.email.text = 'Invalid email address';

      //Validate first name, must be provided
      this.helper.firstName.visible = !this.firstName;
      if (!this.firstName) this.helper.firstName.text = 'First name must be provided';

      //Validate last name, must be provided
      this.helper.lastName.visible = !this.lastName;
      if (!this.lastName) this.helper.lastName.text = 'First name must be provided';

      //Validate phone number, must be provided, must match pattern
      this.helper.phone.visible = !this.phone || (!phoneValidation.test(this.phone));
      if (!this.phone) this.helper.phone.text = 'Phone number must be provided';
      else if (!phoneValidation.test(this.phone)) this.helper.phone.text = 'Invalid phone number';

      // eslint-disable-next-line no-unused-vars
      const valid = !this.helper.username.visible &&
          !this.helper.password.visible &&
          !this.helper.passwordConfirm.visible &&
          !this.helper.email.visible &&
          !this.helper.firstName.visible &&
          !this.helper.lastName.visible &&
          !this.helper.phone.visible;

      if (valid) this.post_register();
    },
    post_register: function () {
      this.loading = true;

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
              this.$router.push({ path: data.redirect, query: { registration: 'true' } });
            } else {
              const err = data['errors']['errors']

              for (let i = 0; i < (err.length); i++) {
                this.helper[err[i]['param']].visible = true;
                this.helper[err[i]['param']].text = err[i]['msg'];
              }
            }
            this.loading = false;
          })
    }
  }
}
</script>
