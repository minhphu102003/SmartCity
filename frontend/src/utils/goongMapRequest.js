import axios from "axios";
import { GOONG_MAP_BASE_URL } from "../constants";

const goongInstance = axios.create({
    baseURL: GOONG_MAP_BASE_URL,
});

export const get = async(endPoints, options= {}) =>{
    return await goongInstance.get(endPoints,options)
}

export const put = async(endPoints, body = {}, options= {})=>{
    return await goongInstance.put(endPoints,body,options);
}

export const post = async(endPoints, body = {}, options= {})=>{
    return await goongInstance.post(endPoints,body,options);
}

export const deleteRe = async (endPoints, option = {}) => {
    return await goongInstance.delete(endPoints, option);
};