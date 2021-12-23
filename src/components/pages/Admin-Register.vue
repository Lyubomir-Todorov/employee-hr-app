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
            <li class="is-active"><router-link to="#" aria-current="page">Register</router-link></li>
          </ul>
        </nav>

        <h1 class="title is-2 has-text-weight-bold is-underlined">Create an Account</h1>
        <h1 class="is-size-7 has-text-danger">* Denotes required fields</h1>
        <form @submit.prevent="validate" id="form-register">

          <message :visible="error.visible" :text="error.text" type="is-danger"></message>

          <div class = "field-body mb-3">

            <input-field name="firstName" label="First Name"
                         placeholder="First Name" type="text" icon="fa-user"
                         :error="helper.first.visible"
                         :helper="helper.first.text"
                         v-model = "firstName"
                         @input="helper.first.visible=false"
            />

            <input-field name="middleName" label="Middle Name"
                         placeholder="Middle Name" type="text" icon="fa-user"
                         :error="helper.middle.visible"
                         :helper="helper.middle.text"
                         :required="false"
                         v-model = "middleName"
                         @input="helper.middle.visible=false"
            />

            <input-field name="lastName" label="Last Name"
                         placeholder="Last Name" type="text" icon="fa-user"
                         :error="helper.last.visible"
                         :helper="helper.last.text"
                         v-model = "lastName"
                         @input="helper.last.visible=false"
            />

            <input-field name="birthday" label="Date of Birth"
                         placeholder="yyyy-mm-dd" type="date" icon="fa-calendar-day"
                         :has-max="true"
                         :error="helper.birthday.visible"
                         :helper="helper.birthday.text"
                         v-model = "birthday"
                         @input="helper.birthday.visible=false"
            />
          </div>



          <div class = "field-body mb-3">

            <input-field name="streetName" label="Address"
                         placeholder="Street Name" type="text" icon="fa-home"
                         :error="helper.address.visible"
                         :helper="helper.address.text"
                         v-model = "address"
                         @input="helper.address.visible=false"
            />

            <!--
            <input-field name="postal" label="Postal Code"
                         placeholder="e.g L9L 9L9" type="text" icon="fa-map-marker-alt"
                         :error="helper.postal.visible"
                         :helper="helper.postal.text"
                         v-model = "postal"
                         @input="helper.postal.visible=false"
            />
            -->

            <input-field name="unitNumber" label="Apartment / Building number"
                         placeholder="Apartment / Building number" type="number" icon="fa-building"
                         :error="helper.unit.visible"
                         :helper="helper.unit.text"
                         :required="false"
                         v-model = "unitNumber"
                         @input="helper.unit.visible=false"
            />

          </div>

          <input-field name="sin" label="SIN"
                       placeholder="123-456-789" type="text" icon="fa-id-card"
                       :error="helper.sin.visible"
                       :helper="helper.sin.text"
                       v-model = "sin"
                       @input="helper.sin.visible=false"
          />

          <input-field name="email" label="Email Address"
                       placeholder="Email Address" type="email" icon="fa-at"
                       :error="helper.email.visible"
                       :helper="helper.email.text"
                       v-model = "email"
                       @input="helper.email.visible=false"
          />

          <input-field name="phone" label="Phone Number"
                       placeholder="1234567890" type="tel" icon="fa-phone-alt"
                       :error="helper.phone.visible"
                       :helper="helper.phone.text"
                       v-model = "phone"
                       @input="helper.phone.visible=false"
          />

          <div class="field mt-5">
            <btn text = "Create account" type="is-success"/>
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

import { initializeApp } from 'firebase/app';
import {getAuth, getIdToken} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBDv7e6FNIdthlx0bCmz5v2zeRCXnaG1J0",
  authDomain: "vuejs-backend-demo.firebaseapp.com",
  projectId: "vuejs-backend-demo",
  storageBucket: "vuejs-backend-demo.appspot.com",
  messagingSenderId: "1094637691283",
  appId: "1:1094637691283:web:99df984eb7ffe91a1e4866"
};

initializeApp(firebaseConfig);

const auth = getAuth();


