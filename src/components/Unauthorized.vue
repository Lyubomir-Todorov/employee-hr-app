<template>
  <div class="box m-5 p-5">
    <h1 class="title is-2 has-text-weight-bold is-underlined">Access denied</h1>
    <div>
      <message text="Unauthorized - Please login to continue" type="is-danger"></message>
      <router-link to="/login">
        <button class = "button is-link has-text-weight-bold">Login</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account'
}
</script>
