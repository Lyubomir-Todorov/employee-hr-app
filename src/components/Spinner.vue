<template>
  <div class = "spinner"></div>
</template>

<script>
export default {
  name: "Spinner"
}
</script>

<style scoped>
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }

  .spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-top: -20px;
    margin-left: -20px;
    border-radius: 50%;
    border: 4px solid #ccc;
    border-top-color: #000;
    animation: spinner .6s linear infinite;
  }
</style>