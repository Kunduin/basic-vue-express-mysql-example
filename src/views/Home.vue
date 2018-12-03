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
          <upload-button
            :is-loading="isUploading"
            @onchange="onFilesChange"
          />
        </section>
      </section>
    </header>
    <section class="search-section">
      <form
        class="search-form"
        @submit.prevent="onSearch"
      >
        <input
          v-model="searchByTag"
          class="tag-item input-text"
          placeholder="Search by tag"
        >
        <input
          class="tag-item action-section"
          type="submit"
          value="search"
        >
      </form>
      <div
        class="all-tags"
        @click="openTags"
      >All Tags</div>
      <section class="order-section">
        <div
          :class="{'is-selected':orderType==='POPULAR'}"
          class="select-item"
          @click="$store.dispatch('orderBy','POPULAR')"
        >Popular</div>
        <div
          :class="{'is-selected':orderType==='LATEST'}"
          class="select-item"
          @click="$store.dispatch('orderBy','LATEST')"
        >Latest</div>
      </section>
      <div
        class="all-tags"
        @click="openMap"
      >SEE MAP</div>
    </section>
    <main class="site-content">
      <section class="masonry-section">
        <gallery
          :photos="photos"
          @photoClick="onPhotoClicked"
        />
      </section>
    </main>
    <modal
      :show="showTags"
      @close="onTagsClose()"
    >
      <div class="modal-title-section">
        <div class="modal-title">Tags</div>
      </div>
      <div class="modal-tag-section">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="tag-section-item"
          @click="onClickTag(tag)"
        >
          <div class="name">
            {{ tag.name }}
          </div>
          <div class="view">
            hot:{{ tag.pageview }}
          </div>
        </div>
      </div>
    </modal>
    <modal
      :show="showMap"
      @close="onMapClose()"
    >
      <baidu-map
        :center="center"
        :zoom="zoom"
        style="width:800px;height:800px;margin:-20px 0 -8px"
        ak="8PoS5stgfRwCdnLiLsEBYRi6Tvut3qiB"
        @ready="handler"
      />
    </modal>
    <modal
      :show="showModal"
      @close="onClose()"
    >
      <div class="modal-top-section">
        <div class="modal-title-section">
          <div class="modal-title">Shared by {{ modalUser.username }}</div>
          <div class="modal-title subtitle">ON {{ modalDay }} with {{ modalImg.pageview }} views</div>
        </div>
        <div class="modal-button-section">
          <div
            class="modal-button"
            @click="onGoMix"
          >
            GO MIX
          </div>
        </div>
      </div>
      <img
        :src="modalImg.url"
        style="width: 100%"
        alt=""
      >
      <div class="tag-section">
        <div
          v-for="item in modalTags"
          :key="item.id"
          class="tag-item"
        >
          {{ item.name }}
        </div>
        <form
          class="form"
          @submit.prevent="onAddTag"
        >
          <input
            v-model="nextTag"
            class="tag-item input-text"
            required
            placeholder="add tag here"
          >
          <input
            class="tag-item action-section"
            type="submit"
            value="ADD TAG"
          >
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
      showTags: false,
      showMap: false,
      modalImg: {},
      nextTag: "",
      searchByTag: "",
      tags: [],
      center: { lng: 0, lat: 0 },
      zoom: 3
    };
  },
  computed: {
    ...mapState({
      profile: state => state.user.profile,
      photos: state => state.user.photos,
      orderType: state => state.user.orderType
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
    handler() {
      this.center.lng = 116.404;
      this.center.lat = 39.915;
      this.zoom = 15;
    },
    openMap() {
      this.showMap = true;
    },
    async openTags() {
      this.tags = await getTags({});
      this.showTags = true;
    },
    onSearch() {
      this.$store.dispatch(FETCH_PHOTOS, this.searchByTag);
    },
    onClickTag(tag) {
      this.searchByTag = tag.name;
      this.showTags = false;
      this.$store.dispatch(FETCH_PHOTOS, this.searchByTag);
    },

    async onFilesChange(files) {
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
    onTagsClose() {
      this.showTags = false;
    },
    onMapClose() {
      this.showMap = false;
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
.modal-tag-section {
  width: 400px;
  padding: 10px 20px 20px;

  .tag-section-item {
    background-color: #dddddd;
    height: 40px;
    font-family: "IBM Plex Sans", sans-serif;
    line-height: 40px;
    padding: 0 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: opacity 0.5s;

    display: flex;
    .name {
      flex-grow: 1;
    }

    .view {
      color: #4f4a8a;
    }
  }
}

.search-section {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 60px;
  display: flex;
  flex-wrap: wrap;

  .simple-button {
    height: 40px;
    font-family: "IBM Plex Sans", sans-serif;
    line-height: 40px;
    padding: 0 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.5s;
  }
  .order-section {
    color: white;
    display: flex;
    margin-right: 40px;
    .select-item {
      @extend .simple-button;
      border-radius: 4px 0 0 4px;
      background: #36335a;
      width: 100px;
      text-align: center;
    }
    .select-item:nth-child(even) {
      border-radius: 0 4px 4px 0;
    }

    .is-selected {
      background: #4f4a8a;
    }
  }

  .simple-button:hover {
    opacity: 0.8;
  }

  .all-tags {
    @extend .simple-button;
    background: #323554;
    color: white;
    margin-right: 40px;
  }

  .search-form {
    display: flex;
    padding-right: 40px;
    input {
      border: 0px;
    }
    .input-text {
      padding: 5px 10px;
      border-radius: 4px 0 0 4px;
      height: 40px;
    }

    .action-section {
      @extend .simple-button;
      border-radius: 0 4px 4px 0;
      background-color: #019fef;
      color: white;
    }
  }
}

header {
  height: 70vh;
  background: url("../assets/asteroids.jpg");
}

.site-header {
  height: 100%;
  background-image: linear-gradient(to top, #05071d 0%, rgba(0, 0, 0, 0) 100%);
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
