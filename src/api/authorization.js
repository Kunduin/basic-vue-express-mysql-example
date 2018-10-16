import request from "@/util/request";
import { AUTH_MODULE } from "./_prefix";

/**
 * 登陆 login
 * @param {object} {username,password} 登陆信息
 * @returns {object} {token}
 */
export const login = ({ username, password }) => {
  return request(`${AUTH_MODULE}/login`, {
    method: "POST",
    body: {
      username: username || null,
      password: password || null
    }
  });
};

/**
 * 注册 register
 * @param {object} {username,password} 注册信息
 */
export const register = ({ username, password }) => {
  return request(`${AUTH_MODULE}/register`, {
    method: "POST",
    body: {
      username: username || null,
      password: password || null
    }
  });
};
