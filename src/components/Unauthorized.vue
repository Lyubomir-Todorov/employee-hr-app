<template>
  <div class = "container">
    <div class="box m-5 p-5">
      <h1 class="title is-2 has-text-weight-bold is-underlined">Unauthorized</h1>
      <div>
        <message :text="message" type="is-danger"></message>
        <router-link :to="goto">
          <button class = "button is-link has-text-weight-bold">{{ buttonText }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Account',
  props: {
    message: String,
    buttonText: String,
    goto: String,
  }
}
</script>
