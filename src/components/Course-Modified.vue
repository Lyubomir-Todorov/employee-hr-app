<template>
  <div class = "block mb-3">
    <article class = "message is-info">
      <div class = "message-header is-clickable" @click="expand = !expand">{{courseCode}} : {{title}}
        <span class="icon is-small">
          <i class="fas fa-angle-down"></i>
        </span>
      </div>
      <div v-show="expand" class = "message-body">

        <div class = "columns">
          <personal-field :inline="true" v-model="course.title" title="Title" :editing="editing" :subtitle="title"/>
          <personal-field :inline="true" v-model="course.coursecode" title="Course Code" :editing="editing" :subtitle="courseCode"/>
        </div>

        <div class = "columns">
          <personal-field type="date" v-model="course.startdate" :inline="true" title="Start Date" :editing="editing" :subtitle="startDate"/>
          <personal-field type="date" v-model="course.enddate" :inline="true" title="End Date" :editing="editing" :subtitle="startDate"/>
        </div>

        <personal-field type="number" v-model="course.totalhours" title="Total hours" :editing="editing" :subtitle="totalHours"/>
        <personal-field type="area" v-model="course.description" title="Description" :editing="editing" :subtitle="description"/>


        <div class = "buttons">
          <div v-if="editing">

            <btn text="Save" icon="fa-check-circle"
                 type="is-success"  @click.native="update" :is-loading="this.performingTask"/>
            <btn text="Cancel" icon="fa-times-circle"
                 type="is-danger"  @click.native="editing=false"/>

          </div>
          <div v-else>

            <btn text="Edit" icon="fa-pen"
                 type="is-warning"  @click.native="editing=true"/>
            <btn text="Delete" icon="fa-trash"
                 type="is-danger"  @click.native="$parent.delete_course(course)"/>

          </div>


        </div>


      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: "CourseModified",
  data() {
    return {
      course: {
        title: this.title,
        coursecode: this.courseCode,
        description: this.description,
        startdate: this.startDate,
        enddate: this.endDate,
        totalhours: this.totalHours,
        courseId: this.id,
        id: this.id,
      },
      expand: false,
      editing: false
    }
  },
  props: {
    courseCode: String,
    id: String,
    title: String,
    startDate: String,
    endDate: String,
    totalHours: String,
    description: String,
  },
  methods: {
    async update() {
      await this.$parent.update_course(this.course, this.id);
      this.editing = false;
      this.expand = true;
    }
  },
  created() {

  },
}
</script>