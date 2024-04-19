<template>
	<view class="page">
		<view class="search-block">
			<view class="search-block-ico">
			</view>
			<input type="text" v-model="searchValue" placeholder="搜索电影" class="search-text" @input="searchMovie" />
		</view>
		<view class="search-list page-block">
			<view class="search-list-item" v-for="(item, index) in searchList" :key="index" @click="goDetail(item.id)">
				<view class="list-item-img">
					<image :src="item?.img" class="item-img"></image>
				</view>
				<view class="list-item-info">
					<view class="item-info-title">
						{{ item?.nm }}
					</view>
					<view class="item-info-detail">
						<view class="item-info-title-english" v-show="item.enm == undefined || item.enm == '' ? false : true">
							{{ item?.enm }}
						</view>
						<view class="item-info-type">
							{{ item?.cat }}
						</view>
						<view class="item-info-time">
							{{ item?.pubDesc }}
						</view>
					</view>
				</view>
				<view class="item-info-score" v-show="item.sc > 0 ? true : false">
					<view>{{ item?.sc }}分</view>
				</view>
				<view v-show="!item.sc">
					<view>暂无评分</view>
				</view>
			</view>

			<div class='cinema-section' @click="navToCinemaDetail(cinema)" hover-class="none"
				v-for="(cinema, index) in cinemas" :key="index">
				<view class='name-price line-ellipsis'>{{ cinema.nm }}
					<text class='sell-price' v-if='cinema?.sellPrice'><text class='price'>{{ cinema.sellPrice }}</text> 元起</text>
				</view>
				<view class='address'>
					<text class='line-ellipsis'>{{ cinema?.addr }}</text>
					<text class='distance'>{{ cinema?.distance }}</text>
				</view>
				<view class='feature-tags'>
					<text v-show='cinema?.endorse || cinema?.tag?.endorse'>退</text>
					<text v-show='cinema?.allowRefund || cinema?.tag?.allowRefund'>改签</text>
					<text v-for='item in cinema?.hallType || cinema?.tag?.hallType' :key='item'>{{ item }}</text>
					<text class='featrue' v-if='cinema?.snack || cinema?.tag?.snack'>小吃</text>
					<!-- 	<text class='featrue'
						v-show='cinema?.vipDesc || cinema.tag?.vipTag'>{{ cinema?.vipDesc || cinema?.tag?.vipTag }}</text> -->
				</view>
				<view v-show='cinema?.promotion?.cardPromotionTag'>
					<text class='card'></text>
					<text class='discount-label-text'>{{ cinema?.promotion?.cardPromotionTag }}</text>
				</view>
				<view v-show='cinema?.showTimes' class='showTimes'>近期场次：{{ cinema?.showTimes }}</view>
			</div>

			<view class="search-all" v-show="allmovies > 0 ? true : false" @click="searchAll()">
				查看全部{{ allmovies }}部影视剧
			</view>
		</view>

	</view>
</template>

<script>
	import debounce from 'lodash.debounce';
	// //防抖函数，防止短时间提交多次
	// function debounce(func, wait = 500) { //可以放入项目中的公共方法中进行调用
	// 	let timeout
	// 	return function(event) {
	// 		clearTimeout(timeout)
	// 		timeout = setTimeout(() => {
	// 			func.call(this, event)
	// 		}, wait)
	// 	}
	// }

	export default {
		data() {
			return {
				searchValue: '', //查询关键字
				searchList: [], //查询结果
				page: 1, //当前页数
				allmovies: 0, //总数量	
				allmovieslist: '',
				cinemas: []
			}
		},
		onReachBottom() { //页面触底事件
			var me = this
			var page = me.page + 10
			var sValue = me.searchValue
			var allmovieslist = me.allmovieslist
			uni.showLoading({
				mask: true,
				title: '加载中...'
			})
			if (page <= allmovieslist) {
				me.searchByFY(sValue, page, 10)
			} else {
				uni.hideLoading()
			}
		},
		methods: {
			navToCinemaDetail(cinema) {

				uni.navigateTo({
					url: `/pages/goods-show/goods-show?cinemaId=${cinema.id}&movieId=${cinema.movieId}&day=${cinema.day}`
				})
			},
			//模糊查询
			async searchMovie() {
				if (this.searchValue === '') {
					this.searchList = []
					this.cinemas = []
				}
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				let { data } = await new Promise((resolve, reject) => {
					uni.request({
						url: `https://m.maoyan.com/ajax/search?kw=${this.searchValue}&cityId=${uni.getStorageSync('cityId')}&stype=-1`,
						method: 'GET',
						success: resolve,
						fail: reject
					})
				})
				this.searchList = data?.movies?.list
				this.cinemas = data?.cinemas?.list
				console.log("@@@@@@@@", this.searchList)
				console.log("@@@@@@@@", this.cinemas)
				// this.searchWhere()
				uni.hideLoading()
			},

			searchWhere() {
				uni.request({
					url: 'https://m.maoyan.com/ajax/search?kw=' + this.searchValue + '&cityId=59&stype=-1',
					method: 'GET',
					success: res => {
						//判断是否有 有效数据
						if (res.statusCode != 200 || res.data.movies == undefined || res.data.movies.length < 0) {
							this.searchList = []
							this.allmovies = 0
							uni.hideLoading()
							this.inputdis = false
							return
						}
						this.searchList = res.data.movies.list
						// console.log(this.searchList);
						for (let i = 0; i < this.searchList.length; i++) {
							this.searchList[i].img = this.searchList[i].img.replace('w.h/', '')
						}
						this.allmovies = res.data.movies.total
						this.allmovieslist = res.data.movies.total
					},
					complete: () => {
						this.inputdis = false
						uni.hideLoading()
					}
				})
			},

			//分页模糊查询
			searchByFY(value, page, limit) {
				var me = this
				uni.request({
					url: 'https://m.maoyan.com/searchlist/movies?keyword=' + value + '&ci=59&offset=' + page + '&limit=' +
						limit,
					method: 'GET',
					success: res => {
						//判断是否有 有效数据
						if (res.statusCode != 200 || res.data.movies == undefined || res.data.movies.length < 0) {
							me.searchList = []
							uni.hideLoading()
							this.inputdis = false
							return
						}
						var templist = res.data.movies
						for (let i = 0; i < templist.length; i++) {
							templist[i].img = templist[i].img.replace('w.h/', '')
						}

						me.searchList = me.searchList.concat(templist)
						me.page = page

					},
					complete: () => {
						this.inputdis = false
						uni.hideLoading()
					}
				})
			},
			//查询全部
			searchAll() {
				this.searchList = []
				this.allmovies = 0
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				//去掉总数
				this.searchByFY(this.searchValue, 1, 10)
			},

			//跳转详情页
			goDetail(movieid) {
				uni.navigateTo({ url: '/pages/film-detail/film-detail?movieid=' + movieid })
			}

		}
	}
