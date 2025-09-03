import request from '@/utils/request'

// 获取eSIM订单列表
export function getOrderList(params) {
    return request({
      url: '/shopify/order/orderList',
      method: 'get',
      params
    })
  }
// 查询国家/地区管理列表
export function countryManageList(params) {
  return request({
    url: '/business/countryManage/listAnonymous',
    method: 'get',
    params
  })
}
// 查询产品列表
export function lineProductList(params) {
  return request({
    url: '/joyProduct/listing/lineProductList',
    method: 'get',
    params
  })
}
// 查询父产品
export function parentlistAnonymous(params) {
  return request({
    url: '/business/parentProduct/listAnonymousLine',
    method: 'get',
    params
  })
}
export function lineUser(data) {
  return request({
    url: '/business/lineUser',
    method: 'post',
    data
  })
}
export function lineUserInfo(params) {
  return request({
    url: '/business/lineUser/list',
    method: 'get',
    params
  })
}
// 首页搜索
export function lineSearchProductList(params) {
  return request({
    url: '/joyProduct/listing/lineSearchProductList',
    method: 'get',
    params
  })
}
// 查询购买历史
export function buyHistory(params) {
  return request({
    url: '/joyProduct/listing/buyHistory',
    method: 'get',
    params
  })
}
// 首页国家推荐
export function getHotCountry(params) {
  return request({
    url: '/business/countryManage/getHotCountry',
    method: 'get',
    params
  })
}

// 首页国家推荐
export function getByProductPdf(params) {
  return request({
    url: '/open/lineController/addUserIdByProductPdf',
    method: 'get',
    params
  })
}

export function getDaysByCountry(country) {
  return request({
    url: '/joyProduct/listing/lineProductDaysList?parentProductName=' + country,
    method: 'get'
  })
}