<template>
    <view>
        <h3 class="PayTitle">提示：付款金额要与显示的金额一致，否则后果自负</h3>

        <view class="PayAmount">
            <span>￥</span>
            <span>{{ pay.price }}元</span>
        </view>

        <view class="PayCode">
            <img v-if="type == 'wx'" :src="pay.wxcode" />
            <img v-else :src="pay.zfbcode" />
        </view>

        <view class="PayInfo">
            <view class="name">订单名称：{{ pay.name }}</view>
            <view class="code">订单号：{{ pay.code }}</view>
            <view class="box">
                <span class="tip">订单支付有效期</span>
                <span class="sec">{{ sec }} 秒</span>
            </view>
        </view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
export default {
    onLoad(options) {
        // onLoad 为uni-app支持的生命周期之一
        // 获取用户信息
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        this.money = options.money ? options.money : 1;
        this.type = options.type ? options.type : "wx";
        // this.$refs.notice.show({
        //     type: "error",
        //     message: "请先登录",
        // });

        // 登录
        if (!this.business || !this.business.id) {
            this.$refs.notice.show({
                type: "error",
                message: "请先登录",
            });

            return false;
        }

        this.request();
    },

    data() {
        return {
            business: {},
            money: 1,
            type: "wx",
            pay: {},
            sec: 180,
            T: null,
        };
    },

    methods: {
        // 定时器
        autoplay() {
            if (this.sec <= 0) {
                this.pay.wxcode =
                    "https://fastadmin.yunjian0128.cn/uploads/pay/images/qrcode_timeout.png";
                this.pay.zfbcode =
                    "https://fastadmin.yunjian0128.cn/uploads/pay/images/qrcode_timeout.png";
                clearInterval(this.T);
            } else {
                this.sec--;
            }

            if (this.sec % 5 == 0) {
                this.PayQuery();
            }
        },

        // 查询订单状态
        async PayQuery() {
            if (this.sec <= 0) {
                return false;
            }

            // 组装数据
            var data = {
                busid: this.business.id,
                payid: this.pay.id,
            };

            var result = await uni.$u.http.post("/business/query", data);
            var status = result.data.status ? result.data.status : 0;

            if (status == "1") {
                clearInterval(this.T);

                this.$refs.notice.show({
                    type: "success",
                    message: "支付成功",
                    duration: 3000,
                    onClose: () => {
                        uni.$u.route({
                            url: "/pages/business/pay",
                        });
                    },
                });
            }
        },

        async request() {
            // 组装数据
            const data = {
                busid: this.business.id,
                money: this.money,
                type: this.type,
            };

            // 发送请求
            var result = await uni.$u.http.post("/business/pay", data);

            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            }

            this.pay = result.data;
            this.T = setInterval(this.autoplay, 1000);
        },
    },
};
</script>

<style>
.PayTitle {
    text-align: center;
    color: red;
    font-size: 1.3rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.PayAmount {
    text-align: center;
    margin-bottom: 1rem;
}

.PayAmount span:first-child {
    font-size: 1.6rem;
}

.PayAmount span:last-child {
    font-size: 2.4rem;
}

.PayCode {
    width: 70%;
    margin: 0 auto;
}

.PayCode img {
    width: 100%;
}

.PayInfo {
    text-align: center;
    color: #000;
    font-size: 1.2rem;
    font-weight: bold;
}

.PayInfo .box {
    margin-top: 1.5rem;
}

.PayInfo .box span {
    background: #3ec742;
    color: #fff;
    line-height: 1.5rem;
    font-size: 1.2rem;
    font-family: Arial;
    padding: 0 0.5rem;
    margin-right: 0.8rem;
    border-radius: 0.8rem;
    box-shadow: 1rpx 1rpx 3rpx rgba(0, 0, 0, 0.2);
}
</style>
