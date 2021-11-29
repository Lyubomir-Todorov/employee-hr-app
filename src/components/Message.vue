<template>
  <div v-show="visible" class="message" v-bind:class="type">
    <div class = "message-body has-text-weight-bold">
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    text: String,
    type: String,
  },
}
</script>

<style scoped>

</style>