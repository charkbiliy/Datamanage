import axios from  "axios"
import qs from 'qs';
export default function ajax(url,data={},type="GET"){
    return new Promise((resolve,reject)=>{
        let promise = ""
        if(type==="GET"){
            promise =  axios.get(url,{
                params:data
        })
        }else if(type==="POST") {
        // 用 qs 将js对象转换为url字符串 'name=edward&age=25'
        promise = axios.post(url,qs.stringify(data),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        }
        //promise = axios.post(url,data)
        promise.then(res =>{
            console.log(res)
            resolve(res)
            console.log("请求成功")
        }).catch(err=>{
            reject(err)
            console.log("请求出错"+err.message)
        })
    })}