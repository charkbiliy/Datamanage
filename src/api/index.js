//包含应用中所有接口请求函数的模块
import jsonp from 'jsonp'
import ajax from "./ajax"
//const BASE = "http://localhost:8888"
//登录
export const reqLogin = (username,password)=>ajax("/v1/login",{username,password},"POST")

//添加用户
export const reqAdduser = user => ajax("/manage/user/add",user,"POST")

//获取天气API
/*通过 jsonp 请求获取天气信息*,高德天气*/
//  jsonp是解决一般解决get的请求，
export function reqWeather(){
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=73da34cee519906f1d5b672cacf4deda&city=610100&extensions=base`
    return new Promise((resolve, reject) => {
        jsonp(url, {
            // param: 'callback'
        }, (error, response) => {
            if (response.info && response.info == 'OK') {
                const { city, weather } = response.lives[0]
                //resolve({ dayPictureUrl, weather })
                resolve({city, weather})
            } else {
                alert('获取天气信息失败')
            }
        })
    })
}


//获取商品一级/二级分类列表api
export const reqCategoryList = (parentId)=>{
    return ajax("/v1/getcategorylist",{parentId},"GET")
}
//添加分类和更新分类
export const reqAddCategory = (categoryName,parentId)=>{
    return ajax("/v1/manage/category/add",{categoryName,parentId},"POST")
}
export const reqUpdateCategory = (categoryId,categoryName)=>{
    return ajax("/v1/manage/category/update",{categoryId,categoryName},"POST")
}

//获取商品列表
export const reqProductList = (pageNum,pageSize) =>{
    return ajax("/v1/manage/product/list",{pageNum,pageSize},"GET")
}
//搜索商品分页列表
export const reqSearchProduct = (pageNum, pageSize, searchName, searchType)=>{
    return ajax("/v1/manage/product/search",{pageNum, pageSize,[searchType]:searchName},"GET")
}
// 在详情页根据分类ID获取分类
export const reqCategoryName = (categoryId)=>{
    return ajax("/v1/manage/category/info",{categoryId},"GET")
}

// 更新产品状态(上架/下架)
export const reqUpdateProductStatus = (productId, status)=>{
    return ajax("/v1/manage/product/updateStatus",{productId, status},"POST")
}

//删除图片
export const reqDeletePic = (name)=>{
    return ajax("/v1/manage/img/delete",{name},"POST")
}

//更新/添加商品(更新商品是必须有商品_id)
export const reqUpdateOrAddProduct = (product)=>{
    return ajax('/v1/manage/product/'+ (product._id?'update':'add'),{product},"POST")
}
//添加商品
// export const reqAddProduct = ()=>{
//     return ajax("/v1/manage/product/add",{product},"POST")
// }