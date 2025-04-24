import * as request from '../utils/request'
import { USERS_ENDPOINT, EDIT_PROFILE_ENDPOINT, DELETE_ENDPOINT } from '../constants'


export const getListUser = async ({ username = "", page = 1, limit = 10 } = {}) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = authData?.token;
  
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const queryParams = new URLSearchParams();
      if (username) queryParams.append("username", username);
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
  
      const response = await request.get(USERS_ENDPOINT, {
        method: "GET",
        headers: {
          "x-access-token": token
        }
      });
  
      return response?.data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  };


export const getCurrentUser = async(accessToken) =>{
    try{
        const response = await request.get(USERS_ENDPOINT, 
            {
                headers: {Authorization: `Bearer ${accessToken}`},
            }
        );
        return response;
    }catch(error){
        return error;
    }
}

export const editProfile = async(formData,accessToken) => {
    try{
        const response = await request.put(EDIT_PROFILE_ENDPOINT,
            formData,
            {
                headers:{
                    headers: {
                        "Content-Type": "application/form-data",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    withCredentials: true
                }
            }
        )
        return response;
    }catch(error){
        return error;
    }
}

export const deleteUserById = async (accessToken, id) => {
    try {
        const response = await request.deleteRe(`${DELETE_ENDPOINT}?userId=${id}`, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return response;
    } catch (error) {
        return error;
    }
};