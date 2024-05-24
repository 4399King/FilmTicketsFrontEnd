<template>
	<div class="snack-order-list">

		<view class='container order-list-page'>
			<view v-for='(item, index) in orderList' :key='index' class='order-item'>
				<div class='order-title line-ellipsis' @click="navToDetail(item.cinema,item.film)" hover-class='none'>
					<view>{{ item.description.cinemaName }}</view>
					<view class='triangle'></view>
				</div>
				<view class='order-info' @click="goTo(item)">
					<image :src='item?.img'></image>
					<view class='order-desc'>
						<view class='delete-box' catchtap='deleteOrder' data-index='{{index}}'>
							<view class='iconfont icon-del delete'></view>
						</view>
						<view class='movie-name line-ellipsis'>{{ item.description.movieName }} 1张</view>
						<view class='showTime line-ellipsis'>{{ item.description.time }}</view>
						<view class='position line-ellipsis'>{{ item.description.hall }}
							{{ `${Math.floor(item.seat/10)}排${item.seat%10?item.seat%10: 10}座`  }}
						</view>
					</view>
					<button class="cancel-ticket" @click.prevent="cancelTicket(item)">退票</button>
				</view>
				<view class='order-more'>
					<view>总价：{{ item.description.price }}元</view>
					<view class='status' v-if='item.time <= curTime'>已完成</view>
					<view class='status' v-else>未完成</view>
				</view>
			</view>
			<view v-if='!orderList.length'>
				暂无电影订单
			</view>
		</view>
	</div>
</template>

<script>
	import { myRequest } from '../../api/uniRequest.js'
	export default {
		name: 'film-order-list',
		props: {},
		data() {
			return {
				orderList: [],
				curTime: ''
			}
		},
		onLoad() {
			this.curTime = new Date()
			this.getFilmOrder()

		},
		computed: {},
		methods: {
			async cancelTicket(item) {
				if (item.time <= this.curTime) {
					uni.showModal({
						title: '提示',
						content: '已过期的影票无法退款哦',
					})
					return
				}
				try {
					await myRequest('/ticket/refund', 'POST', { ticketId: item.id })
					uni.showToast({
						title: '退票成功',
						duration: 1000
					})
					this.curTime = new Date()
					this.getFilmOrder()

				} catch (e) {
					console.error(e)
				}

			},
			async getFilmOrder() {
				let data = await myRequest('/ticket/ordered', 'GET')
				console.log(data)
				this.orderList = []
				for (const order of data) {
					order.description = JSON.parse(order.description)
					order.time = new Date(order.description.time)
					this.orderList.push(order)
				}
				this.getFilmImg()
				console.log(this.orderList)
			},
			async getFilmImg() {
				for (const order of this.orderList) {
					let { data: { detailMovie: { img } = {} } } = await new Promise((resolve, reject) => {
						console.log('order', order)
						uni.request({
							url: `https://m.maoyan.com/ajax/detailmovie?movieId=${order.film}`,
							method: 'GET',
							success: resolve,
							fail: reject
						})
					})
					if (img) {
						this.$set(order, 'img', img)
						console.log('here is answer', img)
					}



				}


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
							this.orderList = orderList
							uni.setStorageSync('movieOrder', orderList)
						}
					}
				})
			},
			//跳转到订单详情页面
			goTo(order) {
				uni.setStorageSync('order', order)
				uni.navigateTo({ url: '/pages/film-order-detail/film-order-detail' })
			},
			navToDetail(cinemaId, movieId) {

				uni.navigateTo({ url: `/pages/goods-show/goods-show?cinemaId=${cinemaId}&movieId=${movieId}` })
				// url = '../cinema-detail/cinema-detail?cinemaId={{item.cinemaId}}'
			}
		},
		watch: {},

		// 组件周期函数--监听组件挂载完毕
		mounted() {},
		// 组件周期函数--监听组件数据更新之前
		beforeUpdate() {},
		// 组件周期函数--监听组件数据更新之后
		updated() {},
		// 组件周期函数--监听组件激活(显示)
		activated() {},
		// 组件周期函数--监听组件停用(隐藏)
		deactivated() {},
		// 组件周期函数--监听组件销毁之前
		beforeDestroy() {},
	}
</script>

<style lang="less" scoped>
	.cancel-ticket {
		position: absolute;
		bottom: 30upx;
		right: 20upx;
		width: 110upx;
		height: 50upx;
		line-height: 50upx;
		font-size: 20upx;
	}

	.cancel-ticket-box {
		position: relative
	}

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
		height: 160rpx;
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

	.order-list-page .movie-name {
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