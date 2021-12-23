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
            <li class="is-active"><router-link to="">Registered Courses</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">My Registered Courses</h1>
        <div v-if="this.courseFound">

          <div v-for="item in this.registeredCourseInfo" :key="item.id">

            <div class = "card mt-3">
              <header class = "card-header">
              <div class="card-header-title">
                {{item.coursecode}} - {{item.title}}
              </div>
              <btn type="card-header-icon" @click.native="withdraw_from_course(item)" icon="fa-trash"/>
              </header>

            </div>
          </div>
        </div>
        <div v-else>
          <p>You are not currently registered for any courses.</p>
        </div>

        <div class = "block mt-5">
          <router-link to = "/account/training/browse">
            <btn text = "Browse Courses" type="is-link is-light" icon="fa-search"/>
          </router-link>
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
  name: 'AccountTraining',
  data: function() {
    return {
      info: {},
      showCourses: false,
      courseFound: false,
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    async withdraw_course(id) {
      await this.withdraw_from_course(id);
    },
  },
  watch: {
    async registeredCourses() {
      if (!this.courseFound) {
        await this.get_registered_courses();
        this.courseFound=true;
      }
    }
  }
}
</script>