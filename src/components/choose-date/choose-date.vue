<template>
  <view class="choose-date">
    <scroll-view class="timeline scroll-view_H" scroll-x>
      <view
        :class="['day', item.day === selectDay ? 'active' : '']"
        v-for="item in days"
        :key="item"
        @click="selectDay"
        :data-day="item.day"
        >{{ item.title }}</view
      >
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'choose-date',
  props: {},
  data() {
    return { selectDay: '', days: [] }
  },
  computed: {},
  methods: {},
  watch: {},

  // 组件周期函数--监听组件挂载完毕
  mounted() {},
  // 组件周期函数--监听组件数据更新之前
  beforeUpdate() {},
  // 组件周期函数--监听组件数据更新之后
  updated() {},
  // 组件周期函数--监听组件激活(显示)
  activated() {},
  // 组件周期函数--监听组件停用(隐藏)
  deactivated() {},
  // 组件周期函数--监听组件销毁之前
  beforeDestroy() {}
}
</script>

<style scoped>
.timeline {
  height: 90rpx;
  border-bottom: 1px solid #e6e6e6;
}
/* 设置了externalClasses 不起作用 */
.scroll-view_H {
  white-space: nowrap;
  width: 100%;
}

.day {
  display: inline-block;
  height: 90rpx;
  width: 30%;
  line-height: 90rpx;
  text-align: center;
  box-sizing: border-box;
  margin: 0 10rpx;
  font-size: 28rpx;
  color: #333;
}

.day.active {
  color: #ef4238;
  border-bottom: 2px solid #ef4238;
}
</style>