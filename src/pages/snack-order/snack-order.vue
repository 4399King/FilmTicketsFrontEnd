<template>
	<view>
		<view class="container" v-if="order">
			<view class="section">
				<view class="snack-box box">
					<view class="snack line-ellipsis">{{ order.title }}</view>
					<view>{{ order.price }}元</view>
				</view>
				<view class="amount-box box">
					<view>数量：</view>
					<view class="stepper">
						<view :class="[order.amount > 1 ? 'red' : '']" @click="minus">-</view>
						<view class="num">{{ order.amount }}</view>
						<view class="red" @click="plus">+</view>
					</view>
				</view>
				<view class="total box">
					<view>总价：</view>
					<view class="red">{{ order.total }}元</view>
				</view>
			</view>
			<view class="phone section"> 手机号 </view>
			<view class="payment-btn" @click="payment">提交订单</view>
		</view>
	</view>
</template>

<script scoped>
	export default {
		data() {
			return {
				order: null,
				first: true //是否是第一次支付
			}
		},
		methods: {
			initData(order) {
				this.order = oreder
			},
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
			payment() {
				//避免重复支付
				if (this.first) {
					let snackOrder = wx.getStorageSync('snackOrder') || []
					snackOrder.unshift(this.order)
					wx.setStorageSync('snackOrder', snackOrder)
					wx.showToast({ title: '支付成功' })
					this.first = false
				} else {
					wx.showToast({
						title: '已支付',
						icon: 'none'
					})
				}
			}
		},
		onLoad(opt) {
			const paramsObj = JSON.parse(opt.paramsStr)
			this.initData(paramsObj)
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 30rpx 30rpx 0;
		margin-left: 30rpx;
		border-bottom: 1px solid #f0f0f0;
		font-size: 30rpx;
	}

	.snack-box .snack {
		width: 70%;
	}

	.section .amount-box {
		height: 102rpx;
		line-height: 102rpx;
		padding: 0 30rpx 0 0;
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