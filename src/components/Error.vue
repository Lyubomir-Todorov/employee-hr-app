<template>
  <div v-show="visible" class="message is-danger">
    <div class = "message-body has-text-weight-bold">
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: "Error",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    text: String,
  },
}
</script>

<style scoped>

</style>