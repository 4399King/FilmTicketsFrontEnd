<template>
	<div id="select-seat">
		<!-- 		<div class="top">
			<span class="icon-back" @click="$router.go(-1)"></span>
			<span class="name ellipsis">{{ cinemaInfo.cinema_name }}</span>
		</div>
		<div class="movie-info">
			<div class="name">{{ movieInfo.name }}</div>
			<div class="intro">
				<span class="date">{{ scheduleInfo.show_date | dateFilter }}</span><span
					class="time">{{ scheduleInfo.show_time }}</span><span class="language">{{ movieInfo.language }}3D</span>
			</div>
		</div> -->
		<div class="seat-block">
			<div class="screen">{{ scheduleInfo.hall_name }}银 幕</div>
			<div class="center">银幕中央</div>
			<div class="screen-line"></div>
			<div class="row-container">
				<span>1</span>
				<span>2</span>
				<span>3</span>
				<span>4</span>
				<span>5</span>
			</div>
			<div class="seat-container">
				<div class="row" v-show="hackReset" v-for="(itemI, indexI) in seatIJ" :key="indexI">
					<span class="seat icon-empty-seat" v-for="(itemJ, indexJ) in itemI" :key="indexJ" :class="{
				'icon-sold-seat': itemJ === 1,
				'icon-selected-seat': itemJ === 2
			}" @click.prevent="handleSelectSeat(indexI, indexJ)"></span>
				</div>
			</div>

		</div>

		<div class="bottom">
			<div class="seat-example">
				<div class="example empty-example">
					<span class="icon icon-empty-seat"></span>可选
				</div>
				<div class="example sold-example">
					<span class="icon icon-sold-seat"></span>不可选
				</div>
				<div class="example selected-example">
					<span class="icon icon-selected-seat"></span>已选
				</div>
			</div>
			<div class="title" v-if="selectedSeat">已选座位</div>
			<div class="selected-seat" v-if="selectedSeat">
				<div class="seat-item" v-for="(item, index) in selectedSeatInfo" :key="index">
					<div class="left">
						<span class="seat">{{ item[0] + 1 }}排{{ item[1] + 1 }}座</span>
						<span class="price">{{ scheduleInfo?.price?.toFixed(2) || 65 }}元</span>
					</div>
					<span class="right icon-close" @click="cancelSelectedSeat(item[0], item[1])"></span>
				</div>
			</div>
			<span class="btn" v-if="!selectedSeat">请先选座</span>
			<span class="btn active" v-else @click="ensureSeatBtn">确认选座</span>
		</div>
	</div>
</template>

