<template>
  <view class="container" :style="'position:' + (isShow ? 'fixed' : '')">
    <view class="topbar">
      <view class="city-entry" url="../../subPages/city-select/city-select">
        <text class="city-name">{{ city }}</text>
        <text class="city-entry-arrow"></text>
      </view>
      <view
        url="../../subPages/search-page/search-page?stype=2"
        class="search-input"
      >
        <text class="iconfont icon-sousuo"></text>搜影院</view
      >
    </view>
    <view class="nav-wrapper">
      <filter-nav
        city-cinema-info="{{cityCinemaInfo}}"
        bindchange="changeCondition"
        bindtoggleShow="toggleShow"
      ></filter-nav>
    </view>
    <view class="cinema-list">
      <!-- <template
        is="cinemaSection"
        wx:for="{{cinemas}}"
        wx:for-item="cinema"
        wx:key="id"
        data="{{cinema}}"
      /> -->
      <navigator
        class="cinema-section"
        url="/pages/subPages/cinema-detail/cinema-detail?cinemaId={{cinema.id}}&movieId={{movieId}}&day={{day}}"
        hover-class="none"
      >
        <view class="name-price line-ellipsis"
          >{{ cinema.nm }}
          <text class="sell-price" wx:if="{{cinema.sellPrice}}"
            ><text class="price">{{ cinema.sellPrice }}</text> 元起</text
          >
        </view>
        <view class="address">
          <text class="line-ellipsis">{{ cinema.addr }}</text>
          <text class="distance">{{ cinema.distance }}</text>
        </view>
        <view class="feature-tags">
          <text wx:if="{{cinema.endorse || cinema.tag.endorse}}">退</text>
          <text wx:if="{{cinema.allowRefund || cinema.tag.allowRefund}}"
            >改签</text
          >
          <text
            wx:for="{{cinema.hallType || cinema.tag.hallType}}"
            wx:key="{{item}}"
            >{{ item }}</text
          >
          <text class="featrue" wx:if="{{cinema.snack || cinema.tag.snack}}"
            >小吃</text
          >
          <text
            class="featrue"
            wx:if="{{cinema.vipDesc ||cinema.tag.vipTag}}"
            >{{ cinema.vipDesc || cinema.tag.vipTag }}</text
          >
        </view>
        <view wx:if="{{!!cinema.promotion.cardPromotionTag}}">
          <text class="card"></text>
          <text class="discount-label-text">{{
            cinema.promotion.cardPromotionTag
          }}</text>
        </view>
        <view wx:if="{{cinema.showTimes}}" class="showTimes"
          >近期场次：{{ cinema.showTimes }}</view
        >
      </navigator>
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
export default {
  components: {},
  data() {
    return {
      city: '正在定位...',
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
      // filter-nav
      properties: {
        cityCinemaInfo: {
          type: Object,
          value: {},
          observer: function (newVal, oldVal, changedPath) {
            const sideList = newVal.district ? newVal.district.subItems : []
            this.setData({
              selectRegion: { ...this.data.selectRegion, sideList }
            })
          }
        },
        hidden: {
          type: Boolean,
          value: true,
          observer: function (newVal) {
            if (newVal) {
              this.setData({
                itemNum: -1
              })
            }
          }
        }
      }
    }
  },
  computed: {},
  methods: {
    //初始化页面
    initPage() {
      wx.showLoading({
        title: '正在加载...'
      })

      this.getCinemas(this.params).then(() => {
        wx.hideLoading()
      })
      wx.request({
        url: 'https://m.maoyan.com/ajax/filterCinemas',
        success: (res) => {
          this.cityCinemaInfo = res.data
        }
      })
    },
    //获取影院列表
    getCinemas(params) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: 'https://m.maoyan.com/ajax/cinemaList',
          data: params,
          success: (res) => {
            resolve(res.data.cinemas)
            console.log(res, 'wakakak')
            this.cinemas = this.cinemas.concat(res.data.cinemas)
            this.loadComplete = !res.data.paging.hasMore
          }
        })
      })
    },
    //当过滤条件变化时调用的函数
    changeCondition(e) {
      const obj = e.detail
      wx.showLoading({
        title: '正在加载...'
      })

      this.params = { ...this.data.params, ...obj }
      this.cinemas = []
      this.nothing = false

      this.getCinemas(this.params).then((list) => {
        if (!list.length) {
          this.nothing = true
        }
        wx.hideLoading()
      })
    },
    //导航下拉框状态变化时的处理
    toggleShow(e) {
      const item = e.detail.item
      this.setData({
        isShow: item !== -1
      })
    },
    //上拉触底加载更多
    onReachBottom() {
      if (this.data.loadComplete) {
        return
      }
      const params = { ...this.data.params, offset: this.data.cinemas.length }
      this.getCinemas(params)
    },
    //转发
    onShareAppMessage(res) {
      return {
        title: '最近上映的这些电影你都看了吗？',
        path: 'pages/tabBar/movie/movie'
      }
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    let app = getApp()
    console.log(app, 'appp')
    if (app.globalData.userLocation) {
      this.city = app.globalData.selectCity
        ? app.globalData.selectCity.cityName
        : '定位失败'
    } else {
      app.userLocationReadyCallback = () => {
        this.city = app.globalData.selectCity
          ? app.globalData.selectCity.cityName
          : '定位失败'
      }
    }
    this.initPage()
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
@import '/assets/font/icon.wxss';

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