<template>
  <div>
    <div class="intro">
      Sign In
    </div>
    <el-form 
      ref="loginForm" 
      :rules="rules"
      :model="credentials" 
    >
      <el-form-item prop="username">
        <el-input 
          v-model="credentials.username"
          type="username" 
          placeholder="username" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          v-model="credentials.password" 
          type="password"
          placeholder="password"/>
      </el-form-item>
      <el-form-item>
        <div class="action-section">
          <el-button 
            :loading="isLoginLoading"
            style="width:150px;"
            type="primary" 
            @click="onSubmit('loginForm')">登 陆</el-button>
          <router-link 
            :to="{ name: 'register'}" 
            class="link" >没有账户，注册 <i class="el-icon-arrow-right"/></router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { HOME_ROUTER } from "@/router/name";
import { LOGIN } from "@/store/type/actions.type";
export default {
  name: "UserLogin",
  data() {
    return {
      credentials: {
        username: "",
        password: ""
      },
      isLoginLoading: false,
      rules: {
        username: [
          {
            required: true,
            message: "请输入账户名",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.isLoginLoading = true;
          await this.$store.dispatch(LOGIN, this.credentials);
          this.isLoginLoading = false;
          this.$router.push({ name: HOME_ROUTER });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../style/config";
.intro {
  color: $oc-gray-7;
  text-align: center;
  font-size: 25px;
  padding: 10px 0 30px;
}

.link {
  color: $oc-blue-5;
  text-decoration: none;
}

.action-section {
  display: flex;
  justify-content: space-between;
}
</style>
