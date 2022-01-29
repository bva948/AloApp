import Axios from "axios";
const cancelTokenSource = Axios.CancelToken.source();

export async function getAsyncWithToken(url, token) {
  try {
    const response = await Axios.get(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
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

export async function postAsyncWithToken(url, data, token) {
  try {
    const response = await Axios.post(url, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
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

export async function deleteAsyncWithToken(url, token) {
  try {
    const response = await Axios.delete(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
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
