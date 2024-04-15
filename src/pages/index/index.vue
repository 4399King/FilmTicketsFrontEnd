<template>
	<view class="page">
		<customNavBar style="position: absolute; width: 100vw; z-index: 100"></customNavBar>
		<!-- 首页轮播图  Begin-->
		<swiper :indicator-dots="true" :autoplay="true" duration="1000" class="carousel">
			<view>
				<swiper-item v-for="(item, index) in 5" :key="index">
					<div>
						<image
							:src="SuperHotList[index]?.img"
						/>
					</div>
				</swiper-item>
			</view>
		</swiper>
		<!--首页轮播图 End -->
		<!-- 热门视频 Begin -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/super-hot/hot.png" class="hot-ico"></image>
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
				<image src="../../static/super-movieyg/hotmovie.png" class="hot-ico"></image>
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
				<image src="../../static/ulike/ulikeico.png" class="hot-ico"></image>
				<view class="hot-title"> 猜你喜欢 </view>
				<view @click="ulikeReload">
					<image src="../../static/ulike/reload.png" class="hot-ico ulike-reload"></image>
				</view>
			</view>
		</view>
		<view class="page-block guess-u-like">

			<!-- <image :src="serverContent + Item.Bannerpic" class="like-movie-png"></image> -->
			<div class="movie-item" v-for="(Item, index) in UlikeMovieList" :key="index">
				<div class="image-box">
					<image src="../../static/image/ed/movie1.jpg" class="like-movie-png"></image>
				</div>
				<view class="movie-desc">
					<view class="movie-title">
						{{ Item.Name }}
					</view>
					<view class="movie-score">评分：<label>{{ Item.sc }} 分</label></view>
					<view class="movie-info">
						{{ Item.Mtype }}
					</view>
					<view class="movie-info"> 演员：{{ Item.Performers }} </view>
					<view class="movie-info">
						{{ Item.UplayTime }}
					</view>
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
	// 引用自定义组件
	export default {
		data() {
			return {
				userInfo: '',
				CarouselList: [], //首页轮播组
				SuperHotList: [], //热门影视组
				SuperMovieList: [], //热门预告组
				UlikeMovieList: [{ Name: '11', Mtype: '666', UplayTime: '6666', sc: 5, Performers: 'xxf' }, {
					Name: '11',
					Mtype: '6666',
					UplayTime: '6666',
					sc: 5,
					Performers: 'xxf'
				}, {
					Name: '11',
					Mtype: '66666',
					UplayTime: '666666',
					sc: 5,
					Performers: 'xxf'
				}, { Name: '11', Mtype: '666666', UplayTime: '666666', sc: 5, Performers: 'xxf' }, {
					Name: '11',
					Mtype: '6666666',
					UplayTime: '6666',
					sc: 5,
					Performers: 'xxf'
				}], //猜你喜欢组
				serverContent: '', //静态资源加载地址
				animationData: {}, //动画
				animationDataArr: [], //动画组

				//

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
			}
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
			this.refresh()
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userName')
			if (!this.userInfo) {
				uni.navigateTo({ url: '/pages/login/login' })
			}
		},
		methods: {
			refresh() {
				var serverUrl = this.ServerUrl
				uni.request({
					url: serverUrl + '/Movies/GetRandomMovies',
					method: 'GET',
					header: { 'content-type': 'application/json' },
					success: res => {
						this.UlikeMovieList = res.data.Data
						console.log(this.UlikeMovieList, 'hrer')
					},
					complete: () => {
						uni.stopPullDownRefresh()
						uni.hideLoading()
					},
				})
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