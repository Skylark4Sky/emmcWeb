import request from '@/api/request'

const deviceApi = {
  GetDeviceCom: '/device/getDeviceCom',
  GetDeviceChargeList: '/device/getDeviceChargeList',
  GetDeviceList: '/device/getDeviceList',
  GetDeviceTransferLogList: '/device/getDeviceTransferLog',
  SyncDeviceStatus: '/device/syncDeviceStatus'
}

export function getDeviceCom (parameter) {
  return request({
    url: deviceApi.GetDeviceCom,
    method: 'post',
    data: parameter
  })
}

export function getDeviceChargeList (parameter) {
  return request({
    url: deviceApi.GetDeviceChargeList,
    method: 'post',
    data: parameter
  })
}

export function getDeviceList (parameter) {
  return request({
    url: deviceApi.GetDeviceList,
    method: 'post',
    data: parameter
  })
}

export function getDeviceTransferLogList (parameter) {
  return request({
    url: deviceApi.GetDeviceTransferLogList,
    method: 'post',
    data: parameter
  })
}

export function syncDeviceStatus (parameter) {
  return request({
    url: deviceApi.SyncDeviceStatus,
    method: 'post',
    data: parameter
  })
}
