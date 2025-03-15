import * as request from '../utils/request'
import { USERS_ENDPOINT, EDIT_PROFILE_ENDPOINT, DELETE_ENDPOINT } from '../constants/endPoints'


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