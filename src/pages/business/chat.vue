<template>
    <view class="content">
        <!-- 聊天界面 -->
        <view class="chat">
            <!-- 聊天列表 -->
            <view class="chat-eare">
                <scroll-view
                    scroll-y="true"
                    refresher-enabled="true"
                    :refresher-triggered="triggered"
                    @refresherrefresh="refresh"
                    @scrolltolower="loadmore"
                    class="list"
                >
                    <view v-for="(item, index) in list" :key="index"
                        ><view
                            class="chat-time"
                            v-if="
                                index == 0 ||
                                item.createtime - list[index - 1].createtime <
                                    -120
                            "
                            >{{ item.createtime_text }}
                        </view>
                        <view
                            class="chat-item"
                            v-if="item.sender.id == receiveid"
                        >
                            <view class="chat-item-left">
                                <image
                                    class="chat-item-left-img"
                                    :src="item.sender.avatar_text"
                                />
                            </view>
                            <view
                                class="chat-item-right"
                                style="margin-left: 15rpx"
                            >
                                <view class="chat-item-right-name">{{
                                    item.sender.nickname
                                }}</view>
                                <view class="chat-item-right-content">
                                    {{ item.content }}
                                </view>
                            </view>
                        </view>
                        <view
                            class="chat-item"
                            v-else
                            style="justify-content: flex-end"
                        >
                            <view
                                class="chat-item-right"
                                style="
                                    margin-right: 15rpx;
                                    align-items: flex-end;
                                "
                            >
                                <view
                                    class="chat-item-right-name"
                                    style="text-align: right"
                                    >{{ item.sender.nickname }}</view
                                >
                                <view
                                    class="chat-item-right-content"
                                    style="text-align: right"
                                >
                                    {{ item.content }}
                                </view>
                            </view>
                            <view class="chat-item-left">
                                <image
                                    class="chat-item-left-img"
                                    :src="item.sender.avatar_text"
                                />
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>

        <!-- 聊天输入框 -->
        <view class="input">
            <u-input
                class="u-input"
                focus
                type="text"
                v-model="words"
                placeholder="输入你想要发送的内容..."
                @confirm="Send"
            ></u-input>
            <u-button type="primary" :plain="plain" @click="Send"
                >发送</u-button
            >
        </view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
export default {
    onLoad(options) {
        // 获取用户信息
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        // 获取接收者id
        this.receiveid = options.receiveid;

        // 获取聊天记录
        this.List();
    },

    // 上拉加载
    onReachBottom() {
        if (this.finished) {
            this.finished = false;
        }
        this.List();
    },

    data() {
        return {
            triggered: false,
            finished: false,
            page: 1,
            business: {},
            receiveid: 0,
            list: [],
            words: "",
            plain: true,
        };
    },
    methods: {
        // 获取聊天记录
        async List() {
            // 判断用户是否登录
            if (!this.business || !this.business.id) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });

                return false;
            }
            var result = await uni.$u.http.post("/chat/list", {
                sendid: this.business.id,
                receiveid: this.receiveid,
                page: this.page,
            });

            // 改变下拉的状态
            this.triggered = false;

            // 判断结果
            if (result.code == 0) {
                this.finished = true;
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            } else {
                this.list = this.list.concat(result.data);
                this.page++;
            }
        },

        // 发送消息
        async Send() {
            this.plain = false;

            // 判断用户是否登录
            if (!this.business || !this.business.id) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });

                return false;
            }

            // 判断是否输入内容
            if (!this.words) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请输入内容",
                });

                this.plain = true;
                return false;
            }

            var result = await uni.$u.http.post("/chat/send", {
                content: this.words,
                sendid: this.business.id,
                receiveid: this.receiveid,
            });

            // 改变下拉的状态
            this.triggered = false;

            // 判断结果
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            } else {
                this.$refs.notice.show({
                    type: "success",
                    message: result.msg,
                });

                // 清空输入框
                this.words = "";

                // 刷新聊天记录
                // this.triggered = true;
                this.finished = false;
                this.page = 1;
                this.list = [];
                this.List();

                this.plain = true;
            }
        },

        // 刷新事件
        async refresh() {
            this.triggered = true;
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
        },

        // 上拉加载
        loadmore() {
            console.log("上拉加载");
        },
    },
};
</script>

<style>
.chat {
    width: 100%;
    background-color: #f5f5f5;
}

.chat-eare {
    width: 100%;
    height: 80%;
    margin-bottom: 12%;
}
.list {
    width: 100%;
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
}
.chat-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: center;
    margin-bottom: 20rpx;
}

.chat-time {
    text-align: center;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 20rpx;
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
    max-width: 81%;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 10rpx;
}

.chat-item-right-name {
    display: inline;
    max-width: 100%;
    text-align: left;
    font-size: 30rpx;
    color: #000;
}

.chat-item-right-content {
    display: inline;
    width: fit-content;
    padding: 10rpx;
    max-width: 100%;
    border-radius: 15rpx;
    margin-top: 10rpx;
    background-color: rgba(60, 156, 255, 0.8);
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
    width: 80%;
    margin-right: 20rpx;
    height: 60%;
}

.input .u-button {
    width: 20%;
    height: 100%;
}
</style>
