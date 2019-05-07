<template>
  <div class="container">
    <a href="https://cn.vuejs.org/v2/guide/" target="_blank">{{ msg }}</a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: 'hello vue'
    }
  }
}
</script>
<style scoped lang="less">
.container {
  font-size: 40px;
  text-align: center;
  padding: 40px;
  > a {
    display: block;
    color: #f00;
  }
}
</style>
