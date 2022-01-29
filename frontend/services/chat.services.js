import { postAsync } from "../utils/request";
import { postAsyncWithToken } from "../utils/requestWithToken";
import { SERVICE_URL } from "./base.services";

export async function createRoomChat(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/room-chats";
  return postAsyncWithToken(url, body, token);
}

export async function getRoomChats(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/room-chats/findById";
  return postAsyncWithToken(url, body, token);
}

export async function getMessages(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/messages/findByRoomChatId";
  return postAsyncWithToken(url, body, token);
}

export async function setUnRead(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/messages/setUnRead";
  return postAsyncWithToken(url, body, token);
}

export async function sendMessage(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/messages";
  return postAsyncWithToken(url, body, token);
}

export async function setMessageUnRead(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/messages/setMessageUnRead";
  return postAsyncWithToken(url, body, token);
}

export async function upLoadImage(body = {}) {
  const url = SERVICE_URL + "/upload";
  return postAsync(url, body);
}

export async function deleteRoomChat(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/room-chats/delete";
  return postAsyncWithToken(url, body, token);
}
