<template>
    <view class="post">
        <view class="info">
            <view class="tag">
                <view class="item">
                    <u-tag
                        class="item"
                        :text="post.category.name"
                        type="success"
                        icon="list-dot"
                    ></u-tag>
                </view>

                <view class="item">
                    <u-tag
                        class="item"
                        v-if="post.status == '0'"
                        :text="post.status_text"
                        type="error"
                        icon="close"
                    ></u-tag>
                    <u-tag
                        class="item"
                        v-else
                        :text="post.status_text"
                        type="success"
                        icon="checkmark"
                    ></u-tag>
                </view>

                <view class="item">
                    <u-tag
                        class="item"
                        v-if="post.collect"
                        text="取消收藏"
                        type="warning"
                        plain
                        icon="star-fill"
                        @click="ColCancelToggle"
                    ></u-tag
                    ><u-tag
                        class="item"
                        v-else
                        text="收藏"
                        type="warning"
                        @click="Collect"
                        icon="star"
                    ></u-tag>
                </view>
            </view>

            <view class="title">{{ post.title }}</view>

            <view class="author">
                <!-- 头像 -->
                <view class="avatar">
                    <image
                        mode="fill"
                        v-if="post.business.avatar_text"
                        :src="post.business.avatar_text"
                    ></image>
                    <image mode="fill" v-else src="/static/avatar.png"></image>
                </view>

                <!-- 昵称 -->
                <view class="nickname">{{
                    post.business.nickname ? post.business.nickname : "匿名用户"
                }}</view>

                <!-- 发布时间 -->
                <view class="createtime"
                    >发布于 <br />{{ post.createtime_text }}</view
                >

                <view class="follow">
                    <u-tag
                        v-if="post.busid != business.id && post.subscribe"
                        class="item"
                        text="取消关注"
                        type="error"
                        icon="plus-people-fill"
                        size="mini"
                        @click="SubCancelToggle"
                    ></u-tag
                    ><u-tag
                        v-else-if="post.busid != business.id"
                        class="item"
                        text="关注"
                        type="error"
                        icon="plus-people-fill"
                        size="mini"
                        @click="Subscribe"
                    ></u-tag>
                </view>
            </view>

            <!-- 正文内容 -->
            <view class="content">
                <u-parse :content="post.content"></u-parse>
            </view>

            <!-- 宫格布局 -->
            <view class="grid">
                <u-grid :border="true">
                    <u-grid-item>
                        <u--text
                            type="warning"
                            text="关注者"
                            align="center"
                        ></u--text>
                        <u--text
                            type="warning"
                            :text="`${post.collect_text}人`"
                            align="center"
                        ></u--text>
                    </u-grid-item>
                    <u-grid-item>
                        <u--text
                            type="success"
                            text="回答人数"
                            align="center"
                        ></u--text>
                        <u--text
                            type="success"
                            :text="`${post.comment_text}人`"
                            align="center"
                        ></u--text>
                    </u-grid-item>
                    <u-grid-item>
                        <u--text
                            type="error"
                            text="悬赏积分"
                            align="center"
                        ></u--text>
                        <u--text
                            type="error"
                            :text="post.point"
                            align="center"
                        ></u--text>
                    </u-grid-item>
                </u-grid>
            </view>

            <u-divider text="分割线" :dot="true"></u-divider>

            <view class="bottom">
                <view class="btn" v-if="post.status == '0'">
                    <u-button
                        type="primary"
                        text="我来回答"
                        @click="AnswerToggle"
                    ></u-button>
                </view>
                <view class="btn" v-if="business.id == post.busid">
                    <u-button
                        type="warning"
                        text="修改提问"
                        @click="edit"
                    ></u-button>
                </view>
            </view>
        </view>

        <!-- 评论列表 -->
        <comment v-if="refresh" :postid="postid" :pid="0" :show="true" />

        <!-- 回答弹出层 -->
        <u-popup :show="AnswerShow" @close="AnswerShow = false">
            <view class="answer">
                <u-form
                    labelPosition="top"
                    labelWidth="150"
                    :model="comment"
                    :rules="rules"
                    ref="answer"
                >
                    <!-- 描述 -->
                    <u-form-item
                        label="回答描述："
                        prop="content"
                        ref="content"
                    >
                        <u--textarea
                            v-model="comment.content"
                            placeholder="请输入回答描述"
                        ></u--textarea>
                    </u-form-item>

                    <view class="btn">
                        <u-button
                            type="primary"
                            text="提交答案"
                            formType="submit"
                            @click="submit"
                        ></u-button>
                    </view>
                </u-form>
            </view>
        </u-popup>

        <!-- 取消关注确定框 -->
        <u-modal
            :show="SubCancelShow"
            :title="'取消关注提醒'"
            :content="'是否确认取消关注此用户'"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="SubCancelShow = false"
            @close="SubCancelShow = false"
            @confirm="Subscribe"
        ></u-modal>

        <!-- 取消收藏确定框 -->
        <u-modal
            :show="ColCancelShow"
            :title="'取消收藏提醒'"
            :content="'是否确认取消收藏此帖子'"
            showCancelButton
            :closeOnClickOverlay="true"
            @cancel="ColCancelShow = false"
            @close="ColCancelShow = false"
            @confirm="Collect"
        ></u-modal>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
