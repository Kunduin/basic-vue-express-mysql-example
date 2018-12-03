<template>
  <div class="mixer__upload">
    <!--<div class="mixer__cover">重新上传</div>-->
    <input
      v-if="!isLoading"
      type="file"
      name="photos"
      multiple
      accept="image/*"
      @change="onchange">
    <div class="image-box">
      <div class="mixer__logo">
        <div v-if="isLoading" class="spinner"/>
        <img v-else src="../../assets/cloud-upload.svg">
      </div>
      <div class="mixer__description">
        UPLOAD
      </div>
    </div>
  </div>
</template>

<script>
import { SET_LOGIN_ERROR } from "@/store/type/mutations.type";

export default {
  name: "UploadButton",
  props: {
    isLoading: {
      type: Boolean,
      required: false,
      default: false
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
  watch: {
    credentials: {
      handler() {
        this.$store.commit(SET_LOGIN_ERROR, false);
      },
      deep: true
    }
  },
  methods: {
    onchange(event) {
      const { files = [] } = event.target;
      this.$emit("onchange", files);
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.spinner:before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #333;
  animation: spinner 0.6s linear infinite;
}
.mixer__upload {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: transparent;
  border-radius: 3px;
}

.mixer__upload input {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  width: 100%;
  cursor: pointer;
  font-size: 0;
}

.mixer__cover {
  position: absolute;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  align-content: center;
  opacity: 0;
  transition: all 0.5s;
  background-color: rgba(0, 0, 0, 0.623);
  cursor: pointer;
}

.mixer__cover:hover {
  opacity: 1;
}

.image-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;

  .mixer__logo {
    position: relative;
    background: #00c7ff;
    width: 45px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
    }
  }

  .mixer__description {
    background: #009fef;
    color: white;
    flex: 1;
    line-height: 40px;
    height: 40px;
    text-align: center;
    font-family: "IBM Plex Sans", sans-serif;
  }
}
</style>
