<template>
  <div class = "container">
    <div class="box m-5">
      <h1 class="title is-2 has-text-weight-bold is-underlined">Employee HR App</h1>
      <message type="is-success"
               text="Made by Lyubomir Todorov. This is a web app that uses Vue.js as its front-end and Firebase as the back-end."
      />

      <div class="block">
        Employees can view and edit their personal info, along with registering for training courses.
        <br>Administrators can manage courses, along with adding new users.
      </div>

      <div class="block">
        <strong>Please note, the demo is in a read-only state. Retrieving information works fine, however trying
          to update courses or personal information will result in an error.
        </strong>
      </div>

      <div class="block">
        <a href="https://github.com/Lyubomir-Todorov/employee-hr-app" target="_blank">
          View the source code and additional information on Github
        </a>
      </div>

      <div class="block">
        <router-link to="/login"><btn text="Go to Login" type = "is-link" icon="fa-sign-in-alt"/></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>
