import { postAsync, putAsync } from "../utils/request";
import { postAsyncWithToken } from "../utils/requestWithToken";
import { SERVICE_URL } from "./base.services";

export async function login(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/login";
  return postAsync(url, body);
}

export async function logout(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/logout";
  return postAsync(url, body);
}

export async function findByPhone(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/findByPhone";
  return postAsync(url, body);
}

export async function register(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/register";
  return postAsync(url, body);
}

export async function forgotPassword(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/forgotPassword";
  return postAsync(url, body);
}

export async function changePassword(body = {}) {
  const url = SERVICE_URL + "/api/users-zalo/changePassword";
  return postAsync(url, body);
}

export async function updateUserInfo(uid, body = {}) {
  const url = SERVICE_URL + `/api/users-zalos/${uid}`;
  return putAsync(url, body);
}

export async function getFriendInfo(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + `/api/users-zalo/getFriendInfo`;
  return postAsyncWithToken(url, body, token);
}
