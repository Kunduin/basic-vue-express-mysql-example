import request from "@/util/request";
import { USER_MODULE } from "./_prefix";

/**
 * 获取用户数据
 * @returns {object} {avatar,username,nickname,bios}
 */
export const fetchUserAuthProfile = userId => {
  return request(`${USER_MODULE}/auth/${userId}`);
};
