import { postAsync } from "../utils/request";
import { deleteAsyncWithToken, postAsyncWithToken } from "../utils/requestWithToken";
import { SERVICE_URL } from "./base.services";

export async function findUserByPhone(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/contacts/findByPhone";
  return postAsyncWithToken(url, body, token);
}

export async function requestAddFriend(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/request-add-friends";
  return postAsyncWithToken(url, body, token);
}

export async function getUserContacts(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/contacts/getUserContacts";
  return postAsyncWithToken(url, body, token);
}

export async function getRequestAddFriend(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/request-add-friends/findById";
  return postAsyncWithToken(url, body, token);
}

export async function getCountRequest(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/request-add-friends/count";
  return postAsyncWithToken(url, body, token);
}

export async function acceptRequest(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/contacts/addUserContacts";
  return postAsyncWithToken(url, body, token);
}

export async function deleteContact(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/contacts/deleteUserContacts";
  return postAsyncWithToken(url, body, token);
}

export async function deleteRequest(id, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/request-add-friends/" + id;
  return deleteAsyncWithToken(url, token);
}

export async function getUserRequestAddFriend(body, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/request-add-friends/getRequestAddFriend";
  return postAsyncWithToken(url, body, token);
}

export async function getIsFriend(body) {
  const url = SERVICE_URL + "/api/contacts/getIsFriend";
  return postAsync(url, body);
}
