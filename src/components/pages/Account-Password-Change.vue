<template>
  <div v-if="this.loading">
    <spinner/>
  </div>
  <div v-else-if="!this.isLoggedIn">
    <unauthorized message="Error: Unauthorized, please log in to continue" goto="/login" button-text="Login"/>
  </div>
  <div v-else-if="this.userInformationRetrieved">
    <div class="container">
      <div class="box m-5 p-5">

        <back/>

        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/account">My Account</router-link></li>
            <li class="is-active"><router-link to="">Change Password</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Change Password</h1>

        <form @submit.prevent="validate" id="form-register">
          <input-field name="password" label="Password"
                       placeholder="New Password" type="password" icon="fa-key"
                       :error="helper.password.visible"
                       :helper="helper.password.text"
                       :required="true"
                       v-model = "password"
                       @input="helper.password.visible=false"
          />

          <input-field name="passwordConfirm" label="Password"
                       placeholder="Confirm Password" type="password" icon="fa-key"
                       :error="helper.passwordConfirm.visible"
                       :helper="helper.passwordConfirm.text"
                       :required="true"
                       v-model = "passwordConfirm"
                       @input="helper.passwordConfirm.visible=false"
          />

          <btn text = "Submit" type = "is-success"/>


        </form>
      </div>
    </div>
  </div>
  <div v-else-if="this.userInformationError">
    An error has occurred!
  </div>
</template>

<script>

export default {
  name: 'AccountPasswordChange',
  data: function() {
    return {
      helper: {
        password: {visible: false, text: ""},
        passwordConfirm: {visible: false, text: ""},
      },
      password: "",
      passwordConfirm: "",
      error: {visible: false, text: ""}
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    validate: function() {

      let valid = true;
      this.password = this.password.trim();
      this.passwordConfirm = this.passwordConfirm.trim();

      if (!this.password) {
        this.helper.password.visible = true;
        this.helper.password.text = "Password must be provided";
        valid = false;
      }
      if (!this.passwordConfirm) {
        this.helper.passwordConfirm.visible = true;
        this.helper.passwordConfirm.text = "Password must be provided";
        valid = false;
      }

      if (this.password !== this.passwordConfirm) {
        this.helper.password.visible = true;
        this.helper.passwordConfirm.visible = true;
        this.helper.password.text = "Passwords must match!";
        this.helper.password.text = "Passwords must match!";

        valid = false;
      }

      if (valid) this.change_password(this.password);

    }
  },
}
</script>