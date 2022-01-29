import { putAsync } from "../utils/request";
import { deleteAsyncWithToken, postAsyncWithToken } from "../utils/requestWithToken";
import { SERVICE_URL } from "./base.services";

export async function postStatus(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/posts";
  return postAsyncWithToken(url, body, token);
}

export async function getPostStatus(data, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/getPosts";
  return postAsyncWithToken(url, data, token);
}

export async function likePost(data, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/like-posts";
  return postAsyncWithToken(url, data, token);
}

export async function updatePost(pid, data) {
  const url = SERVICE_URL + "/api/posts/" + pid;
  return putAsync(url, data);
}

export async function deletePost(pid, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/posts/" + pid;
  return deleteAsyncWithToken(url, token);
}

export async function getPostComment(data, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/post-comments/getByPostId";
  return postAsyncWithToken(url, data, token);
}

export async function sendPostComment(data, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/post-comments";
  return postAsyncWithToken(url, data, token);
}
