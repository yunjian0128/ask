<template>
    <view class="content">
        <view class="header">
            <view class="search">
                <input
                    class="uni-input search-area"
                    focus
                    placeholder="搜索你想了解的帖子..."
                    v-model="keywords"
                    @confirm="Search"
                />
            </view>
            <view class="nav" v-if="keywords == ''">
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'post' }"
                    @click="Post"
                    >我的提问</view
                >
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'answer' }"
                    @click="Answer"
                    >我的解决</view
                >
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'collect' }"
                    @click="Collect"
                    >我的收藏</view
                >
            </view>
        </view>

        <!-- 侧滑列表 -->
        <scroll-view
            class="list"
            scroll-y="true"
            refresher-enabled="true"
            :refresher-triggered="triggered"
            @refresherrefresh="refresh"
            @scrolltolower="loadmore"
        >
            <view class="item" v-if="list.length == 0">
                <text
                    class="info"
                    style="width: 100%; margin-top: 20px; text-align: center"
                    >{{ tip[activeTab] }}
                </text>
            </view>
            <u-swipe-action v-else>
                <u-swipe-action-item
                    :disabled="disabled"
                    :options="action"
                    @click="DeleteToggle(item.id)"
                    v-for="(item, index) in list"
                    :key="index"
                >
                    <view class="swipe-action u-border-top u-border-bottom">
                        <view class="item">
                            <view class="business">
                                <view class="avatar">
                                    <image
                                        v-if="item.business.avatar"
                                        :src="item.business.avatar_text"
                                    ></image>
                                    <image
                                        v-else
                                        src="/static/avatar.png"
                                    ></image>
                                </view>
                                <view class="author">{{
                                    item.business.nickname
                                }}</view>
                            </view>

                            <view class="info">
                                <navigator
                                    :url="`/pages/post/info?postid=${item.id}`"
                                    class="title"
                                    >{{ item.title }}</navigator
                                >
                                <view class="createtime"
                                    >发布时间：{{ item.createtime_text }}</view
                                >
                                <view class="category"
                                    >分类：{{ item.category.name }}</view
                                >

                                <view class="join">
                                    <view
                                        v-if="
                                            item.status == '1' &&
                                            activeTab != 'answer'
                                        "
                                        style="
                                            color: green;
                                            border: green 1px solid;
                                        "
                                        class="status"
                                        >{{ item.status_text }}</view
                                    >
                                    <view
                                        v-if="
                                            item.status == '0' &&
                                            activeTab != 'answer'
                                        "
                                        color="success"
                                        class="status"
                                        >{{ item.status_text }}</view
                                    >
                                    <view class="point"
                                        >￥{{ item.point }}</view
                                    >
                                    <view class="count"
                                        >{{ item.comment_text }}人参与回复</view
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </u-swipe-action-item>
            </u-swipe-action>
        </scroll-view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>

        <!-- 回到顶部 -->
        <u-back-top :scroll-top="scrollTop"></u-back-top>

        <!-- 弹框组件 -->
        <u-modal
            :show="show"
            :title="'提醒'"
            :content="content[activeTab]"
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
    // 钩子函数
    onLoad() {
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        this.List();
    },

    // 上拉加载
    onReachBottom() {
        if (this.finished) {
            this.finished = false;
        }
        this.List();
    },

    // 监听滚动
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },

    data() {
        return {
            business: {},
            disabled: false,
            triggered: false,
            finished: false,
            scrollTop: 0,
            page: 1,
            activeTab: "post",
            list: [],
            tip: {
                post: "您还没有发布过任何提问",
                answer: "您还没有发表过任何回答",
                collect: "您还没有收藏过任何帖子",
            },
            show: false,
            keywords: "",
            content: {
                post: "是否确认删除提问",
                answer: "是否确认删除回答",
                collect: "是否确认取消收藏",
            },
            text: {
                post: "删除提问",
                collect: "取消收藏",
            },
            action: [
                {
                    text: "删除",
                    style: {
                        backgroundColor: "rgb(245, 108, 108)",
                    },
                },
            ],
            cateid: {
                post: 0,
                collect: 2,
            },

            // 当前点击的用户id
            currentId: 0,
        };
    },
    methods: {
        // 搜索
        async List() {
            // 发送请求
            var result = await uni.$u.http.post("/business/post", {
                busid: this.business.id,
                keywords: this.keywords,
                action: this.activeTab,
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

                if (result.msg == "暂未搜索到相关帖子") {
                    this.Post();
                    this.keywords = "";
                }

                return false;
            } else {
                this.$refs.notice.show({
                    type: "success",
                    message: result.msg,
                });

                this.list = this.list.concat(result.data);
                this.page++;
            }
        },

        // 搜索
        Search() {
            this.activeTab = "search";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.disabled = true;
            this.List();
        },

        // 切换tab
        Post() {
            this.activeTab = "post";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
            this.disabled = false;
        },

        // 切换tab
        Answer() {
            this.activeTab = "answer";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
            this.disabled = true;
        },

        // 切换tab
        Collect() {
            this.activeTab = "collect";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
            this.disabled = false;
        },

        // 刷新事件
        refresh() {
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

        // 记录删除的用户id
        DeleteToggle(id) {
            this.currentId = id;
            this.show = true;
        },

        async confirm() {
            this.show = false;

            // 判断是否有用户登录
            if (this.business.id == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });

                return false;
            }

            // 发起请求
            var result = await uni.$u.http.post("post/delete", {
                busid: this.business.id,
                cateid: this.cateid[this.activeTab],
                postid: this.currentId,
            });

            // 判断结果
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });
                this.finished = false;
                this.page = 1;
                this.list = [];
                this.List();
                return false;
            }

            this.$refs.notice.show({
                type: "error",
                message: result.msg,
            });

            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
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

.nav {
    display: flex;
    background-color: #f1f6f9;
    position: relative;
    justify-content: space-around;
    align-items: center;
    align-content: center;
}

.nav .nav-item {
    height: 110rpx;
    line-height: 110rpx;
    text-align: center;
    color: #666;
    font-size: 30rpx;
}

.nav .active {
    color: #000;
    font-weight: 600;
}

.nav .active-line {
    background-color: #038fff;
    width: 35rpx;
    height: 4rpx;
    position: absolute;
    top: 86rpx;
    transition: left 0.2s;
}

.list .item {
    display: flex;
    width: 100%;
    padding: 10px;
    margin: 0 auto;
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

.author {
    text-align: center;
    font-size: 0.8em;
    color: #999;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.info {
    font-size: 0.9em;
    color: #999;
}

.info .title,
.info .createtime,
.info .category,
.info .status,
.info .join {
    margin-bottom: 2px;
}

.info .title {
    font-size: 1.1em;
    width: 95%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #000;
    text-decoration: underline;
    font-weight: bold;
}

.info .status {
    background: #fff8e5;
    color: #fa3534;
    padding: 1px 2px;
    border: 1px solid #fa3534;
    border-radius: 3px;
    margin-right: 5px;
}

.info .join {
    display: flex;
    align-items: center;
    align-content: center;
    color: #fa3534;
}

.count {
    margin-right: 10px;
}

.info .point {
    width: 4em;
    text-align: center;
    background: #fff8e5;
    color: #f19049;
    padding: 2px;
    margin-right: 10px;
}

.info .title {
    /* 去掉下划线 */
    text-decoration: none !important;
}
</style>
