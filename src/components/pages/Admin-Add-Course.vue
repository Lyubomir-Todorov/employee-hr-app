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
            <li class="is-active"><router-link to="#" aria-current="page">Add course</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Add a new course</h1>
        <form @submit.prevent="validate" id="form-register">


          <div class = "field-body mb-3">
            <input-field name="courseCode" label="Course Code"
                         placeholder="Course Code" type="text"
                         :error="helper.coursecode.visible"
                         :helper="helper.coursecode.text"
                         v-model = "course.coursecode"
                         @input="helper.coursecode.visible=false"
            />

            <input-field name="courseTitle" label="Title"
                         placeholder="Course Title" type="text"
                         :error="helper.title.visible"
                         :helper="helper.title.text"
                         v-model = "course.title"
                         @input="helper.title.visible=false"
            />
          </div>

          <div class = "field-body mb-3">
            <input-field name="startDate" label="From"
                         type="date" icon="fa-calendar"
                         :has-min="true"
                         :error="helper.startdate.visible"
                         :helper="helper.startdate.text"
                         v-model = "course.startdate"
                         @input="helper.startdate.visible=false"
            />

            <input-field name="endDate" label="To"
                         type="date" icon="fa-calendar"
                         :has-min="true"
                         :error="helper.enddate.visible"
                         :helper="helper.enddate.text"
                         v-model = "course.enddate"
                         @input="helper.enddate.visible=false"
            />

            <input-field name="totalhours" label="Total hours"
                         placeholder="0" type="number"
                         :error="helper.totalhours.visible"
                         :helper="helper.totalhours.text"
                         v-model = "course.totalhours"
                         @input="helper.totalhours.visible=false"
            />
          </div>

          <div class="control">
            <label for="description" class="label">Description</label>
            <textarea v-model="course.description" id="description" class="textarea has-fixed-size" placeholder="Course Description" ></textarea>
          </div>

          <div class="field mt-5">
            <btn text = "Create course" type="is-link is-success"/>
          </div>

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
  name: 'Register',
  data: function() {
    return {
      course: {
        coursecode: "",
        title: "",
        startdate: "",
        enddate: "",
        description: "",
        totalhours: ""
      },
      helper: {
        coursecode: {visible: false, text: ""},
        title: {visible: false, text: ""},
        startdate: {visible: false, text: ""},
        enddate: {visible: false, text: ""},
        description: {visible: false, text: ""},
        totalhours: {visible: false, text: ""},
      },
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    validate: function () {


      this.course.coursecode = (this.course.coursecode).trim();
      this.course.title = (this.course.title).trim();
      this.course.startdate = (this.course.startdate).trim();
      this.course.enddate = (this.course.enddate).trim()
      this.course.totalhours = (this.course.totalhours).trim();

      //Validate course code
      this.helper.coursecode.visible = !this.course.coursecode;
      if (!this.course.coursecode) this.helper.coursecode.text = 'Course code must be provided';

      //Validate title
      this.helper.title.visible = !this.course.title;
      if (!this.course.title) this.helper.title.text = 'A title must be provided';

      //Validate start
      this.helper.startdate.visible = !this.course.startdate;
      if (!this.course.startdate) this.helper.startdate.text = 'A start date must be provided';

      //Validate end
      this.helper.enddate.visible = !this.course.enddate;
      if (!this.course.enddate) this.helper.enddate.text = 'An end date must be provided';

      //Validate Total
      this.helper.totalhours.visible = !this.course.totalhours;
      if (!this.course.totalhours) this.helper.totalhours.text = 'Total hours must be provided';


      const valid = !this.helper.coursecode.visible &&
          !this.helper.title.visible &&
          !this.helper.startdate.visible &&
          !this.helper.enddate.visible;

      if (valid) this.create_course(this.course);
    },
  }
}
</script>
