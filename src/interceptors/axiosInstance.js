import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_PORT}`,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const storedAccessToken = localStorage.getItem('userToken');
    if (storedAccessToken) {
      config.headers = {
        'Authorization': `Bearer ${storedAccessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/user/refreshAccessToken', {
          refreshToken: localStorage.getItem('refreshToken')
        });

        if (response.data.success) {
          localStorage.setItem('userToken', response.data.accessToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
          return axiosInstance(originalRequest);
        } else {
          console.error('Refresh token failed:', response.data.message);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
