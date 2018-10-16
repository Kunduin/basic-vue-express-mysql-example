<template>
  <div class="home">
    <div class="title">
      Tags
    </div> 
    <div class="decoration"/>
    <el-row :gutter="20">
      <!-- <el-col 
        v-for="item in tags" 
        :key="item.id" 
        :span="8">    
        <el-card shadow="hover">
          {{ item.name }}
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      email: null,
      password: null
    };
  },
  computed: {
    // ...mapState({
    //   tags: state => state.user.tags
    // })
  },
  async mounted() {
    // await this.$store.dispatch(FETCH_TAGS);
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
    font-size: $logo-font-size;
    color: $logo-color;
  }
  .decoration {
    background-color: $logo-color;
    width: 50px;
    height: 5px;
    margin: 15px 5px 30px;
  }
}
</style>
