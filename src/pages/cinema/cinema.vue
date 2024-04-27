<template>
	<view class="container" :style="'position:' + (isShow ? 'fixed' : '')">
		<view class="topbar">
			<view class="city-entry" url="../../subPages/city-select/city-select">
				<text class="city-name">{{ city }}</text>
				<text class="city-entry-arrow"></text>
			</view>
			<input @click="navToSearch" class="search-input" placeholder="搜索影片/影院" />

		</view>
		<view class="nav-wrapper">
			<filterBar @toggleShow="toggleShow" @cinemaList="cinemaList" :params="params" :cityCinemaInfo="cityCinemaInfo">
			</filterBar>
		</view>
		<view class="cinema-list">
			<cinemaListItem :cinemas="cinemas" :movieId="params.movieId" :day='params.day' :movie='movie'></cinemaListItem>
		</view>
		<view v-if="!loadComplete && cinemas.length">
			<!-- <template is="loadingMore" /> -->
		</view>
		<view :hidden="!nothing">
			<!-- <template is="nothing" data='{{message:"暂无符合条件的影院"}}' /> -->
		</view>
	</view>
</template>


<script>
	import { getToday } from '../../utils/util'
	import filterBar from '../../components/filter-bar/filter-bar.vue'
	import cinemaListItem from '../../components/cinema-list-item/cinema-list-item.vue'
	export default {
		components: { filterBar, cinemaListItem },
		data() {
			return {
				//cinema
				city: '天津',
				cityId: 40,
				cinemas: [],
				params: {
					//url请求参数对象
					day: getToday(),
					offset: 0,
					limit: 20,
					districtId: -1,
					lineId: -1,
					hallType: -1,
					brandId: -1,
					serviceId: -1,
					areaId: -1,
					stationId: -1,
					item: '',
					updateShowDay: false
				},
				nothing: false, //结果是否为空
				cinemas: [], //影院列表
				//城市影院信息
				loadComplete: false, //数据是否加载完
				isShow: false, //导航下拉框是否展开
				// filter-nav
				cityCinemaInfo: {
					brand: {
						name: '品牌',
						subItems: []
					},
					district: {
						name: '行政区',
						subItems: []
					},
					hallType: {
						name: '影厅类型',
						subItems: []
					},
					service: {
						name: '影院服务',
						subItems: []
					},
					showType: null
				},

				hidden: true,
				itemNum: -1,
				itemName1: '全城',
				itemName2: '品牌',
				itemName3: '特色',
				selectBrandId: -1, //选择的品牌ID
				selectServiceId: -1, //选择的服务ID
				selectHallTypeId: -1, //选择的特殊厅ID
				selectRegion: {
					item: 0,
					sideList: [], //侧边导航的list
					list: [], //详情list
					selectDistrictId: -1, //选择的大区ID
					selectAreaId: -1, //选择的小区ID
					selectLineId: -1, //选择的地铁线ID
					selectStationId: -1 //选择的地铁站ID
				}
			}
		},
		computed: {},
		methods: {
			navToSearch() {
				uni.navigateTo({ url: '/pages/search/search' })
			},
			//初始化页面
			async getLocation() {
				// uni.authorize({
				//   scope: 'scope.userLocation',
				//   async success() {
				//     let res = await new Promise((resolve, reject) => {
				//       uni.getLocation({
				//         type: 'gcj02',
				//         success: resolve,
				//         fail: reject
				//       });
				//     }).then(() => {
				//       // 在这里调用逆地理编码服务
				//       reverseGeocode(res.latitude, res.longitude);
				//     }).catch((err) => {
				//       console.error("出错了", err)
				//     })
				//   }
				// })
				// let that = this
				// // 获取用户是否开启 授权获取当前的地理位置、速度的权限。
				// uni.getSetting({
				//   success(res) {
				//     console.log(res)

				//     // 如果没有授权
				//     if (!res.authSetting['scope.userLocation']) {
				//       // 则拉起授权窗口
				//       uni.authorize({
				//         scope: 'scope.userLocation',
				//         success() {
				//           //点击允许后--就一直会进入成功授权的回调 就可以使用获取的方法了
				//           uni.getLocation({
				//             type: 'wgs84',
				//             success: function (res) {
				//               that.x = res.longitude
				//               that.y = res.latitude
				//               console.log(res)
				//               console.log('当前位置的经度：' + res.longitude)
				//               console.log('当前位置的纬度：' + res.latitude)
				//               uni.showToast({
				//                 title: '当前位置的经纬度：' + res.longitude + ',' + res.latitude,
				//                 icon: 'success',
				//                 mask: true
				//               })
				//             }, fail(error) {
				//               console.log('失败', error)
				//             }
				//           })
				//         },
				//         fail(error) {
				//           //点击了拒绝授权后--就一直会进入失败回调函数--此时就可以在这里重新拉起授权窗口
				//           console.log('拒绝授权', error)

				//           uni.showModal({
				//             title: '提示',
				//             content: '若点击不授权，将无法使用位置功能',
				//             cancelText: '不授权',
				//             cancelColor: '#999',
				//             confirmText: '授权',
				//             confirmColor: '#f94218',
				//             success(res) {
				//               console.log(res)
				//               if (res.confirm) {
				//                 // 选择弹框内授权
				//                 uni.openSetting({
				//                   success(res) {
				//                     console.log(res.authSetting)
				//                   }
				//                 })
				//               } else if (res.cancel) {
				//                 // 选择弹框内 不授权
				//                 console.log('用户点击不授权')
				//               }
				//             }
				//           })
				//         }
				//       })
				//     } else {
				//       // 有权限则直接获取
				//       uni.getLocation({
				//         type: 'wgs84',
				//         success: function (res) {
				//           that.x = res.longitude
				//           that.y = res.latitude
				//           console.log(res)
				//           console.log('当前位置的经度：' + res.longitude)
				//           console.log('当前位置的纬度：' + res.latitude)
				//           uni.showToast({
				//             title: '当前位置的经纬度：' + res.longitude + ',' + res.latitude,
				//             icon: 'success',
				//             mask: true
				//           })
				//         }, fail(error) {
				//           uni.showToast({
				//             title: '请勿频繁调用！',
				//             icon: 'none',
				//           })
				//           console.log('失败', error)
				//         }
				//       })
				//     }
				//   }
				// })
			},
			// reverseGeocode() {
			//   // 注意：此处代码为示例，实际开发中请替换为正确的AK等参数
			//   var BMap = window?.BMap;
			//   var point = new BMap.Point(longitude, latitude);
			//   var geoc = new BMap.Geocoder();
			//   geoc.getLocation(point, function (res) {
			//     if (res && res.addressComponents) {
			//       let city = res.addressComponents.city;
			//       console.log("城市名字在这里", city); // 这里的city就是用户所在的城市名
			//     }
			//   });

			// },
			initPage() {
				wx.showLoading({ title: '正在加载...' })

				this.cinemaList(this.params).then(() => {
					wx.hideLoading()
				})

				wx.request({
					url: 'https://m.maoyan.com/ajax/filterCinemas',
					success: res => {
						this.cityCinemaInfo = res.data
					}
				})
			},
			//获取影院列表
			cinemaList(params) {
				console.log('!!!!!')
				return new Promise((resolve, reject) => {
					wx.request({
						url: 'https://m.maoyan.com/ajax/cinemaList',
						data: params,
						success: res => {
							resolve(res.data.cinemas)
							// this.cinemas = this.cinemas.concat(res.data.cinemas)
							this.cinemas = res.data.cinemas
							this.loadComplete = !res.data.paging.hasMore
						}
					})
				})
			},
			//当过滤条件变化时调用的函数
			changeCondition(e) {
				const obj = e.detail
				wx.showLoading({ title: '正在加载...' })

				this.params = { ...this.params, ...obj }
				this.cinemas = []
				this.nothing = false

				this.cinemaList(this.params).then(list => {
					if (!list.length) {
						this.nothing = true
					}
					wx.hideLoading()
				})
			},
			//导航下拉框状态变化时的处理
			toggleShow(value) {
				this.isShow = value !== -1
			},
			//上拉触底加载更多
			onReachBottom() {
				if (this.loadComplete) {
					return
				}
				const params = { ...this.params, offset: this.cinemas.length }
				this.cinemaList(params)
			},
			//转发
			onShareAppMessage(res) {
				return {
					title: '最近上映的这些电影你都看了吗？',
					path: 'pages/tabBar/movie/movie'
				}
			},

			//filter-nav
			//导航栏的点击事件
			selectItemNum(e) {
				const itemNum = e.currentTarget.dataset.itemNum
				let num = itemNum
				if (this.itemNum !== -1) {
					num = itemNum === this.itemNum ? -1 : itemNum
				}
				this.itemNum = num
			},
			//蒙板的点击事件
			cancal() {
				this.itemNum = -1
			},
			//选择品牌的点击事件
			selectBrand(e) {
				const brand = e.currentTarget.dataset.brand
				let brandName = brand.name
				if (brand.id === -1) {
					brandName = '品牌'
				}
				this.params.brandId = brand.id
				this.selectBrandId = brand.id
				this.itemName2 = brandName
				this.itemNum = -1
				this.cinemaList(this.params)
			},
			//特色重置按钮
			specialReset() {
				this.selectServiceId = -1
				this.selectHallTypeId = -1
			},
			//特色选择按钮
			specialSelectItem(e) {
				const { type, typeId } = e.currentTarget.dataset
				if (type === 'service') {
					this.selectServiceId = typeId
				} else {
					this.selectHallTypeId = typeId
				}
			},
			//特色确定按钮
			specialConfirm() {
				this.params.serviceId = this.selectServiceId
				this.params.hallType = this.selectHallTypeId
				this.itemNum = -1
				this.cinemaList(this.params)
			},
			//“全城”的item点击事件
			selectRegionItem(e) {
				const index = e.currentTarget.dataset.index
				const cityCinemaInfo = this.properties.cityCinemaInfo
				let obj = { ...this.selectRegion }
				if (index === 0) {
					obj.item = 0
					obj.sideList = cityCinemaInfo.district.subItems
					const findItem = obj.sideList.find(
						item => item.id === obj.selectDistrictId
					)
					obj.list = findItem.subItems ? findItem.subItems : []
				} else {
					obj.item = 1
					obj.sideList = cityCinemaInfo.subway.subItems
					const findItem = obj.sideList.find(
						item => item.id === obj.selectLineId
					)
					obj.list = findItem.subItems ? findItem.subItems : []
				}
				this.selectRegion = obj
			},
			//“全城”的side的点击事件
			regionSideClick(e) {
				const {
					item,
					selectDistrictId,
					selectLineId,
					selectStationId,
					selectAreaId
				} = this.selectRegion
				const side = e.currentTarget.dataset.side
				let obj = {
					...this.selectRegion,
					list: side.subItems ? side.subItems : []
				}
				if (item === 0) {
					//点击“全部”时关闭下拉框
					if (side.id === -1 && selectDistrictId !== -1) {
						this.params.districtId = -1
						this.params.lineId = selectLineId
						this.params.areaId = -1
						this.params.stationId = selectStationId
						this.itemNum = -1
						this.itemName1 = '全城'
						this.selectRegion = {
							...this.selectRegion,
							selectDistrictId: -1,
							selectAreaId: -1,
							list: []
						}
						return
					}
					obj.selectDistrictId = side.id
					obj.list = side.subItems ? side.subItems : []
				} else {
					if (side.id === -1 && selectLineId !== -1) {
						this.params.districtId = selectDistrictId
						this.params.lineId = -1
						this.params.areaId = selectAreaId
						this.params.stationId = -1
						this.itemNum = -1
						this.itemName1 = '全城'
						this.selectRegion = {
							...this.selectRegion,
							selectLineId: -1,
							selectStationId: -1,
							list: []
						}

						return
					}
					obj.selectLineId = side.id
				}
				this.selectRegion = obj
			},
			//“全城”详细list的点击事件
			regionListClick(e) {
				const item = e.currentTarget.dataset.item
				console.log(item, '55555555555')
				let obj = { ...this.selectRegion }
				if (this.selectRegion.item === 0) {
					obj.selectAreaId = item.id
				} else {
					obj.selectStationId = item.id
				}

				this.params.districtId = obj.selectDistrictId
				this.params.lineId = obj.selectLineId
				this.params.areaId = obj.selectAreaId
				this.params.stationId = obj.selectStationId
				this.selectRegion = obj
				this.itemNum = -1
				this.itemName1 = item.name
				this.cinemaList(this.params)
			}
		},
		watch: {
			cityCinemaInfo(newVal, oldVal, changedPath) {
				const sideList = newVal.district ? newVal.district.subItems : []
				this.selectRegion = { ...this.selectRegion, sideList }
			},
			hidden(newVal) {
				if (newVal) {
					this.itemNum = -1
				}
			},
			itemNum(value) {
				this.toggleShow(value)
			}
		},

		// 页面周期函数--监听页面加载
		onLoad() {
			// let app = getApp()
			// if (app.globalData.userLocation) {
			//   this.city = app.globalData.selectCity
			//     ? app.globalData.selectCity.cityName
			//     : '定位失败'
			// } else {
			//   app.userLocationReadyCallback = () => {
			//     this.city = app.globalData.selectCity
			//       ? app.globalData.selectCity.cityName
			//       : '定位失败'
			//   }
			// }
			this.initPage()
			this.getLocation()
			uni.setStorageSync('cityId', 40)
		},
		// 页面周期函数--监听页面初次渲染完成
		onReady() {},
		// 页面周期函数--监听页面显示(not-nvue)
		onShow() {
			let app = getApp()
			if (app.globalData.selectCity) {
				this.city = app.globalData.selectCity.cityName
			}
		},
		// 页面周期函数--监听页面隐藏
		onHide() {},
		// 页面周期函数--监听页面卸载
		onUnload() {}
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
	/* @import '/templates/cinemaSection/cinemaSection.wxss';*/
	.topbar {
		position: fixed;
		width: 100vw;
		top: 0;
		height: 90rpx;
		border: none;
		background-color: #f5f5f5;
	}

	.search-input {
		flex-grow: 1;
		height: 56rpx;
		font-size: 26rpx;
		color: #999;
		border: 1rpx solid #e6e6e6;
		border-radius: 10rpx;
		margin: 0 30rpx;
		background: #fff;
		line-height: 56rpx;
		text-align: center;
	}

	.icon-sousuo {
		display: inline-block;
		margin-right: 10rpx;
		font-size: 24rpx;
		color: #999;
	}

	.nav-wrapper {
		position: fixed;
		z-index: 10;
		top: 90rpx;
		left: 0;
		width: 100vw;
		height: 80rpx;
		background: #fff;
	}

	.cinema-list {
		margin-top: 170rpx;
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	/* cinema-section */
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

	/* filter-nav */
	/* @import '/assets/font/icon.wxss'; */

	.line-ellipsis {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.nav {
		font-size: 28rpx;
	}

	.tab {
		display: flex;
		align-items: center;

		width: 100vw;
		height: 80rpx;
		border-bottom: 1px solid #e6e6e6;
		color: #555;
		background: #fff;
	}

	.nav-item {
		flex-grow: 1;
		text-align: center;
		font-size: 28rpx;
	}

	.tab .nav-item {
		width: 33.33%;
	}

	.nav-item .title {
		display: inline-block;
		max-width: 80%;
	}

	.have-border {
		border-left: 1px solid #e6e6e6;
		border-right: 1px solid #e6e6e6;
	}

	.city-entry-arrow {
		width: 0;
		height: 0;
		border: 8rpx solid #b0b0b0;
		border-left-color: transparent;
		border-right-color: transparent;
		border-bottom-color: transparent;
		display: inline-block;
		vertical-align: text-top;
		margin-left: 8rpx;
		margin-top: 10rpx;
	}

	.select-item {
		color: #e54847;
	}

	.select-item .city-entry-arrow {
		position: relative;
		transform: translateY(-8rpx);
		border: 8rpx solid #e54847;
		border-left-color: transparent;
		border-right-color: transparent;
		border-top-color: transparent;
	}

	.nav-content-item {
		position: relative;
		width: 100vw;
		height: calc(100vh * 0.6);
		background: #fff;
		color: #777;
	}

	/* region */

	.region .tab {
		border: none;
	}

	.region .nav-item {
		height: 100%;
		line-height: 80rpx;
		box-sizing: border-box;
	}

	.region .nav-item.active {
		color: #e54847;
		border-bottom: 2px solid #e54847;
	}

	.region-list {
		display: flex;
		width: 100%;
		height: calc(100% - 80rpx);
	}

	.region-sidenav {
		white-space: nowrap;
		/* 直接用百分比有点问题 */
		width: calc(100vw * 0.4);
		height: 100%;
	}

	.side-item {
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 30rpx;
	}

	.side-item.active {
		color: #dd403b;
		background: #f5f5f5;
	}

	.region-list-item {
		white-space: nowrap;
		flex-grow: 1;
		height: 100%;
		background: #f5f5f5;
	}

	.region-list-item .item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 30rpx;
		padding-right: 50rpx;
		height: 80rpx;
	}

	/* brand */

	.brand-scroll-view {
		white-space: nowrap;
		width: 100%;
		height: 100%;
	}

	.brand-item {
		display: flex;
		justify-content: space-between;
		line-height: 88rpx;
		height: 88rpx;
		border-bottom: 1px solid #f0f0f0;
		padding-left: 45rpx;
		padding-right: 80rpx;
	}

	.red {
		color: #dd403b;
	}

	.brand-count {
		font-size: 24rpx;
	}

	/* special */

	.special-scroll-view {
		white-space: nowrap;
		width: 100%;
		height: calc(100% - 120rpx);
	}

	.special .item-title {
		padding: 20rpx 30rpx;
	}

	.special .item-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30rpx;
	}

	.special .item-list .btn {
		width: 21.3%;
		height: 60rpx;
		margin-right: 3%;
		margin-bottom: 20rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 10rpx;
		font-size: 24rpx;
		box-sizing: border-box;
		border: 1px solid #e5e5e5;
		padding: 0 6rpx;
	}

	.special .item-list .btn.select {
		background: #fcf0f0;
		color: #f03d37;
		border: 1px solid #f03d37;
	}

	.special-btn {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 120rpx;
		background: #fafafa;
		border-top: 1px solid #e5e5e5;
		padding: 0 30rpx;
		box-sizing: border-box;
	}

	.special-btn .btn {
		background: #fff;
		border: 1px solid #e5e5e5;
		height: 68rpx;
		width: 20%;
		text-align: center;
		border-radius: 12rpx;
		font-size: 28rpx;
		line-height: 68rpx;
	}

	.special-btn .btn.confirm-btn {
		background: #f03d37;
		border: 1px solid #f03d37;
		color: #fff;
	}

	/* 蒙板 */

	.mask {
		position: fixed;
		z-index: -1;
		bottom: 0;
		left: 0;
		height: 50%;
		width: 100%;
		background: rgba(0, 0, 0, 0.3);
	}
</style>