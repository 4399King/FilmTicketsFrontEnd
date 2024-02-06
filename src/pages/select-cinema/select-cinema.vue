<template>
  <div class="select-cinema">
    <!-- <import src="../../../templates/cinemaSection/cinemaSection.wxml" />
    <import src="../../../templates/loadingMore/loadingMore.wxml" />
    <import src="../../../templates/nothing/nothing.wxml" /> -->

    <view class="container" :style="{ position: isShow ? 'fixed' : '' }">
      <view class="top">
        <view>
          <select-time
            :start-time="showTime"
            bindselectDayEvent="changeTime"
          ></select-time>
        </view>

        <view>
          <filter-nav
            :city-cinema-info="cityCinemaInfo"
            bindchange="changeCondition"
            bindtoggleShow="toggleShow"
            :hidden="!isShow"
          ></filter-nav>
        </view>
      </view>
      <view class="main-content">
        <view class="cinema-list">
          <!-- <template
            is="cinemaSection"
            wx:for="{{cinemas}}"
            wx:for-item="cinema"
            wx:key="id"
            data="{{cinema,movieId:params.movieId,day:params.day}}"
          /> -->
        </view>
        <view v-if="!loadComplete && cinemas.length">
          <!-- <template is="loadingMore" /> -->
        </view>
        <view :hidden="!nothing">
          <!-- <template is="nothing" data='{{message:"暂无符合条件的影院"}}' /> -->
        </view>
        <view :hidden="!noSchedule">
          <!-- <template is="nothing" data='{{message:"当天暂无场次"}}' /> -->
        </view>
      </view>
    </view>
  </div>
</template>

<script >
export default {
  components: {},
  data() {
    return {
      showTime: '', //影片上映日期
      isShow: false, //导航下拉框是否展开
      cityCinemaInfo: {}, //影院过滤菜单
      params: {
        //影院搜索条件
        movieId: 0,
        day: '',
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
      cinemas: [], //影院列表
      loadComplete: false, //数据是否加载完
      nothing: false, //是否有符合过滤的影院
      noSchedule: false //当天是否有场次，原本时间是由后台返回的，但是缺少城市ID就没有返回，导致当天可能没有播放场次
    }
  },
  computed: {},
  methods: {
    initPage(options) {
      //跳转路由时传参进入options
      const movieId = options.movieId
      const movieName = options.movieName
      this.showTime = options.showTime //影片上映日期
      wx.setNavigationBarTitle({
        title: movieName
      })

      this.params = {
        ...this.data.params,
        movieId
      }

      //select-time会触发事件来调用changeTime初始化数据
    },
    //获取影院列表
    getCinemas(params) {
      const _this = this
      return new Promise((resolve, reject) => {
        wx.request({
          url: `https://m.maoyan.com/ajax/movie?forceUpdate=${Date.now()}`,
          method: 'POST',
          data: params,
          success(res) {
            // 缺少了城市ID所以返回值缺少showDays，只能自己模拟时间了
            resolve(res.data.cinemas)
            _this.setData({
              cinemas: _this.data.cinemas.concat(res.data.cinemas),
              loadComplete: !res.data.paging.hasMore
            })
          }
        })
      })
    },
    //获取过滤菜单数据
    getFilter() {
      const _this = this
      const { params } = this.data
      wx.request({
        url: `https://m.maoyan.com/ajax/filterCinemas?movieId=${params.movieId}&day=${params.day}`,
        success(res) {
          _this.setData({
            cityCinemaInfo: res.data
          })
        }
      })
    },
    //当选择的时间变化时触发
    changeTime(e) {
      const day = e.detail.day
      this.setData(
        {
          params: { ...this.data.params, day },
          cinemas: [],
          isShow: false, //隐藏过滤下拉框
          noSchedule: false
        },
        () => {
          wx.showLoading({
            title: '正在加载...'
          })
          this.getCinemas(this.data.params).then((list) => {
            wx.hideLoading()
            if (!list.length) {
              this.setData({
                noSchedule: true
              })
            }
          })
          this.getFilter()
        }
      )
    },
    //当过滤条件变化时调用的函数
    changeCondition(e) {
      const obj = e.detail
      wx.showLoading({
        title: '正在加载...'
      })
      this.setData(
        {
          params: {
            ...this.data.params,
            ...obj
          },
          cinemas: [],
          nothing: false
        },
        () => {
          this.getCinemas(this.data.params).then((list) => {
            if (!list.length) {
              this.setData({
                nothing: true
              })
            }
            wx.hideLoading()
          })
        }
      )
    },
    //导航下拉框状态变化时的处理，在下拉框展开时禁止滚动穿透
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
      const params = {
        ...this.data.params,
        offset: this.data.cinemas.length
      }
      this.getCinemas(params)
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(options) {
    this.initPage(options)
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
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
.top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #555;
  font-size: 28rpx;
  background: #fff;
  z-index: 10;
}
.main-content {
  padding-bottom: 30rpx;
}

.cinema-list {
  margin-top: 170rpx;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>