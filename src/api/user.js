import request from "@/util/request";
import { USER_MODULE } from "./_prefix";
import { getToken } from "@/util/token";

/**
 * 获取用户数据
 * @returns {{avatar,username,nickname,bios}}
 */
export const fetchUserAuthProfile = userId => {
  return request(`${USER_MODULE}/auth/${userId}`);
};

/**
 *
 * @param userId
 * @returns {{_headers}}
 */
export const fetchUserPhotos = userId => {
  return request(`${USER_MODULE}/auth/${userId}/photo`);
};

/**
 *
 * @param userId
 * @param files
 * @param onload
 */
export const postUserPhotos = (userId, files = [], onload = () => {}) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData();
  xhr.onload = onload;
  xhr.open("POST", `${USER_MODULE}/auth/${userId}/photo`, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("Authorization", getToken());
  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }
  xhr.send(formData);
};
