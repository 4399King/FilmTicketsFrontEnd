<script setup lang="ts">
// 获取屏幕边界到安全区域距离，以适配不同机型
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
    <view class="navbar" :style="{ marginTop: safeAreaInsets!.top  + 'px' }">
        <!-- logo文字 -->
        <view class="btn">搜索</view>
        <!-- 搜索条 -->
        <input
            class="search"
            placeholder="搜索影片 / 影城"
            placeholder-style="color:#e8e8e8;font-size:30rpx;font-weight:500"
            :style="{ 'placeholder-color': '#000' }"
        />
    </view>
</template>

<style lang="less" scoped>
/* 自定义导航条 */
.navbar {
    // background-image: url(@/static/images/navigator_bg.png);
    position: relative;
    background-color: transparent;
    background-size: cover;
    position: relative;
    display: flex;
    flex-direction: column;

    .btn {
        position: absolute;
        top: 16rpx;
        left: 406rpx;
        width: 100rpx;
        height: 64rpx;
        background-color: rgba(255, 255, 255, 0.4);
        border-radius: 0 32rpx 32rpx 0;
        border: 1px solid rgba(0, 0, 0, 0.3);
        font-size: 32rpx;
        line-height: 64rpx;
        text-align: center;
        color: #e8e8e8;
    }
    .search {
        display: flex;
        width: 60%;
        align-items: center;
        justify-content: space-between;
        padding: 0 10rpx 0 26rpx;
        height: 64rpx;
        margin: 16rpx 20rpx;
        color: #e8e8e8;
        font-size: 28rpx;
        border-radius: 32rpx;
        background-color: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(0, 0, 0, 0.3);
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
