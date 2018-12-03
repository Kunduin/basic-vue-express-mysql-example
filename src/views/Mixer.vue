<template>
  <div>
    <header>
      <section class="site-header">
        <section class="back-to-home">
          <router-link :to="{name:'home'}">BACK</router-link>
        </section>
        <section class="site-title">Mixer</section>
        <section id="description">
          <div 
            id="description-loading" 
            class="description-loading spinner"/>
          <div 
            id="description-content" 
            class="description-content">训练数据总大小为6M,请耐心等待</div>
        </section>
      </section>
    </header>
    <main class="site-content">
      <section v-show="isCropper">
        <section class="cropper__actions">
          <section style="display:flex">
            <div
              id="rotate"
              class="cropper__item">旋转</div>
            <div
              id="scaleX"
              class="cropper__item">翻转</div>
            <div
              id="download"
              class="cropper__item">下载</div>
          </section>
          <section>
            <div 
              ref="mixButton" 
              class="cropper__item upload-button">
              开始合成
            </div>
          </section>
        </section>
        <section class="cropper__container">
          <img
            id="image"
            ref="image"
            :src="targetImg||'https://bequank.oss-cn-beijing.aliyuncs.com/landpage/large/60682895_p0_master1200.jpg'" >
        </section>
      </section>
      <section v-show="!isCropper">
        <section class="mixer__actions">
          <div class="mixer__upload">
            <div class="image-box">
              <img 
                id="image-upload" 
                src="../assets/upload.svg"
                alt="">
            </div>
          </div>
          <div 
            id="upload-right" 
            class="mixer__upload">
            <div 
              id="upload-right-cover" 
              class="mixer__cover">日式绘卷风格</div>
            <div class="image-box">
              <img 
                src="../assets/wave.jpg"
                alt="">
            </div>
          </div>
        </section>
        <section class="cropper__container">
          <img 
            id="result-image" 
            src="../assets/upload.svg" >
        </section>
        <section class="cropper__preview">
          <div 
            class="preview" 
            style="width:40%"/>
          <div 
            class="preview" 
            style="width:30%"/>
          <div 
            class="preview" 
            style="width:20%"/>
        </section>
      </section>
    </main>
    <footer>
      made by 吴新宇 @161250157
    </footer>
  </div>
</template>

<script>
import { HOME_ROUTER } from "@/router/name";
import { LOGIN } from "@/store/type/actions.type";
import Cropper from "cropperjs";
import ml5 from "ml5";

