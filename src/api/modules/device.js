import request from '@/api/request'

const deviceApi = {
  GetDeviceCom: '/device/getDeviceCom',
  GetDeviceCharge: '/device/getDeviceCharge',
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

export function getDeviceCharge (parameter) {
  return request({
    url: deviceApi.GetDeviceCharge,
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
