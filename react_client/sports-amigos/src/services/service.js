import {React} from 'react';
import axios from 'axios';

const get = async (path, obj)=>{
    try{
        const {data} = await axios.get(path,obj)
        return data; 

    }
    catch(e){ return e}
   
}

const post = async (path, obj)=>{
    try{
        const {data} = await axios.post(path, obj)
        return data;

    }

    catch(e) {return e}
   
    
}

const httpService = {
    get:get,
    post:post
}

export  {httpService};


