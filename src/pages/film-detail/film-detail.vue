<template>
	<view class="page">
		<!-- 头部图片和信息 -->
		<view class="movie-bgimg" :style="{ backgroundImage: 'url(' + Moviedetail.img + ')' }"></view>
		<view class="movie-mask">
			<view class="movie-detail">
				<view class="detail-img">
					<image :src="flag?images[picIndex]:Moviedetail.img" class="detail-img-ico"></image>
				</view>
				<view class="detail-info">
					<view class="detail-info-nm">
						{{ Moviedetail.nm||Moviedetail.name }}
					</view>
					<view class="detail-info-enm">
						{{ Moviedetail?.enm }}
					</view>
					<view class="detail-star" v-if="Moviedetail?.stars">
						<image v-for="item in Moviedetail?.stars" :key="item" :src="'../../static/image/star/' + item + '.png'">
						</image>
					</view>
					<view v-else>暂无评分</view>
					<view class="detail-info-snum" v-if=" Moviedetail?.snum"> ({{ Moviedetail?.snum }}人评分) </view>
					<view class="detail-info-cat">
						{{ Moviedetail.cat||Moviedetail.category }}
					</view>
					<view class="detail-info-dur">
						{{ Moviedetail.src||Moviedetail.releasePlace }} <span
							v-if="Moviedetail?.dur">/{{ Moviedetail.dur }}分钟</span>
					</view>
					<view class="detail-info-pubDesc">
						{{ Moviedetail.pubDesc||Moviedetail.releasTime }}
					</view>
				</view>
			</view>
		</view>

		<view class="movie-body">
			<!-- 中部 影片介绍 -->
			<view class="movie-intro">
				<view class="movie-info-titile">剧情简介</view>
				<view :class="
            fold == true
              ? 'movie-info-texthide page-block'
              : 'movie-info-textauto page-block'
          ">
					{{ Moviedetail.dra||Moviedetail.synopsis }}
				</view>
				<view class="movie-info-text-btn page-block" @click="changeText">
					<image :src="
              fold == true
                ? '../../static/detail/down.png'
                : '../../static/detail/top.png'
            " class="movie-info-text-btn-img"></image>
				</view>
			</view>

			<view class="movie-detail-vedio" v-if="Moviedetail?.videourl">
				<video id="movievedio" :src="Moviedetail.videourl" :poster="Moviedetail.videoImg" class="movie-vedio"></video>
			</view>

			<!-- 电影图片展示 -->
			<view class="movie-detail-photos page-block" v-if="Moviedetail?.photos">
				<view class="movie-detail-photos-text">影视剧照</view>
				<scroll-view scroll-x="true" class="movie-photos-scroll page-block">
					<view class="movie-photos-block" v-for="(item, index) in Moviedetail.photos" :key="index">
						<view class="movie-photos-item" @click="previewImg(index)">
							<image mode="aspectFill" class="movie-photos-png" :src="item"></image>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 电影评论展示 -->
			<view class="movie-comment page-block">
				<view class="movie-detail-comment-text">热门评论
					<button @click="this.showFloatWindow = true">发表评论</button>
				</view>
				<view class="" v-if="commentslist.length">
					<view class="movie-comment-item" v-for="(item, index) in commentslist" :key="index">
						<view class="movie-comment-user">
							<view>
								<image :src="item.avatarUrl" class="movie-comment-user-img"></image>
							</view>
							<view class="movie-comment-user-info">
								{{ item.nick }}
							</view>
						</view>
						<view class="movie-comment-text">
							<view>{{ item.content }}</view>
						</view>
						<view class="movie-comment-info">
							<view>{{ item.startTime }} {{((item.score / 2) + '')[0]}}分</view>
							<view>
								<view>{{ item.replyCount }}
									<image v-if="!item.isPraised" @click="praise(item)" src="../../static/detail/zan.png"
										class="movie-comment-info-ico" />
									<image v-else @click="dePraise(item)" src=" ../../static/detail/dianzan.png"
										class="movie-comment-info-ico" />

								</view>
							</view>
						</view>
						<view class="line-wapper">
							<view class="line"></view>
						</view>
					</view>
					<view class="search-all" v-show="allcomments > 0 ? true : false">
						查看全部{{ allcomments }}条评论
					</view>
				</view>
				<view v-else style="font-size:32upx;text-align: center;padding-top:20rpx;">
					暂无评论...
				</view>

			</view>
			<button hover-class="none"
				url="/pages/subPages/select-cinema/select-cinema?movieId={{detailMovie.id}}&movieName={{detailMovie.nm}}&showTime={{detailMovie.rt}}"
				v-if="Moviedetail.onSale" class="purchase" @click.prevent="navToChooseCinema" type="warn">
				优惠购票
			</button>
			<!-- 遮罩层 -->
			<view class="mask" v-show="showFloatWindow" @click="this.showFloatWindow = false"></view>

			<div v-show="showFloatWindow" class="float-window">
				<div class="give-score">评分：<span v-for="(item, index) in 5" :key="index">
						<image :src='userScore >= (index + 1)?fullStar:emptyStar' class="star-img" @click="giveScore(index)">
						</image>
					</span></div>
				<textarea v-model="commentContent" placeholder="请输入评论内容"></textarea>
				<button @click="pubComment">发表评论</button>
			</div>
		</view>
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
	import emptyStar from '../../static/image/star/star-empty.png'
	import fullStar from '../../static/image/star/star-full.png'
	export default {
		data() {
			return {
				Movieid: '', //电影id
				Moviedetail: {}, //电影详情
				Imagesrc: '', //背景图
				fold: true, //隐藏文本
				allcomments: '', //数量
				commentslist: [], //评论
				flag: false,
				commentContent: '',
				showFloatWindow: false,
				userScore: -1,
				fullStar,
				emptyStar,
				isLogin: false,
				picIndex: 0,
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

		onLoad(res) {

			if (res?.flag) { //切换成老电影
				this.flag = res.flag - 0
				this.Moviedetail = JSON.parse(res.paramStr)
				this.picIndex = res.picIndex - 0
				this.fold = false
				this.Movieid = this.Moviedetail.id
				this.getOldMovieComment()
			} else {
				this.Movieid = res.movieid
				this.searchDetail()
				this.searchComment()
			}
		},
		onReady() {
			this.videocontext = uni.createVideoContext('movievedio')
		},
		onHide() {
			this.videocontext.pause()
		},
		onShow() {
			// if (this.videocontext) {
			// 	this.videocontext.play()
			// }
		},
		onShareAppMessage(res) {
			return {
				title: this.Moviedetail.nm,
				path: '/pages/detail/detail?movieid=' + this.Movieid
			}
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
		},
		filters: {
			formatDate: function(value) {
				var date = new Date()
				date.setTime(value)
				var month = date.getMonth() + 1
				var hours = date.getHours()
				if (hours < 10) hours = '0' + hours
				var minutes = date.getMinutes()
				if (minutes < 10) minutes = '0' + minutes
				var time =
					date.getFullYear() +
					'-' +
					month +
					'-' +
					date.getDate() +
					' ' +
					hours +
					':' +
					minutes
				return time
			}
		},
		computed: {},
		methods: {
			getOldMovieComment() {
				if (!uni.getStorageSync('comments')) {
					uni.setStorageSync('comments', [])
				}
				//我的评论
				let comments = uni.getStorageSync('comments')
				for (const comment of comments) {
					if (comment.movieId === this.Movieid) {
						this.commentslist.unshift(comment)
					}

				}
				this.formatDate(this.commentslist)
			},
			giveScore(index) {
				this.userScore = index + 1;
			},
			returnFomatDate(timeStamp) {
				var date = new Date()
				date.setTime(timeStamp)
				var month = date.getMonth() + 1
				var hours = date.getHours()
				if (hours < 10) hours = '0' + hours
				var minutes = date.getMinutes()
				if (minutes < 10) minutes = '0' + minutes
				var time =
					date.getFullYear() +
					'-' +
					month +
					'-' +
					date.getDate() +
					' ' +
					hours +
					':' +
					minutes
				return time
			},
			dePraise(item) {

				if (!item.hasOwnProperty('id')) {
					item.isPraised--
					item.replyCount--
					let myComments = uni.getStorageSync('comments')

					myComments.map((comment) => {

						if (this.returnFomatDate(comment.startTime) === item.startTime && comment.content === item.content) {

							comment.isPraised--
							comment.replyCount--
						}

					})
					uni.setStorageSync("comments", myComments)
				} else {
					item.isPraised--
					item.replyCount--
					if (!uni.getStorageSync('othersComments')) {
						return
					}
					let othersComments = uni.getStorageSync('othersComments')
					othersComments = othersComments.filter((otherComment) => {
						console.log(otherComment.id, item.id)
						otherComment.id !== item.id
					})
					console.log('othersComments', othersComments)
					uni.setStorageSync('othersComments', othersComments)
				}
			},
			praise(item) {

				if (!item.hasOwnProperty('id')) {
					item.isPraised++
					item.replyCount++
					let myComments = uni.getStorageSync('comments')

					myComments.map((comment) => {

						if (this.returnFomatDate(comment.startTime) === item.startTime && comment.content === item.content) {

							comment.isPraised++
							comment.replyCount++
						}

					})
					uni.setStorageSync("comments", myComments)

				} else {
					item.isPraised++
					item.replyCount++
					if (!uni.getStorageSync('othersComments')) {
						uni.setStorageSync('othersComments', [])
					}
					let othersComments = uni.getStorageSync('othersComments')
					othersComments = [...othersComments, item]
					uni.setStorageSync('othersComments', othersComments)
				}

			},
			pubComment() {
				if (this.userScore < 0) {
					uni.showModal({
						title: '提示',
						content: '请先评分'
					})
					return
				}
				if (!uni.getStorageSync('comments')) {
					uni.setStorageSync('comments', [])
				}
				let startTime = Date.now()
				let comments = uni.getStorageSync('comments')
				for (const comment of comments) {
					if (comment.movieId === this.Movieid) {
						uni.showModal({
							title: '提示',
							content: '您已经发表过对这部电影的评价咯'
						})
						return
					}

				}
				const comment = {
					nick: uni.getStorageSync('userName'),
					avatarUrl: uni.getStorageSync('userImg'),
					content: this.commentContent,
					startTime,
					replyCount: 0,
					movieId: this.Movieid,
					isPraised: 0,
					score: this.userScore * 2
				}
				console.log('comment', comment)

				let tempComments = [comment]
				comments.unshift(...[{ ...comment }]);
				this.formatDate(tempComments);
				this.commentslist.unshift(...tempComments);
				uni.setStorageSync('comments', comments)
				this.showFloatWindow = false;
			},
			getCurrentTimeFormatted() {
				const now = new Date();
				const year = now.getFullYear(); // 获取年份
				const month = now.getMonth() + 1; // 获取月份，加1使其从1开始
				const day = now.getDate(); // 获取日期
				const hours = now.getHours(); // 获取小时
				const minutes = now.getMinutes(); // 获取分钟

				// 生成格式化的时间字符串，注意月、日、小时和分钟不补零
				return `${year}-${month}-${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
			},
			//加载数据
			searchDetail() {
				uni.showLoading({
					mask: true,
					title: '加载中...'
				})
				uni.request({
					url: 'https://m.maoyan.com/ajax/detailmovie?movieId=' + this.Movieid,
					method: 'GET',
					header: {
						//uni.request不支持小程序cookie，此处iuuid为自己获取的id，并手动设置cookie传入
						cookie: 'iuuid=01E2CDE09CCA11EBBA0D13E3C3194737A56B4CED40274A299CC63CA5D6B488F1'
					},
					success: (res) => {
						// console.log(res);
						if (res.statusCode != 200) {
							uni.hideLoading()
							return
						}
						this.Moviedetail = res.data.detailMovie
						console.log(this.Moviedetail, 'heere111')
						uni.setNavigationBarTitle({
							title: this.Moviedetail.nm
						})

						this.Moviedetail.img = this.Moviedetail.img?.replace('w.h/', '')
						for (let i = 0; i < this.Moviedetail.photos.length; i++) {
							this.Moviedetail.photos[i] = this.Moviedetail.photos[i]?.replace(
								'w.h/',
								''
							)
						}
						this.Moviedetail.stars = this.formatStar(this.Moviedetail.sc)
						console.log(this.Moviedetail, '@@@@@@@kkk')
						this.Imagesrc = this.Moviedetail.photos[2]
					},
					complete() {
						uni.hideLoading()
					}
				})
			},
			//上拉下拉展示文本
			changeText() {
				this.fold = !this.fold
			},
			//预览图片
			previewImg(index) {
				uni.previewImage({
					current: index,
					urls: this.Moviedetail.photos
				})
			},
			//查询热门评论
			searchComment(pageoffset) {
				uni.request({
					url: 'https://m.maoyan.com/review/v2/comments.json?movieId=' +
						this.Movieid +
						'&userId=-1&offset=15&limit=15&ts=',
					method: 'GET',
					header: {
						//uni.request不支持小程序cookie，此处iuuid为自己获取的id，并手动设置cookie传入
						cookie: 'iuuid=01E2CDE09CCA11EBBA0D13E3C3194737A56B4CED40274A299CC63CA5D6B488F1'
					},
					success: (res) => {
						if (res.statusCode != 200) {
							uni.hideLoading()
							return
						}
						//别人的评论
						let othersComments = [];
						if (uni.getStorageSync('othersComments')) {
							othersComments = uni.getStorageSync('othersComments')
						}
						for (const comment of res.data.data.hotComments) {
							comment.isPraised = 0
							for (const record of othersComments) {
								if (record.id === comment.id) {
									comment.isPraised++;
									comment.replyCount++;
								}
							}
							this.commentslist.push(comment)
						}

						if (!uni.getStorageSync('comments')) {
							uni.setStorageSync('comments', [])
						}
						//我的评论
						let comments = uni.getStorageSync('comments')
						for (const comment of comments) {
							if (comment.movieId === this.Movieid) {
								this.commentslist.unshift(comment)
							}

						}

						this.allcomments = res.data.data.total
						this.formatDate(this.commentslist)

					}
				})
			},
			formatDate(commentslist) {
				for (let i = 0; i < commentslist.length; i++) {
					var date = new Date()
					date.setTime(commentslist[i].startTime)
					var month = date.getMonth() + 1
					var hours = date.getHours()
					if (hours < 10) hours = '0' + hours
					var minutes = date.getMinutes()
					if (minutes < 10) minutes = '0' + minutes
					var time =
						date.getFullYear() +
						'-' +
						month +
						'-' +
						date.getDate() +
						' ' +
						hours +
						':' +
						minutes
					commentslist[i].startTime = time
				}
			},
			formatStar(sc) {
				//1分对应满星，0.5对应半星
				sc /= 2
				let stars = new Array(5).fill('star-empty')
				const fullStars = Math.floor(sc) //满星的个数
				const halfStar = sc % 1 ? 'star-half' : 'star-empty' //半星的个数，半星最多1个
				stars.fill('star-full', 0, fullStars) //填充满星
				if (fullStars < 5) {
					stars[fullStars] = halfStar //填充半星
				}

				return stars
			},
			navToChooseCinema() {
				let allInfo = JSON.stringify({
					movieId: this.Moviedetail.id,
					movieName: this.Moviedetail.nm,
					showTime: this.Moviedetail.rt,

				})
				uni.navigateTo({
					url: `/pages/select-cinema/select-cinema?allInfo=${allInfo}`
				})
			}
		},
		components: {}
	}
</script>

<style scoped>
	.give-score {
		border-bottom: 1px solid #f0f0f0;
		margin-bottom: 20upx;
		font-size: 36upx;
	}

	.star-img {
		width: 50upx;
		height: 50upx;
		margin: 0 5upx;
	}

	.active-score-star {
		color: orange;
		background-color: orangered;
	}

	.score-star {
		font-size: 36upx;
		color: #000;
		background-color: #fff;
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 2;
	}

	.float-window {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		left: 0;
		background-color: white;
		padding: 20px;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 2;
		width: 100vw;

	}

	textarea {
		width: 100%;
		height: 100px;
		margin-bottom: 10px;
		font-size: 30upx;
	}

	button {
		font-size: 30upx;
		display: block;
		background-color: #e54847;
		color: white;
		border: none;
		border-radius: 5px;
	}

	.purchase {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background: #e54847;
		border-radius: 0;
		color: #fff;
		font-size: 40rpx;
		line-height: 100rpx;
		text-align: center;
		z-index: 1;
	}

	/* 头部预告片 Begin */
	.movie-detail-vedio {
		position: relative;
		display: border-box;
		padding: 5upx 0;
		width: 100%;
		height: 450upx;
		background-color: #fff;
		margin: 20upx 0;
	}

	.movie-vedio {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 380upx;

	}

	/* 头部预告片 End */
	/* 上部分详情 Begin */
	.movie-bgimg {
		position: fixed;
		width: 100%;
		height: 100%;
		background-size: 100%;
		filter: blur(30rpx);
		z-index: -1;
		/* background-color: #40454e; */

		/* position: absolute; */
		/* background-repeat: no-repeat; */
		/* background-size: 100% 100%; */
	}

	.movie-mask {
		background-color: rgba(64, 69, 78, 0.55);
		width: 100%;
	}

	.movie-detail {
		display: flex;
		flex-direction: row;
		padding: 30upx 30upx;

		top: 0;


	}

	.detail-star image {
		width: 36upx;
		height: 36upx;
		margin-right: 5upx;
	}

	.detail-img-ico {
		width: 206upx;
		height: 286upx;
		border: 1px solid #fff;
	}

	.detail-info {
		color: #e5e5e5;
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		font-size: 22rpx;

	}

	.detail-info-nm {
		color: #FFFFFF;
		font-size: 36rpx;
	}

	.detail-info-enm {
		margin-bottom: 12upx;
	}

	/* 上部分详情 End */

	/* 中间简介 Begin */
	.movie-body {
		background-color: #f5f5f5;
		z-index: -1;
		cursor: pointer;

	}

	.movie-intro {
		background-color: #fff;
	}

	.movie-info-titile {
		padding: 20rpx 30rpx 10rpx;
		font-size: 32rpx;
		color: #444;
	}

	.movie-info-texthide {
		line-height: 1.42;
		text-indent: 2em;
		height: 101upx;
		padding: 20upx 20upx;
		overflow: hidden;
		font-size: 30rpx;
		color: #555;
	}

	.movie-info-textauto {
		line-height: 1.42;
		text-indent: 2em;
		padding: 20upx 20upx;
		height: auto;
		font-size: 30rpx;
		color: #555;
	}

	.movie-info-text-btn {
		text-align: center;
	}

	.movie-info-text-btn-img {
		width: 30upx;
		height: 30upx;
	}

	/* 中间简介 End */

	/* 电影图片展示 Begin */
	.movie-detail-photos {
		background-color: #fff;
		margin-top: 20upx;
		display: border-box;
		padding: 25upx 0;
	}

	.movie-detail-photos-text,
	.movie-detail-comment-text {
		font-size: 32rpx;
		padding: 0 20rpx 20rpx 20rpx;
	}

	.movie-photos-scroll {
		width: 100%;
		white-space: nowrap;
	}

	.movie-photos-block {
		display: inline-block;
		margin-left: 20upx;
	}

	.movie-photos-item {
		display: flex;
		flex-direction: row;
		margin-left: 20upx;
	}

	.movie-photos-png {
		width: 240upx;
		height: 180upx;

	}

	/* 电影图片展示 End */

	/* 电影评论 Begin */
	.movie-detail-comment-text {
		display: flex;
		justify-content: space-between;
		border-bottom: 2px solid #f5f5f5;
	}

	.movie-detail-comment-text button {
		margin: 0;
		width: 152rpx;
		font-size: 24rpx;
		background-color: #e54847;
		color: #fff
	}

	.movie-comment-item {
		padding: 30upx 20upx;
		display: flex;
		flex-direction: column;
		border-bottom: 2px solid #f5f5f5;
	}

	.movie-comment {
		display: border-box;
		margin-top: 20upx;
		padding: 20upx 0;
		background-color: #fff;
	}

	.movie-comment-user {
		display: flex;
		flex-direction: row;
	}

	.movie-comment-user-img {
		width: 80upx;
		height: 80upx;
		border-radius: 10%;
	}

	.movie-comment-user-info {
		padding-left: 20upx;
		color: #444;
		font-size: 28rpx;
	}

	.movie-comment-info {
		padding-top: 25upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 100upx;
		font-size: 24rpx;
		color: #999;
	}

	.movie-comment-text {
		padding-left: 100upx;
		font-size: 30rpx;
	}

	.movie-comment-info-ico {
		padding-left: 10upx;
		width: 30upx;
		height: 30upx;
	}

	.search-all {
		color: #ef4238;
		font-size: 15px;
		text-align: center;
		height: 44px;
		line-height: 44px;
	}

	/* 电影评论 End' */
</style>