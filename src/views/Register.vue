<template>
  <div>
    <div class="intro">
      Sign Up
    </div>
    <div v-if="errors">
      <el-alert
        :closable="isAlertClosable"
        title="用户名已被注册"
        type="error"
        show-icon/>
    </div>
    <el-form 
      ref="registerForm"
      :model="credentials"
      :rules="rules"
      status-icon 
    >
      <el-form-item 
        label="用户名" 
        prop="username">
        <el-input 
          v-model="credentials.username"
          type="username" 
          placeholder="username" />
      </el-form-item>
      <el-form-item 
        label="密码" 
        prop="password">
        <el-input 
          v-model="credentials.password" 
          type="password"
          placeholder="password"/>
      </el-form-item>
      <el-form-item 
        label="请再次输入密码" 
        prop="passwordAgain">
        <el-input 
          v-model="credentials.passwordAgain" 
          type="password"
          placeholder="repeat password"/>
      </el-form-item>
      <el-form-item>
        <div class="action-section">
          <el-button 
            :loading="isRegisterLoading"
            style="width:150px;" 
            type="primary"
            @click="onSubmit('registerForm')">注 册</el-button>
          <router-link 
            :to="{ name: 'login'}" 
            class="link" >已有账号 <i class="el-icon-arrow-right"/></router-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { REGISTER } from "@/store/type/actions.type";
import { SET_REGSITER_ERROR } from "@/store/type/mutations.type";
import { LOGIN_ROUTER } from "@/router/name";
export default {
  name: "UserRegister",
  data() {
    const validateUsername = (rule, value, callback) => {
      const regex = /([a-zA-Z]+[0-9a-zA-Z_]*)/;
      if (value === "") {
        callback(new Error("请输入用户名"));
        return;
      } else if (value.length < 5) {
        callback(new Error("用户名长度必须大于5"));
        return;
      } else if (!regex.test(value)) {
        callback(
          new Error("用户名必须以英文字符开头，且只能包含英文或数字或下划线")
        );
        return;
      } else {
        this.$store.commit(SET_REGSITER_ERROR, false);
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      const regex = /(^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,30})$)/;
      if (value === "") {
        callback(new Error("请输入密码"));
        return;
      } else if (!regex.test(value)) {
        callback(
          new Error("密码同时包含至少一位数字和一位字母，长度在6-30之间")
        );
        return;
      } else {
        callback();
      }
    };
    const validatePasswordAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
        return;
      } else if (value !== this.credentials.password) {
        callback(new Error("两个密码不同！"));
        return;
      } else {
        callback();
      }
    };
    return {
      credentials: {
        username: "",
        password: "",
        passwordAgain: ""
      },
      isAlertClosable: false,
      isRegisterLoading: false,
      rules: {
        username: [
          {
            validator: validateUsername,
            trigger: "change"
          }
        ],
        password: [
          {
            validator: validatePassword,
            trigger: "change"
          }
        ],
        passwordAgain: [
          {
            validator: validatePasswordAgain,
            trigger: "change"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.isRegisterError
    })
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.isRegisterLoading = true;
          await this.$store.dispatch(REGISTER, this.credentials);
          this.isRegisterLoading = false;
          if (!this.errors) {
            this.$notify({
              title: "成功",
              message: `用户名「${this.credentials.username}」注册成功`,
              type: "success"
            });
            this.$router.push({ name: LOGIN_ROUTER });
          }
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
