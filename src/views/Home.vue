<template>
  <div class="home">
    <div class="title">
      Success
    </div>
    <div class="decoration"/>
    <div class="sub-title">Hello {{ profile.username }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      email: null,
      password: null
    };
  },
  computed: {
    ...mapState({
      profile: state => state.user.profile
    })
  },
  methods: {
    onSubmit() {}
  }
};
</script>

<style lang="scss" scoped>
@import "../style/config";
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 10px;

  .title {
    font-family: $logo-font-family;
    font-size: $logo-font-size * 2;
    color: $logo-color;
  }
  .decoration {
    background-color: $logo-color;
    width: 50px;
    height: 5px;
    margin: 15px 5px 30px;
  }

  .sub-title {
    font-family: $logo-font-family;
    color: $oc-grape-0;
    font-size: 50px;
  }
}
</style>