</script>

<style>
	/* 搜索框 Begin*/
	.search-ico {
		width: 30upx;
		height: 30upx;
	}

	.search-text {
		font-size: 14px;
		background-color: #F1F1F1;
		height: 60upx;
		width: 650upx;
	}

	.search-block {
		display: flex;
		flex-direction: row;
		padding: 0upx 20upx 20upx 20upx;
	}

	.search-block-ico {
		background-color: #F1F1F1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0upx 10upx;
	}

	/* 搜索框 End */

	/* 搜索内容展示 Begin*/

	.search-list-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 30upx 30upx;
		border-bottom: 1px solid #C0C0C0;

	}

	.item-img {
		width: 128upx;
		height: 180upx;
	}

	.list-item-info {
		flex: 1;
		padding-left: 15upx;
		display: flex;
		flex-direction: column;
	}

	.item-info-title {
		font-size: 18px;
		font-weight: bold;
	}

	.item-info-detail {
		color: #666;
		font-size: 14px;
		line-height: 22px;
	}

	.item-info-score {
		color: #fa0;
	}

	.item-info-title-3d {
		width: 40upx;
		height: 40upx;
	}

	.search-all {
		color: #ef4238;
		font-size: 15px;
		text-align: center;
		height: 44px;
		line-height: 44px;
	}

	/* 搜索内容展示 End */
	.cinema-section {
		padding: 30rpx 0;
		margin: 0 30rpx;
		border-bottom: 1px solid #f0f0f0;
		line-height: 1.8em;
	}

	.name-price {
		font-size: 32rpx;
		color: #333;
	}

	.sell-price {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		margin-left: 20rpx;
	}

	.price {
		font-size: 34rpx;
		color: #ef4238;
	}

	.address {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		color: #666;
	}

	.distance {
		margin-left: 10rpx;
	}

	.feature-tags {
		width: 80%;
	}

	.feature-tags text {
		display: inline-block;
		border: 1px solid #589daf;
		color: #589daf;
		padding: 0 6rpx;
		height: 30rpx;
		line-height: 30rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		margin-right: 8rpx;
	}

	.feature-tags .featrue {
		color: #f90;
		border-color: #f90;
	}

	.card {
		position: relative;
		top: 6rpx;
		display: inline-block;
		width: 30rpx;
		height: 28rpx;
		margin-right: 6rpx;
		z-index: -1;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAYAAABNChwpAAAAAXNSR0IArs4c6QAAAgFJREFUSA3Nlz1LA0EQhmf3kouFEQwi+FEYQ+xEsImFoCDoL/CLaKd/QbC0sbCzFVuxsRS1jEVAsUqrIILRQAhaBGKMuawzwpGAm83mNhddCHfZnd3n3Z2ZuxsG2JI3YtQpVw6AiTkhYJj6/GqMwSsIdm312DsnMyzLCF79rGRAiIhfUOm6jL0FQvZU4Gfn0GU4KcINE5vjsc9LFXajE9kcfT7UDZaMQWwuG9Dpi/YyiIWZjqnSxrOAtWgANsYDysV1Bj0L0Flcx8ZoC1F0wf50UMo5fqjCY1FIxxo7jQSUHWgK+ag2YprfGwnIlQTQTk3a/46B2UEOIUu+v0gIIMgZLLTIZHJTOl+TL4K9ShckMc36Q+pc356QB6FLLJQFCqi4f39d2WoKLTy03ckg2OjAvcyXh9n1KX8eA0YC4n0MtuLoJru+o3bvjAS8o2vpfXCYsGEzZkFYHQ5SbcoglM5o6KQAoxhIDHBYiVqYERZcZB04f3aghNGv04wEuIDbQg3u8Lc4YsHymAVLeD17cuDypbWKjgggIZTpVwhM5x1YxzdlpaaXXB0T4J5GEbPy6F7/8WwUhC7U5OpZgIPfU5qnrNTn+UmoXLWNQc8n0AZDacqxUskpLXwcJDbHMinlI0O9NLI51WiAZZLa0odRZBKbU4FINRoDdtoNdxCDWMQk9jePWpE8hVOLbwAAAABJRU5ErkJggg==');
	}

	.discount-label-text {
		font-size: 22rpx;
		color: #999;
	}

	.showTimes {
		font-size: 24rpx;
		color: #999;
	}
</style>