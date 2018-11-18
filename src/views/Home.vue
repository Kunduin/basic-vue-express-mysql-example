<template>
  <section>
    <header>
      <section class="site-header">
        <section class="back-to-home">
          <router-link :to="{name:'login'}">OUT</router-link>
        </section>
        <section class="site-title">Gallery</section>
        <section class="site-author">Upload images, Click image, Mix image</section>
        <section class="site-actions">
          <upload-button :is-loading="isUploading" @onchange="onFilesChange" />
        </section>
      </section>
    </header>
    <main class="site-content">
      <section class="masonry-section">
        <gallery :photos="photos" @photoClick="onPhotoClicked" />
      </section>
    </main>
    <modal :show="showModal" @close="onClose()">
      <div class="modal-top-section">
        <div class="modal-title-section">
          <div class="modal-title">Shared by {{ modalUser.username }}</div>
          <div class="modal-title subtitle">ON {{ modalDay }} with {{ modalImg.pageview }} views</div>
        </div>
        <div class="modal-button-section">
          <div class="modal-button" @click="onGoMix">
            GO MIX
          </div>
        </div>
      </div>
      <img :src="modalImg.url" style="width: 100%" alt="">
      <div class="tag-section">
        <div v-for="item in modalTags" :key="item.id" class="tag-item">
          {{ item.name }}
        </div>
        <form
          class="form"
          @submit.prevent="onAddTag">
          <input
            v-model="nextTag"
            class="tag-item input-text"
            required
            placeholder="add tag here" >
          <input
            class="tag-item action-section"
            type="submit"
            value="ADD TAG" >
        </form>
      </div>
    </modal>

  </section>

</template>

<script>
import { mapState } from "vuex";
import UploadButton from "@/components/Upload/index";
import Gallery from "@/components/Gallery/index";
import Modal from "@/components/Modal/index";
import { FETCH_PHOTOS, POST_PHOTOS } from "@/store/type/actions.type";
import { MIXER_ROUTER } from "@/router/name";
import dayjs from "dayjs";
import { addTag, getTags } from "@/api/tag";
import { addPageview } from "@/api/photo";

export default {
  name: "Home",
  components: { Gallery, UploadButton, Modal },
  data() {
    return {
      isUploading: false,
      showModal: false,
      modalImg: {},
      nextTag: ""
    };
  },
  computed: {
    ...mapState({
      profile: state => state.user.profile,
      photos: state => state.user.photos
    }),
    modalUser: function() {
      return this.modalImg.user || {};
    },
    modalTags: function() {
      return this.modalImg.tags || [];
    },
    modalDay: function() {
      return this.modalImg.createdAt
        ? dayjs(this.modalImg.createdAt).toString()
        : "";
    }
  },
  async mounted() {
    await this.$store.dispatch(FETCH_PHOTOS);
  },
  methods: {
    onSubmit() {},
    async onFilesChange(files) {
      // eslint-disable-next-line no-console
      console.log(files);
      this.isUploading = true;
      await this.$store.dispatch(POST_PHOTOS, {
        files,
        onload: async () => {
          await this.$store.dispatch(FETCH_PHOTOS);
          this.isUploading = false;
        }
      });
    },
    onPhotoClicked(photo) {
      const { id } = this.$store.state.user.profile;
      addPageview(id, photo.id).then(photo => {
        this.showModal = true;
        this.modalImg = photo;
      });
    },
    onClose() {
      this.showModal = false;
    },
    onGoMix() {
      this.$router.push({
        name: MIXER_ROUTER,
        params: { photo: this.modalImg }
      });
    },
    async onAddTag() {
      await addTag(this.modalImg.id, this.nextTag);
      this.modalImg.tags = await getTags({ photoId: this.modalImg.id });
      this.nextTag = "";
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  height: 70vh;
  background: url("../assets/asteroids.jpg");
}

.site-header {
  height: 100%;
  background-image: linear-gradient(to top, #05071d 0%, #0000 100%);
}

.site-title {
  color: rgba(255, 255, 255, 0.85);
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 150px;
  padding-top: 25vh;
  padding-bottom: 20px;
  text-align: center;
}

.site-author {
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.site-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.site-actions {
  display: flex;
  max-width: 250px;
  margin: 30px auto;
  justify-content: space-between;
}

.site-action__button {
  color: white;
  padding: 12px 40px;
  border-radius: 2px;
  font-size: 16px;
  text-decoration: none;
}

.site-action__button:hover {
  opacity: 0.8;
}

.button-yellow {
  background: #f59f00;
}

.button-blue {
  background: #7048e8;
}

.masonry-section {
  margin: 0 auto;
  max-width: 1500px;
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

.modal-title {
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 20px;
  padding-left: 20px;
  padding-bottom: 10px;
}

.subtitle {
  font-size: 14px;
  color: gray;
  padding-bottom: 20px;
}

.modal-top-section {
  display: flex;
}

.modal-title-section {
  flex: 1;
}

.modal-button-section {
  padding: 0 30px 20px;

  .modal-button {
    cursor: pointer;
    padding: 10px 20px;
    background: #4c6ef5;
    color: white;
    font-family: "IBM Plex Sans", sans-serif;
    border-radius: 3px;
  }
}

.tag-section {
  padding: 10px 20px 0;

  .tag-item {
    display: inline-block;
    padding: 5px 12px;
    margin-right: 10px;
    margin-bottom: 10px;
    background: #dddddd;
    font-family: "IBM Plex Sans", sans-serif;
    border-radius: 3px;
  }

  .form {
    padding: 0;
    display: inline-block;

    input {
      border: none;
      outline: none;
    }

    .input-text {
      background: #dddddd;
    }
    .action-section {
      background: #4c6ef5;
      color: white;
      cursor: pointer;
    }
  }
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

  .site-title {
    font-size: 70px;
  }

  .site-author {
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
