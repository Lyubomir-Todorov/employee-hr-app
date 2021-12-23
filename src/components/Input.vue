<template>
  <div class="field">
    <label :for="name" class="label">
      {{label}}
      <span v-show="required" class = "has-text-danger">*</span>
    </label>
    <div class="control" :class="{'has-icons-left' : icon}">

      <span class="icon is-small is-left" v-show="icon">
        <i class="fas" :class="icon"></i>
      </span>

      <input class="input"
        :id="name"
        :type="type"
        :min="(type === 'date' && hasMin) ? today : null"
        :max="(type === 'date' && hasMax) ? today : null"
        :name="name"
        :placeholder="placeholder"
        :spellcheck="spellcheck"
        :class="{'is-danger' : error}"
        :autocomplete="{'current-password': type==='password'}"
        :value="value"
        @input="$emit('input', $event.target.value);"
      />
    </div>
    <p class="help is-danger" v-show="error">{{ helper }}</p>
  </div>
</template>

<script>
export default {
  name: "Input",
  data: function() {
    return {
      today: ""
    };
  },
  props: {
    name: String,
    label: String,
    helper: String,
    placeholder: String,
    value: String,
    required: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "text"
    },
    spellcheck: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: false
    },
    hasMin: {
      type: Boolean,
      default: false
    },
    hasMax: {
      type: Boolean,
      default: false
    },
    icon: String,
  },
  created() {
    if (this.type === 'date') this.getTodaysDate();
  },
  methods: {
    getTodaysDate: function () {
      const date = new Date();
      this.today = (date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()).toString();
    }
  },
}
</script>