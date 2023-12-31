import api from "./api";
import { postRequest, getRequest } from "./apiRequest";

export function interceptor() {
  api.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${sessionStorage.getItem(
        "access_token"
      )}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  api.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      let requestUrl = error.response.request.responseURL;

      if (error.response.status === 401) {
        const response = await postRequest("/api/token");
        if (response && response.status >= 200 && response.status <= 299) {
          const access_token = response?.data?.access_token;
          sessionStorage.setItem("access_token", access_token);
          return await getRequest(requestUrl, null, {});
        }
      }
      return Promise.reject(error);
    }
  );
}
