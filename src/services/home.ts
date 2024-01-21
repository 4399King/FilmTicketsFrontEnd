import type { BannerItem } from '@/types/home'
import { http } from '@/utils/http'
/**
 *
 * @param distributionSite
 * @returns
 * 获取首页轮播图
 */
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    //指定http函数的泛型T，是以BannerItem为元素的数组
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })
}
/**
 *
 * @returns
 */
export const getHomeCategoryAPI = async () => {
  return http({
    method:"GET",
    url:"/home/category/mutli"
  })
}

export const getHomeHotAPI = async ()=> {
  return http({
    method: "GET",
    url:"/home/hot/mutli"
  })
}