// 引入评论组件
import comment from "@/components/comment/index.vue";

export default {
    components: { comment },

    onLoad(options) {
        var postid = options.postid ? options.postid : 0;
        this.postid = postid;

        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        // 调用请求数据
        this.PostData();
        this.CommentData();
    },
    // onShow() {
    //     this.business = uni.getStorageSync("business")
    //         ? uni.getStorageSync("business")
    //         : {};

    //     // 调用请求数据
    //     this.PostData();

    //     this.CommentData();
    // },

    data() {
        return {
            postid: 0,
            post: {
                category: {},
                business: {},
            },
            answer: {
                content: "",
            },
            refresh: true,
            comlist: [],
            business: {},
            MenuShow: false,
            AnswerShow: false,
            SubCancelShow: false,
            ColCancelShow: false,
            content: `
					<b>这个是正文内容</b>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`,
            comment: {
                content: "",
            },
            rules: {
                content: {
                    type: "string",
                    required: true,
                    message: "请填写回答内容",
                    trigger: ["blur", "change"],
                },
            },
        };
    },
    methods: {
        // 帖子详情
        async PostData() {
            // 组装数据
            var data = {
                postid: this.postid,
            };
            if (this.business.id) {
                data.busid = this.business.id;
            }

            // 调用接口
            var result = await uni.$u.http.post("post/info", data);

            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                    complete: () => {
                        uni.$u.route({
                            type: "navigateBack",
                            delta: 1, // 返回上一级页面
                        });
                        return false;
                    },
                });
                return false;
            }
            this.post = result.data;
        },

        // 评论列表
        async CommentData() {
            // 组装数据
            var data = {
                postid: this.postid,
            };
            if (this.business.id) {
                data.busid = this.business.id;
            }

            // 调用接口
            var result = await uni.$u.http.post("/comment/index", data);
            if (result.data) {
                this.comlist = result.data;
            }
        },

        // 关注
        async Subscribe() {
            this.SubCancelShow = false;

            // 判断是否登录
            if (!this.business || !this.business.id) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });
                return false;
            }

            // 自己不能关注自己
            if (this.business.id == this.post.busid) {
                this.$refs.notice.show({
                    type: "error",
                    message: "自己不能关注自己",
                });
                return false;
            }

            // 组装数据
            var data = {
                busid: this.post.busid,
                fansid: this.business.id,
            };

            // 调用接口
            var result = await uni.$u.http.post("/post/subscribe", data);

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

            // 刷新数据
            this.PostData();
        },

        // 收藏
        async Collect() {
            this.ColCancelShow = false;

            // 判断是否登录
            if (!this.business || !this.business.id) {
                this.$refs.notice.show({
                    type: "error",
                    message: "请先登录",
                });
                return false;
            }

            // 组装数据
            var data = {
                postid: this.postid,
                busid: this.business.id,
            };

            // 调用接口
            var result = await uni.$u.http.post("/post/collect", data);
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });
            } else {
                this.$refs.notice.show({
                    type: "success",
                    message: result.msg,
                });

                // 刷新数据
                this.PostData();
            }
        },

        // 编辑
        edit() {
            // 做程序的时候，要把add发帖界面复制一份出来修改为edit编辑界面
            uni.$u.route({
                type: "navigateTo",
                url: `/pages/post/edit?postid=${this.postid}`,
            });
        },

        // 弹出回答框
        AnswerToggle() {
            this.AnswerShow = true;
            this.comment.pid = 0;
        },

        // 弹出取消关注框
        SubCancelToggle() {
            this.SubCancelShow = true;
        },

        // 弹出取消收藏框
        ColCancelToggle() {
            this.ColCancelShow = true;
        },

        // 提交答案
        submit() {
            // 判断是否有通过表单验证
            this.$refs.answer
                .validate()
                .then(async (res) => {
                    this.AnswerShow = false;

                    // 判断是否登录
                    if (!this.business || !this.business.id) {
                        this.$refs.notice.show({
                            type: "error",
                            message: "请先登录",
                        });
                        return false;
                    }

                    // 组装数据
                    var data = {
                        postid: this.postid,
                        busid: this.business.id,
                        content: this.comment.content,
                        pid: 0,
                    };

                    // 调用接口
                    var result = await uni.$u.http.post("/comment/add", data);

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

                    // 刷新数据
                    this.comment.content = "";

                    //隐藏掉评论列表
                    this.refresh = false;

                    this.$nextTick(() => {
                        this.refresh = true;
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.$refs.notice.show({
                        type: "error",
                        message: "校验失败",
                    });
                });
        },
    },
};
</script>

