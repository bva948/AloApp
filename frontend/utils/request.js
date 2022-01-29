import Axios from "axios";
const cancelTokenSource = Axios.CancelToken.source();

export async function postAsync(url, data) {
  try {
    const response = await Axios.post(url, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cancelToken: cancelTokenSource.token,
    });
    return response?.data;
  } catch (e) {
    const {
      data: { data, code, msg },
    } = e?.response || {};
    if (!code) {
      return {
        code: 503,
        data: null,
        msg: "Máy chủ đang bảo trì. Vui lòng thử lại sau.",
      };
    }
    return {
      data,
      code,
      msg,
    };
  }
}

export async function putAsync(url, data) {
  try {
    const response = await Axios.put(url, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cancelToken: cancelTokenSource.token,
    });
    return response?.data;
  } catch (e) {
    const {
      data: { data, code, msg },
    } = e?.response || {};
    if (!code) {
      return {
        code: 503,
        data: null,
        msg: "Máy chủ đang bảo trì. Vui lòng thử lại sau.",
      };
    }
    return {
      data,
      code,
      msg,
    };
  }
}
