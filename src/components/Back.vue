<template>
  <div class = "block">
    <div class = "icon is-clickable" @click="back">
      <span class = "fas fa-arrow-left"></span>
    </div>
  </div>
</template>

<script>
export default {
name: "Back",
  methods: {
    back: function () {
      this.$router.back();
      //this.$router.replace("./")
    }
  }
}
</script>