<script>
import {
	getMovieDetail,
	getCurrentCinemaDetail,
	getScheduleById,
	updateScheduleSeat
} from '../../api/index'
export default {
	name: 'SelectSeat',
	data() {
		return {
			allInfo: {},
			cinemaInfo: {},
			movieInfo: {},
			scheduleInfo: {},
			seatInfo: '',
			seatCount: 0,
			cinemaId: 0,
			movieId: 0,
			scheduleId: 0,
			selectedSeat: false,
			hackReset: true,
			selectedSeatInfo: [],
			seatIJ: [
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			]
		}
	},
	created() {
		// Indicator.open('Loading...')

	},
	onLoad({ paramsStr, movieId, cinemaId, scheduleId }) {
		this.allInfo = JSON.parse(paramsStr)
		this.cinemaId = cinemaId - 0
		this.movieId = movieId - 0
		this.scheduleId = scheduleId - 0
		console.log('弱小但不是软糯')
		// this.loadInfo(query)
	},
	methods: {
		//加载信息
		// async loadInfo(query) {

		// 	const { cinemaId, movieId, scheduleId } = query
		// 	console.log('!!!!!!!!!!!', query)
		// 	return
		// 	if (
		// 		cinemaId &&
		// 		movieId &&
		// 		scheduleId
		// 	) {
		// 		let json = await getCurrentCinemaDetail(cinemaId)
		// 		if (json.success_code === 200) {
		// 			this.cinemaInfo = json.data
		// 		}
		// 		json = await getMovieDetail(movieId)
		// 		if (json.success_code === 200) {
		// 			this.movieInfo = json.data[0]
		// 		}
		// 		json = await getScheduleById(scheduleId)
		// 		if (json.success_code === 200) {
		// 			this.scheduleInfo = json.data
		// 			this.seatInfo = this.scheduleInfo.seat_info
		// 			if (this.seatInfo) {
		// 				this.seatInfo = JSON.parse(this.seatInfo)
		// 				this.seatInfo.forEach(value => {
		// 					if (value % 10 !== 0) {
		// 						this.seatIJ[parseInt(value / 10)][(value % 10) - 1] = 1
		// 					} else {
		// 						this.seatIJ[parseInt(value / 10) - 1][9] = 1
		// 					}
		// 				})
		// 			}
		// 		}
		// 	}
		// 	Indicator.close()
		// },
		// 选择座位

		getSeatInfo(){},
		handleSelectSeat(indexI, indexJ) {
			if (this.seatCount === 4 && this.seatIJ[indexI][indexJ] === 0) {
				MessageBox.alert('一次最多选择4个座位哦！')
			} else {
				if (this.seatIJ[indexI][indexJ] === 0) {
					this.seatIJ[indexI][indexJ] = 2
					this.selectedSeatInfo.push([indexI, indexJ])
					this.seatCount += 1
					if (!this.selectedSeat) {
						this.selectedSeat = true
					}
				} else if (this.seatIJ[indexI][indexJ] === 2) {
					this.seatIJ[indexI][indexJ] = 0
					this.seatCount -= 1
					let currentIndex
					this.selectedSeatInfo.forEach((value, index) => {
						if (indexI === value[0] && indexJ === value[1]) {
							currentIndex = index
						}
					})
					this.selectedSeatInfo.splice(currentIndex, 1)
					if (this.seatCount === 0) {
						this.selectedSeat = false
					}
				}
				// this.hackReset = false
				// this.$nextTick(() => {
				// 	this.hackReset = true
				// })
			}
		},
		//取消选座
		cancelSelectedSeat(indexI, indexJ) {
			this.seatIJ[indexI][indexJ] = 0
			this.seatCount -= 1
			let currentIndex
			this.selectedSeatInfo.forEach((value, index) => {
				if (indexI === value[0] && indexJ === value[1]) {
					currentIndex = index
				}
			})
			this.selectedSeatInfo.splice(currentIndex, 1)
			if (this.seatCount === 0) {
				this.selectedSeat = false
			}
		},
		//确认选座
		ensureSeatBtn() {			
			const orders = {
				movieId:this.movieId,
				cinemaId:this.cinemaId,
				scheduleId: this.scheduleId,
				selectedSeatInfo:this.selectedSeatInfo,
				allInfo:this.allInfo
			}
			uni.navigateTo({ url: `/pages/ticket-order/ticket-order?orders=${JSON.stringify(orders)}` })
			


			// uni.navigateTo({ url: '/pages/ticket-order/ticket-order' })
			// return



			// if (this.$cookies.get('user_id')) {
			// 	if (!this.seatInfo) {
			// 		this.seatInfo = []
			// 	}
			// 	this.selectedSeatInfo.forEach((value, index) => {
			// 		this.seatInfo.push(value[0] * 10 + value[1] + 1)
			// 		this.$cookies.set('seat_' + (index + 1), value[0] * 10 + value[1] + 1)
			// 	})
			// 	this.$cookies.set('seat_count', this.selectedSeatInfo.length)
			// 	this.seatInfo = JSON.stringify(this.seatInfo)
			// 	let json = await updateScheduleSeat(
			// 		scheduleId,
			// 		this.seatInfo
			// 	)
			// 	if (json.success_code === 200) {
			// 		Toast({
			// 			message: '锁定座位成功',
			// 			position: 'middle',
			// 			duration: 2000
			// 		})
			// 		this.$router.push({
			// 			path: '/submit_order',
			// 			query: {
			// 				cinemaId,
			// 				movieId,
			// 				scheduleId,
			// 			}
			// 		})
			// 	}
			// } else {
			// 	this.$router.push('./login')
			// }
		}
	},
	filters: {
		dateFilter(props) {
			props = props + ''
			return (
				props.split('-')[0] +
				'年' +
				props.split('-')[1] +
				'月' +
				props.split('-')[2] +
				'日'
			)
		}
	}
}
</script>

