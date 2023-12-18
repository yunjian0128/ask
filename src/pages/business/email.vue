<template>
    <view>
        <u-form labelPosition="left" labelWidth="70" :model="business">
            <!-- 用户信息 -->
            <view class="user">
                <view class="avatar">
                    <u-form-item>
                        <u-upload
                            readonly
                            :deletable="deletable"
                            :fileList="avatar"
                            :maxCount="1"
                            :previewFullImage="true"
                        ></u-upload>
                    </u-form-item>
                </view>

                <view class="nickname">{{ business.nickname }}</view>
            </view>

            <!-- 表单 -->
            <view class="profile">
                <!-- 邮箱 -->
                <u-form-item label="邮箱" borderBottom>
                    <u-input
                        readonly
                        v-model="business.email"
                        border="none"
                    ></u-input>
                </u-form-item>

                <!-- 验证码 -->
                <u-form-item label="验证码" prop="text" borderBottom>
                    <u-input
                        name="code"
                        v-model="code"
                        type="text"
                        border="none"
                        placeholder="请输入验证码"
                    ></u-input>
                </u-form-item>
                <view class="btn-list">
                    <u-button
                        type="success"
                        :text="content"
                        @click="sendemail"
                        :disabled="disabled"
                    ></u-button>
                    <u-button
                        type="primary"
                        text="确认提交"
                        formType="submit"
                        @click="submit"
                    ></u-button>
                </view>
            </view>
        </u-form>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
export default {
    onShow() {
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        console.log(this.business);

        this.avatar = [
            {
                url: this.business.avatar_text,
            },
        ];
    },
    data() {
        return {
            business: {},
            avatar: [],
            code: "",
            deletable: false,
            disabled: false,
            content: "发送验证码",
            time: 60,
            timer: null,
        };
    },
    methods: {
        // 提交表单
        async submit() {
            // 验证码不能为空
            if (!this.code) {
                this.$refs.notice.show({
                    type: "error",
                    message: "验证码不能为空",
                });

                return false;
            }

            // 提交验证码
            var result = await uni.$u.http.post("/business/email", {
                code: this.code,
                busid: this.business.id,
            });

            // 判断结果
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            }

            // 提示用户
            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            // 修改本地存储数据
            var business = uni.getStorageSync("business");
            business.auth = "1";
            uni.setStorageSync("business", business);

            // 延迟跳转个人中心
            setTimeout(() => {
                uni.switchTab({
                    url: "/pages/business/index",
                });
            }, 2000);
        },

        // 发送邮件
        async sendemail() {
            // 判断是否有用户登录
            if (!this.business || !this.business.id) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });

                return false;
            }

            // 发送邮件
            var result = await uni.$u.http.post("/business/email", {
                busid: this.business.id,
                action: "send",
            });

            // 判断结果
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            }

            // 提示用户
            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            // 开始倒计时
            this.timer = setInterval(() => {
                this.time--;

                // 按钮不可用
                this.disabled = true;
                this.content = "重新发送(" + this.time + ")";

                if (this.time <= 0) {
                    this.content = "发送验证码";
                    this.disabled = false;
                    this.time = 60;
                    clearInterval(this.timer);
                }
            }, 1000);
        },
    },
};
</script>

<style>
/* 用户信息 */
.user {
    width: 100%;
    padding: 40rpx 0rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
    color: white;
}

/* 表单 */
.profile {
    width: 90%;
    margin: 0 auto;
}

.btn-list {
    width: 100%;
    display: flex;
    margin-top: 20rpx;
}

.btn-list .u-button {
    height: 65rpx;
    width: 25%;
}
</style>
