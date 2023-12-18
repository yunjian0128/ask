<template>
    <view class="content">
        <!-- 滚动信息 -->
        <u-notice-bar :text="message"></u-notice-bar>

        <JCalendar
            :yearMonth="current"
            :dataSource="list"
            @dateChange="SignData"
            @clickChange="clickSign"
        >
        </JCalendar>

        <view class="count">
            <view
                >本月累积打卡<text class="sum">{{ list.length }}</text
                >天，请再接再厉，继续努力!</view
            >
        </view>

        <!-- 提醒组件 -->
        <u-toast ref="notice"></u-toast>
    </view>
</template>

<script>
import JCalendar from "@/components/calendar/j-calendar.vue";
export default {
    components: {
        JCalendar,
    },

    onLoad() {
        // 获取用户信息
        this.business = uni.getStorageSync("business")
            ? uni.getStorageSync("business")
            : {};

        if (!this.business.hasOwnProperty("id")) {
            this.$refs.notice.show({
                type: "error",
                message: "请先登录",
            });

            return false;
        }

        // 获取当前用户当前任务的签到状态
        this.SignData(this.current);
    },

    data() {
        return {
            message: "每日签到可以获得超值优惠大奖，并且会获得相应积分",
            current:
                parseInt(new Date().getFullYear()) +
                "-" +
                parseInt(new Date().getMonth() + 1), //本月
            list: [],
        };
    },
    methods: {
        // 点击签到或补签事件，回调参格式“YYYY-MM-DD”
        async clickSign(day) {
            // 发起请求
            var result = await uni.$u.http.post("/signin/add", {
                busid: this.business.id,
            });

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

            this.list.push(day);
        },

        // 切换月份事件，获取当前用户该任务的签到数组
        async SignData(date) {
            // 组装数据
            var data = {
                busid: this.business.id,
                date: date,
            };

            // 发起请求
            var result = await uni.$u.http.post("/signin/index", data);

            if (result.code == 0) {
                this.$refs.notice.show({
                    type: "error",
                    message: result.msg,
                });

                this.list = [];
                return false;
            }

            var arr = [];
            result.data.map((item) => arr.push(item.createtime_text));
            this.list = arr;
        },
    },
};
</script>

<style>
.count {
    margin: 10px;
    padding: 10px;
    display: flex;
    text-align: center;
    border-radius: 10px;
    flex-direction: column;
    justify-content: center;
    background-color: #fff;
    align-items: center;
}

.sum {
    color: red;
    font-size: 20px;
}

.count text {
    margin: 5px;
}
</style>
