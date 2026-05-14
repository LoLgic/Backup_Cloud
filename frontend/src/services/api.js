import axios from "axios";

const api = axios.create({
  baseURL: "https://backup-cloud.onrender.com/api"
  //baseURL: "http://localhost:4000/api"
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

});


api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    // Token expirado
    if (

      error.response?.status === 401
      &&
      !originalRequest._retry

    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem(
            "refreshToken"
          );

        const response =
          await axios.post(

            "https://backup-cloud.onrender.com/api/token/refresh",

            {
              refreshToken
            }

          );

        const newAccessToken =
          response.data.accessToken;

        localStorage.setItem(
          "token",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(
          originalRequest
        );

      } catch (refreshError) {

        localStorage.clear();

        window.location.href =
          "/login";

      }

    }

    return Promise.reject(error);

  }
);

export default api;