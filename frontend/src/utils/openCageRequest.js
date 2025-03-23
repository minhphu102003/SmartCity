import axios from 'axios';
import { OPEN_CAGE_BASE_URL } from '../constants';

const openCageInstance = axios.create({
  baseURL: OPEN_CAGE_BASE_URL,
});


export const get = async(endPoints, options= {}) =>{
    return await openCageInstance.get(endPoints,options)
}

export const put = async(endPoints, body = {}, options= {})=>{
    return await openCageInstance.put(endPoints,body,options);
}

export const post = async(endPoints, body = {}, options= {})=>{
    return await openCageInstance.post(endPoints,body,options);
}

export const deleteRe = async (endPoints, option = {}) => {
    return await openCageInstance.delete(endPoints, option);
};