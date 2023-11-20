<template>
	<view>
		<u-form labelPosition="left" labelWidth="70" :model="business" :rules="rules" ref="profile">
			<!-- 用户信息 -->
			<view class="user">
				<view class="avatar">
					<u-form-item borderBottom>
						<u-upload :fileList="avatar" name="avatar" :maxCount="1" :previewFullImage="true" @afterRead="Read"
							@delete="Del"></u-upload>
					</u-form-item>
				</view>

				<view class="nickname">{{ business.nickname }}</view>
			</view>

			<!-- 表单 -->
			<view class="profile">
				<!-- 手机号 -->
				<u-form-item label="手机号" prop="mobile" borderBottom ref="mobile">
					<u-input v-model="business.mobile" border="none" placeholder="请输入手机号码"></u-input>
				</u-form-item>

				<!-- 昵称 -->
				<u-form-item label="昵称" prop="nickname" borderBottom ref="nickname">
					<u-input v-model="business.nickname" border="none" placeholder="请输入昵称"></u-input>
				</u-form-item>

				<!-- 邮箱 -->
				<u-form-item label="邮箱" prop="email" borderBottom ref="email">
					<u-input v-model="business.email" border="none" placeholder="请输入邮箱"></u-input>
				</u-form-item>

				<!-- 密码 -->
				<u-form-item label="密码" prop="password" borderBottom ref="password">
					<u-input type="password" v-model="business.password" border="none" placeholder="请输入密码"></u-input>
				</u-form-item>

				<!-- 性别 -->
				<u-form-item label="性别" prop="gender_text" borderBottom ref="gender_text" @click="ShowGender = true">
					<u-input v-model="business.gender_text" readonly border="none" placeholder="请选择性别"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>

				<!-- 性别弹出菜单 -->
				<u-action-sheet :show="ShowGender" :actions="GenderList" title="请选择性别" @close="ShowGender = false"
					@select="GenderSelect">
				</u-action-sheet>

				<!-- 地区 -->
				<pick-regions :defaultRegion="business.region_code" @getRegion="handleGetRegion">
					<u-form-item label="地区" prop="region_text" borderBottom ref="region_text">
						<u-input v-model="business.region_text" readonly border="none" placeholder="请选择地区"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
				</pick-regions>

				<u-button type="primary" text="确认修改" formType="submit" @click="submit"></u-button>
			</view>
		</u-form>

		<!-- 提醒组件 -->
		<u-toast ref="notice"></u-toast>
	</view>
</template>

<script>
//需要引入城市地区组件
import pickRegions from '@/components/pick-regions/pick-regions.vue'

export default {
	components: { pickRegions },
	onReady() {
		//onReady 为uni-app支持的生命周期之一
		//设置表单验证规则
		this.$refs.profile.setRules(this.rules)
	},
	onShow() {
		this.business = uni.getStorageSync('business') ? uni.getStorageSync('business') : {}

		this.avatar = [{
			url: this.business.avatar_text
		}]

		this.business.region_code = this.business.district || this.business.city || this.business.province
	},
	data() {
		return {
			ShowGender: false,
			GenderList: [
				{ name: '保密', value: '0' },
				{ name: '男', value: '1' },
				{ name: '女', value: '2' },
			],
			business: {},
			avatar: [],
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
				nickname: {
					type: 'string',
					required: true,
					message: '请填写昵称',
					trigger: ['blur', 'change']
				},
				email: [
					{
						type: 'string',
						required: true,
						message: '请填写邮箱',
						trigger: ['blur', 'change']
					},
					{
						// 自定义验证函数
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// uni.$u.test.mobile()就是返回true或者false的
							return uni.$u.test.email(value);
						},
						message: '邮箱不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}
				],
			}
		}
	},
	methods: {
		GenderSelect(e) {
			this.business.gender = e.value
			this.business.gender_text = e.name
		},
		// 获取选择的地区
		handleGetRegion(region) {
			this.business.region_text = region.map(item => item.name).join('/')
			this.business.region_code = region[2]['code']
		},
		// 删除图片
		Del() {
			this.avatar = []
		},
		// 读取图片
		Read(event) {
			this.avatar = [{
				url: event.file.thumb
			}]
		},
		// 提交表单
		submit() {
			// 判断是否有通过表单验证
			this.$refs.profile.validate()
				.then(async res => {
					// 组装数据
					var data = {
						// 文字数据
						params: {
							id: this.business.id,
							mobile: this.business.mobile,
							nickname: this.business.nickname,
							email: this.business.email,
							gender: this.business.gender,
							code: this.business.region_code,
						},
					}

					if (this.business.password) {
						data.params.password = this.business.password
					}

					if (this.avatar.length > 0 && this.avatar[0].url != this.business.avatar_text) {
						data.name = 'avatar'
						data.filePath = this.avatar[0].url
					}

					var result = await uni.$u.http.upload('business/profile', data)

					if (result.code == 0) {
						this.$refs.notice.show({
							type: 'error',
							message: result.msg
						})
						return false
					}

					this.$refs.notice.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							// 登录成功，设置本地存储
							uni.setStorageSync('business', result.data)

							// 返回的动作
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
/* 用户信息 */
.user {
	width: 100%;
	padding: 40rpx 0rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	background: linear-gradient(rgb(1, 115, 222), rgb(78, 169, 245));
	color: white;
}

/*.avatar {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		overflow: hidden;
	}

	.avatar image{
		width:100%;
		height:100%;
	}*/

/* 表单 */
.profile {
	width: 90%;
	margin: 0 auto;
}
</style>