export default {
  name: "UserLogin",
  data() {
    return {
      targetImg:
        "https://bequank.oss-cn-beijing.aliyuncs.com/landpage/large/60682895_p0_master1200.jpg",
      isCropper: true
    };
  },
  created() {
    if (this.$route.params) {
      const { photo = {} } = this.$route.params;
      this.targetImg = photo.url;
    } else {
      this.targetImg =
        "https://bequank.oss-cn-beijing.aliyuncs.com/landpage/large/60682895_p0_master1200.jpg";
    }
  },
  mounted() {
    const previews = document.querySelectorAll(".preview");
    const rotate = document.querySelector("#rotate");
    const scaleX = document.querySelector("#scaleX");
    const download = document.querySelector("#download");
    const imageUpload = document.querySelector("#image-upload");
    const resultImage = document.querySelector("#result-image");
    const descriptionLoading = document.querySelector("#description-loading");
    const descriptionContent = document.querySelector("#description-content");
    const descriptionStatus = {
      loading: false,
      loadingModelsText: "训练数据总大小为6M,请耐心等待",
      loadingImageText: "",
      loadingResultText: "正在处理",
      content: "点我开始合成"
    };
    const options = {
      aspectRatio: 1,
      crop: function(event) {
        const data = event.detail;
        const cropper = this.cropper;
        const imageData = cropper.getImageData();
        const previewAspectRatio = data.width / data.height;

        previews.forEach(function(elem) {
          const previewImage = elem.getElementsByTagName("img").item(0);
          const previewWidth = elem.offsetWidth;
          const previewHeight = previewWidth / previewAspectRatio;
          const imageScaledRatio = data.width / previewWidth;

          elem.style.height = previewHeight + "px";
          if (previewImage) {
            previewImage.style.width =
              imageData.naturalWidth / imageScaledRatio + "px";
            previewImage.style.height =
              imageData.naturalHeight / imageScaledRatio + "px";
            previewImage.style.marginLeft = -data.x / imageScaledRatio + "px";
            previewImage.style.marginTop = -data.y / imageScaledRatio + "px";
          }
        });
      }
    };
    let cropper = new Cropper(this.$refs.image, options);

    const style1 = ml5.styleTransfer(
      "http://localhost:4000/public/models/wave/",
      function() {
        descriptionStatus.loading = false;
        descriptionAction("数据集已下载成功，开始合成以查看效果");
      }
    );

    rotate.onclick = function() {
      cropper.rotate(90);
    };

    scaleX.onclick = function() {
      const data = cropper.getData();
      cropper.scaleX(-1 * data.scaleX);
    };

    download.onclick = function() {
      let canvas = cropper.getCroppedCanvas();
      let url = canvas.toDataURL("image/png");
      let a = document.createElement("a");
      let event = new MouseEvent("click");
      a.download = "cropped img";
      a.setAttribute("target", "_blank");
      a.href = url;
      a.dispatchEvent(event);
    };

    this.$refs.mixButton.onclick = () => {
      let canvas = cropper.getCroppedCanvas();
      this.isCropper = false;
      imageUpload.src = canvas.toDataURL("image/png");

      imageUpload.onload = function() {
        style1.transfer(imageUpload, (err, result) => {
          resultImage.src = result.src;
        });
        imageUpload.onload = null;
      };
    };

    const descriptionAction = function(text) {
      if (descriptionStatus) {
        if (descriptionStatus.loading) {
          descriptionLoading.style.display = "block";
        } else {
          descriptionLoading.style.display = "none";
        }
      }
      descriptionContent.innerHTML = text;
    };
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
header {
  height: 30vh;
  background: url("../assets/asteroids.jpg");
}

.site-header {
  height: 100%;
  background-image: linear-gradient(to top, #05071d 0%, rgba(0, 0, 0, 0) 100%);
}

.site-title {
  color: rgba(255, 255, 255, 0.85);
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 100px;
  padding-top: 10vh;
  text-align: center;
}

.site-author {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

footer {
  color: rgba(255, 255, 255, 0.438);
  text-align: center;
  line-height: 50px;
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 20px;
}

.cropper__preview,
.cropper__container,
.cropper__actions,
#image {
  max-width: var(--max-width);
  margin: 0 auto;
}

.cropper__preview {
  width: 100%;
  display: flex;
}

.cropper__actions {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
}

.cropper__item {
  color: white;
  padding: 10px 40px;
  background-color: #4263eb;
  margin-right: 20px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.cropper__item input {
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

.cropper__item:hover {
  background-color: #5275ff;
}

.mixer__actions {
  width: var(--max-width);
  margin: 0 auto;
  display: flex;
  padding-bottom: 30px;
}

.mixer__upload {
  flex: 1;
  width: 50%;
  overflow: hidden;
  position: relative;
  margin-left: 30px;
  background: transparent;
  height: 400px;
}

.mixer__upload:first-child {
  margin-left: 0;
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

.upload-button {
  cursor: pointer;
  margin-right: 0;
  background-color: rgb(17, 153, 85);
}

.upload-button:hover {
  background-color: rgb(17, 187, 102);
}

.preview {
  overflow: hidden;
  display: inline-block;
  margin-top: 30px;
  margin-right: 30px;
}

.image-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-box img {
  width: 500px;
  height: 500px;
}

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

#result-image {
  width: 100%;
}

#description {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.description-loading {
  position: relative;
}

.description-content {
  color: white;
  padding-left: 20px;
}

.back-to-home {
  position: absolute;
  background-color: #ffffff;
  color: gray;
  margin: 30px 30px;
  border-radius: 3px;
  font-family: "IBM Plex Sans", sans-serif;
  box-shadow: 0 10px 40px black;
  a {
    display: inline-block;
    padding: 8px 20px;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: gray;
  }
}
</style>