<style>
.post {
    background: #f4f6f8;
}

.info {
    width: 95%;
    margin: 0 auto;
    margin-bottom: 20px;
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 3px 0 rgba(0, 78, 255, 0.1);
}

/* 标签 */
.info .tag {
    display: flex;
    margin-bottom: 10px;
}

.info .tag .item {
    margin-right: 5px;
}

/* 标题 */
.info .title {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 0.5em;
}

/* 用户信息 */
.author {
    display: flex;
    align-items: center;
    align-content: center;
    color: #999;
    font-size: 0.8em;
}

.author .avatar {
    width: 2em;
    height: 2em;
    border-radius: 100%;
    overflow: hidden;
    margin-right: 10px;
}

.author .avatar image {
    width: 100%;
    height: 100%;
}

.author .nickname,
.author .createtime {
    margin-right: 10px;
}

/* 详细内容 */
.content {
    margin: 10px 0px;
    overflow: hidden;
}

.content img {
    width: 100%;
    height: 100%;
}

.info .bottom {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.info .bottom .btn {
    width: 10em;
    margin-right: 15px;
}

.info .bottom .btn:last-of-type {
    margin-right: 0px;
}

/* 评论列表 */
.list {
    width: 97%;
    margin: 0 auto;
}

.list .item {
    width: 91%;
    margin: 0 auto;
    margin-bottom: 5px;
    padding: 15px;
    background: #fff;
    box-shadow: 0 0 3px 0 rgba(0, 78, 255, 0.1);
}

.list .item .business {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
}

.business .avatar {
    width: 2em;
    height: 2em;
    border-radius: 100%;
    overflow: hidden;
    margin-right: 10px;
    flex-shrink: 0;
}

.business .avatar image {
    width: 100%;
    height: 100%;
}

.business .base {
    width: 90%;
    padding: 5px 10px;
    font-size: 0.8em;
}

.business .base .name {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.business .base .name .nickname {
    font-weight: bold;
    color: #000;
}

.business .base .name .createtime {
    color: #999;
}

.business .base .desc {
    color: #999;
}

.item .content {
    font-size: 0.9em;
    color: #303133;
    margin-bottom: 30px;
}

.item .action {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
}

.item .action .left {
    display: flex;
}

.item .action .right {
    display: flex;
    align-items: flex-end;
    align-content: flex-end;
    margin-top: 4px;
}

.item .action .tag {
    margin-right: 10px;
}

.item .action .comment {
    display: flex;
    align-content: center;
    align-items: center;
}

/* 弹出菜单 */
.menu .grid {
    margin: 20px 0px;
}

.btn {
    border-radius: 0px;
}

/* 回答内容 */
.answer {
    padding: 20px;
}
</style>
