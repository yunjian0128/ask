<template>
	<view class="content">
		<view class='header'>
			<view class='search'>
			  <input class="uni-input search-area" focus placeholder="搜索你想了解的问题或用户..." />
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
		<u-modal :show="show" :title="'提醒'" :content="content" showCancelButton :closeOnClickOverlay="true" @cancel="show = false" @close="show = false" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	export default {
		data()
		{
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
		methods:{
			confirm()
			{
				this.show = false
			}
		}
	}
</script>


<style>
	.content{
		width:100%;
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

	.list .item{
		display: flex;
		width:100%;
		padding:10px;
		margin:0 auto;
	}

	.business{
		width:20%;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 10px;
		margin-right:10px;
	}

	.avatar{
		width:100%;
		height:5em;
	}

	.avatar image{
		width:100%;
		height:100%;
	}

	.author{
		text-align: center;
		font-size:.8em;
		color:#999;
		width:100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.info{
		font-size:.9em;
		color:#999;
	}

	.info .title, .info .createtime, .info .category, .info .status, .info .join{
		margin-bottom:2px;
	}

	.info .title{
		font-size:1.1em;
		width:95%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color:#000;
		text-decoration: underline;
		font-weight: bold;
	}

	.info .status{
		background:#fff8e5;
		color:#fa3534;
		padding:1px 2px;
		border:1px solid #fa3534;
		border-radius: 3px;
		margin-right:5px;
	}

	.info .join{
		display: flex;
		align-items: center;
		align-content: center;
		color:#fa3534;
	}

	.count{
		margin-right:10px;
	}

	.info .point{
		width:4em;
		text-align: center;
		background:#fff8e5;
		color:#f19049;
		padding:2px;
		margin-right:10px;
	}
</style>