export default {
  name: 'Register',

  data: function() {
    return {
      loading: true,
      authorized: false,
      authorizedLevel: false,
      uid: "",
      password: "",

      firstName: "",
      middleName: "",
      lastName: "",
      birthday: "",
      address: "",
      postal: "",
      unitNumber: "",
      sin: "",
      email: "",
      phone: "",

      helper: {
        first: {visible: false, text: ""},
        middle: {visible: false, text: ""},
        last: {visible: false, text: ""},
        birthday: {visible: false, text: ""},
        address: {visible: false, text: ""},
        postal: {visible: false, text: ""},
        unit: {visible: false, text: ""},
        sin: {visible: false, text: ""},
        email: {visible: false, text: ""},
        phone: {visible: false, text: ""},
      },
      error: {visible: false, text: ""}
    };
  },
  created() {
    this.get_account();
  },
  methods: {
    validate: function () {

      const nameValidation = /\d/;
      const dateValidation = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      //const postalValidation = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
      const sinValidation = /^(\d{3}-\d{3}-\d{3})|(\d{3} \d{3} \d{3})|(\d{9})$/;
      const emailValidation = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const phoneValidation = /[0-9]{10}/

      this.firstName.trim();
      this.middleName.trim();
      this.lastName.trim();
      this.address.trim();
      //this.postal.trimLeft().trimRight();
      this.unitNumber.trim();
      this.email.trim();
      this.phone.trim();
      this.sin.trim();

      //Validate first name, must be provided
      this.helper.first.visible = !this.firstName || nameValidation.test(this.firstName);
      if (!this.firstName) this.helper.first.text = 'First name must be provided';
      else if (this.firstName && nameValidation.test(this.firstName)) this.helper.first.text = 'Invalid first name';

      //Validate middle name, optional
      if (this.middleName && nameValidation.test(this.middleName)) this.helper.middle.visible = true;
      if (this.middleName && nameValidation.test(this.middleName)) this.helper.middle.text = 'Invalid middle name';

      //Validate last name, must be provided
      this.helper.last.visible = !this.lastName || nameValidation.test(this.lastName);
      if (!this.lastName) this.helper.last.text = 'Last name must be provided';
      else if (this.lastName && nameValidation.test(this.lastName)) this.helper.last.text = 'Invalid last name';

      //Validate birthday, must be provided
      this.helper.birthday.visible = !this.birthday || (this.birthday && !dateValidation.test(this.birthday));
      if (!this.birthday) this.helper.birthday.text = 'Date of birth must be provided';
      else if (this.birthday && !dateValidation.test(this.birthday)) this.helper.birthday.text = 'Invalid date';

      //Validate address, must be provided
      this.helper.address.visible = !this.address;
      if (!this.address) this.helper.address.text = 'Address must be provided';

      //Validate postal code, must be provided
      //this.helper.postal.visible = !this.postal || (this.postal && !postalValidation.test(this.postal));
      //if (!this.postal) this.helper.postal.text = 'Postal Code must be provided';
      //else if (this.postal && !postalValidation.test(this.postal)) this.helper.postal.text = 'Invalid Postal Code';

      //Validate unit number, optional
      if (this.unitNumber && !nameValidation.test(this.unitNumber)) this.helper.unit.visible = true;
      if (this.unitNumber && !nameValidation.test(this.unitNumber)) this.helper.unit.text = 'Invalid unit number';

      //Validate sin, must be provided, must match pattern
      this.helper.sin.visible = !this.sin || (!sinValidation.test(this.sin));
      if (!this.sin) this.helper.sin.text = 'SIN must be provided';
      else if (!sinValidation.test(this.sin)) this.helper.sin.text = 'Invalid SIN';

      //Validate email, must be provided, must match pattern
      this.helper.email.visible = !this.email || (!emailValidation.test(this.email));
      if (!this.email) this.helper.email.text = 'Email address must be provided';
      else if (!emailValidation.test(this.email)) this.helper.email.text = 'Invalid email address';

      //Validate phone number, must be provided, must match pattern
      this.helper.phone.visible = !this.phone || (!phoneValidation.test(this.phone));
      if (!this.phone) this.helper.phone.text = 'Phone number must be provided';
      else if (!phoneValidation.test(this.phone)) this.helper.phone.text = 'Invalid phone number';

      const valid = !this.helper.first.visible &&
          !this.helper.middle.visible &&
          !this.helper.last.visible &&
          !this.helper.birthday.visible &&
          !this.helper.address.visible &&
          //!this.helper.postal.visible &&
          !this.helper.unit.visible &&
          !this.helper.sin.visible &&
          !this.helper.email.visible &&
          !this.helper.phone.visible;

      if (valid) this.register();
    },
    async register() {

      this.loading = true;

      const requestOptions = {
        method: 'POST',
        body: JSON.stringify({
          first: this.firstName,
          middle: this.middleName,
          last: this.lastName,
          birthday: this.birthday,
          address: this.address,
          //postal: this.postal,
          unit: this.unitNumber,
          email: this.email,
          phone: this.phone,
          sin: this.sin
        })
      }


      getIdToken(auth.currentUser, true)
        .then(token => {
          requestOptions.headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
          }
          fetch('/register', requestOptions)
              .then(response => response.json())
              .then(data => {

                if (data.status === 400) {
                  const err = data['message']['errors'];
                  for (let i = 0; i < (err.length); i++) {
                    this.helper[err[i]['param']].visible = true;
                    this.helper[err[i]['param']].text = err[i]['msg'];
                  }
                } else {
                  this.displayToast(data.status === 200 || data.status === 401 ? data.message :data.message.message,
                      data.status === 200 ? "is-success" : "is-danger")
                }

                if (data.status === 200) {
                  this.$router.go();
                }

                this.loading = false;
              })

      });
    },
  }
}
</script>
