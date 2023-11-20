<template>
	<view class="content">
		<view class='header'>
			<view class='search'>
			  <input class="uni-input search-area" focus placeholder="搜索你想了解的用户..." />
			</view>
			<view class='nav'>
			  <view class="nav-item active">我的关注</view>
			  <view class="nav-item">我的粉丝</view>
			</view>
		</view>

		<!-- 侧滑列表 -->
		<view class="list">
			<u-swipe-action>
				<u-swipe-action-item :options="action" @click="show = true">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="item">
							<view class="business">
								<view class="avatar">
									<image mode="aspectFit" src="/static/avatar.png"></image>
								</view>
							</view>
							
							<view class="info">
								<navigator url="/pages/post/info" class="nickname">RickyFlex</navigator>
								<view class="desc">这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！</view>
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
							</view>
							
							<view class="info">
								<navigator url="/pages/post/info" class="nickname">RickyFlex</navigator>
								<view class="desc">这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！</view>
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
							</view>
							
							<view class="info">
								<navigator url="/pages/post/info" class="nickname">RickyFlex</navigator>
								<view class="desc">这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！</view>
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
							</view>
							
							<view class="info">
								<navigator url="/pages/post/info" class="nickname">RickyFlex</navigator>
								<view class="desc">这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！这家伙儿很懒，什么也没写！</view>
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
				content: '是否确认取消关注',
				action: [{
                    text: '取消关注',
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
		width:95%;
		margin:10px auto;
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

	.info{
		font-size:.9em;
		color:#999;
	}

	.info .nickname, .info .desc{
		margin-bottom:2px;
	}

	.info .nickname{
		font-size:1.1em;
		width:95%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		color:#000;
		font-weight: bold;
	}

	.info .desc{
		font-size:.8em;
		width:100%;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		/* 改成你需要的行数 */
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

</style>
