<template>
	<div>
		<view class='container order-list-page'>
			<view v-for='(item, index) in orderList' :key='index' class='order-item'>
				<div class='order-title line-ellipsis' @click="navToDetail(item.description.cinemaId)">
					<view>{{item.description.cinemaName}}</view>
					<view class='triangle'></view>
				</div>
				<view class='order-info' data-order='{{item}}'>
					<image :src='item.description.deal.imageUrl'></image>
					<view class='order-desc'>
						<view class='delete-box' catchtap='deleteOrder' data-index='{{index}}'>
							<view class='iconfont icon-del delete'></view>
						</view>
						<view class='snack-name line-ellipsis'>{{item.description.deal.title}}</view>
						<view class='amount line-ellipsis'>数量：{{item.description.amount}}</view>
					</view>
				</view>
				<view class='order-more'>
					<view>总价：{{(item.description.deal.price *item.description.amount * 1.0).toFixed(2)}}元</view>
					<view class='status'>已完成</view>
				</view>
			</view>
			<view v-if='!orderList.length'>
				暂无小吃订单
			</view>
		</view>
	</div>
</template>
<script>
	import { myRequest } from '../../api/uniRequest.js'
	export default {
		data() {
			return { orderList: [] }
		},
		onShow() {

		},

		onLoad() {
			this.getSnackOrder()
		},
		computed: {},
		methods: {
			async getSnackOrder() {
				let data = await myRequest('/food/ordered', 'GET')
				console.log('数据在这里', data)
				for (const order of data) {
					order.description = JSON.parse(order.description)
					this.orderList.push(order)
				}

				console.log('订单在这里', this.orderList)
			},
			//删除订单
			deleteOrder(e) {
				const index = e.currentTarget.dataset.index
				let orderList = this.data.orderList.slice()
				orderList.splice(index, 1)
				uni.showModal({
					title: '提示',
					content: '确认删除订单吗？',
					success: res => {
						if (res.confirm) {
							this.setData({ orderList })
							uni.setStorageSync('snackOrder', orderList)
						}
					}
				})
			},
			navToDetail(cinemaId) {
				uni.navigateTo({ url: `/pages/goods-show/goods-show?cinemaId=${cinemaId}` })

			}
		},
	}
</script>
<style lang="less" scoped>
	.container.order-list-page {
		width: 100vw;
		min-height: 100vh;
		background: #f0f0f0;
		padding-bottom: 50rpx;
		box-sizing: border-box;
	}

	.order-list-page .order-item {
		background-color: #fff;
		margin-bottom: 20rpx;
	}

	.order-list-page .order-title {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx 20rpx 0;
		margin-left: 30rpx;
		color: #666;
		font-size: 28rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.order-list-page .triangle {
		width: 16rpx;
		height: 16rpx;
		border-left: 1px solid #999;
		border-top: 1px solid #999;
		margin-left: 5rpx;
		transform: rotate(135deg) scale(0.8);
	}

	.order-list-page .order-info {
		position: relative;
		display: flex;
		padding: 20rpx 30rpx 20rpx 0;
		margin-left: 30rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.order-list-page .order-info image {
		width: 114rpx;
		height: 114rpx;
	}

	.order-list-page .order-desc {
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
		justify-content: space-around;
		margin-left: 24rpx;
		padding: 20rpx 0;
		font-size: 24rpx;
		color: #999;
	}

	/* showTime不继承order-desc？ */

	.order-list-page .showTime,
	.position {
		/* 不继承上面的font-size，所以重新写 */
		font-size: 24rpx;
	}

	.order-list-page .order-desc .delete-box {
		/* 多写一个box的原因是增大点击面积 */
		position: absolute;
		padding: 30rpx;
		top: 0;
		right: 0;
	}

	.order-list-page .delete-box .delete {
		font-size: 30rpx;
		color: #999;
	}

	.order-list-page .snack-name {
		font-size: 30rpx;
		width: 80%;
		color: #333;
	}

	.order-list-page .order-more {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #999;
	}
</style>