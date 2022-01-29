import { postAsyncWithToken } from "../utils/requestWithToken";
import { SERVICE_URL } from "./base.services";

export async function getPostById(body = {}, userInfo) {
  const { token } = userInfo;
  const url = SERVICE_URL + "/api/getByid";
  return postAsyncWithToken(url, body, token);
}