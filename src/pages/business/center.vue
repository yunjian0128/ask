<template>
    <view class="content">
        <view class="header">
            <view class="person">
                <!-- 基本资料 -->
                <view class="info">
                    <view class="avatar">
                        <!-- #ifdef H5 || APP-PLUS -->
                        <image
                            v-if="busdata.avatar"
                            :src="busdata.avatar_text"
                        ></image>
                        <image v-else src="/static/avatar.png"></image>
                        <!-- #endif -->

                        <!-- #ifdef MP-WEIXIN -->
                        <open-data type="userAvatarUrl"></open-data>
                        <!-- #endif -->
                    </view>

                    <view class="base">
                        <view class="nickname">{{ busdata.nickname }}</view>
                        <view v-if="busdata.motto" class="desc">
                            {{ truncatedContent(busdata.motto) }}
                        </view>
                        <view v-else class="desc"
                            >这家伙很懒，什么也没写！</view
                        >
                    </view>
                </view>

                <!-- 宫格布局 -->
                <view class="grid">
                    <u-grid :border="true">
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="提问"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.posts"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="解决"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.accepts"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="收藏"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.collects"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="粉丝"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.fans"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="关注"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.follows"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item>
                            <u--text
                                color="#fff"
                                text="评论"
                                align="center"
                            ></u--text>
                            <u--text
                                color="#fff"
                                :text="busdata.comments"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                    </u-grid>
                </view>

                <!-- 按钮 -->
                <view class="btnlist" v-if="busid != business.id">
                    <view class="btn">
                        <u-button
                            v-if="isfollow"
                            type="success"
                            icon="man-add"
                            text="取消关注"
                            @click="FollowToggle"
                        ></u-button>
                        <u-button
                            v-else
                            type="success"
                            icon="man-add"
                            text="关注"
                            @click="Follow"
                        ></u-button>
                    </view>
                    <view class="btn">
                        <u-button
                            type="warning"
                            icon="more-circle"
                            text="发私信"
                            @click="Send"
                        ></u-button>
                    </view>
                </view>
            </view>
            <view
                style="
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                "
                ><u-tabs :list="CateList" @click="CateCheck"></u-tabs
            ></view>

            <!-- <view class="nav">
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'posts' }"
                    >我的提问</view
                >
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'posts' }"
                    >我的解决</view
                >
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'posts' }"
                    >我的收藏</view
                >
            </view> -->
        </view>

        <!-- 帖子列表 -->
        <scroll-view
            class="list"
            scroll-y="true"
            refresher-enabled="true"
            :refresher-triggered="triggered"
            @refresherrefresh="refresh"
            @scrolltolower="loadmore"
            v-if="cateid != 3"
        >
            <view class="item" v-if="list.length == 0">
                <text
                    class="info"
                    style="width: 100%; margin-top: 20px; text-align: center"
                    >{{ tip[cateid] }}
                </text>
            </view>
            <u-swipe-action v-else>
                <u-swipe-action-item
                    v-for="(item, index) in list"
                    :key="index"
                    :disabled="disabled"
                    :options="action"
                    @click="Delete(item.id)"
                >
                    <view class="swipe-action u-border-top u-border-bottom">
                        <view class="item">
                            <navigator
                                :url="`/pages/business/center?busid=${item.business.id}`"
                                class="business"
                            >
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
                                <view
                                    v-if="item.business.nickname"
                                    class="author"
                                    >{{ item.business.nickname }}</view
                                >
                                <view v-else class="author">匿名用户</view>
                            </navigator>

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
                                        v-if="item.status == '1' && cateid != 1"
                                        style="
                                            color: green;
                                            border: green 1px solid;
                                        "
                                        class="status"
                                        >{{ item.status_text }}</view
                                    >
                                    <view
                                        v-if="item.status == '0' && cateid != 1"
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

        <!-- 评论列表 -->
        <scroll-view
            class="list"
            scroll-y="true"
            refresher-enabled="true"
            :refresher-triggered="triggered"
            @refresherrefresh="refresh"
            @scrolltolower="loadmore"
            v-else
        >
            <view class="item" v-if="list.length == 0">
                <text
                    class="info"
                    style="width: 100%; margin-top: 20px; text-align: center"
                    >{{ tip[cateid] }}
                </text>
            </view>
            <u-swipe-action v-else>
                <u-swipe-action-item
                    v-for="(item, index) in list"
                    :key="index"
                    :disabled="disabled"
                    :options="action"
                    @click="Delete(item.id)"
                >
                    <view class="swipe-action u-border-top u-border-bottom">
                        <view
                            class="item"
                            :url="`/pages/post/info?postid=${item.postid}`"
                        >
                            <!-- <view class="business">
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
                                <view
                                    v-if="item.business.nickname"
                                    class="author"
                                    >{{ item.business.nickname }}</view
                                >
                                <view v-else class="author">匿名用户</view>
                            </view> -->

                            <view class="info" style="width: 100%">
                                <navigator
                                    :url="`/pages/post/info?postid=${item.postid}`"
                                    class="title"
                                    >{{
                                        item.content.length > 20
                                            ? item.content.substring(0, 20) +
                                              "..."
                                            : item.content
                                    }}
                                </navigator>
                                <view class="createtime"
                                    >评论时间：{{ item.createtime_text }}</view
                                >
                                <view class="category"
                                    >获赞：{{ item.like_count }}</view
                                >

                                <view class="join" style="width: 100%">
                                    <view
                                        v-if="item.status == '1' && cateid != 1"
                                        style="
                                            color: green;
                                            border: green 1px solid;
                                        "
                                        class="status"
                                        >{{ item.status_text }}</view
                                    >
                                    <view
                                        v-if="item.status == '0' && cateid != 1"
                                        color="success"
                                        class="status"
                                        >{{ item.status_text }}</view
                                    >
                                    <view class="point" style="width: auto"
                                        >回复给{{ item.post.title }}</view
                                    >
                                    <view class="count"
                                        >{{
                                            item.comment_count
                                        }}人参与回复</view
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
            :title="'删除提醒'"
            :content="content[cateid]"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="show = false"
            @close="show = false"
            @confirm="confirm"
        ></u-modal>

        <!-- 弹框组件 -->
        <u-modal
            :show="followshow"
            :title="'取消关注提醒'"
            :content="'是否确定取消关注'"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="followshow = false"
            @close="followshow = false"
            @confirm="Follow"
        ></u-modal>
    </view>
