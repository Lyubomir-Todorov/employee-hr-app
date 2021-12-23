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

        <div v-if="this.isAdministrator">

          <h1 class="title is-2 has-text-weight-bold is-underlined">Admin portal</h1>

          <div class="block">
            <h1 class="title is-6 has-text-weight-bold">Administrator Tools:</h1>
            <div class = "subtitle is-6">
              <ul><router-link to="/account/register">Add new employee</router-link></ul>
              <ul><router-link to="/training/manage">Manage training courses</router-link></ul>
              <ul><router-link to="/training/add">Add a new course</router-link></ul>
            </div>
          </div>

        </div>
        <div v-else>

          <h1 class="title is-2 has-text-weight-bold is-underlined">Welcome back, {{
              this.info.name ? this.info.name.first: ''
            }}!</h1>
          <h1 class="subtitle is-4 has-text-weight-bold">{{
              this.info.display_id ? this.info.display_id: ''
            }}</h1>

          <div class = "block">
            <h1 class="title is-6 has-text-weight-bold">Self service:</h1>
            <div class = "subtitle is-6">
              <ul><router-link to="/account/info">View personal information</router-link></ul>
              <ul><router-link to="/account/password">Change password</router-link></ul>
            </div>
          </div>

          <div class = "block">
            <h1 class="title is-6 has-text-weight-bold">Learning and Development:</h1>
            <div class = "subtitle is-6">
              <ul><router-link to="/account/training">View registered courses</router-link></ul>
              <ul><router-link to="/account/training/browse">Apply to courses</router-link></ul>
            </div>
          </div>
        </div>
        <div class = "block mt-5">
          <btn text="Logout" type="is-danger" icon="fa-door-open" @click.native="logout_"/>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="this.userInformationError">
    An error has occurred!
  </div>
</template>

<script>

export default {
  name: 'Account',
  data: function() {
    return {
      info: {},
      courses: {},
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    logout_: function () {
      this.logout()
      }
  }
}
</script>