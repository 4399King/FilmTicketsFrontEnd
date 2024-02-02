<template>
  <view class="container" :style="'position:' + (isShow ? 'fixed' : '')">
    <view class="topbar">
      <view class="city-entry" url="../../subPages/city-select/city-select">
        <text class="city-name">{{ city }}</text>
        <text class="city-entry-arrow"></text>
      </view>
      <input
        url="../../subPages/search-page/search-page?stype=2"
        class="search-input"
        placeholder="搜影院"
      />
      <button class="iconfont icon-sousuo">搜索</button>
    </view>
    <view class="nav-wrapper">
      <!-- <filter-nav
        city-cinema-info="{{cityCinemaInfo}}"
        bindchange="changeCondition"
        bindtoggleShow="toggleShow"
      ></filter-nav> -->
      <view class="nav">
        <view class="tab">
          <view
            :class="['nav-item', itemNum === 1 ? 'select-item' : '']"
            @click="selectItemNum"
            :data-item-num="1"
          >
            <text class="title line-ellipsis">{{ itemName1 }}</text>
            <text class="city-entry-arrow"></text>
          </view>
          <view
            :class="[
              'nav-item',
              'have-border',
              itemNum === 2 ? 'select-item' : ''
            ]"
            @click="selectItemNum"
            :data-item-num="2"
          >
            <text class="title line-ellipsis">{{ itemName2 }}</text>
            <text class="city-entry-arrow"></text>
          </view>
          <view
            :class="['nav-item', itemNum == 3 ? 'select-item' : '']"
            @click="selectItemNum"
            :data-item-num="3"
          >
            <text class="title line-ellipsis">{{ itemName3 }}</text>
            <text class="city-entry-arrow"></text>
          </view>
        </view>
        <view class="nav-content">
          <view
            class="nav-content-item region"
            :style="{ display: itemNum === 1 ? 'block' : 'none' }"
          >
            <view class="tab">
              <view
                :class="['nav-item', selectRegion.item === 0 ? 'active' : '']"
                @click="selectRegionItem"
                :data-index="0"
                >商区</view
              >
              <view
                :class="['nav-item', selectRegion.item === 1 ? 'active' : '']"
                @click="selectRegionItem"
                :data-index="1"
                >地铁站</view
              >
            </view>
            <view class="region-list">
              <scroll-view class="region-sidenav" scroll-y>
                <view
                  v-for="item in selectRegion.sideList"
                  :key="item.id"
                  :class="[
                    'line-ellipsis',
                    'side-item',
                    selectRegion.item === 0
                      ? item.id === selectRegion.selectDistrictId
                        ? 'active'
                        : ''
                      : item.id === selectRegion.selectLineId
                      ? 'active'
                      : ''
                  ]"
                  @click="regionSideClick"
                  :data-side="item"
                  >{{ item.name }}({{ item.count }})</view
                >
              </scroll-view>
              <scroll-view class="region-list-item" scroll-y>
                <view
                  v-for="item in selectRegion.list"
                  :key="item.id"
                  :class="[
                    'item',
                    selectRegion.item === 0
                      ? item.id === selectRegion.selectAreaId
                        ? 'red'
                        : ''
                      : item.id === selectRegion.selectStationId
                      ? 'red'
                      : ''
                  ]"
                  @click="regionListClick"
                  :data-item="item"
                >
                  <view>
                    <text
                      class="iconfont icon-hook"
                      :style="{
                        visibility:
                          selectRegion.item === 0
                            ? item.id === selectRegion.selectAreaId
                              ? ''
                              : 'hidden'
                            : item.id === selectRegion.selectStationId
                            ? ''
                            : 'hidden'
                      }"
                    ></text>
                    {{ item.name }}
                  </view>
                  <view>{{ item.count }}</view>
                </view>
              </scroll-view>
            </view>
          </view>
          <view
            class="nav-content-item brand"
            :style="{ display: itemNum === 2 ? 'block' : 'none' }"
          >
            <scroll-view class="brand-scroll-view" scroll-y>
              <view
                v-for="item in cityCinemaInfo.brand.subItems"
                :key="item.id"
                :class="['brand-item ', selectBrandId === item.id ? 'red' : '']"
                @click="selectBrand"
                :data-brand="item"
              >
                <view>
                  <text
                    class="iconfont icon-hook"
                    :style="{
                      visibility: selectBrandId === item.id ? '' : 'hidden'
                    }"
                  ></text>
                  {{ item.name }}
                </view>
                <view class="brand-count">{{ item.count }}</view>
              </view>
            </scroll-view>
          </view>
          <view
            class="nav-content-item special"
            :style="{ display: itemNum === 3 ? 'block' : 'none' }"
          >
            <scroll-view class="special-scroll-view" scroll-y>
              <view class="item-title">特色功能</view>
              <view class="item-list">
                <view
                  v-for="item in cityCinemaInfo.service.subItems"
                  :key="item.id"
                  :class="[
                    'btn',
                    'line-ellipsis',
                    selectServiceId === item.id ? 'select' : ''
                  ]"
                  @click="specialSelectItem"
                  :data-type-id="item.id"
                  data-type="service"
                  >{{ item.name }}</view
                >
              </view>
              <view class="item-title">特殊厅</view>
              <view class="item-list">
                <view
                  v-for="item in cityCinemaInfo.hallType.subItems"
                  :key="item.id"
                  :class="[
                    'btn',
                    'line-ellipsis',
                    selectHallTypeId === item.id ? 'select' : ''
                  ]"
                  @click="specialSelectItem"
                  :data-type-id="item.id"
                  data-type="hallType"
                  >{{ item.name }}</view
                >
              </view>
            </scroll-view>
            <view class="special-btn">
              <view class="btn" @click="specialReset">重置</view>
              <view class="btn confirm-btn" @click="specialConfirm">确定</view>
            </view>
          </view>
        </view>
        <view
          class="mask"
          @click="cancal"
          :style="{ display: itemNum === -1 ? 'none' : 'block' }"
          catchtap="cancal"
        ></view>
      </view>
    </view>
    <view class="cinema-list">
      <!-- <template
        is="cinemaSection"
        wx:for="{{cinemas}}"
        wx:for-item="cinema"
        wx:key="id"
        data="{{cinema}}"
      /> -->
      <view
        v-for="cinema in cinemas"
        :key="cinema.id"
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
            v-for="item in cinema.hallType || cinema.tag.hallType"
            :key="item"
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
      </view>
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
      //cinema
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
      nothing: false, //结果是否为空
      cinemas: [], //影院列表
      cityCinemaInfo: {}, //城市影院信息
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
          console.log(this.cityCinemaInfo, '46464')
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

      this.params = { ...this.params, ...obj }
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
    toggleShow(item) {
      this.isShow = item !== -1
    },
    //上拉触底加载更多
    onReachBottom() {
      if (this.loadComplete) {
        return
      }
      const params = { ...this.params, offset: this.cinemas.length }
      this.getCinemas(params)
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
      this.triggerEvent('change', {
        brandId: brand.id
      })
      this.selectBrandId = brand.id
      this.itemName2 = brandName
      this.itemNum = -1
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
      const { selectServiceId, selectHallTypeId } = this
      this.triggerEvent('change', {
        serviceId: selectServiceId,
        hallType: selectHallTypeId
      })
      this.itemNum = -1
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
          (item) => item.id === obj.selectDistrictId
        )
        obj.list = findItem.subItems ? findItem.subItems : []
      } else {
        obj.item = 1
        obj.sideList = cityCinemaInfo.subway.subItems
        const findItem = obj.sideList.find(
          (item) => item.id === obj.selectLineId
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
          this.triggerEvent('change', {
            districtId: -1,
            lineId: selectLineId,
            areaId: -1,
            stationId: selectStationId
          })((this.itemNum = -1))
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
          this.triggerEvent('change', {
            districtId: selectDistrictId,
            lineId: -1,
            areaId: selectAreaId,
            stationId: -1
          })
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
      let obj = { ...this.selectRegion }
      if (this.selectRegion.item === 0) {
        obj.selectAreaId = item.id
      } else {
        obj.selectStationId = item.id
      }
      this.triggerEvent('change', {
        districtId: obj.selectDistrictId,
        lineId: obj.selectLineId,
        areaId: obj.selectAreaId,
        stationId: obj.selectStationId
      })
      this.selectRegion = obj
      this.itemNum = -1
      this.itemName1 = item.name
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
    let app = getApp()
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