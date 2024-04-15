<template>
  <view class="login-container">
    <div class="login-btn-box">
      <p class="title">电影订票微信小程序</p>
      <button class="login-btn" @click="showLoginBox">登 录</button>
    </div>
    <div class="mask" v-show="isShowLogin" @click="cancelLogin"></div>
    <div class="login-box" v-show="isShowLogin">
      <div class="avatar-box">
        <span>选择头像：</span>
        <button class="box-img" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="avatar" :src="avatarUrl"></image>
        </button>
      </div>
      <div class="nickname-box">
        <span>输入昵称：</span>
        <input :value="nickname" @input="inputName" @blur="blurName" type="nickname" class="nickname"
          placeholder="请输入昵称" />
      </div>

      <div class="btns">
        <button class="sure" @click="login(1)">确认</button>
        <button class="cancel" @click="login(0)">取消</button>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isShowLogin: true,
      avatarUrl: "",
      nickname: "",
    };
  },
  methods: {
    inputName(e) {
      this.nickname = e.detail.value;
    },
    blurName(e) {
      this.nickname = e.detail.value;
    },
    showLoginBox() {
      this.isShowLogin = true;
    },
    async login(order) {


      if (order) {
        if (this.avatarUrl === '' || this.nickname === '') {
          uni.showToast({
            title: '请选择头像和昵称',
            icon: 'none',  // 图标，有效值 "success", "loading", "none"
            duration: 2000 // 提示的延迟时间，单位毫秒，默认为 1500
          });
          return
        }
     
        try {
          const loginRes = await new Promise(
            (resolve, reject) => {
              uni.login({
                provider: 'weixin',
                success: resolve,
                fail: reject
              })
            }
          )
          // 同步存储数据
          uni.setStorageSync("userName", this.nickname);
          uni.setStorageSync("userImg", this.avatarUrl);
          const {data} = await uni.request({
            url: "https://film.sipc115.com/user/login",
            method: "POST",
            data: {
              jsCode: loginRes.code
            }
          })
          switch(data.code) {
            case "00000":
              const {token} = data.data;
              uni.setStorageSync("token",token);
              this.isShowLogin = false;
              uni.switchTab({ url: "/pages/index/index" });
              uni.showToast({
                title:"登陆成功",
                duration:1000
              })
              break;
            default:
              throw new Error(data)
          }
          
        } catch (error) {
          console.log("操作失败",error)
        }

      } else {
        this.isShowLogin = false;
      }
    },

    onChooseAvatar(e) {
      this.avatarUrl = e.detail.avatarUrl;
    },
    cancelLogin() {
      this.isShowLogin = false;
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100vh;

  .login-btn-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 36rpx;
    }

    .login-btn {
      width: 320rpx;
      background-color: orange;
      color: #fff;
      margin-top: 50rpx;
    }
  }

  .mask {
    width: 100vw;
    height: 100vh;
    background-color: black;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .login-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 50rpx 50rpx 0 50rpx;
    border-radius: 15px 15px 0 0;
    background-color: #fff;

    .avatar-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0;
      padding: 20rpx 0;

      .box-img {
        width: 102rpx;
        height: 102rpx;
        margin: 0;
        padding: 0;
        font-size: 25rpx;

        .avatar {
          width: 100%;
          height: 100%;

          // border: 1px solid #f0f0f0;
        }
      }
    }

    .nickname-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx 0;
      border-bottom: 1px solid #f0f0f0;

      .nickname {
        border: 1px solid #f0f0f0;
        border-radius: 5px;
        background-color: #f0f0f0;
        width: 360rpx;
        height: 60rpx;
        text-align: center;
      }
    }

    .btns {
      display: flex;
      padding: 30rpx 0;

      button {
        height: 65rpx;
        line-height: 65rpx;
        font-size: 32rpx;
      }

      .sure {
        background-color: orange;
        color: #fff;
      }
    }
  }
}
</style>
