<template>
	<view class="content">
		<view class='header'>
			<view class='person'>
				<!-- 基本资料 -->
				<view class="info">
					<view class="avatar">
						<!-- #ifdef H5 || APP-PLUS -->
						<image src="/static/logo.png"></image>
						<!-- #endif -->

						<!-- #ifdef MP-WEIXIN -->
						<open-data type="userAvatarUrl"></open-data>
						<!-- #endif -->
					</view>

					<view class="base">
						<view class="nickname">RickyFlex</view>
						<view class="desc">这家伙很懒，什么也没写！</view>
					</view>
				</view>

				<!-- 宫格布局 -->
				<view class="grid">
					<u-grid :border="true">
						<u-grid-item>
							<u--text color="#fff" text="提问" align="center"></u--text>
							<u--text color="#fff" text="20" align="center"></u--text>
						</u-grid-item>
						<u-grid-item>
							<u--text color="#fff" text="回答" align="center"></u--text>
							<u--text color="#fff" text="50" align="center"></u--text>
						</u-grid-item>
						<u-grid-item>
							<u--text color="#fff" text="收藏" align="center"></u--text>
							<u--text color="#fff" text="2" align="center"></u--text>
						</u-grid-item>
					</u-grid>
				</view>

				<!-- 按钮 -->
				<view class="btnlist">
					<view class="btn">
						<u-button type="success" icon="man-add" text="关注"></u-button>
					</view>
					<view class="btn">
						<u-button type="warning" icon="more-circle" text="发私信"></u-button>
					</view>
				</view>
			</view>
			<view class='nav'>
				<view class="nav-item active">我的提问</view>
				<view class="nav-item">我的回答</view>
				<view class="nav-item">我的收藏</view>
			</view>
		</view>

		<view class="list">
			<u-swipe-action>
				<u-swipe-action-item :options="action" @click="show = true">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item">
							<view class="business">
								<view class="avatar">
									<image mode="aspectFit" src="/static/avatar.png"></image>
								</view>
								<view class="author">RickyFlex</view>
							</view>

							<view class="info">
								<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
								<view class="createtime">发布时间：2023-07-17</view>
								<view class="category">分类：WEB前端</view>

								<view class="join">
									<view class="status">已解决</view>
									<view class="point">￥20.00</view>
									<view class="count">20人参与回复</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
				<u-swipe-action-item :options="action" @click="show = true">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item">
							<view class="business">
								<view class="avatar">
									<image mode="aspectFit" src="/static/avatar.png"></image>
								</view>
								<view class="author">RickyFlex</view>
							</view>

							<view class="info">
								<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
								<view class="createtime">发布时间：2023-07-17</view>
								<view class="category">分类：WEB前端</view>

								<view class="join">
									<view class="status">已解决</view>
									<view class="point">￥20.00</view>
									<view class="count">20人参与回复</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
				<u-swipe-action-item :options="action" @click="show = true">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item">
							<view class="business">
								<view class="avatar">
									<image mode="aspectFit" src="/static/avatar.png"></image>
								</view>
								<view class="author">RickyFlex</view>
							</view>

							<view class="info">
								<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
								<view class="createtime">发布时间：2023-07-17</view>
								<view class="category">分类：WEB前端</view>

								<view class="join">
									<view class="status">已解决</view>
									<view class="point">￥20.00</view>
									<view class="count">20人参与回复</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
				<u-swipe-action-item :options="action" @click="show = true">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item">
							<view class="business">
								<view class="avatar">
									<image mode="aspectFit" src="/static/avatar.png"></image>
								</view>
								<view class="author">RickyFlex</view>
							</view>

							<view class="info">
								<navigator url="/pages/post/info" class="title">如何访问知识问答社区系统首页进行发帖</navigator>
								<view class="createtime">发布时间：2023-07-17</view>
								<view class="category">分类：WEB前端</view>

								<view class="join">
									<view class="status">已解决</view>
									<view class="point">￥20.00</view>
									<view class="count">20人参与回复</view>
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>

		<!-- 提醒组件 -->
		<u-toast ref="notice"></u-toast>

		<!-- 弹框组件 -->
		<u-modal :show="show" :title="'提醒'" :content="content" showCancelButton :closeOnClickOverlay="true"
			@cancel="show = false" @close="show = false" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			content: '是否确认删除',
			action: [{
				text: '删除',
				style: {
					backgroundColor: 'rgb(245, 108, 108)',
				}
			}]
		}
	},
	methods: {
		confirm() {
			this.show = false
		}
	}
}
</script>


<style>
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
	font-size: .8em;
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
	font-size: .8em;
	color: #999;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.info {
	font-size: .9em;
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
}</style>
