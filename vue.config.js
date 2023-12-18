// vue.config.js，如没有此文件则手动创建
module.exports = {
    transpileDependencies: ["uview-ui"],

    // 以下为接口代理设置,但是仅在H5模式下面支持，如需要配置其他小程序的接口地址，请移步到 services/request.js
    devServer: {
        proxy: {
            "/ask": {
                target: "https://fastadmin.yunjian0128.cn",

                // 如果接口跨域，需要进行这个参数配置
                changeOrigin: true,
                pathRewrite: {
                    "^ask": "",
                },
            },
        },
    },
};
