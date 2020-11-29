<template>
  <a-modal
    title="日志预览"
    :width="680"
    :visible="visible"
    :confirmLoading="loading"
    :closable="true"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
    footer=""
    :centered="true"
  >
    <a-spin :spinning="loading" size="small">
      <a-descriptions v-if="showDataList(this.model.behavior)" :title="'设备序列号: ' + this.model.device_sn">
        <a-descriptions-item label="上报状态">{{ this.model.behavior }}</a-descriptions-item>
        <a-descriptions-item label="上报标志">{{ this.model.transfer_id }}</a-descriptions-item>
        <a-descriptions-item label="上报时间">{{ moment(this.model.create_time).format('YYYYMMDD HH:mm:ss') }}</a-descriptions-item>
      </a-descriptions>

      <a-descriptions v-if="isShowOther(this.model.behavior)" :title="'设备序列号: ' + this.model.device_sn">
        <a-descriptions-item label="上报状态">{{ this.model.behavior }}</a-descriptions-item>
        <a-descriptions-item label="上报标志">{{ this.model.transfer_id }}</a-descriptions-item>
        <a-descriptions-item label="上报时间">{{ moment(this.model.create_time).format('YYYYMMDD HH:mm:ss') }}</a-descriptions-item>
      </a-descriptions>

      <a-descriptions v-if="isSetConfig(this.model.behavior)" :title="'设备序列号: ' + this.model.device_sn">
        <a-descriptions-item label="上报状态">{{ this.model.behavior }}</a-descriptions-item>
        <a-descriptions-item label="上报标志">{{ this.model.transfer_id }}</a-descriptions-item>
        <a-descriptions-item label="空载时间">{{ this.data.time }}</a-descriptions-item>
        <a-descriptions-item label="上报时间">{{ moment(this.model.create_time).format('YYYYMMDD HH:mm:ss') }}</a-descriptions-item>
      </a-descriptions>

      <a-descriptions v-if="isChargeTask(this.model.behavior)" :title="'设备序列号: ' + this.model.device_sn">
        <a-descriptions-item label="上报端口" >{{ this.data.id }}</a-descriptions-item>
        <a-descriptions-item label="上报标志">{{ this.model.transfer_id }}</a-descriptions-item>
        <a-descriptions-item label="最大电量">{{ this.data.energy }}</a-descriptions-item>
        <a-descriptions-item label="最大电流">{{ this.data.electricity }}</a-descriptions-item>
        <a-descriptions-item label="最大时间">{{ this.data.time }}</a-descriptions-item>
        <a-descriptions-item label="上报时间">{{ moment(this.model.create_time).format('YYYYMMDD HH:mm:ss') }}</a-descriptions-item>
      </a-descriptions>

      <a-descriptions v-if="isExitChargeTask(this.model.behavior)" :title="'设备序列号: ' + this.model.device_sn">
        <a-descriptions-item label="上报端口" >{{ this.data.id }}</a-descriptions-item>
        <a-descriptions-item label="强制停止">{{ this.data.energy ? '是':'否' }}</a-descriptions-item>
        <a-descriptions-item label="上报标志">{{ this.model.transfer_id }}</a-descriptions-item>
        <a-descriptions-item label="上报时间">{{ moment(this.model.create_time).format('YYYYMMDD HH:mm:ss') }}</a-descriptions-item>
      </a-descriptions>

      <s-table
        v-if="showDataList(this.model.behavior)"
        ref="table"
        size="middle"
        :columns="columns"
        :data="loadDetailList"
        showPagination="auto">
      </s-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import moment from 'moment'

const GISUNLINK_CHARGE_TASK = 0x10 // 下发
const GISUNLINK_DEVIDE_STATUS = 0x11 // 查询
const GISUNLINK_EXIT_CHARGE_TASK = 0x12 // 终止
const GISUNLINK_SET_CONFIG = 0x13 // 配置
const GISUNLINK_RESTART = 0x1E // 重启

