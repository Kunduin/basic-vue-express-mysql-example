import { PHOTO_MODULE } from "@/api/_prefix";
import request from "@/util/request";

/**
 * 获取全部图片
 * @returns {{_headers}}
 */
export const fetchUserPhotos = ({ tag = -1, sort = -1 }) => {
  return request(`${PHOTO_MODULE}?tag=${tag}&sort=${sort}`);
};

/**
 * 新增pageview
 * @param userId
 * @param photoId+
 * @returns {Object}
 */
export const addPageview = (userId, photoId) => {
  return request(`${PHOTO_MODULE}/${photoId}/pageview`, {
    method: "POST"
  });
};

/**
 * 获得pageview
 * @param userId
 * @param photoId+
 * @returns {Object}
 */
export const getPageview = (userId, photoId) => {
  return request(`${PHOTO_MODULE}/${photoId}/pageview`);
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
  xhr.open("POST", `${PHOTO_MODULE}?userId=${userId}`, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  for (let i = 0; i < files.length; i++) {
    formData.append("photos", files[i]);
  }
  xhr.send(formData);
};
