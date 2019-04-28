<template>
  <div class="container">首页</div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("test", {
      count: ({ count }) => count
    })
  },
  methods: {
    ...mapMutations("test", ["subtract", "increment"])
  },
  created() {
    console.log("second");
  }
};
</script>
<style scoped >
.container {
  /**/
  font-size: 18px;
  text-align: center;
}
</style>
