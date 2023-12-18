<template>
    <view class="content">
        <view class="header">
            <view class="search">
                <view class="slogan">电脑DIY问答社区</view>
                <input
                    class="uni-input search-area"
                    v-model="keywords"
                    @confirm="search"
                    focus
                    placeholder="搜索你想了解的问题或用户..."
                />
            </view>
            <u-tabs :list="CateList" @click="CateCheck"></u-tabs>
        </view>

        <scroll-view
            class="list"
            scroll-y="true"
            refresher-enabled="true"
            :refresher-triggered="triggered"
            @refresherrefresh="refresh"
            @scrolltolower="loadmore"
        >
            <view class="item" v-for="(post, index) in postlist" :key="index">
                <view class="business">
                    <view class="avatar">
                        <image
                            mode="fill"
                            v-if="post.business.avatar"
                            :src="post.business.avatar_text"
                        ></image>
                        <image
                            mode="fill"
                            v-else
                            src="/static/avatar.png"
                        ></image>
                    </view>
                    <view class="author">{{ post.business.nickname }}</view>
                </view>

                <view class="info">
                    <navigator
                        :url="`/pages/post/info?postid=${post.id}`"
                        class="title"
                        >{{ post.title }}</navigator
                    >
                    <view class="createtime"
                        >发布时间：{{ post.createtime_text }}</view
                    >
                    <view class="category">分类：{{ post.category.name }}</view>

                    <view class="join">
                        <view
                            v-if="post.status == '1'"
                            style="color: green; border: green 1px solid"
                            class="status"
                            >{{ post.status_text }}</view
                        >
                        <view v-else color="success" class="status">{{
                            post.status_text
                        }}</view>
                        <view class="point">￥{{ post.point }}</view>
                        <view class="count"
                            >{{ post.comment_text }}人参与回复</view
                        >
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>

        <!-- 回到顶部 -->
        <u-back-top :scroll-top="scrollTop"></u-back-top>
    </view>
</template>

<script>
export default {
    onLoad() {
        this.CateData();
        this.PostData();
    },
    // 上拉加载
    onReachBottom() {
        if (this.finished) {
            this.finished = false;
        }

        this.PostData();
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
    },
    data() {
        return {
            triggered: false,
            finished: false,
            scrollTop: 0,
            CateList: [{ id: 0, name: "全部" }],
            cateid: 0,
            page: 1,
            postlist: [],
            keywords: "",
        };
    },
    methods: {
        // 获取分类数据
        async CateData() {
            var result = await uni.$u.http.post("/post/cate");
            this.CateList.push(...result.data);
        },

        // 分类切换
        async CateCheck(item) {
            this.cateid = item.id;
            this.finished = false;
            this.page = 1;
            this.postlist = [];
            this.PostData();
        },

        // 帖子详情
        async PostData() {
            // 组装数据
            var data = {
                page: this.page,
                cateid: this.cateid,
                keywords: this.keywords,
            };

            var result = await uni.$u.http.post("/post/index", data);

            // 改变下拉的状态
            this.triggered = false;

            if (result.code == 0) {
                this.finished = true;

                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });
                return false;
            }

            this.postlist = this.postlist.concat(result.data);
            this.page++;
        },

        // 搜索
        search() {
            this.refresh();
        },

        // 刷新事件
        refresh() {
            this.triggered = true;
            this.finished = false;
            this.page = 1;
            this.postlist = [];
            this.PostData();
        },

        // 上拉加载
        loadmore() {
            console.log("上拉加载");
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
}

.slogan {
    font-size: 50rpx;
    color: #fff;
    padding-top: 20rpx;
    padding-bottom: 30rpx;
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
}

.nav .nav-item {
    width: 25%;
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
    border-bottom: 1px solid #e9e6e6;
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
.info .title {
    /* 去掉下划线 */
    text-decoration: none !important;
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
