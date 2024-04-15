<template>
	<view class="container">
		<view class="header">
		<image
			:src="userImg"
			mode="scaleToFill"
			class="avatar"
		/>
		<span class="user-name">{{ userName }}</span>

		</view>
		<view>
			<view class="order">
				<view class="title-box">
					<view class="title">我的订单</view>
					<view class="title-line"></view>
				</view>
				<view class="order-list">
					<div class="order-item" @click="navToList('film')">
						<image src="../../static/image/user/order_movie.png"></image>
						<view>电影</view>
					</div>
					<div class="order-item" @click="navToList('snack')">
						<image src="../../static/image/user/order_store.png"></image>
						<view>小吃</view>
					</div>
				</view>
			</view>
			<view class="other">
				<view class="share other-item">
					<button open-type="share" class="btn" hover-class="none">
						<text class="iconfont icon-fenxiang1"></text> 分享给朋友
					</button>
				</view>
				<view class="customer other-item">
					<button open-type="contact" class="btn" hover-class="none">
						<text class="iconfont icon-lianxikefu"></text> 客服反馈
					</button>
				</view>
				<view class="about other-item">
					<navigator url="../subPages/about-page/about-page" hover-class="none">
						<text class="iconfont icon-guanyuwomen"></text> 关于
					</navigator>
				</view>
			</view>
		</view>
		<view class="login-box">
			<input type="nickname" class="nickname" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userImg: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				userName: '点击登录',
				hasUserInfo: false
			}
		},
		onLoad() {
			this.userAuthorized()
		},
		onShow() {
			this.userAuthorized()
		},
		created(){
			this.userName =   uni.getStorageSync("userName");
			this.userImg = uni.getStorageSync("userImg")
		},
		methods: {
			async login() {
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes)
						// 获取用户信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								console.log('用户昵称为：', infoRes.userInfo)
							}
						})
					}
				})
			},
			onChooseAvatar(e) {
				this.avatarUrl = e.detail.avatarUrl
				console.log(this.avatarUrl)
			},
			userAuthorized() {
				const userInfo = wx.getStorageSync('userInfo')
				if (userInfo) {
					//存在则判断服务端session是否过期
					console.log('判断服务端session是否过期')
					wx.request({
						url: app.globalData.url + '/user/isAuth',
						method: 'GET',
						header: { token: userInfo.data.token },
						success: res => {
							if (res.data.state == 202) {
								this.hasUserInfo = false
							} else {
								this.hasUserInfo = true
							}
						}
					})
				} else {
					this.hasUserInfo = false
				}
			},
			onGetUserInfo(event) {
				const userInfo = event.detail.userInfo
				if (userInfo) {
					wx.login({
						success: res_1 => {
							wx.getUserInfo({
								success: res_2 => {
									console.log(res_2)
									wx.request({
										url: app.globalData.url + '/user/wxLogin',
										method: 'POST',
										header: { 'content-type': 'application/x-www-form-urlencoded' },
										data: {
											code: res_1.code,
											nickName: res_2.userInfo.nickName,
											avatarUrl: res_2.userInfo.avatarUrl,
											gender: res_2.userInfo.gender
										},
										success: res => {
											const userInfo = res.data
											wx.setStorage({
												key: 'userInfo',
												data: userInfo
											})
											this.hasUserInfo = true

											app.globalData.userInfo = res_2.userInfo
										}
									})
								}
							})
						}
					})
				}
			},
			navToList(flag) {
				if(flag === "film") {
					uni.navigateTo({url:"/pages/film-order-list/film-order-list"})
				}else {
					uni.navigateTo({url:"/pages/snack-order-list/snack-order-list"})
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.container {
		background: #f3f3f3;
	}

	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-image: url('https://mokespace.cn/kodexplorer/index.php?share/fileProxy&user=1&sid=IwiHsyK7');
		background-repeat: no-repeat;
		background-position: 50%;
		background-size: 100% 300rpx;
		height: 300rpx;
		overflow: hidden;
		text-align: center;
	}

	.login-box {
		position: fixed;
		width: 100%;

		button {
			width: 120rpx;
			height: 120rpx;
			text-align: center;
			padding: 0;
			background-color: transparent;

			.avatar {
				width: 120rpx;
				height: 120rpx;
				/* border-radius: 120rpx; */
				margin: 0;
				overflow: hidden;
			}

			.nickname {
				width: 80rpx;
				height: 120rpx;
			}
		}
	}

	.header {
		background-color: #e54847;
		.user-name {
		height: 45rpx;
		margin-top: 14rpx;
		font-size: 27rpx;
		line-height: 45rpx;
		background: none;
		color: #fff;
	}
	.avatar {
		width:200rpx;
		height:200rpx;
		border-radius: 50%;
	}
	}



	.order {

		background: #fff;
		padding: 26rpx 30rpx 0;
	}

	.order .title-box {
		position: relative;
		width: 320rpx;
		height: 42rpx;
		margin: 0 auto;
	}

	.order .title {
		position: relative;
		height: 42rpx;
		width: 160rpx;
		margin: 0 auto;
		font-size: 32rpx;
		line-height: 42rpx;
		color: #333;
		text-align: center;
		background: #fff;
		z-index: 9;
	}

	.order .title-line {
		position: absolute;
		width: 320rpx;
		height: 1px;
		left: 0;
		top: 23rpx;
		background: #f0f0f0;
	}

	.order-list {
		display: flex;
		height: 230rpx;
		align-items: center;
		background: #fff;
	}

	.order-item {
		width: 50%;
		text-align: center;
	}

	.order-item image {
		width: 84rpx;
		height: 84rpx;
		margin-bottom: 6rpx;
	}

	.order-item view {
		color: #333;
		font-size: 28rpx;
	}

	.other {
		margin-top: 20rpx;
		background: #fff;
	}

	.other-item {
		position: relative;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
		color: #333;
		border-bottom: 1px solid #f0f0f0;
		vertical-align: middle;
	}

	.other-item::after {
		position: absolute;
		right: 30rpx;
		top: 50%;
		content: '';
		width: 16rpx;
		height: 16rpx;
		border-left: 1px solid #ccc;
		border-top: 1px solid #ccc;
		transform: translateY(-50%) rotate(135deg);
	}

	/* 覆盖按钮的默认样式 */
	.other .btn {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		border: none;
		border-radius: 0;
		padding: 0;
		font-size: 1em;
		color: #333;
		text-align: left;
		background: #fff;
	}

	.other .btn::after {
		content: none;
	}

	.other .iconfont {
		display: inline-block;
		/* line-height: 100rpx; */
		margin-right: 8rpx;
		font-size: 32rpx;
		color: #333;
	}

	.customer .iconfont {
		font-size: 38rpx;
	}

	.about .iconfont {
		opacity: 0.8;
	}
</style>