<template>
    <view class="content">
        <view class="header">
            <view class="search">
                <input
                    class="uni-input search-area"
                    focus
                    placeholder="搜索你想了解的私信..."
                    v-model="keywords"
                    @confirm="Search"
                />
            </view>
        </view>

        <!-- 侧滑列表 -->
        <view class="list">
            <view
                class="swipe-action u-border-top u-border-bottom"
                v-if="list.length == 0"
            >
                <view class="item">
                    <text
                        class="info"
                        style="
                            width: 100%;
                            margin-top: 20px;
                            text-align: center;
                        "
                        >{{ tip }}
                    </text>
                </view>
            </view>
            <view
                class="swipe-action u-border-top u-border-bottom"
                v-else
                v-for="(item, index) in list"
                :key="index"
            >
                <view class="item">
                    <view class="business">
                        <view class="avatar">
                            <image
                                mode="fill"
                                :src="item.avatar_text"
                                @click="CenterPage(item.id)"
                            ></image>
                        </view>
                    </view>

                    <view class="info">
                        <navigator
                            :url="`/pages/business/center?busid=${item.id}`"
                            class="nickname"
                            >{{ item.nickname }}</navigator
                        >
                        <view
                            class="desc"
                            style="
                                color: black;
                                font-size: small;
                                padding: 5rpx;
                            "
                            @click="Send(item.id)"
                        >
                            {{
                                truncatedContent(item.last_message.content, 30)
                            }}
                        </view>
                        <view class="action">
                            <view class="btn">
                                <u-button
                                    type="primary"
                                    text="发私信"
                                    size="mini"
                                    shape="circle"
                                    @click="Send(item.id)"
                                ></u-button>
                            </view>
                            <view class="btn">
                                <u-button
                                    v-if="
                                        item.last_message.status == 0 &&
                                        item.last_message.sendid != business.id
                                    "
                                    type="warning"
                                    :plain="plain"
                                    size="mini"
                                    shape="circle"
                                    @click="Read(item.last_message.id)"
                                    >未读 ({{ item.unread }})</u-button
                                >

                                <u-button
                                    v-else
                                    :disabled="disabled"
                                    type="success"
                                    :plain="plain"
                                    size="mini"
                                    shape="circle"
                                    >已读</u-button
                                >
                            </view>
                            <view class="btn">
                                <u-button
                                    type="error"
                                    text="删除"
                                    size="mini"
                                    shape="circle"
                                    @click="DeleteToggle(item.last_message.id)"
                                ></u-button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>

        <!-- 弹框组件 -->
        <u-modal
            :show="show"
            :title="'删除消息提醒'"
            :content="content"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="show = false"
            @close="show = false"
            @confirm="confirm"
        ></u-modal>
    </view>
</template>

<script>
export default {
    onLoad() {
        // 获取当前用户信息
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        // 获取私信列表
        this.List();
    },

    data() {
        return {
            plain: false,
            disabled: true,
            business: {},
            list: [],
            show: false,
            content: "确认删除与当前用户的所有私信吗？",
            keywords: "",
            delid: 0,
            tip: "您当前暂无私信",
        };
    },
    methods: {
        // 获取私信列表
        async List() {
            var result = await uni.$u.http.post("/chat/message", {
                busid: this.business.id,
                keywords: this.keywords,
            });

            // 判断结果
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            }

            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            this.list = result.data;
        },

        // 搜索
        async Search() {
            this.tip = "暂无搜索结果";
            this.list = [];
            this.List();
        },

        // 发送私信
        Send(id) {
            uni.navigateTo({
                url: `/pages/business/chat?receiveid=${id}`,
            });
        },

        // 读取私信
        async Read(id) {
            var result = await uni.$u.http.post("/chat/read", {
                messageid: id,
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

            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            this.list = [];
            this.List();
        },

        // 触发删除私信
        DeleteToggle(id) {
            this.show = true;
            this.delid = id;
        },
        // 删除私信
        async confirm() {
            this.show = false;

            // 删除私信
            var result = await uni.$u.http.post("/chat/delete", {
                messageid: this.delid,
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

            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            this.list = [];
            this.List();
        },

        // 跳转个人界面
        CenterPage(busid) {
            uni.navigateTo({
                url: `/pages/business/center?busid=${busid}`,
            });
        },

        // 截取字符串
        truncatedContent(content, maxLength) {
            if (content.length > maxLength) {
                return content.substring(0, maxLength) + "...";
            }
            return content;
        },
    },
};
</script>

<style>
.content {
    width: 100%;
    overflow-x: hidden;
}
.search {
    height: 238rpx;
    background-image: url("/static/titlebg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    align-content: center;
}

.search-area {
    width: 100%;
    height: 88rpx;
    background-color: #fff;
    background-image: url("/static/search.png");
    background-repeat: no-repeat;
    background-size: 30rpx 30rpx;
    background-position: 35rpx 30rpx;
    border-radius: 11rpx;
    line-height: 88rpx;
    text-indent: 78rpx;
    color: #2f2e2e;
    font-size: 30rpx;
}

.list .item {
    display: flex;
    width: 95%;
    margin: 10px auto;
}

.business {
    width: 20%;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 10px;
    margin-right: 10px;
}

.avatar {
    width: 100%;
    height: 5em;
}

.avatar image {
    width: 100%;
    height: 100%;
}

.info {
    font-size: 0.9em;
    color: #999;
}

.info .nickname,
.info .desc {
    margin-bottom: 2px;
}

.info .nickname {
    font-size: 1.1em;
    width: 95%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
    font-weight: bold;
}

.info .desc {
    font-size: 0.8em;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    margin-bottom: 0.5em;
    /* 改成你需要的行数 */
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.info .action {
    display: flex;
    width: 100%;
    justify-content: flex-end;
}

.info .action .btn {
    margin-right: 10px;
}
</style>
