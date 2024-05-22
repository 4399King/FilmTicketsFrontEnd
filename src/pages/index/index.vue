<template>
	<view class="page">
		<custom-nav-bar style="position: absolute; width: 100vw; z-index: 9999; height:200px;"></custom-nav-bar>
		<!-- 首页轮播图  Begin-->
		<swiper :indicator-dots="true" :autoplay="true" duration="1000" class="carousel">
			<view>
				<swiper-item v-for="(item, index) in 5" :key="index">
					<div>
						<image :src="SuperHotList[index]?.img" @click="goDetail(SuperHotList[index].id)" />
					</div>
				</swiper-item>
			</view>
		</swiper>
		<!--首页轮播图 End -->
		<!-- 热门视频 Begin -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<!-- <image src="../../static/super-hot/hot.png" class="hot-ico"></image> -->
				<view class="hot-title"> 今日热映 </view>
			</view>
		</view>
		<view class="hot-box">
			<scroll-view scroll-x="true" class="hot page-block">
				<view class="signle-poster" v-for="(item, index) in SuperHotList" :key="index" @click="goDetail(item.id)">
					<view class="poster-wapper">
						<image :src="item?.img" class="hot-movie-jpg"></image>
						<view class="movie-name">
							{{ item.nm }}
						</view>
						<view class="movie-score" v-if="item.sc != 0">观众评分
							<label>{{
                (item.sc - 0) % 1 == 0 ? item.sc + ".0" : item.sc
              }}</label>
						</view>
						<view class="movie-score" v-else>暂无评分</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--热门视频 End -->

		<!-- 热门预告 Begin -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<!-- <image src="../../static/super-movieyg/hotmovie.png" class="hot-ico"></image> -->
				<view class="hot-title"> 热门预告 </view>
			</view>
		</view>
		<view class="most-expected">
			<scroll-view class="scroll-view_H" scroll-x>
				<view @click="goDetail(movie.id)" v-for="(movie, index) in mostExpectedList" :key="index" class="expected-item">
					<image :src="movie.img" class="poster"></image>
					<view class="name line-ellipsis">{{ movie.nm }}</view>
					<view class="data line-ellipsis">{{ movie.wish }}人想看</view>
					<view class="data">{{ movie.comingTitle }}</view>
				</view>
			</scroll-view>
		</view>

		<!-- 热门预告 End -->

		<!-- 猜你喜欢 Begin-->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<!-- <image src="../../static/ulike/ulikeico.png" class="hot-ico"></image> -->
				<view class="hot-title"> 猜你喜欢 </view>
			</view>
		</view>
		<view class="page-block guess-u-like">

			<!-- <image :src="serverContent + Item.Bannerpic" class="like-movie-png"></image> -->
			<div class="movie-item" v-for="(Item, index) in curRecommendMovie" :key="index"
				@click="goOldMovieDetail(Item,index)">
				<div class="image-box">
					<image :src='`../../static/image/ed/${index}.webp`' class="like-movie-png"></image>

				</div>
				<view class="movie-desc">
					<view class="movie-title">
						{{ Item?.name.slice(-5) == ' - 电影'?Item?.name.slice(0,-5):Item?.name }}
					</view>
					<view class="movie-score">推荐程度：<label>{{ '⭐'.repeat((Item?.score - 0)) }} </label></view>
					<view class="movie-info ">
						{{ Item?.category.includes('同性')?'爱情':Item?.category }}
					</view>
					<view class="movie-info overflow-ellipsis" v-show="!(Item?.actor === null)"> 演员：{{ Item?.actor }} </view>
					<!-- <view class="movie-info movie-release-time">
						{{ Item?.releaseTime }}
					</view> -->
				</view>
			</div>
			<!-- <view class="movie-oper" :data-index="index" @click="giveup">
					<image src="../../static/ulike/giveup.png" class="giveup-ico"></image>
					<view class="giveup-me"> 点赞 </view>
					<view :animation="animationDataArr[index]" class="giveup-me animation-opacity">
						+1
					</view>
				</view> -->

		</view>
		<!-- 猜你喜欢 End -->
	</view>
</template>

