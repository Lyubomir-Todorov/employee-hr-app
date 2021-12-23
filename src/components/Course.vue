<template>
  <div class = "block mb-3">
    <article class = "message is-info" :class="{'is-success' : isRegistered}">
      <div class = "message-header is-clickable" @click="expand = !expand">{{courseCode}} : {{title}}
        <span class="icon is-small">
          <i class="fas fa-angle-down"></i>
        </span>
      </div>
      <div v-show="expand" class = "message-body">

        <div class = "block">
          <h1 class = "title is-4 has-text-weight-bold">{{ startDate }} to {{ endDate }}</h1>

          <h1 class = "subtitle is-6">
            {{isRegistered ? "You are currently registered for this course" : "You are not yet registered for this" }}
          </h1>

          <btn :text="isRegistered ? 'Withdraw' : 'Register'"
               :type="isRegistered ? 'is-danger' : 'is-success'"
               :icon="isRegistered ? 'fa-minus-circle' : 'fa-plus-circle'"
               :is-loading="loading"
               @click.native="course_toggle"
          />
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
    id: String,
    title: String,
    startDate: String,
    endDate: String,
    registered: Boolean,
    description: String,
  },
  methods: {
    async course_toggle() {
      this.loading = true;
      this.isRegistered ? await this.withdraw(): await this.register();
      this.loading = false;
    },
    async register() {
      await this.$parent.register_to_course(this).then((success) => {
        if (success) this.isRegistered = true;
      });
    },
    async withdraw() {
      await this.$parent.withdraw_from_course(this)
      .then(success => {
        if (success) this.isRegistered = false;
      });
    }
  },
  created() {
    const options = { month: 'short', day: 'numeric' };

    this.startDateAsDate = new Date(this.startDate).toLocaleDateString('en-US', options);
    this.endDateAsDate = new Date(this.endDate).toLocaleDateString('en-US', options);
  },
}
</script>