import { fetchUserAuthProfile } from "@/api/user";
import { FETCH_PROFILE } from "@/store/type/actions.type";
import { SET_PROFILE } from "@/store/type/mutations.type";

const state = {
  profile: {
    id: undefined,
    username: undefined,
    nickname: undefined
  }
};

const actions = {
  async [FETCH_PROFILE](context) {
    if (context.state.profile) {
      const newProfile = await fetchUserAuthProfile(context.state.profile.id);
      context.commit(SET_PROFILE, newProfile);
    }
  }
};

const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = profile;
  }
};

export default {
  state,
  actions,
  mutations
};
