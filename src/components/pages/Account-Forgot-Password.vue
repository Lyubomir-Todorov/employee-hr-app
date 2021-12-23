<template>
  <div class = "container">
    <div class="box m-5 p-5">

      <back/>

      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li><router-link to="/login">Login</router-link></li>
          <li class="is-active"><router-link to="#" aria-current="page">Forgot Password</router-link></li>
        </ul>
      </nav>

      <h1 class="title is-2 has-text-weight-bold is-underlined">Reset your Password</h1>
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
            <btn text="Reset Password" type="is-success" icon="fa-sync-alt" :is-loading="loading"/>
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
      this.helper.email.visible = !this.email;
      this.error.visible = false;

      if (this.email.trim()) {
        this.resetPassword(this.email);
      }
    },
  }
}
</script>
