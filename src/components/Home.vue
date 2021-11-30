<template>
  <div class = "container">
    <div class="box m-5">
      <h1 class="title is-2 has-text-weight-bold is-underlined">This is the landing page, sweet!</h1>
      <message type="is-info"
               text="Made by Lyubomir Todorov. This is a demo that uses Vue.js as its front-end and node.js as a back-end."
      />
      <router-link to="/login">
        <button class = "button is-link has-text-weight-bold">
          Go to login
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
