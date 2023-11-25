<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <el-button type="primary" v-debounce="[debounce]">1111</el-button>
    <svg-icon icon-class="bug" class="bug" />
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    debounce() {
      console.log('111111111');
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  background-color: rgba($color: #000000, $alpha: 0.1);
  @include border_box();
  .bug {
    font-size: 50px;
  }
}
</style>
