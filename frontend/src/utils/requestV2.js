import axios from "axios";
import { toast } from "react-toastify";

let isRefreshingV2 = false;

const instanceV2 = axios.create({
  baseURL: "http://localhost:8000/api/v2",
// baseURL:"https://danahub-backend-4ccd2faffe40.herokuapp.com/api/v2",
});

instanceV2.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (error.response?.status === 401 && !isRefreshingV2) {
      console.log("Access token expired - V2");
      isRefreshingV2 = true;
      try {
        console.log("Call api refresh token - V2");
        const auth = localStorage.getItem("refresh-token");
        const refreshToken = JSON.parse(auth).refreshToken;
        const result = await instanceV2.post(
          `api/auth/refresh-token`,
          { refreshToken: refreshToken },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const accessToken = result.data.newAccessToken;
        localStorage.setItem("access-token", accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return instanceV2(originalRequest);
      } catch (error) {
        console.log(error.message);
        if (error.response?.status === 401) {
          console.log("Refresh token expired - V2");
          toast.info("Hết phiên đăng nhập. Vui lòng đăng nhập lại");
          localStorage.removeItem("access-token");
          localStorage.removeItem("refresh-token");
          localStorage.removeItem("auth");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      } finally {
        isRefreshingV2 = false;
      }
    }
    return Promise.reject(error);
  }
);

export const get = async (endPoints, options = {}) => {
  return await instanceV2.get(endPoints, options);
};

export const put = async (endPoints, body = {}, options = {}) => {
  return await instanceV2.put(endPoints, body, options);
};

export const post = async (endPoints, body = {}, options = {}) => {
  return await instanceV2.post(endPoints, body, options);
};

export const deleteRe = async (endPoints, option = {}) => {
  return await instanceV2.delete(endPoints, option);
};
