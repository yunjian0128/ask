<template>
    <view class="content">
        <view class="header">
            <view class="search">
                <input
                    class="uni-input search-area"
                    focus
                    placeholder="搜索你想了解的用户..."
                    v-model="keywords"
                    @confirm="Search"
                />
            </view>
            <view class="nav" v-if="keywords == ''">
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'follow' }"
                    @click="Follow"
                    >我的关注</view
                >
                <view
                    class="nav-item"
                    :class="{ active: activeTab === 'fans' }"
                    @click="Fans"
                    >我的粉丝</view
                >
            </view>
            <!-- <u-tabs :list="CateList" @click="Action"></u-tabs> -->
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
                            <navigator
                                class="business"
                                :url="`/pages/business/center?busid=${item.id}`"
                            >
                                <view class="avatar">
                                    <image
                                        mode="fill"
                                        :src="item.avatar_text"
                                    ></image>
                                </view>
                            </navigator>

                            <view class="info">
                                <navigator
                                    class="nickname"
                                    :url="`/pages/business/center?busid=${item.id}`"
                                    >{{ item.nickname }}</navigator
                                >
                                <view v-if="item.motto" class="desc">{{
                                    truncatedContent(item.motto)
                                }}</view>
                                <view v-else class="desc"
                                    >这家伙儿很懒，什么也没写！</view
                                >

                                <view v-if="activeTab != 'search'" class="desc">
                                    关注时间： {{ item.followtime }}
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
            :title="'取消关注提醒'"
            :content="content"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="show = false"
            @close="show = false"
            @confirm="nofollow"
        ></u-modal>
    </view>
</template>

<script>
export default {
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

    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },

    data() {
        return {
            disabled: false,
            triggered: false,
            finished: false,
            scrollTop: 0,
            page: 1,
            show: false,
            content: "是否确认取消关注",
            action: [
                {
                    text: "取消关注",
                    style: {
                        backgroundColor: "rgb(245, 108, 108)",
                    },
                },
            ],
            keywords: "",
            business: {},
            activeTab: "follow",
            list: [],
            tip: {
                follow: "您还没有关注任何用户",
                fans: "您还没有粉丝",
                search: "没有搜索到相关用户",
            },
            CateList: [
                { id: "follow", name: "我的关注" },
                { id: "fans", name: "我的粉丝" },
            ],

            // 当前点击的用户id
            currentId: 0,
        };
    },

    methods: {
        // 搜索
        async List() {
            // 发送请求
            var result = await uni.$u.http.post("/business/follow", {
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

                if (result.msg == "暂未搜索到相关用户") {
                    this.Follow();
                    this.keywords = "";
                }

                return false;
            }

            this.$refs.notice.show({
                type: "success",
                message: result.msg,
            });

            this.list = this.list.concat(result.data);
            this.page++;
        },

        Search() {
            this.activeTab = "search";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.disabled = true;
            this.List();
        },

        // 切换tab
        Follow() {
            this.activeTab = "follow";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
            this.disabled = false;
        },

        // 切换tab
        Fans() {
            this.activeTab = "fans";
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
            this.disabled = true;
        },

        // 刷新事件
        refresh() {
            this.triggered = true;
            this.finished = false;
            this.page = 1;
            this.list = [];
            this.List();
        },

        // 记录删除的用户id
        DeleteToggle(id) {
            this.currentId = id;
            this.show = true;
        },

        // 取消关注
        async nofollow() {
            this.show = false;

            // 组装数据
            var data = {
                fansid: this.business.id,
                busid: this.currentId,
            };

            // 发送请求
            var result = await uni.$u.http.post("/business/nofollow", data);

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

                // 刷新列表
                this.refresh();
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
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
    /* 改成你需要的行数 */
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
</style>
