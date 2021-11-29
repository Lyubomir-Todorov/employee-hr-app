<template>
  <div class="field">
    <label v-bind:for="name" class="label">{{label}}</label>
    <div class="control" v-bind:class="{'has-icons-left' : icon}">

      <span class="icon is-small is-left" v-show="icon">
        <i class="fas" v-bind:class="icon"></i>
      </span>

      <input class="input"
        v-bind:id="name"
        v-bind:type="type"
        v-bind:name="name"
        v-bind:placeholder="placeholder"
        v-bind:spellcheck="spellcheck"
        v-bind:class="{'is-danger' : error}"
        v-bind:autocomplete="{'current-password': type==='password'}"
        v-bind:value="value"
        @input="$emit('input', $event.target.value);"
      />
    </div>
    <p class="help is-danger" v-show="error">{{ helper }}</p>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    name: String,
    label: String,
    helper: String,
    placeholder: String,
    value: String,
    type: {
      type: String,
      default: "text",
    },
    spellcheck: {
      type: Boolean,
      default: true,
    },
    error: {
      type: Boolean,
      default: false,
    },
    icon: String,
  },
}
</script>