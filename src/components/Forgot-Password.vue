<template>
  <div class = "container">
    <div class="box m-5 p-5">

      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/login">Login</router-link></li>
          <li class="is-active"><router-link to="#" aria-current="page">Forgot Password</router-link></li>
        </ul>
      </nav>

      <h1 class="title is-2 has-text-weight-bold is-underlined">Reset your Password</h1>
      <message text="Note: The email will not contain any way to actually reset the password. This is just a proof of concept to test mailing" type="is-info"></message>
      <form v-on:submit.prevent="validate" id="form-reset">

        <message v-bind:visible="error.visible" v-bind:text="error.text" type="is-danger"></message>
        <message v-bind:visible="success.visible" v-bind:text="success.text" type="is-success"></message>

        <input-field name="email" label="Email Address"
                     placeholder="Email Address" type="email" icon="fa-at"
                     v-bind:error="helper.email.visible"
                     v-bind:helper="helper.email.text"
                     v-model = "email"
                     @input="helper.email.visible=false"
        />


        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link has-text-weight-bold" id="submit" v-bind:class="{'is-loading' : loading}">Reset</button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forgot-Password',
  data: function() {
    return {
        email: '',
        loading: false,
        helper: {
          email: {
            visible: false,
            text: "Email Address required",
          },
        },
        error: {
          visible: false,
          text: "",
        },
        success: {
          visible: false,
          text: "",
        }
      };
  },
  methods: {
    validate: function () {
      this.helper.email.visible = !this.email
      this.error.visible = false

      if (this.email.trim()) {
        this.post_reset()
      }
    },
    post_reset: function () {
      this.loading = true;

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email
        })
      }

      fetch('/reset', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              this.success.visible = true;
              this.success.text = data.msg;
            } else {
              this.error.visible = true;
              console.log(data);
              this.error.text = data.errors.errors[0].msg;

              const element = document.getElementById('app');
              element.classList.add('animate__animated', 'animate__shakeX');

              element.addEventListener('animationend', () => {
                element.classList.remove('animate__animated', 'animate__shakeX');
              })
            }
            this.loading = false;
          })
    }
  }
}
</script>
