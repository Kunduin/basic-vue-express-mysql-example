const ID_TOKEN_KEY = "id_token";
const USER_PROFILE = "user_profile";

export const getToken = () => {
  const token = window.localStorage.getItem(ID_TOKEN_KEY);
  if (token === "undefined") {
    return false;
  } else {
    return window.localStorage.getItem(ID_TOKEN_KEY);
  }
};

export const saveToken = (token, profile) => {
  token && window.localStorage.setItem(ID_TOKEN_KEY, token);
  profile && window.localStorage.setItem(USER_PROFILE, JSON.stringify(profile));
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const getUserProfile = () => {
  const profileText = window.localStorage.getItem(USER_PROFILE);
  let profile = {};
  try {
    profile = JSON.parse(profileText);
  } catch (e) {
    profile = {};
  }
  return profile;
};
