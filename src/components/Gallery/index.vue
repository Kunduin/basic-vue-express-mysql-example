<template>
  <figure class="masonry">
    <div 
      v-for="photo in photos" 
      :key="photo.id"
      @click="$emit('photoClick', photo)"
    >
      <div class="masonry-item">
        <img
          :src="photo.url"
          class="item" >
        <div class="masonry-desc">upload by {{ photo.user.username }}</div>
      </div>
    </div>
  </figure>
</template>
<script>
import { mapState } from "vuex";

import { HOME_ROUTER } from "@/router/name";
import { LOGIN } from "@/store/type/actions.type";
import { SET_LOGIN_ERROR } from "@/store/type/mutations.type";

export default {
  name: "Gallery",
  props: {
    photos: {
      type: Array,
      required: true
    }
  },
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
<style lang="scss" scoped>
.masonry {
  max-width: 1500px;
  column-gap: 0;
  column-rule: 1px solid rgba(238, 238, 238, 0.08);
}

.masonry-item {
  position: relative;
}

.masonry-desc {
  position: absolute;
  left: 35px;
  top: 30px;
  padding: 4px 10px;
  background: #05071d;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(5, 7, 29, 0.56);
  color: rgba(255, 255, 255, 0.67);
  font-size: 12px;
  font-family: "IBM Plex Sans", sans-serif;
}

.item {
  width: 100%;
  padding: 20px;
  transition: all 0.5s ease-in-out;
  border-top: 1px solid rgba(238, 238, 238, 0.08);
}

.item:hover {
  opacity: 0.5;
}

@media only screen and (min-width: 1023px) {
  .masonry {
    column-count: 3;
  }
}

@media only screen and (max-width: 1023px) and (min-width: 720px) {
  .masonry {
    column-count: 2;
  }
}

@media only screen and (max-width: 720px) {
  .masonry {
    column-count: 1;
  }
}
</style>
