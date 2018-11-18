import request from "@/util/request";
import { TAG_MODULE } from "@/api/_prefix";

/**
 * 新增tag
 * @param photoId
 * @param name
 * @returns {Object}
 */
export const addTag = (photoId, name) => {
  return request(`${TAG_MODULE}`, {
    method: "POST",
    body: {
      name,
      photoId
    }
  });
};

/**
 * 获得tag
 * @param photoId+
 * @param name
 * @returns {Object}
 */
export const getTags = ({ photoId = -1, name = -1 }) => {
  return request(`${TAG_MODULE}?photoId=${photoId}&name=${name}`);
};
