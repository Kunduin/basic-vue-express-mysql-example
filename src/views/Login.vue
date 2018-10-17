<template>
  <div>
    <div
      v-if="errors"
      class="error-action">
      username or password mistake
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
      <section class="action-section">
        <input
          type="submit"
          class="submit-action"
          value="LOGIN"
        >
        <router-link
          :to="{ name: 'register'}"
          class="register-link">register</router-link>
      </section>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { HOME_ROUTER } from "@/router/name";
import { LOGIN } from "@/store/type/actions.type";
import { SET_LOGIN_ERROR } from "@/store/type/mutations.type";

export default {
  name: "UserLogin",
  data() {
    return {
      credentials: {
        username: "",
        password: ""
      },
      isLoginLoading: false
    };
  },
  computed: {
    ...mapState({
      errors: state => state.auth.isLoginError
    })
  },
  watch: {
    credentials: {
      handler() {
        this.$store.commit(SET_LOGIN_ERROR, false);
      },
      deep: true
    }
  },
  methods: {
    async onSubmit() {
      await this.$store.dispatch(LOGIN, this.credentials);
      if (!this.errors) {
        this.$router.push({ name: HOME_ROUTER });
      }
    }
  }
};
</script>
