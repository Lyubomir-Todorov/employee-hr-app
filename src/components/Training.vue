<template>
  <div class = "container">
    <div v-show="!loading" class="box m-5 p-5">
      <div>
        <div v-if="authorized">

          <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li><router-link to="/account">My Account</router-link></li>
              <li class="is-active"><router-link to="#" aria-current="page">Training courses</router-link></li>
            </ul>
          </nav>

          <h1 class="title is-2 has-text-weight-bold is-underlined">Training</h1>

          <course class = "mb-2" v-for="item in courses" :key="item.id"
                  v-bind:courseId="item.id"
                  v-bind:course-code="item.course_code"
                  v-bind:title="item.course_title"
                  v-bind:description="item.description"
                  v-bind:startDate="item.start_date"
                  v-bind:endDate="item.end_date"
                  v-bind:registered="item.registered"
          />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: function() {
    return {
      error: "",
      loading: true,
      authorized: false,
      courses: {},
      registered: {}
    };
  },
  created() {
    this.get_courses();
  },
  methods: {
    get_courses: function () {

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'text/html' },
      }

      fetch('/training', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              this.courses = data.msg;
              this.registered = data.msg;
              this.authorized = true;
            } else {
              this.$router.push("/unauthorized")
              this.error = data.msg;
            }
            this.loading = false;
          })
    },
  },
}
</script>