<style scoped lang="less">
#select-seat {
	width: 100%;
	color: #000;
	font-size: 12rpx;

	.top {
		width: 100%;
		height: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #dd2727;
		color: #fff;

		.icon-back {
			font-size: 12rpx;
			position: absolute;
			left: 20rpx;
		}

		.name {
			width: 60%;
			text-align: center;
			font-size: 12rpx;
		}
	}

	.movie-info {
		margin-top: 1rpx;
		display: flex;
		flex-flow: column;
		padding: 20rpx;

		.name {
			margin-bottom: 20rpx;
			font-size: 12rpx;
			font-weight: 700;
		}

		.intro {
			font-size: 12rpx;
			margin-bottom: 20rpx;
			color: #888;

			span {
				margin-right: 0.12rpx;
			}
		}
	}

	.seat-block {
		height: 100vh;
		width: 100%;
		background: #f1f1f1;
		position: relative;
		left: 0;
		top: 0;
		bottom: 0;

		.screen {
			width: 367rpx;
			margin: 0 auto;
			text-align: center;
			background: #dcdcdc;
			font-size: 28rpx;
			padding: 5rpx 0;
			border-bottom-left-radius: 50px;
			border-bottom-right-radius: 50px;
			position: relative;
			left: 20rpx;
		}

		.center {
			font-size: 20rpx;
			width: 120rpx;
			position: absolute;
			text-align: center;
			padding: 20rpx 20rpx;
			top: 80rpx;
			left: 50%;
			transform: translate(-50%);
			letter-spacing: 8rpx;
			background-color: #fff;
			color: #888;
			border-radius: 5rpx;
			margin-left: 20rpx;
		}

		.screen-line {
			width: 0;
			height: 69%;
			border-left: 2px dashed #dcdcdc;
			position: absolute;
			transform: translate(-50%);
			top: 150rpx;
			left: 50%;
			margin-left: 20rpx;
		}

		.row-container {
			box-sizing: border-box;
			position: absolute;
			top: 205rpx;
			left: 20rpx;
			width: 30rpx;
			height: 411rpx;
			background-color: rgba(168, 168, 168, 0.8);
			display: flex;
			flex-flow: column;
			text-align: center;
			justify-content: space-between;
			align-items: center;
			color: #fff;
			border-radius: 15rpx;
			font-size: 26rpx;
			// padding: 50rpx 0 50rpx 0;
		}
	}

	.seat-container {
		padding: 20rpx 0;
		position: absolute;
		top: 177rpx;
		left: 55rpx;

		.row {
			margin-bottom: 50rpx;

			.seat {
				font-size: 47rpx;
				margin-left: 20rpx;
			}
		}
	}


}

.bottom {

	position: fixed;
	width: 100%;
	left: 0;
	bottom: 0;
	background: #fff;
	z-index: 999;
	display: flex;
	flex-flow: column;
	padding: 50rpx 20rpx 30rpx 20rpx;

	box-sizing: border-box;

	.seat-example {
		position: absolute;
		// top: 50rpx;
		bottom: 396rpx;
		width: 80%;
		margin-left: 50%;
		transform: translateX(-50%);
		display: flex;
		justify-content: center;
		align-items: center;

		.example {
			font-size: 25rpx;
			margin-right: 50rpx;
			color: #888;

			display: flex;
			justify-content: center;
			align-items: center;

			.icon {
				font-size: 39rpx;
				margin-right: 20rpx;
			}
		}
	}

	.title {
		font-size: 20rpx;
		font-weight: 700;
		margin-bottom: 50rpx;
	}

	.btn {
		height: 60rpx;
		line-height: 60rpx;
		background-color: #f7dbb3;
		color: #fff;
		text-align: center;
		border-radius: 5rpx;
		font-size: 20rpx;

		&.active {
			background-color: #fe9900;
		}
	}

	.selected-seat {
		height: 140rpx;
		display: flex;

		.seat-item {
			width: 25%;
			height: 90rpx;
			display: flex;
			box-sizing: border-box;
			justify-content: space-around;
			align-items: center;
			border: 5rpx solid #f1f1f1;
			margin-right: 50rpx;

			&:last-child {
				margin-right: 0;
			}

			.left {
				display: flex;
				flex-flow: column;
				font-size: 20rpx;

				.seat {
					font-size: 20rpx;
					color: #666;
					margin-bottom: 3rpx;
				}

				.price {
					color: #dd2727;
					font-size: 20rpx;
				}
			}

			.right {
				font-size: 20rpx;
			}
		}
	}
}
</style>