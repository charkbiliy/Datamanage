const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = function(app){
    app.use(
        //请求以v1开头的后端服务器地址
        createProxyMiddleware("/v1",{
            target:"http://localhost:8888",
            changeOrigin:true,
            //路径重写把v1替换成空
            pathRewrite:{"^/v1":""}
        })
    )
}