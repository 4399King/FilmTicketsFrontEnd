<script setup lang="ts">
// 获取屏幕边界到安全区域距离，以适配不同机型
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top  + 'px' }">
    <!-- logo文字 -->
  
    <!-- 搜索条 -->
    <input class="search" placeholder="搜索商品"/>
     
 
  </view>
</template>

<style lang="less">
/* 自定义导航条 */
.navbar {
  // background-image: url(@/static/images/navigator_bg.png);
  background-color: transparent;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .search {
    display: flex;
    width:60%;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #000;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid red;
    
  }
  .search::placeholder {
      color: #000;
    }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
