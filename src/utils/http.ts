import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    //超时默认60s
    options.timeout = 10000
    //请求头，标记该请求为wx小程序的请求
    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    const memberStore = useMemberStore()
    //请求头中添加用户的token
    const token = memberStore.profile?.token
    if (token) {
      options.header.token = token
    }
    console.log(options.url)
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/** 
 * @param UniApp.RequestOptions
   @return Promise
   */

interface Data<T> {
  code: string
  msg: string
  result: T
}
/**
 * uni的request在服务器响应后就调用success，
 * 但是例如axios，应该在服务器响应并且响应码为
 * 200才应该调用success，因此封装一个http函数
 * 弥补uni.request的缺陷*/
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    //返回promise方便使用这个函数以后用await接受结果
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>) //断言res.data就是Data<T>类型
        } else if (res.statusCode === 401) {
          //401错误，清理用户信息并跳转到首页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: 'pages/login/login' })
          reject(res)
        } else {
          //其他错误，提示用户
          uni.showToast({
            icon: 'error',
            title: (res.data as Data<T>).msg || '请求错误', //把res.data断言为后端的接口返回格式对应的类型
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络',
        })
        console.log('loss')
        reject(err)
      },
    })
  })
}
