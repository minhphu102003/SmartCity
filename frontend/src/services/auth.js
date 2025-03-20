import * as request from '../utils/request';
import { REGISTER_ENDPOINT, VERIFY_EMAIL_ENDPOINT, LOGIN_ENDPOINT, LOGOUT_ENDPOINT, REFRESHTOKE_ENDPOINT, FORGOT_PASS_ENDPOINT, RESET_PASS_ENDPOINT } from '../constants';

export const register = async (name, email, password) =>{
    try{
        const response = await request.post(REGISTER_ENDPOINT,
            {
                username: name,
                email,
                password,
            },
            {
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
        return response;
    }catch(error){
        return error;
    }
}

export const verifyEmail = async (name, email, password, otp) =>{
    try{
        const response = await request.post(VERIFY_EMAIL_ENDPOINT,
            {
                name,
                email,
                password,
                otp,
            },{
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true,
            });
        return response;
    }catch(error){
        return error;
    }
}

export const login = async (email, password) => {
    try{
        const response = await request.post(LOGIN_ENDPOINT,
            {
                email,
                password,
            },
            {
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        return response;
    }catch(error){
        return error;
    }
}

export const logout = async () => {
    try{
        return await request.post(LOGOUT_ENDPOINT);
    }catch(error){
        return error;
    }
}

export const refreshToken = async (refreshToken) => {
    try{
        const response = await request.post(REFRESHTOKE_ENDPOINT,
            {
                refreshToken: refreshToken,
            },
            {
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
        return response;
    }catch(error){
        return error;
    }
}

export const forgotPassword = async (email) => {
    try {
        return await request.post(FORGOT_PASS_ENDPOINT,
            {
                email: email
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
    } catch (error) {
        return error
    }
};

export const resetPass = async (password, otp, email) => {
    try {
        return await request.post(RESET_PASS_ENDPOINT,
            {
                password: password,
                otp: otp,
                email: email
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                withCredentials: true
            }
        );
    } catch (error) {
        return error
    }
};