const GISUNLINK_COM_NO_UPDATE = 0x1D // 参数没有刷新
const GISUNLINK_START_CHARGE = 0x14 // 开始
const GISUNLINK_CHARGEING = 0x15 // 执行中
const GISUNLINK_CHARGE_FINISH = 0x16 // 完成
const GISUNLINK_CHARGE_LEISURE = 0x17 // 空闲中
const GISUNLINK_CHARGE_BREAKDOWN = 0x18 // 故障
const GISUNLINK_CHARGE_NO_LOAD = 0x19 // noload
const GISUNLINK_UPDATE_FIRMWARE = 0x1A // 升级
const GISUNLINK_COM_UPDATE = 0x1B // 参数刷新
const GISUNLINK_STOP_CHARGE = 0x1C // 停止

const columns = [
    {
      title: '端口',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '时间',
      customRender: (text, record) => {
        return `${record.maxTime} : ${record.useTime}`
      }
    },
    {
      title: '度数',
      customRender: (text, record) => {
        return `${record.maxEnergy} : ${record.useEnergy}`
      }
    },
    {
      title: '电流',
      customRender: (text, record) => {
        return `${record.maxElectricity} : ${record.curElectricity}`
      }
    },
    {
      title: '状态',
      customRender: (text, record) => {
        return `错误码:${record.errCode} 状态:${record.enable} 扩展:${record.chipReset} 行为:${record.behavior} `
      }
    }
]

export default {
  components: {
    STable
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => []
    }
  },
  created () {
    this.$watch('model', () => {
      this.data = JSON.parse(this.model.payload_data)
      console.log('JSON.parse(this.model.payload_data):' + JSON.stringify(this.data))
      if (this.showDataList(this.model.behavior)) {
        this.model && this.$refs.table.refresh(true)
      }
    })
  },
  methods: {
    moment,
    showDataList (behavior) {
      let res = false
      switch (behavior) {
        case GISUNLINK_START_CHARGE:		// 开始充电
        case GISUNLINK_CHARGEING:				// 充电中
        case GISUNLINK_CHARGE_FINISH:		// 充电完成
        case GISUNLINK_CHARGE_LEISURE:	// 空闲中
        case GISUNLINK_CHARGE_BREAKDOWN:// 充电故障
        case GISUNLINK_CHARGE_NO_LOAD:	// 空载充电
        case GISUNLINK_UPDATE_FIRMWARE:	// 固件升级
        case GISUNLINK_COM_UPDATE:			// 端口数据更新
        case GISUNLINK_STOP_CHARGE: // 停止充电
        case GISUNLINK_COM_NO_UPDATE: // 参数没有刷新
          res = true
          break
      }
      return res
    },
    isChargeTask (behavior) {
      let res = false
      if (behavior === GISUNLINK_CHARGE_TASK) {
        res = true
      }
      return res
    },
    isExitChargeTask (behavior) {
      let res = false
      if (behavior === GISUNLINK_EXIT_CHARGE_TASK) {
        res = true
      }
      return res
    },
    isSetConfig (behavior) {
      let res = false
      if (behavior === GISUNLINK_SET_CONFIG) {
        res = true
      }
    return res
  },
    isShowOther (behavior) {
      let res = false
      if (behavior === GISUNLINK_DEVIDE_STATUS || behavior === GISUNLINK_RESTART) {
        res = true
      }
      return res
    }
  },
  data () {
    this.columns = columns
    this.data = null
    return {
      // 加载数据方法 必须为 Promise 对象
      loadDetailList: () => {
        return new Promise(resolve => {
          const datalist = JSON.parse(this.model.payload_data)
          resolve({
            data: { 'datalist': datalist, 'page': { pageNum: 1, total: datalist.length } }
          })
        }).then(res => {
          return res
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-modal-body {
    padding: 14px 14px 0px 14px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
</style>
