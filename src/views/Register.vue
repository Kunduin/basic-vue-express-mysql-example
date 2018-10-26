<template>
  <div>
    <div
      v-if="errors"
      class="error-action">
      {{ errorMessage }}
    </div>
    <form
      class="form"
      @submit.prevent="onSubmit">
      <input
        v-model="credentials.username"
        required
        type="username"
        placeholder="username" >
      <input
        v-model="credentials.password"
        required
        type="password"
        placeholder="password" >
      <input
        v-model="credentials.passwordAgain"
        required
        type="password"
        placeholder="password again" >
      <section class="action-section">
        <input
          type="submit"
          class="submit-action"
          value="REGISTER"
        >
        <router-link
          :to="{ name: 'login'}"
          class="register-link">login</router-link>
      </section>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { REGISTER } from "@/store/type/actions.type";
import { SET_REGISTER_ERROR } from "@/store/type/mutations.type";
import { LOGIN_ROUTER } from "@/router/name";
export default {
  name: "UserRegister",
  data() {
    return {
      credentials: {
        username: "",
        password: "",
        passwordAgain: ""
      },
      errorMessage: "",
      isRegisterLoading: false
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.isRegisterError
    })
  },
  watch: {
    credentials: {
      handler() {
        this.$store.commit(SET_REGISTER_ERROR, false);
      },
      deep: true
    }
  },
  methods: {
    async onSubmit() {
      const { password, passwordAgain } = this.credentials;
      if (password !== passwordAgain) {
        this.$store.commit(SET_REGISTER_ERROR, true);
        this.errorMessage = "password must be the same";
      } else {
        await this.$store.dispatch(REGISTER, this.credentials);
        if (this.errors) {
          this.$store.commit(SET_REGISTER_ERROR, true);
          this.errorMessage = "username already exist";
        } else {
          this.$router.push({ name: LOGIN_ROUTER });
        }
      }
    }
  }
};
</script>