<script>
	import img0 from "@/static/image/ed/0.webp"
	import img1 from "@/static/image/ed/1.webp"
	import img2 from "@/static/image/ed/2.webp"
	import img3 from "@/static/image/ed/3.webp"
	import img4 from "@/static/image/ed/4.webp"
	import img5 from "@/static/image/ed/5.webp"
	import img6 from "@/static/image/ed/6.webp"
	import img7 from "@/static/image/ed/7.webp"
	import img8 from "@/static/image/ed/8.webp"
	import img9 from "@/static/image/ed/9.webp"
	import img10 from "@/static/image/ed/10.webp"
	import img11 from "@/static/image/ed/11.webp"
	import img12 from "@/static/image/ed/12.webp"
	import img13 from "@/static/image/ed/13.webp"
	import img14 from "@/static/image/ed/14.webp"
	import img15 from "@/static/image/ed/15.webp"
	import img16 from "@/static/image/ed/16.webp"
	import img17 from "@/static/image/ed/17.webp"
	import img18 from "@/static/image/ed/18.webp"
	import img19 from "@/static/image/ed/19.webp"
	// 引用自义组件
	export default {
		data() {
			return {
				userInfo: '',
				CarouselList: [], //首页轮播组
				SuperHotList: [], //热门影视组
				SuperMovieList: [], //热门预告组
				UlikeMovieList: [], //猜你喜欢组
				serverContent: '', //静态资源加载地址
				animationData: {}, //动画
				animationDataArr: [], //动画组
				city: '正在定位...',
				switchItem: 0, //默认选择‘正在热映’
				//‘正在热映’数据
				movieList0: [],
				movieIds0: [],
				loadComplete0: false, //‘正在上映’数据是否加载到最后一条
				//‘即将上映’数据
				mostExpectedList: [],
				movieList1: [],
				movieIds1: [],
				loadComplete1: false,
				loadComplete2: false, //水平滚动加载的数据是否加载完毕
				recommendMoviePage: 1,
				curRecommendMovie: [],
				curRecommendMovieCount: 0,
				images: [
					img0,
					img1,
					img2,
					img3,
					img4,
					img5,
					img6,
					img7,
					img8,
					img9,
					img10,
					img11,
					img12,
					img13,
					img14,
					img15,
					img16,
					img17,
					img18,
					img19,
				],

			}
		},
		created() {
			uni.setStorageSync('cityId', 40)
		},
		onUnload() {
			this.animationData = {} //页面关闭 清除动画
			this.animationDataArr = []
		},
		onPullDownRefresh() {
			//监听下拉操作，下拉刷新数据
			uni.showLoading({ mask: true })
			this.refresh()
		},
		onLoad() {
			// #ifdef APP-PLUS || MP-WEIXIN
			this.animation = uni.createAnimation() //创建动画
			// #endif

			//通过import文件实现全局变量
			// var serverUrl = common.ServerUrl;
			var serverUrl = this.ServerUrl //全局API地址
			this.serverContent = this.ServerContent //静态资源加载地址

			// 获取首页轮播
			uni.request({
				url: serverUrl + '/Movies/GetCarousel',
				method: 'POST',
				header: { 'content-type': 'application/json' },
				success: res => {
					this.CarouselList = res.data.Data
				},
			})
			// 获取中间热映
			uni.request({
				url: 'https://m.maoyan.com/ajax/movieOnInfoList',
				method: 'GET',
				header: {
					'content-type': 'application/json',
					cookie: 'iuuid=01E2CDE09CCA11EBBA0D13E3C3194737A56B4CED40274A299CC63CA5D6B488F1',
				},
				success: res => {
					if (res.statusCode !== 200) {
						return
					}
					this.SuperHotList = res.data.movieList
					console.log(res.data.movieList, 'wuhuwuhu')
					for (let i = 0; i < this.SuperHotList.length; i++) {
						this.SuperHotList[i].img = this.SuperHotList[i]?.img.replace(
							'w.h/',
							''
						)
					}
				},
			})

			//获取热门预告
			uni.request({
				url: serverUrl + '/Movies/HotMovies?type=supermovie',
				method: 'POST',
				header: { 'content-type': 'application/json' },
				success: res => {
					this.SuperMovieList = res.data.Data
				},
			})
			this.expectedMovie()
			//获取猜你喜欢

		},
		onShow() {
			this.userInfo = uni.getStorageSync('userName')
			console.log(this.userInfo, "@@@@@@@@@@@")
			if (!this.userInfo) {
				uni.navigateTo({ url: '/pages/login/login' })
				return
			} else if (!this.UlikeMovieList.length) {

				this.refresh()
			}

		},
		onReachBottom() {
			if (this.curRecommendMovie.length < 20) {
				for (let i = 0; i < 4; i++) {
					this.curRecommendMovie.push(this.UlikeMovieList[this.curRecommendMovieCount++])
				}
			} else {
				uni.showToast({
					title: '已经到底了',
					icon: 'none' // 使用‘none’类型的图标，仅展示文本
				});
			}
		},
		methods: {
			//上拉触底刷新的加载函数
			async getMoreComingMovie(list, ids, complete, item) {
				if (complete) {
					return
				}
				const length = list.length
				if (length + 10 >= ids.length) {
					this.setData({
						[`loadComplete${item}`]: true
					})
				}
				let query = ids.slice(length, length + 10).join('%2C')
				const url = `https://m.maoyan.com/ajax/moreComingList?token=&movieIds=${query}`
				const [res, err] = await request({
					api: `/ajax/moreComingList?token=&movieIds=${query}`
				})
				if (!err) {
					const arr = list.concat(this.formatImgUrl(res.coming || []))
					this.setData({
						[`movieList${item}`]: arr,
					})
				}
			},
			async refresh() {

				if (!this.UlikeMovieList.length) {
					try {
						let { data: { code }, data: { data } } = await new Promise((resolve, reject) => {
							uni.request({
								url: `https://film.sipc115.com/film/recommend`,
								method: 'GET',
								header: { 'content-type': 'application/json', 'Authorization': uni.getStorageSync('token') },
								success: resolve,
								fail: reject,
							})

						})
						switch (code) {
							case "00000":
								this.curRecommendMovieCount = 0;
								for (const item of data) {
									if (this.curRecommendMovieCount < 4) {
										this.curRecommendMovie.push(item)
										this.curRecommendMovieCount++;
									}

									this.UlikeMovieList.push(item)
								}

								break;
							default:
								throw new Error(data)
						}

					} catch (e) {
						//TODO handle the exception
						console.error(e)
					}

					// this.UlikeMovieList =
					// console.log(this.UlikeMovieList, 'hrer')
				}
			},

			//点赞动画效果
			giveup(e) {
				// #ifdef APP-PLUS||MP-WEIXIN

				var index = e.currentTarget.dataset.index

				this.animation.translateY(-60).opacity(1).step({ duration: 400 })

				this.animationData = this.animation
				this.animationDataArr[index] = this.animationData.export()
				setTimeout(
					function() {
						this.animation.translateY(0).opacity(0).step({ duration: 0 })
						this.animationData = this.animation
						this.animationDataArr[index] = this.animationData.export()
					}.bind(this),
					600
				)
				// #endif
			},
			//重加载猜你喜欢数据
			ulikeReload() {
				uni.showLoading({ mask: true })
				this.refresh()
			},
			goDetail(movieid) {
				uni.navigateTo({ url: '../film-detail/film-detail?movieid=' + movieid })
			},
			goOldMovieDetail(movie, picIndex) {
				console.log('电影', movie)
				uni.navigateTo({
					url: `../film-detail/film-detail?flag=${1}&paramStr=${JSON.stringify(movie)}&picIndex=${picIndex}`
				})
			},
			//预告电影
			expectedMovie() {
				// uni.showLoading({
				// 	mask: true
				// })

				// 获取中间热映
				uni.request({
					url: 'https://m.maoyan.com/ajax/mostExpected?limit=10&offset=0&token=',
					method: 'GET',
					header: {
						'content-type': 'application/json',
						cookie: 'iuuid=01E2CDE09CCA11EBBA0D13E3C3194737A56B4CED40274A299CC63CA5D6B488F1',
					},
					success: ({ data: res }) => {
						console.log(res, '@@@@@@@@@@@here')

						this.mostExpectedList = this.formatImgUrl(res.coming || [], true)
						console.log(this.mostExpectedList, 'here@@@@@@@@@@@@')
					},
				})
			},
			//处理图片url
			formatImgUrl(arr, cutTitle = false) {
				if (!Array.isArray(arr)) {
					return
				}
				let newArr = []
				arr.forEach(item => {
					let title = item.comingTitle
					if (cutTitle) {
						//是否截取X月X日，砍掉星期
						title = item.comingTitle.split(' ')[0]
					}
					let imgUrl = item.img.replace('w.h', '128.180')
					newArr.push({
						...item,
						comingTitle: title,
						img: imgUrl,
					})
				})
				return newArr
			},
		},
		components: {},
	}
</script>

<style>
	@import url("index.css");
</style>