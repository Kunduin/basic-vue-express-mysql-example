import { fetchUserAuthProfile } from "@/api/user";
import {
  FETCH_PROFILE,
  FETCH_PHOTOS,
  POST_PHOTOS
} from "@/store/type/actions.type";
import { SET_PROFILE, SET_PHOTOS } from "@/store/type/mutations.type";
import { fetchUserPhotos, postUserPhotos } from "@/api/photo";

const state = {
  profile: {
    id: undefined,
    username: undefined,
    nickname: undefined
  },
  photos: []
};

const actions = {
  async [FETCH_PROFILE](context) {
    if (context.state.profile) {
      const newProfile = await fetchUserAuthProfile(context.state.profile.id);
      context.commit(SET_PROFILE, newProfile);
    }
  },
  async [FETCH_PHOTOS](context) {
    const photos = await fetchUserPhotos({});
    context.commit(SET_PHOTOS, photos);
  },
  async [POST_PHOTOS](context, { files, onload }) {
    if (context.state.profile) {
      postUserPhotos(context.state.profile.id, files, onload);
    }
  }
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = profile;
  },
  [SET_PHOTOS](state, photos = []) {
    state.photos = photos;
  }
};

export default {
  state,
  actions,
  mutations
};
