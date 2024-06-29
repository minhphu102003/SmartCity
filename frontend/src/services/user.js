import * as request from '../utils/request'


const USERS_ENDPOINT = '/api/users/current-user';

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

const EDIT_PROFILE_ENDPOINT = '/api/users/edit-profile';

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


const DELETE_ENDPOINT = "/api/users/delete-user";

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