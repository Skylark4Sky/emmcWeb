import request from '@/api/request'

const moduleApi = {
  GetModuleList: '/device/getModuleList',
  GetModuleConnectLog: '/device/getModuleConnectLog'
}

export function getModuleList (parameter) {
  return request({
    url: moduleApi.GetModuleList,
    method: 'post',
    data: parameter
  })
}

export function getModuleConnectLog (parameter) {
  return request({
    url: moduleApi.GetModuleConnectLog,
    method: 'post',
    data: parameter
  })
}
