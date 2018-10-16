import { fetchUserTags } from "@/api/user";
import { FETCH_PROFILE } from "@/store/type/actions.type";
import { SET_TAGS } from "@/store/type/mutations.type";

const state = {
  profile: {
    id: undefined,
    username: undefined,
    nickname: undefined
  }
};

const actions = {
  async [FETCH_PROFILE](context) {
    const { tags } = await fetchUserTags();
    context.commit(SET_TAGS, tags);
  }
};

const mutations = {
  [SET_TAGS](state, tags) {
    state.tags = tags;
  }
};

export default {
  state,
  actions,
  mutations
};