</template>

<script>
export default {
    async onLoad(options) {
        // 获取用户id
        var busid = options.busid ? options.busid : 0;
        this.busid = busid;

        // 获取当前用户信息
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        if (this.business.id == 0) {
            this.$refs.notice.show({
                content: "请先登录",
                type: "error",
            });

            return false;
        }

        if (this.busid == 0) {
            this.busid = this.business.id;
        }

        if (this.busid != this.business.id) {
            this.CateList = [
                {
                    id: 0,
                    name: "Ta的提问",
                },
                {
                    id: 1,
                    name: "Ta的解决",
                },
                {
                    id: 2,
                    name: "Ta的收藏",
                },
                {
                    id: 3,
                    name: "Ta的评论",
                },
            ];

            this.disabled = true;
            this.tip = [
                "Ta还没有发布过任何提问",
                "Ta还没有解决过任何问题",
                "Ta还没有收藏过任何帖子",
                "Ta还没有发布过任何评论",
            ];

            // 获取当前用户有没有关注
            var result = await uni.$u.http.post("business/isfollow", {
                busid: this.busid,
                fansid: this.business.id,
            });

            this.isfollow = result.data.isfollow;
        }

        this.Information();
        this.List();
    },

    // 上拉加载
    onReachBottom() {
        if (this.finished) return;
        this.page++;
        this.List();
    },

    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },

    data() {
        return {
            triggered: false,
            finished: false,
            scrollTop: 0,
            page: 1,

            // 分类列表
            CateList: [
                {
                    id: 0,
                    name: "我的提问",
                },
                {
                    id: 1,
                    name: "我的解决",
                },
                {
                    id: 2,
                    name: "我的收藏",
                },
                {
                    id: 3,
                    name: "我的评论",
                },
            ],
            postid: 0,
            cateid: 0,
            busid: 0,
            business: {},
            busdata: {},
            list: [],
            isfollow: false,
            show: false,
            followshow: false,
            content: [
                "确定删除该提问吗？",
                "确定删除该回答吗？",
                "确定删除该收藏吗？",
                "确定删除该评论吗？",
            ],
            disabled: false,
            action: [
                {
                    text: "删除",
                    style: {
                        backgroundColor: "rgb(245, 108, 108)",
                    },
                },
            ],
            tip: [
                "您还没有发布过任何提问",
                "您还没有解决过任何问题",
                "您还没有收藏过任何帖子",
                "您还没有发布过任何评论",
            ],
        };
    },
    methods: {
        // 分类切换
        async CateCheck(item) {
            this.cateid = item.id;

            if (this.cateid == 1 || this.busid != this.business.id) {
                this.disabled = true;
            } else {
                this.disabled = false;
            }

            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
        },

        // 请求用户信息
        async Information() {
            // 发起请求
            var result = await uni.$u.http.post("business/info", {
                busid: this.busid,
            });

            // 判断是否请求成功
            if (result.code == 0) {
                this.$refs.notice.show({
                    content: result.msg,
                    type: "error",
                });

                return false;
            }

            // 保存用户信息
            this.busdata = result.data;
        },

        // 关注切换
        async FollowToggle() {
            this.followshow = true;
        },

        // 关注
        async Follow() {
            this.followshow = false;
            // 发起请求
            var result = await uni.$u.http.post("business/followbus", {
                busid: this.busid,
                fansid: this.business.id,
            });

            // 判断是否请求成功
            if (result.code == 0) {
                this.$refs.notice.show({
                    message: result.msg,
                    type: "error",
                });

                return false;
            }

            this.$refs.notice.show({
                message: result.msg,
                type: "success",
            });
            this.Information();
            this.isfollow = !this.isfollow;
        },

        // 发私信
        Send() {
            uni.navigateTo({
                url: `/pages/business/chat?receiveid=${this.busid}`,
            });
        },

        // 请求帖子列表
        async List() {
            // 发起请求
            var result = await uni.$u.http.post("business/list", {
                busid: this.busid,
                cateid: this.cateid,
                page: this.page,
            });

            // 改变下拉的状态
            this.triggered = false;

            // 判断是否请求成功
            if (result.code == 0) {
                this.finished = true;

                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                return false;
            }

            // 追加列表数据
            this.list = this.list.concat(result.data);
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

        // 删除
        Delete(postid) {
            this.postid = postid;
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
                postid: this.postid,
                cateid: this.cateid,
                busid: this.business.id,
            });

            // 判断是否请求成功
            if (result.code == 1) {
                this.$refs.notice.show({
                    type: "success",
                    message: result.msg,
                });
                this.Information();
                this.finished = false;
                this.page = 1;
                this.list = [];
                this.List();
            } else {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                this.Information();
                this.finished = false;
                this.page = 1;
                this.list = [];
                this.List();
            }
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
.info .title {
    /* 去掉下划线 */
    text-decoration: none !important;
}

.content {
    width: 100%;
    overflow-x: hidden;
}

.person {
    background-image: url("/static/titlebg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
    padding: 30px 30px 10px;
}

.person .info {
    display: flex;
    width: 100%;
    margin-bottom: 15px;
}

.person .info .avatar {
    width: 4em;
    height: 4em;
    overflow: hidden;
    border-radius: 100%;
    margin-right: 1em;
    flex-shrink: 0;
}

.person .info .avatar image {
    width: 100%;
    height: 100%;
}

.person .info .base {
    color: #fff;
    font-size: 1em;
}

.person .info .base .nickname {
    margin-bottom: 7px;
}

.person .info .base .desc {
    font-size: 0.8em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* 改成你需要的行数 */
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.person .grid {
    margin-bottom: 15px;
}

.person .btnlist {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    align-content: center;
    flex-wrap: nowrap;
}

.person .btnlist .btn {
    margin-right: 10px;
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
</style>
