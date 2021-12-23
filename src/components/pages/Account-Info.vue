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
            <li class="is-active"><router-link to="">Personal Information</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Personal Details</h1>
        <div v-if="this.info">

          <div v-if="!editing" class = "block">
            <btn text = "Update information" type = "is-warning" icon = "fa-edit" @click.native="editing = true"/>
          </div>

          <div v-else class = "block buttons">
            <btn text = "Cancel" type = "is-danger" icon="fa-times-circle" :is-loading="this.loading"  @click.native="editing=false"/>
            <btn text = "Save changes" type = "is-success" icon="fa-check-circle" :is-loading="this.loading"  @click.native="update"/>
          </div>

          <personal-field title="Employee ID" :subtitle="this.info.display_id" :editing="false"/>


          <div class = "columns">
            <personal-field v-model="updatedValues.name.first" :inline="true" title="First Name" :editing="editing" :subtitle="this.info.name.first"/>
            <personal-field v-model="updatedValues.name.middle" :inline="true" title="Middle Name" :editing="editing" :subtitle="this.info.name.middle"/>
            <personal-field v-model="updatedValues.name.last" :inline="true" title="Last Name" :editing="editing" :subtitle="this.info.name.last"/>
          </div>

          <div class = "columns">
            <personal-field v-model="updatedValues.birthday" type="date" :inline="true" title="Date of Birth" :editing="editing" :subtitle="this.info.birthday" />

            <personal-field v-model="updatedValues.address" :inline="true" title="Address" :editing="editing"
            :subtitle="this.info.address"/>

            <personal-field v-model="updatedValues.unit" :inline="true" title="Apartment / Unit number" :editing="editing" :subtitle="this.info.unit"/>

          </div>

          <personal-field v-model="updatedValues.phone" type="tel" title="Phone Number" :subtitle="this.info.phone" :editing="editing"/>
          <personal-field v-model="updatedValues.email" type="email" title="Email Address" :subtitle="this.info.email" :editing="editing"/>
          <personal-field v-model="updatedValues.sin" title="SIN number" :subtitle="this.info.sin" :editing="editing"/>

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
  name: 'AccountInfo',
  data: function() {
    return {
      info: {},
      updatedValues: {
        name: {
          first: "",
          middle: "",
          last: "",
        },
        birthday: "",
        address: "",
        unit: "",
        phone: "",
        email: "",
        sin: "",
      },
      courses: {},
      editing: false,
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    async update() {
      await this.update_account(this.updatedValues);
      this.editing = false;
    },
  }
}
</script>