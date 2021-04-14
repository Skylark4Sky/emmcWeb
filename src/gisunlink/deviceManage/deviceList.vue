<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="设备序列号">
                <a-input v-model="requestCond.device_sn" placeholder=""/>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="设备状态码">
                <a-select v-model="requestCond.status" placeholder="选择状态" default-value="255">
                  <a-select-option value="255">按全部状态</a-select-option>
                  <a-select-option value="0">按离线状态</a-select-option>
                  <a-select-option value="1">按在线状态</a-select-option>
                  <a-select-option value="2">按工作状态</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="接入类型">
                  <a-select v-model="requestCond.access_way" placeholder="请选择" default-value="0">
                    <a-select-option value="0">全部</a-select-option>
                    <a-select-option value="1">移动网络</a-select-option>
                    <a-select-option value="2">WIFI</a-select-option>
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

              <a-col :md="8" :sm="24">
                <a-form-item label="时间类型">
                  <a-select v-model="requestCond.time" placeholder="按创建时间" default-value="create_time">
                    <a-select-option value="create_time">按创建时间</a-select-option>
                    <a-select-option value="update_time">按更新时间</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item label="固件版本">
                  <a-input v-model="requestCond.device_version" placeholder=""/>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.requestCond = { 'status': '255', 'access_way': '0' }">重置</a-button>
                <a-button type="primary" style="margin-left: 8px" @click="syncDeviceStatus()">刷新设备状态</a-button>
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
        :alert="true"
        :rowSelection="rowSelection"
        showPagination="auto"
      >
        <span slot="access_way" slot-scope="text">
          {{ text | accessWayFilter }}
        </span>
        <span slot="worker" slot-scope="text, record">
          {{ text | workerHandle(record) }}
        </span>
        <span slot="status" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="time" slot-scope="text">
          {{ text | timeFilter }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleDeviceInfo(record)">详情</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a @click="handleModuleSearchView(record)">模组信息</a></a-menu-item>
                <a-menu-item><a @click="handleLogSearchView(record)">日志上报</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </template>
        </span>
      </s-table>
      <!--
      <create-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        rowkey="id"
        @cancel="handleCancel"
        @ok="handleOk"
      />
      <step-by-step-modal ref="modal" @ok="handleOk"/>
      -->
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getDeviceList, syncDeviceStatus } from '@/api/modules/device'

import StepByStepModal from '@/views/list/modules/StepByStepModal'
import CreateForm from '@/views/list/modules/CreateForm'

const columns = [
  {
    title: '序列号',
    dataIndex: 'device_sn'
  },
  {
    title: '在线状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '端口',
    dataIndex: 'worker',
    needTotal: true,
    scopedSlots: { customRender: 'worker' }
  },
  {
    title: '设备ID',
    dataIndex: 'id'
  },
  {
    title: '版本号',
    dataIndex: 'device_version'
  },
  {
    title: '更新时间',
    dataIndex: 'update_time',
    sorter: true,
    sortOrder: false,
    sortDirections: ['descend', 'ascend'],
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '160px',
    scopedSlots: { customRender: 'action' }
  }
]

const accessWayMap = {
  1: {
    text: 'GSM'
  },
  2: {
    text: 'WIFI'
  }
}

const statusMap = {
  0: {
    status: 'default',
    text: '离线'
  },
  1: {
    status: 'success',
    text: '在线'
  },
  2: {
    status: 'processing',
    text: '工作中'
  },
  3: {
    status: 'error',
    text: '异常'
  }
}

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
      requestCond: { 'status': '255', 'access_way': '0' },
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

        return getDeviceList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  filters: {
    workerHandle (worker, record) {
      if (record.status === 2) {
        return worker + '个'
      }
      record.worker = 0
      return 0 + '个'
    },
    accessWayFilter (type) {
      return accessWayMap[type].text
    },
    timeFilter (timestamp) {
      return moment(timestamp).format('YYYYMMDD HH:mm')
    },
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
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
    handleDeviceInfo (record) {
      const { pageNum } = this.$route.params
      this.$router.push({
        path: '/deviceManage/deviceList/deviceInfo',
        name: 'deviceInfo',
        params: {
          curPagePath: '/deviceManage/deviceList/',
          curPageName: 'deviceList',
          curPageNum: pageNum,
          curRequestCond: this.requestCond,
          deviceInfo: record
        }
      })
    },
    handleModuleSearchView (record) {
      const { pageNum } = this.$route.params
      this.$router.push({
        path: '/deviceManage/moduleList/:pageNum([1-9]\\d*)?',
        name: 'moduleList',
        params: {
          curPagePath: '/deviceManage/deviceList/',
          curPageName: 'deviceList',
          curPageNum: pageNum,
          curRequestCond: this.requestCond,
          deviceID: record.id
        }
      })
    },
    handleLogSearchView (record) {
      const { pageNum } = this.$route.params
      this.$router.push({
        path: '/deviceManage/transferList/:pageNum([1-9]\\d*)?',
        name: 'transferList',
        params: {
          curPagePath: '/deviceManage/deviceList/',
          curPageName: 'deviceList',
          curPageNum: pageNum,
          curRequestCond: this.requestCond,
          deviceSn: record.device_sn
        }
      })
    },
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
