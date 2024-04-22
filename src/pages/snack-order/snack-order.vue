<template>
	<view>
		<view class="container" v-if="order">
			<view class="section">
				<view class="snack-img">
					<img :src="order?.deal?.imageUrl" alt="" />
				</view>
				<view class="snack-name">
					{{order?.deal?.firstTitle}}
				</view>
				<view class="snack-content">
					{{order?.deal?.title === order?.deal?.firstTitle?'':order?.deal?.title}}
				</view>
				<view class="snack-box box">
					<view class="snack line-ellipsis">{{ order?.cinemaName +' '  }}</view>
					<view class="">
						{{order?.cinemaData?.addr }}
					</view>
				</view>
				<view class="amount-box box">
					<view>数量：</view>
					<view class="stepper">
						<view :class="[order?.amount > 1 ? 'red' : '']" @click="minus">-</view>
						<view class="num">{{ order?.amount }}</view>
						<view class="red" @click="plus">+</view>
					</view>
				</view>
				<view class="total box">
					<view>总价：</view>
					<view class="red">{{ (order?.deal?.price * order?.amount * 1.0).toFixed(2) }}元</view>
				</view>
			</view>
			<!-- <view class="phone section"> 手机号 </view> -->
			<view class="payment-btn" @click="payment">提交订单</view>
		</view>
	</view>
</template>

<script scoped>
	export default {
		data() {
			return {
				order: {},
				first: true, //是否是第一次支付

			}
		},
		methods: {
			//减少数量
			minus() {
				if (this.order.amount === 1) {
					return
				} else {
					this.chanegAmount()
				}
			},
			//增加数量
			plus() {
				this.chanegAmount(1)
			},
			chanegAmount(flag) {
				let order = { ...this.order }
				let amount = order.amount
				if (flag) {
					amount++
				} else {
					amount--
				}
				let total = (amount * order.price).toFixed(1)
				this.order = {
					...order,
					amount,
					total
				}

			},
			//模拟支付
			async payment() {
				//避免重复支付
				if (this.first) {
					try {
						let { data: { code }, data: { data } } = await new Promise((resolve, reject) => {
							uni.request({
								url: 'https://film.sipc115.com/food/order',
								method: 'POST',
								header: {
									'Content-Type': 'application/json',
									'Authorization': uni.getStorageSync('token')
								},
								data: { description: JSON.stringify(this.order) },
								success: resolve,
								fail: reject
							})
						})
						switch (code) {
							case '00000':
								wx.showToast({ title: '支付成功' })
								this.first = false
								setTimeout(() => {
									uni.switchTab({ url: '/pages/index/index' })

								}, 2000)
								break
							default:
								throw new Error(data)
						}

					} catch (e) {
						//TODO handle the exception
						console.error(e)
					}
				} else {
					wx.showToast({
						title: '已支付',
						icon: 'none'
					})
				}
			}
		},
		onLoad({ paramsStr }) {
			this.order = JSON.parse(paramsStr)
		}
	}
</script>

<style>
	.container {
		width: 100vw;
		min-height: 100vh;
		background: #f5f5f5;
		color: #666;
		overflow: auto;
	}

	.section {
		margin: 20rpx 0;
		background: #fff;
		border: 1px solid #eee;
	}

	.section .box {
		padding: 30rpx 30rpx 30rpx 0;
		margin-left: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		font-size: 30rpx;
	}

	.section .snack-img image {
		width: 320upx;
		height: 320upx;
		border-radius: 5px;
		margin-left: 30rpx;
		margin-top: 10upx;
	}

	.snack-name,
	.snack-content {
		margin-left: 30rpx;
	}

	.snack-name {
		font-size: 33upx;
	}

	.snack-content {
		font-size: 27upx;
		color: #e54847
	}

	.snack-box .snack {
		width: 70%;
	}

	.section .amount-box {
		height: 102rpx;
		line-height: 102rpx;
		padding: 0 30rpx 0 0;
	}

	.section .amount-box,
	.section .total {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stepper {
		display: flex;
		border: 1px solid #ddd8ce;
		height: 60rpx;
	}

	.stepper view {
		width: 60rpx;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		font-size: 50rpx;
	}

	.stepper view.num {
		border-right: 1px solid #ddd8ce;
		border-left: 1px solid #ddd8ce;
		font-size: 30rpx;
		padding: 0 10rpx;
	}

	.phone {
		padding: 30rpx;
		font-size: 30rpx;
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

	.red {
		color: #f03d37;
	}
</style>