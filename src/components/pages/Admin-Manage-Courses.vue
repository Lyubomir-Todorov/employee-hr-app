<template>

  <div v-if="this.loading">
    <spinner/>
  </div>
  <div v-else-if="!this.isLoggedIn">
    <unauthorized message="Error: Unauthorized, please log in to continue" goto="/login" button-text="Login"/>
  </div>
  <div v-else-if="this.userInformationRetrieved">
    <div v-if="!this.isAdministrator">
      <unauthorized message="Error: Permission Denied, you do not have access to this resource" goto="/account" button-text="Account"/>
    </div>
    <div v-else class = "container">
      <div class = "box m-5 p-5">

        <back/>

        <nav class="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li><router-link to="/account">My Account</router-link></li>
            <li class="is-active"><router-link to="#" aria-current="page">Manage Courses</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Manage Courses</h1>

          <div v-for="item in this.courses" :key="item.id">
            <course-modified
                :courseId="item.id"
                :id="item.courseId"
                :course-code="item.coursecode"
                :title="item.title"
                :description="item.description"
                :startDate="item.startdate"
                :endDate="item.enddate"
                :total-hours="(item.totalhours).toString()"

            />
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
  name: 'Register',
  components: {

  },
  data: function() {
    return {
      courses: {},
    };
  },
  created() {
    this.get_account();
    this.get_courses();
  },
  methods: {
  }
}
</script>
