<template>
	<div class="">
		<view class="swiper-container">
			<view class="post-bg" :style="{ 'background-image': `url(${movie?.img})` }"></view>
			<view class="post-bg-mask"></view>
			<scroll-view class="swiper-wrapper scroll-view_H" scroll-x scroll-with-animation :scroll-left="scrollLeft">
				<view class="movie-item" ref="item" v-for="(item,index) in movies" :key="item.id" data-movie="item"
					:id="`item${index}`" @click="selectMovie(item)">
					<view :class="['post', movie?.id === item?.id ? 'select' : '']">
						<image :src="item?.img"></image>
						{{ item.schedule_id }}
					</view>
				</view>
			</scroll-view>
		</view>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				// movies: [],
				// movie: null, //选中的电影
				day: '',
				scrollLeft: 0, //设置滚动条位置
				size: 0, //电影item的大小（包括margin）
				i: 0 //当前电影的索引,下面的函数传递了事件对象后就不能传递其他参数了，所以只能放在data中传递}
			}
		},
		props: ['movie', 'movies', 'defaultSelectID'],
		// onLoad() {
		// 	this.selectMovie(this.movie)
		// },
		computed: {},
		watch: {
			movies(movies) {
				this.selectMovie(this.movie)
			}
		},
		methods: {
			//选中电影
			selectMovie(movie) {
				console.log('touch', this.movies)

				// const movie =
				//   movie ||
				//   movies.find((item) => item.id == this.defaultSelectID) ||
				//   movies[this.i]
				// console.log("movie:", e.currentTarget.dataset.movie,movies.find((item) => item.id == this.defaultSelectID), movies[this.i])
				// if (this.movies.length && this.movie && movie.id === this.movie.id) {
				// 	return
				// }

				const index = this.movies.findIndex(item => item.id === movie.id)
				// if (this.size) {
				// 	this.movie = movie
				// 	this.scrollLeft = this.size * index
				// } else {
				console.log('beforeCal')
				this.calcSize().then(size => {
					// this.movie = movie;
					console.log('calSize')
					this.size = size
					console.log('size:', size)
					this.scrollLeft = size * index
				})
				// this.scrollLeft = this.size * index
				// }
				this.$emit('selectMovie', movie)
			},
			//计算节点大小
			calcSize() {
				return new Promise((resolve, reject) => {
					const query = wx.createSelectorQuery().in(this)
					query
						.select('#item1')
						.fields({
								size: true,
								computedStyle: ['margin-left']
							},
							function(res) {
								let size = 0
								if (res) {
									size = res.width + parseFloat(res['margin-left'])
								}
								resolve(size)
							}
						)
						.exec()
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.swiper-container {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.post-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		-webkit-filter: blur(30px);
		filter: blur(30px);
		background-position-y: 40%;
	}

	.post-bg-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #40454d;
		opacity: 0.55;
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}

	.movie-item {
		display: inline-block;
		width: 156rpx;
		height: 228rpx;
		margin: 50rpx 0 40rpx 40rpx;
	}

	.movie-item:first-child {
		margin-left: calc(50vw - 78rpx);
	}

	.movie-item:last-child {
		margin-right: calc(50vw - 78rpx);
	}

	.movie-item .post {
		width: 156rpx;
		height: 228rpx;
		transition: transform 0.3s;
	}

	.movie-item .post.select {
		position: relative;
		transform: scale(1.15);
		border: 2px solid #fff;
	}

	.movie-item .post.select::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 50%;
		transform: translateX(-50%);
		width: 20rpx;
		height: 10rpx;
		background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMwODIyNEEwNTkwRDExRTZBNkMwOTE1NDA0RjA5MDA3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMwODIyNEExNTkwRDExRTZBNkMwOTE1NDA0RjA5MDA3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzA4MjI0OUU1OTBEMTFFNkE2QzA5MTU0MDRGMDkwMDciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzA4MjI0OUY1OTBEMTFFNkE2QzA5MTU0MDRGMDkwMDciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7kjYk3AAAAVUlEQVR42qzMMQ7AIAwEwSvy8P25EwokZNkYCFcgCu/IzLB7Q9+jS2gz1MG/KN0ZwVOU0fDgLorvI3AVJWozsELJuhmYocyaCvQo1f2jeiT/cK8AAwBzvH2t7aaajQAAAABJRU5ErkJggg==');
		background-repeat: no-repeat;
		background-size: contain;
	}

	.movie-item image {
		width: 100%;
		height: 100%;
	}
</style>