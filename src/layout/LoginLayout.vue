<template>
  <el-container class="outer-container">
    <el-main>
      <div class="logo">
        MOOC
      </div>
      <div class="container">
        <div class="container__main">
          <router-view/>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div class="author">
        @NJU software
      </div>
    </el-footer>
  </el-container>

</template>

<script>
export default {
  name: "LoginLayout"
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../style/config";
.logo {
  text-align: center;
  padding: 20vh 0 0;
  color: $logo-color;
  font-size: $logo-font-size;
  font-family: $logo-font-family;
}

.outer-container {
  min-height: 100vh;
}
.container {
  width: 100%;
  height: 100%;
  .container__main {
    max-width: 300px;
    margin: 0 auto;
    padding-bottom: 20px;
  }
}

.author {
  color: $footer-color;
  text-align: center;
}
</style>
