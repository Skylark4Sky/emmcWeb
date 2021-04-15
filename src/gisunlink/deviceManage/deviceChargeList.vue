<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="设备ID">
                <a-input v-model="requestCond.device_id" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="充电状态">
                <a-select v-model="requestCond.state" placeholder="选择状态" default-value="0">
                  <a-select-option value="0">按全部状态</a-select-option>
                  <a-select-option value="1">下发开始充电</a-select-option>
                  <a-select-option value="2">设备开始充电</a-select-option>
                  <a-select-option value="4">下发停止充电</a-select-option>
                  <a-select-option value="8">设备停止充电</a-select-option>
                  <a-select-option value="16">已充电中</a-select-option>
                  <a-select-option value="32">充电完成</a-select-option>
                  <a-select-option value="64">触发空载</a-select-option>
                  <a-select-option value="128">触发异常</a-select-option>
                  <a-select-option value="256">异常退出</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="是否完成">
                  <a-select v-model="requestCond.charge_over" placeholder="全部" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">未完成</a-select-option>
                    <a-select-option value="2">已完成</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="时间类型">
                  <a-select v-model="requestCond.time" placeholder="按创建时间" default-value="create_time">
                    <a-select-option value="create_time">按创建时间</a-select-option>
                    <a-select-option value="update_time">按更新时间</a-select-option>
                    <a-select-option value="end_time">按结束时间</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="开始时间">
                  <a-date-picker
                    v-model="requestCond.startTime"
                    style="width: 100%"
                    placeholder="请输入开始时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }" >
                  </a-date-picker></a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item label="结束时间">
                  <a-date-picker
                    v-model="requestCond.endTime"
                    style="width: 100%"
                    placeholder="请输入结束日期"
                    format="YYYY-MM-DD HH:mm:ss"
                    :show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }" >
                  </a-date-picker></a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.requestCond = { 'charge_over': '0', 'state': '0', 'sortField': 'create_time', 'sortOrder': 'descend' }">重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'"/>
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="energyData" slot-scope="record">
          <font color="#FF3030">{{ record.max_energy }}</font> / <font color="#00CD66">{{ record.use_energy }}</font>
        </span>
        <span slot="timeData" slot-scope="record">
          <font color="#FF3030">{{ record.max_time }}</font> / <font color="#00CD66">{{ record.use_time }}</font>
        </span>
        <span slot="electricityData" slot-scope="record">
          <font color="#FF3030">{{ record.max_electricity }}</font> / <font color="#00CD66">{{ record.max_charge_electricity }}</font>
        </span>
        <span slot="powerData" slot-scope="record">
          <font color="#FF3030">{{ record.max_power }}</font> / <font color="#00CD66">{{ record.average_power }}</font>
        </span>
        <span slot="time" slot-scope="text">
          {{ text | timeFilter }}
        </span>
        <span slot="state_value" slot-scope="text, record">
          <template>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item v-for="( item, index ) in stateValueOps(record.state)" :key="index">
                  <a href="javascript:;">{{ item.name }}</a>
                </a-menu-item>
              </a-menu>
              <a>{{ text }}<a-icon type="down"/></a>
            </a-dropdown>
          </template>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getDeviceChargeList, syncDeviceStatus } from '@/api/modules/device'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'

const columns = [
  {
    title: '设备ID',
    dataIndex: 'device_id'
  },
  {
    title: '端口',
    dataIndex: 'com_id',
    align: 'center'
  },
  {
    title: '度数',
    scopedSlots: { customRender: 'energyData' }
  },
  {
    title: '电流',
    scopedSlots: { customRender: 'electricityData' }
  },
  {
    title: '电压',
    scopedSlots: { customRender: 'powerData' }
  },
  {
    title: '计时',
    scopedSlots: { customRender: 'timeData' }
  },
  {
    title: '状态',
    dataIndex: 'state',
    scopedSlots: { customRender: 'state_value' },
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'create_time',
    sorter: true,
    sortOrder: false,
    sortDirections: ['descend', 'ascend'],
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    sorter: true,
    sortOrder: false,
    sortDirections: ['descend', 'ascend'],
    scopedSlots: { customRender: 'time' }
  }
]

export default {
  name: 'DeviceList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    StepByStepModal
  },
  data () {
    this.columns = columns
    return {
      // create model
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      totalFilters: { 'key': 'status', 'val': 0 },
      // 查询参数
      requestCond: { 'charge_over': '0', 'state': '0', 'sortField': 'create_time', 'sortOrder': 'descend' },
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, { userID: this.$store.getters.userID }, parameter)

        if (Object.keys(this.requestCond).length !== 0) {
          if (requestParameters.requestCond !== null) {
            requestParameters.requestCond = Object.assign({}, this.requestCond, requestParameters.requestCond)
          } else {
            requestParameters.requestCond = Object.assign({}, this.requestCond)
          }

          if (requestParameters.requestCond.startTime !== null && requestParameters.requestCond.startTime !== undefined) {
            requestParameters.requestCond.startTime = moment(requestParameters.requestCond.startTime).format('x')
          }

          if (requestParameters.requestCond.endTime !== null && requestParameters.requestCond.endTime !== undefined) {
            requestParameters.requestCond.endTime = moment(requestParameters.requestCond.endTime).format('x')
          }
        }

        return getDeviceChargeList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    timeFilter (timestamp) {
      if (timestamp > 0) {
        return moment(timestamp).format('YYYYMMDD HH:mm:ss')
      }
    }
  },
  created () {
    const { isBack, requestCond } = this.$route.params
    if (isBack) {
      this.requestCond = requestCond
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    moment,
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    stateValueOps (state) {
      var array = []
      if (state & 1) {
        array.push({ 'name': '下发开始充电' })
      }
      if (state & 2) {
        array.push({ 'name': '设备开始充电' })
      }
      if (state & 16) {
        array.push({ 'name': '已充电中' })
      }
      if (state & 4) {
        array.push({ 'name': '下发停止充电' })
      }
      if (state & 8) {
        array.push({ 'name': '设备停止充电' })
      }
      if (state & 32) {
        array.push({ 'name': '充电完成' })
      }
      if (state & 64) {
        array.push({ 'name': '触发空载' })
      }
      if (state & 128) {
        array.push({ 'name': '触发异常' })
      }
      if (state & 256) {
        array.push({ 'name': '异常退出' })
      }
      return array
    },
    syncDeviceStatus () {
      const requestParameters = Object.assign({}, { userID: this.$store.getters.userID })
      syncDeviceStatus(requestParameters)
        .then(res => {
          const result = res.data
          if (!result.code) {
            this.$message.info(`提交成功`)
          } else {
            switch (result.code) {
                case 100009:
                  this.$message.error(`任务执行中,请勿重复提交`)
                  break
                default:
                  this.$message.error(`${result.code} 发生错误`)
            }
          }
        })
    }
  }
}
</script>
