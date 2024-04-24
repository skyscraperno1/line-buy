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
