import * as request from '../utils/request'

const REGISTER_ENDPOINT = '/api/auth/register'

export const register = async (name, email, password) =>{
    try{
        const response = await request.post(REGISTER_ENDPOINT,
            {
                name,
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

const VERIFY_EMAIL_ENDPOINT = '/api/auth/verify-email';

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


const LOGIN_ENDPOINT = '/api/auth/login';

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

const LOGOUT_ENDPOINT = '/api/auth/logout';

export const logout = async () => {
    try{
        return await request.post(LOGOUT_ENDPOINT);
    }catch(error){
        return error;
    }
}

const REFRESHTOKE_ENDPOINT = '/api/auth/refresh-token';

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

const FORGOT_PASS_ENDPOINT = "/api/auth/forgot-password"

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

const RESET_PASS_ENDPOINT = "/api/auth/reset-password"

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