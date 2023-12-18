<template>
    <view>
        <!-- 聊天界面 -->
        <view class="chat">
            <!-- 标题 -->
            <view class="u-title">聊天</view>
            <!-- 聊天列表 -->
            <view class="chat-list">
                <view class="chat-item">
                    <view class="chat-item-left">
                        <image
                            class="chat-item-left-img"
                            src="https://img.yzcdn.cn/vant/cat.jpeg"
                        />
                    </view>
                    <view class="chat-item-right">
                        <view class="chat-item-right-name">小猫咪</view>
                        <view class="chat-item-right-content">
                            你好，我是小猫咪
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <!-- 聊天输入框 -->
        <view class="input">
            <u-input
                class="u-input"
                focus
                type="text"
                v-model="words"
                placeholder="键入你想要发送的内容..."
            ></u-input>
            <u-button type="primary" :plain="plain" @click="Send"
                >发送</u-button
            >
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            plain: true,
        };
    },
    methods: {
        async Send() {
            this.plain = false;

            var result = await uni.$u.http.post("/chat/send", {
                words: this.words,
            });
        },
    },
};
</script>

<style>
.chat {
    background-color: #f5f5f5;
}

.u-title {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    font-size: 40rpx;
    color: #666;
    background-color: #fff;
    border-bottom: 1rpx solid #e9e6e6;
}

.chat-list {
    padding: 10rpx;
}

.chat-item {
    display: flex;
    margin-bottom: 10rpx;
}

.chat-item-left {
    width: 120rpx;
    height: 120rpx;
    flex-shrink: 0;
    overflow: hidden;
}

.chat-item-left-img {
    width: 100%;
    height: 100%;
    border-radius: 10rpx;
}

.chat-item-right {
    width: 80%;
    margin-left: 20rpx;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 10rpx;
}

.chat-item-right-name {
    text-align: left;
    font-size: 30rpx;
    color: #000;
}

.chat-item-right-content {
    margin-top: 10rpx;
    background-color: #fff;
    text-align: left;
    font-size: 28rpx;
    color: rgba(0, 0, 0, 0.8);
}

.input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    border-top: 1rpx solid #e9e6e6;
    padding: 20rpx;
    box-sizing: border-box;
}

.input .u-input {
    margin-right: 20rpx;
    height: 60%;
}

.input .u-button {
    width: 20%;
    height: 100%;
}
</style>
