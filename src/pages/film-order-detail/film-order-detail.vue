<template>
  <div class="film-order-detail">
    <view class='container' v-if='order'>
      <view class='ticket-content'>
        <div class='cinema' url='../cinema-detail/cinema-detail?cinemaId={{order.cinemaId}}' hover-class='none'>
          <view>{{ order.cinemaName }}</view>
          <view class='triangle'></view>
        </div>
        <view class='movie-info'>
          <view class='movie-name line-ellipsis'>{{ order.movieName }}</view>
          <view class='showTime line-ellipsis'>{{ order.time }} {{ order.lang }}</view>
          <view class='position line-ellipsis'>{{ order.hall }} {{ order.seat }}</view>
        </view>
        <view class='divider-box'>
          <view class='divider'></view>
          <image class='status' src='../../static/image/user/status.png'></image>
        </view>
        <view class='code-container'>
          <view class='code-box'>
            <view>手机号：178××××2533</view>
            <view>流水号：{{ order.flowNumber }}</view>
            <!-- <view>验证码：{{ order.Vcode }}</view> -->
          </view>
          <view class='rq'>
            <image src='../../static/image/user/qr.png'></image>
          </view>
        </view>
      </view>
      <view class='price-box box'>
        <view>订单号：{{ order.orderId }}</view>
        <view>总价：{{ order.price }}元</view>
      </view>
      <view class='map-box'>
        <template is="cinemaMap" :data='{ cinemaData: order.cinemaData }' />
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
    return { order: null }
  },

  computed: {},
  methods: {},
  watch: {},
  // 页面周期函数--监听页面加载
  onLoad(opt) {
    this.order = JSON.parse(opt.paramsStr)
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() { },
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() { },
  // 页面周期函数--监听页面隐藏
  onHide() { },
  // 页面周期函数--监听页面卸载
  onUnload() { },
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
</style>