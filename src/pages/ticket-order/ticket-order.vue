<template>
	<view>
		<view class="container" v-if="order">
			<view class="section">
				<view class="movie-box">
					<view class="movie-name">{{ order.movieName }}</view>
					<view class="watch-time">{{ order.time }} {{ order.lang }}</view>
					<view>{{ order.cinemaName }}</view>
					<view>{{ order.hall }} {{ order.seat }}</view>
				</view>
				<view class="price-box">
					<view>票价</view>
					<view class="server">含服务费3元/张
						<text class="price-num">{{ order.price }}<text class="yuan">元</text></text>
					</view>
				</view>
			</view>
			<view class="section">
				<view class="section-title">活动和优惠券</view>
				<view class="section-content">无可用</view>
			</view>
			<view class="section">
				<view class="section-title">退改签须知</view>
				<view class="section-content">
					<view>开场时间60分钟前，可免费改签、退款</view>
					<view>使用观影卡或享受票减小吃特惠时，不可改签</view>
				</view>
			</view>
			<view class="section">
				<view class="section-title">手机号</view>
				<view class="section-content">手机号仅用于生成订单，取票码不再以短信发送</view>
			</view>
			<view class="footer">
				<div class="pay-type">
					<div class="wechat type">
						<div>
							<span class="icon icon-wechat"></span>
							<span class="text">微信支付</span>
						</div>
						<span :class="[
                { 'icon-circle-selected-fill': selectPayType },
                { 'icon-circle-unselect': !selectPayType }
              ]" @click="
                selectPayType ? selectPayType : (selectPayType = !selectPayType)
              "></span>
					</div>
					<div class="alipay type">
						<div>
							<span class="icon icon-alipay"></span>
							<span class="text">支付宝</span>
						</div>
						<span :class="[
                { 'icon-circle-selected-fill': !selectPayType },
                { 'icon-circle-unselect': selectPayType }
              ]" @click="
                !selectPayType
                  ? selectPayType
                  : (selectPayType = !selectPayType)
              "></span>
					</div>
				</div>
				<view class="payment">还需支付：
					<text class="price-num">{{ order.price }}<text class="yuan">元</text></text>
				</view>
				<view class="payment-btn" @click="payment">确认支付</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order: true,
				first: true, //是否是第一次支付
				selectPayType: true, //微信
			}
			j
		},
		methods: {
			initData(params) {
				this.order = params
			},
			payment() {
				//避免重复支付
				if (this.first) {
					let movieOrder = wx.getStorageSync('movieOrder') || []
					movieOrder.unshift(this.order)
					wx.setStorageSync('movieOrder', movieOrder)

					this.first = false

					uni.switchTab({
						url: '/pages/index/index',
						success: () => {
							wx.showToast({ title: '支付成功' })
						},
						fail: res => {
							wx.showToast({ title: '服务器开小差了，请重试' + res })
						}
					})
				} else {
					wx.showToast({
						title: '已支付',
						icon: 'none'
					})
				}
			}
		},
		onLoad(params) {
			return
			const paramsObj = JSON.parse(params.paramsStr)
			this.initData(paramsObj)
		}
	}
</script>

<style lang="less" scoped>
	.container {
		position: relative;
		width: 100vw;
		min-height: 100vh;
		background: #f5f5f5;
		color: #666;
	}

	.section {
		margin-bottom: 20rpx;
		font-size: 28rpx;
		padding: 30rpx;
		padding-right: 0;
		background: #fff;
	}

	.section-title {
		padding-bottom: 20rpx;
		border-bottom: 1px solid #f0f0f0;
		font-size: 32rpx;
		line-height: 1em;
	}

	.section-content {
		color: #999;
		font-size: 28rpx;
		line-height: 1.8em;
		padding-top: 20rpx;
		padding-right: 30rpx;
	}

	.movie-box {
		padding-bottom: 20rpx;
		padding-right: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		line-height: 1.5em;
		font-size: 30rpx;
	}

	.movie-name {
		color: #333;
		font-size: 36rpx;
	}

	.watch-time {
		color: #f03d37;
	}

	.price-box {
		display: flex;
		justify-content: space-between;
		padding-right: 30rpx;
		padding-top: 30rpx;
	}

	.server {
		font-size: 26rpx;
		color: #999;
	}

	.price-box .price-num {
		color: #f03d37;
		font-size: 30rpx;
	}

	.price-box .price-num .yuan {
		font-size: 20rpx;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #fff;
		border-top: 1px solid #f0f0f0;

		.pay-type {

			position: fixed;
			width: 100%;
			left: 0;
			bottom: 192rpx;
			background-color: #f1f1f1;

			.wechat {
				border-bottom: 1px solid #f0f0f0;
			}


			.type {
				border-bottom: 1px solid #f0f0f0;
				box-sizing: border-box;
				padding: 25rpx 35rpx 25rpx 35rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: relative;
				background-color: #fff;
				text-align: left;


				.text {
					margin-left: 26rpx;
					font-size: 29rpx;

				}

				label {
					font-size: 39rpx;
				}

				span {
					font-size: 0.6rem;
				}

				p {
					position: absolute;
					left: 1.2rem;
				}
			}
		}

	}

	.payment {
		padding: 20rpx 30rpx;
		text-align: right;
		font-size: 32rpx;

	}


	.footer .price-num {
		color: #f03d37;
		font-size: 36rpx;
	}

	.footer .yuan {
		font-size: 20rpx;
	}

	.payment-btn {
		height: 2.5em;
		line-height: 2.5em;
		background: #f90;
		margin: 0 30rpx 20rpx;
		color: #fff;
		text-align: center;
		font-size: 34rpx;
		border-radius: 8rpx;
	}
</style>