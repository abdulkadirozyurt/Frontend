import axiosInstance from "./axiosInstance";

export const refreshToken = async () => {
    try {
      
      const response = await axiosInstance.post('/user/refreshAccessToken', {
        refreshToken: localStorage.getItem('refreshToken')
      });
  
      if (response.data.success) {
        
        localStorage.setItem('userToken', response.data.accessToken);
      } else {
        console.error('Refresh token failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
};