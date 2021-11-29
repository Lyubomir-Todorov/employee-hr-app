<template>
  <div v-show="!loading" class="box m-5 p-5">
    <div>
      <div v-if="authorized">
        <h1 class="title is-2 has-text-weight-bold is-underlined">Welcome back, {{this.info.first_name}}!</h1>
        <div class = "block">
          <p class = "is-5 title is-family-code">{{ this.info.id }}</p>
          <p class = "is-6 subtitle">Student</p>
        </div>
        <div class = "block">
          <article class = "message is-success">
            <div class = "message-header">Your Courses</div>
            <div class = "message-body">

              <div v-if="!courses">
                <p class = "mb-3">It looks like you haven't signed up for any modules yet.</p>
              </div>

              <div v-else>
                <div class = "mb-5" v-for="item in courses" :key="item.id">
                  <p class = "is-6 title has-text-weight-bold">{{item.course_code}} - {{item.course_title}}</p>
                  <p class = "is-6 subtitle">{{item.location}}</p>
                  <p class = "is-6 title">{{item.start_date.slice(0,10)}} to {{item.end_date.slice(0,10)}}</p>
                </div>
              </div>

              <button  class = "button is-success has-text-weight-bold">
                <router-link to = "training">Search for training</router-link>
              </button>
            </div>
          </article>
        </div>
        <div class = "card mb-5">
          <header class = "card-header has-text-white has-background-info">
            <p class = "card-header-title has-text-white">Personal Information</p>
            <button class = "card-header-icon" aria-label="more options" @click="expand=!expand">
              <span class = "icon">
                <i class = "fas fa-plus" aria-hidden="true"></i>
              </span>
            </button>
          </header>
          <div class = "card-content" v-show="expand">
            <div class="content">

              <div class = "block">
                <p class = "title is-5 has-text-weight-bold">Name:</p>
                <p class = "subtitle is-6">{{this.info.first_name}} {{this.info.last_name}}</p>
              </div>

              <div class = "block">
                <p class = "title is-5 has-text-weight-bold">Email Address:</p>
                <p class = "subtitle is-6">{{this.info.email_address}}</p>
              </div>

              <div class = "block">
                <p class = "title is-5 has-text-weight-bold">Phone Number:</p>
                <p class = "subtitle is-6">{{format_phone(this.info.phone_number)}}</p>
              </div>

            </div>
          </div>
        </div>
        <button class="button is-danger has-text-weight-bold" @click="post_logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data: function() {
    return {
      info: {},
      courses: {},
      error: "",
      loading: true,
      authorized: false,
      expand: false,
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    get_account: function () {

      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'text/html' },
      }

      fetch('/account', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              this.info = data.msg;
              this.courses = data.courses;
              this.authorized = true;
            } else {
              this.$router.push("/unauthorized")
              this.error = data.msg;
            }
            this.loading = false;
          })
    },
    post_logout: function () {

      const requestOptions = {
        method: 'POST',
      }

      fetch('/logout', requestOptions);
      this.$router.push("/login")
    },
    format_phone: function (val) {
      return `(${val.substring(0,3)})-${val.substring(3,6)}-${val.substring(6,10)}`;
    },
  }
}
</script>
