<template>
  <div class = "block">
    <article class = "message" v-bind:class="{'is-success' : isRegistered}">
      <div class = "message-header is-clickable" @click="expand = !expand">{{courseCode}} : {{title}}
        <span class="icon is-small">
          <i class="fas fa-angle-down"></i>
        </span>
      </div>
      <div v-show="expand" class = "message-body">

        <div class = "block">
          <h1 class = "title is-4 has-text-weight-bold">{{ startDateAsDate }} - {{ endDateAsDate }}</h1>

          <h1 class = "subtitle is-6">
            {{isRegistered ? "You are currently registered for this course" : "You are not yet registered for this" }}
          </h1>

          <button class = "button has-text-weight-bold"
                  v-bind:class="{'is-danger' : isRegistered, 'is-success' : !isRegistered, 'is-loading' : loading}"
                  @click="course_toggle"
          >
            {{ isRegistered ? "Withdraw" : "Register now"}}
          </button>
        </div>

        <p class = "mb-3">{{description}}</p>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: "Course",
  data() {
    return {
      startDateAsDate : null,
      endDateAsDate : null,
      expand: !this.registered,
      isRegistered: this.registered,
      loading: false
    }
  },
  props: {
    courseCode: String,
    courseId: Number,
    title: String,
    startDate: String,
    endDate: String,
    registered: Boolean,
    description: String,
  },
  methods: {
    course_toggle: function () {
      if (this.isRegistered) {
        this.post_course_withdraw();
      } else {
        this.post_course_register();
      }
    },
    post_course_register: function () {
      this.loading = true;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: this.courseId,
        })
      }

      fetch('/course-register', requestOptions)
          .then(response => response.json())
          .then(data => {
            if (data.status === 200) {
              this.isRegistered = true;
            }
            this.loading = false;
          })
    },
    post_course_withdraw: function () {
      this.loading = true;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: this.courseId,
        })
      }

      fetch('/course-withdraw', requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            if (data.status === 200) {
              this.isRegistered = false;
            }
            this.loading = false;
          })
    },
  },
  created() {
    const options = { month: 'short', day: 'numeric' };

    this.startDateAsDate = new Date(this.startDate).toLocaleDateString('en-US', options);
    this.endDateAsDate = new Date(this.endDate).toLocaleDateString('en-US', options);
  },
}
</script>