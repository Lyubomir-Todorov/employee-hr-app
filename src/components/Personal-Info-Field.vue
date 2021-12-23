<template>
  <div class="container" :class="{'column' : inline, 'block' : !inline}">
    <h1 class = "title is-6 has-text-weight-bold">{{this.title}}:</h1>

    <div v-if="editing">
      <input v-if="type !== 'area'" class = "subtitle is-6 input" :type="type"
             @input="$emit('input', $event.target.value)"
             :value="subtitle">
      <textarea v-else class="textarea has-fixed-size"
                @input="$emit('input', $event.target.value)"
                :value="subtitle"/>
    </div>
    <h1 v-else class = "subtitle is-6">{{this.subtitle}}</h1>


  </div>
</template>

<script>
export default {
  name: "Personal-Info-Field",
  data: function() {
    return {
      value: this.subtitle
    };
  },
  props: {
    val: String,
    title: String,
    subtitle: String,
    editing: Boolean,
    inline: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text"
    }
  },
  watch: {
    editing: function() {
      this.$emit('input', this.value);
    },
  }
}
</script>