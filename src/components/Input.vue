<template>
  <div class="field">
    <label for="input" class="label">{{label}}</label>
    <div class="control" v-bind:class="{'has-icons-left' : icon}">

      <span class="icon is-small is-left" v-show="icon">
        <i class="fas" v-bind:class="icon"></i>
      </span>

      <input id="input" class="input"
        v-bind:type="type"
        v-bind:name="name"
        v-bind:placeholder="placeholder"
        v-bind:spellcheck=spellcheck
        v-bind:class="{'is-danger' : input_has_error}"
        v-on:input="clearErrors"
      />
    </div>
    <p class="help is-danger" v-show="helper_is_visible">{{ helper }}</p>
  </div>
</template>

<script>
export default {
  name: "Input",
  data() {
    return {
      input_has_error: true,
      helper_is_visible: true,
    }
  },
  props: {
    name: String,
    label: String,
    helper: String,
    placeholder: String,
    type: {
      type: String,
      default: "text",
    },
    spellcheck: {
      type: Boolean,
      default: true,
    },
    icon: String,
  },
  methods: {
    clearErrors: function () {
      this.input_has_error = false;
      this.helper_is_visible = false;
    },
  }
}
</script>

<style scoped>

</style>