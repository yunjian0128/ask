<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user">
			<view class="avatar">
				<!-- #ifdef H5 || APP-PLUS -->
				<image src="/static/logo.png"></image>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<open-data type="userAvatarUrl"></open-data>
				<!-- #endif -->
			</view>

			<view class="nickname">RickyFlex</view>
		</view>

		<view class="bind">
			<u-form labelPosition="left" labelWidth="70" :model="business" :rules="rules" ref="bind">
				<u-form-item label="手机号" prop="mobile" borderBottom ref="mobile">
					<u-input v-model="business.mobile" border="none" placeholder="请输入手机号码"></u-input>
				</u-form-item>

				<u-form-item label="密码" prop="password" borderBottom ref="password">
					<u-input type="password" v-model="business.password" border="none" placeholder="请输入密码"></u-input>
				</u-form-item>

				<!-- #ifdef MP-WEIXIN -->
				<u-button type="primary" text="确认绑定" formType="submit" @click="submit"></u-button>
				<!-- #endif -->

				<!-- #ifdef H5 || APP-PLUS -->
				<u-button type="primary" text="登录" formType="submit" @click="submit"></u-button>
				<!-- #endif -->
			</u-form>
		</view>

		<!-- 提醒组件 -->
		<u-toast ref="notice"></u-toast>
	</view>
</template>

<script>
export default {
	onLoad(options) {
		this.business.openid = options.hasOwnProperty('openid') ? options.openid : ''
	},
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		//设置表单验证规则
		this.$refs.bind.setRules(this.rules)
	},
	data() {
		return {
			business: {
				mobile: '',
				password: '',
				openid: ''
			},
			rules: {
				mobile: [
					{
						type: 'string',
						required: true,
						message: '请填写手机号码',
						trigger: ['blur', 'change']
					},
					{
						// 自定义验证函数
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// uni.$u.test.mobile()就是返回true或者false的
							return uni.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}
				],
				password: {
					type: 'string',
					required: true,
					message: '请填写密码',
					trigger: ['blur', 'change']
				},
			}
		}
	},
	methods: {
		submit() {
			//判断是否有通过表单验证
			this.$refs.bind.validate()
				.then(async res => {
					this.$refs.notice.show({
						type: 'success',
						message: '通过效验'
					})

					//#ifdef MP-WEIXIN
					var result = await uni.$u.http.post('/business/bind', this.business)
					//#endif

					//#ifdef H5 || APP
					var result = await uni.$u.http.post('/business/web', this.business)
					//#endif

					if (result.code == 0) {
						this.$refs.notice.show({
							message: result.msg,
							type: 'error'
						})
						return false
					}

					this.$refs.notice.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							//登录成功，设置本地存储
							uni.setStorageSync('business', result.data)

							//返回的动作
							uni.$u.route({
								type: 'navigateBack',
								delta: 1
							})
						}
					})


				})
				.catch(error => {
					console.log(error)
					this.$refs.notice.show({
						type: 'error',
						message: '效验失败'
					})
				})
		}
	}
}
</script>

<style>
/* 头部 */
.user {
	width: 100%;
	padding: 40rpx 0rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
	color: white;
}

.avatar {
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	overflow: hidden;
	margin-bottom: 15px;
}

.avatar image {
	width: 100%;
	height: 100%;
}

.notice {
	display: block;
	text-align: center;
	color: #fff;
}

/* 表单 */
.bind {
	width: 90%;
	margin: 0 auto;
}
</style>