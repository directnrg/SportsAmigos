import {React} from 'react';
import axios from 'axios';

const get = async (path, config)=>{
    try{
        const {data} = await axios.get(path,config)
        return data; 

    }
    catch(e){ return e}
   
}

const post = async (path, obj, config)=>{
    try{
        const {data} = await axios.post(path, obj,config)
        return data;

    }

    catch(e) {return e}
   
    
}

const httpService = {
    get:get,
    post:post
}

export  {httpService};


