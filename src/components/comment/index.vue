<template>
    <view class="list">
        <view class="item" v-for="(comment, index) in comlist" :key="index">
            <!-- 基本信息 -->
            <view class="business">
                <!-- 头像 -->
                <view class="avatar">
                    <image
                        mode="aspectFit"
                        v-if="comment.business.avatar_text"
                        :src="comment.business.avatar_text"
                    ></image>
                    <image
                        mode="aspectFit"
                        v-else
                        src="/static/avatar.png"
                    ></image>
                </view>

                <!-- 用户 -->
                <view class="base">
                    <view class="name">
                        <view
                            class="nickname"
                            v-if="comment.business.nickname"
                            >{{ comment.business.nickname }}</view
                        >
                        <view class="nickname" v-else>匿名</view>
                        <view class="createtime">{{
                            comment.createtime_text
                        }}</view>
                    </view>
                    <view class="desc">这家伙很懒，什么都没写！</view>
                </view>
            </view>

            <!-- 详细内容 -->
            <view class="content">{{ comment.content }}</view>

            <!-- 操作 -->
            <view class="action">
                <view class="left">
                    <view class="tag">
                        <!-- 判断当前登录的用户id在不在点赞的列表中 -->
                        <u-tag
                            v-if="
                                comment.like_list.includes(
                                    business.id.toString()
                                )
                            "
                            :text="`取消点赞 ${comment.like_count}`"
                            type="success"
                            icon="thumb-up"
                            @click="LikeToggle(comment.id)"
                        ></u-tag>
                        <u-tag
                            v-else
                            :text="`点赞 ${comment.like_count}`"
                            type="success"
                            plain
                            icon="thumb-up"
                            @click="LikeToggle(comment.id)"
                        ></u-tag>
                    </view>
                    <view class="comment" @click="CommentToggle(index)">
                        <u-icon name="chat" size="25"></u-icon
                        >{{ comment.comment_count }} 条评论
                    </view>
                </view>
                <view class="right" v-if="post.status == '0'">
                    <view class="operation">
                        <u-icon
                            name="more-dot-fill"
                            size="20"
                            @click="MenuToggle(comment)"
                        ></u-icon>
                    </view>
                </view>
            </view>

            <comment
                v-if="comment.comment_count > 0 && comment.show"
                :postid="postid"
                :show="comment.show"
                :pid="comment.id"
            />
        </view>
        <!-- 弹出层 -->
        <u-popup :show="MenuShow" @close="MenuShow = false">
            <view class="menu">
                <view class="grid">
                    <u-grid :border="true">
                        <u-grid-item @click="AnswerToggle">
                            <u-icon
                                color="warning"
                                name="edit-pen-fill"
                                size="35"
                            ></u-icon>
                            <u--text
                                type="warning"
                                text="补充回答"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item v-if="post.busid == business.id">
                            <u-icon
                                color="success"
                                name="checkmark"
                                size="35"
                            ></u-icon>
                            <u--text
                                type="success"
                                text="采纳此答案"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                        <u-grid-item
                            v-if="
                                post.busid == business.id ||
                                current.busid == business.id
                            "
                        >
                            <u-icon
                                color="error"
                                name="trash-fill"
                                size="35"
                            ></u-icon>
                            <u--text
                                type="error"
                                text="删除"
                                align="center"
                            ></u--text>
                        </u-grid-item>
                    </u-grid>
                </view>
                <u-button
                    class="btn"
                    type="error"
                    text="取消"
                    @click="MenuShow = false"
                ></u-button>
            </view>
        </u-popup>

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

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
// 引入自定义组件
import Vue from "vue";

export default {
    components: {
        comment: () => import("@/components/comment/index.vue"),
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        postid: {
            type: [String, Number],
            required: true,
            default: 0,
        },
        pid: {
            type: [String, Number],
            required: true,
            default: 0,
        },
    },
    created() {
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        this.CommentData();
    },
    data() {
        return {
            // 当前点击的评论
            current: {
                id: 0,
                busid: 0,
            },
            post: {},
            comlist: [],
            business: {},
            MenuShow: false,
            AnswerShow: false,
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
        // 弹出菜单
        async MenuToggle(comment) {
            this.current = comment;
            this.MenuShow = !this.MenuShow;
        },

        // 弹出回答框
        async AnswerToggle() {
            this.MenuShow = false;
            this.AnswerShow = true;
        },
        async CommentToggle(index) {
            this.comlist[index].show = !this.comlist[index].show;
        },

        // 帖子详情
        async PostData() {
            // 组装数据
            var data = {
                postid: this.postid,
            };
            if (this.business.id) {
                data.busid = this.business.id;
            }
            var result = await uni.$u.http.post("/post/info", data);
            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                    complete: () => {
                        uni.$u.route({
                            type: "navigateBack",
                            delta: 1,
                        });
                        return false;
                    },
                });
                return false;
            }
            this.post = result.data;
        },
        async CommentData() {
            // 组装数据
            var data = {
                postid: this.postid,
                pid: this.pid,
            };

            if (this.business.id) {
                data.busid = this.business.id;
            }

            var result = await uni.$u.http.post("/comment/index", data);

            if (result.data) {
                this.comlist = result.data;

                this.comlist.map((item) => {
                    // item == js 对象show js对象下属性 修改js对象
                    // 设置响应式数据到对象中
                    Vue.set(item, "show", false);
                });
            }
            this.PostData();
        },

        // 点赞
        async LikeToggle(comid) {
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
                commentid: comid,
                busid: this.business.id,
                postid: this.postid,
            };
            var result = await uni.$u.http.post("/post/like", data);

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

                this.CommentData();
            }
        },

        // 提交答案
        submit() {
            // 判断是否有通过表单验证
            this.$refs.answer
                .validate()
                .then(async (res) => {
                    this.AnswerShow = false;
                    this.$refs.notice.show({
                        type: "success",
                        message: "通过表单验证",
                    });

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
                        pid: this.comment.pid,
                        level: 0,
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

                    // 调用另一个组件中的方法
                    comment.methods.CommentData();
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
    width: 100%;
    margin: 0 auto;
}

.list .item {
    width: 100%;
    margin: 0 auto;
    margin-bottom: 10px;
    padding: 15px;
    padding-left: 0;
    padding-right: 0;
    background: #fff;
    box-shadow: 0 0 3px 0 rgba(0, 78, 255, 0.1);
}

.list .item .business {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    padding: 0px 10px;
    box-sizing: border-box;
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
    padding-left: 10px;
    text-indent: 20px;
}

.item .action {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    padding: 0px 10px;
    box-sizing: border-box;
}

.item .action .left {
    display: flex;
}

.item .action .right {
    display: flex;
    align-items: flex-end;
    align-content: flex-end;
    margin-top: 4px;
    margin-right: 10px;
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
