<template>
  <button class = "button has-text-weight-bold" :class="[type, {'is-loading' : isLoading}]">
    <span v-if="icon" class="icon is-small">
        <i class="fas" :class="icon"></i>
    </span>
    <span>{{text}}</span>
  </button>
</template>

<script>
export default {
  name: "Input",
  props: {
    text: String,
    icon: String,
    type: String,
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>