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
            <li><router-link to="/account/training">My Courses</router-link></li>
            <li class="is-active"><router-link to="">Available Training</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Available Training</h1>


        <div v-if="this.coursesFound">
            <div v-for="item in this.courses" :key="item.id">
              <course
                  :courseId="item.id"
                  :id="item.courseId"
                  :course-code="item.coursecode"
                  :title="item.title"
                  :description="item.description"
                  :startDate="item.startdate"
                  :endDate="item.enddate"
                  :registered="checkCourses(item.courseId)"
              />
            </div>
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
  name: 'AccountTrainingBrowse',
  data: function() {
    return {
      info: {},
      showCourses: false,
    };
  },
  created() {
    this.get_account();
    this.get_courses();
  },
  methods: {
    async withdraw_course(id) {
      await this.withdraw_from_course(id);
    },
    checkCourses: function(t) {
      for(let i = 0; i < this.registeredCourses.length; i ++) {
        if (t === this.registeredCourses[i]) return true;
      }
      return false;
    },
  }
}
</script>