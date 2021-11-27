<template>
  <div class="box m-5">
    <h1 class="title is-2 has-text-weight-bold">This is the landing page, sweet!</h1>
    <article class="message is-info">
      <div class="message-body has-text-weight-bold">
        Made by Lyubomir Todorov. This is a demo that uses Vue.js as its front-end and node.js as a backend.
      </div>
    </article>
    <router-link to="/login">
      <button class = "button is-link">
        Go to login
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
