import { fetchUserAuthProfile } from "@/api/user";
import {
  FETCH_PROFILE,
  FETCH_PHOTOS,
  POST_PHOTOS,
  ORDER_BY
} from "@/store/type/actions.type";
import {
  SET_PROFILE,
  SET_PHOTOS,
  SET_ORDER,
  SET_LAST_SEARCH
} from "@/store/type/mutations.type";
import { fetchUserPhotos, postUserPhotos } from "@/api/photo";

const LATEST = "LATEST";

const state = {
  profile: {
    id: undefined,
    username: undefined,
    nickname: undefined
  },
  photos: [],
  orderType: LATEST,
  searchBy: -1,
  lastSearch: -1
};

const actions = {
  async [FETCH_PROFILE](context) {
    if (context.state.profile) {
      const newProfile = await fetchUserAuthProfile(context.state.profile.id);
      context.commit(SET_PROFILE, newProfile);
    }
  },
  async [FETCH_PHOTOS](context, tag = -1) {
    let searchTag = tag;
    if (tag === "") {
      searchTag = -1;
    }
    const photos = await fetchUserPhotos({
      tag: searchTag,
      sort: context.state.orderType
    });
    context.commit(SET_PHOTOS, photos);
    context.commit(SET_LAST_SEARCH, tag);
  },
  async [POST_PHOTOS](context, { files, onload }) {
    if (context.state.profile) {
      postUserPhotos(context.state.profile.id, files, onload);
    }
  },
  async [ORDER_BY](context, type) {
    context.commit(SET_ORDER, type);
    const photos = await fetchUserPhotos({
      tag: context.state.lastSearch,
      sort: type
    });
    context.commit(SET_PHOTOS, photos);
  }
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = profile;
  },
  [SET_PHOTOS](state, photos = []) {
    state.photos = photos;
  },
  [SET_ORDER](state, type) {
    state.orderType = type;
  },
  [SET_LAST_SEARCH](state, search) {
    state.lastSearch = search;
  }
};

export default {
  state,
  actions,
  mutations
};
