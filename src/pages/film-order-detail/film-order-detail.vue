<template>
	<div class="film-order-detail">
		<view class='container'>
			<view class='ticket-content'>
				<div class='cinema' url='../cinema-detail/cinema-detail?cinemaId={{order.description.cinemaId}}'
					hover-class='none'>
					<view>{{ order.description.cinemaName }}</view>
					<view class='triangle'></view>
				</div>
				<view class='movie-info'>
					<view class='movie-name line-ellipsis'>{{ order.description.movieName }}</view>
					<view class='showTime line-ellipsis'>{{ order.description.time }} {{ order.description.lang }}</view>
					<view class='position line-ellipsis'>{{ order.description.hall }} {{ order.description.seat }}</view>
				</view>
				<view class='divider-box'>
					<view class='divider'></view>
					<image class='status' v-if='order.time  <= curTime' src='../../static/image/user/status.png'></image>
				</view>
				<view class='code-container'>
					<view class='code-box'>
						<view>流水号：{{ order.description.flowNumber }}</view>
						<!-- <view>验证码：{{ order.Vcode }}</view> -->
					</view>
					<view :class="['rq', order.time <= curTime?'rq-used':'']">
						<image src='../../static/image/user/qr.png'></image>
					</view>
				</view>
			</view>
			<view class='price-box box'>
				<view>订单号：{{ order.description.orderId }}</view>
				<view>总价：{{ order.description.price }}元</view>
			</view>
			<view class='map-box'>
				<!-- <template is="cinemaMap" :data='{ cinemaData: order.cinemaData }' /> -->
			</view>
			<view class='maoyan box'>
				<view>客服电话</view>
				<view class='phone-box'>
					<view>工作时间： 9:00-24:00</view>
					<view class='phone'>1010-5335</view>
				</view>
			</view>
		</view>
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				order: {
					curTime: '',
					'id': 1,
					'userId': 3803510,
					'cinema': 39589,
					'film': 1370725,
					'sessionId': 12,
					'seat': 40,
					'description': {
						'cinemaName': '中影德金影城（新安店）',
						'cinemaId': '39589',
						'hall': '6号厅',
						'movieName': '草木人间',
						'lang': '国语2D',
						'time': '2024-04-16 21:05',
						'price': 46,
						'seat': '14排01座',
						'Vcode': 846205,
						'flowNumber': 345053973,
						'orderId': 8147969387,
						'cinemaData': { 'nm': '中影德金影城（新安店）', 'addr': '宝安区新安街道建安一路80号香槟广场四楼403', 'shopId': 1503442725, 'lat': 22.56186, 'lng': 113.90757, 'cinemaId': 39589, 'sell': true, 'callboardInfo': { 'desc': '', 'url': '' } }
					},
					'img': 'https://p0.pipi.cn/mmdb/54ecde029abc69338f339e6bf4aa5fda9b4d8.jpg?imageMogr2/thumbnail/2500x2500%3E'
				}
			}
		},

		computed: {},
		methods: {},
		watch: {},
		created() {
			this.curTime = new Date()
			let order = uni.getStorageSync('order')
			order.time = new Date(order.description.time)
			this.order = order
			console.log('order', this.order)
		},
		// 页面周期函数--监听页面加载
		onLoad(opt) {



		},
		// 页面周期函数--监听页面初次渲染完成
		onReady() {},
		// 页面周期函数--监听页面显示(not-nvue)
		onShow() {},
		// 页面周期函数--监听页面隐藏
		onHide() {},
		// 页面周期函数--监听页面卸载
		onUnload() {},
		// 页面处理函数--监听用户下拉动作
		// onPullDownRefresh() { uni.stopPullDownRefresh(); },
		// 页面处理函数--监听用户上拉触底
		// onReachBottom() {},
		// 页面处理函数--监听页面滚动(not-nvue)
		// onPageScroll(event) {},
		// 页面处理函数--用户点击右上角分享
		// onShareAppMessage(options) {},
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		background: #f0f0f0;
		overflow: auto;
	}

	.ticket-content {
		margin: 24rpx;
		background: #fff;
		border-radius: 8rpx;
	}

	.cinema {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 76rpx;
		line-height: 76rpx;
		color: #666;
		padding: 0 30rpx;
		font-size: 28rpx;
		border-bottom: 1px solid #f0f0f0;
	}

	.triangle {
		width: 16rpx;
		height: 16rpx;
		border-left: 1px solid #999;
		border-top: 1px solid #999;
		margin-left: 5rpx;
		transform: rotate(135deg) scale(0.8);
	}

	.movie-info {
		padding: 0 30rpx;
	}

	.movie-info .movie-name {
		font-size: 36rpx;
		color: #333;
		margin: 20rpx 0;
	}

	.movie-info .showTime {
		font-size: 30rpx;
		color: #f03d37;
	}

	.movie-info .position {
		font-size: 30rpx;
		color: #666;
		margin: 10rpx 0 20rpx;
	}

	.divider-box {
		position: relative;
		border-bottom: 1px dashed #e6e6e6;
		margin: 40rpx 0;
	}

	.divider {
		position: absolute;
		top: -16rpx;
		height: 32rpx;
		line-height: 32rpx;
		text-align: center;
		left: 0;
		right: 0;
		font-size: 12px;
	}

	.divider::before {
		position: absolute;
		top: 50%;
		left: -20rpx;
		content: "";
		display: block;
		width: 40rpx;
		height: 40rpx;
		background: #f0f0f0;
		border-radius: 20rpx;
		margin-top: -20rpx;
	}

	.divider::after {
		position: absolute;
		top: 50%;
		right: -20rpx;
		content: "";
		display: block;
		width: 40rpx;
		height: 40rpx;
		background: #f0f0f0;
		border-radius: 20rpx;
		margin-top: -20rpx;
	}

	.divider-box .status {
		position: absolute;
		right: 26rpx;
		top: -56rpx;
		width: 112rpx;
		height: 112rpx;
	}

	.code-box {
		width: 18em;
		/* 	margin: 0 auto; */
		padding: 10rpx 20rpx;
		/* color: #b2b2b2; */
		font-size: 31rpx;
	}

	.rq {

		text-align: center;
	}

	.rq-used {
		opacity: 0.4;
	}

	.rq image {
		width: 500rpx;
		height: 500rpx;
		margin: 0 auto;
	}

	.box {
		padding: 30rpx;
		background: #fff;
		font-size: 30rpx;
		color: #333;
		line-height: 1.5;
		margin-bottom: 20rpx;
	}

	.phone-box {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #999;
	}

	.phone {
		color: #f03d37;
	}

	.map-box {
		margin-bottom: 20rpx;
	}
</style>