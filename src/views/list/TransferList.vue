<template>
  <page-header-wrapper>
    <!-- actions -->
    <template v-slot:extra v-if="this.showBackBtn">
      <a-button type="primary" @click="goBackPrevious">返回上一页</a-button>
    </template>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="设备序列号">
                <a-input v-model="requestCond.device_sn" placeholder="" />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-item label="上报状态">
                <a-select v-model="requestCond.behavior" placeholder="选择状态" default-value="0">
                  <a-select-option value="0">全部状态</a-select-option>
                  <a-select-option value="16">下发充电</a-select-option>
                  <a-select-option value="17">查询状态</a-select-option>
                  <a-select-option value="18">下发终止</a-select-option>
                  <a-select-option value="19">配置设置</a-select-option>
                  <a-select-option value="30">设备重启</a-select-option>
                  <a-select-option value="20">开始充电</a-select-option>
                  <a-select-option value="21">充电中</a-select-option>
                  <a-select-option value="22">充电完成</a-select-option>
                  <a-select-option value="23">空闲中</a-select-option>
                  <a-select-option value="24">故障</a-select-option>
                  <a-select-option value="25">空载</a-select-option>
                  <a-select-option value="26">固件升级</a-select-option>
                  <a-select-option value="27">参数刷新</a-select-option>
                  <a-select-option value="28">停止充电</a-select-option>
                  <a-select-option value="29">参数没有刷新</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="时间类型">
                  <a-select v-model="requestCond.time" placeholder="按上报时间" default-value="create_time">
                    <a-select-option value="create_time">按上报时间</a-select-option>
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
                  </a-date-picker>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-item label="结束时间">
                  <a-date-picker
                    v-model="requestCond.endTime"
                    style="width: 100%"
                    placeholder="请输入结束日期"
                    format="YYYY-MM-DD HH:mm:ss"
                    :show-time="{ defaultValue: moment('23:59:59', 'HH:mm:ss') }" >
                  </a-date-picker>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="!advanced && 8 || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => this.requestCond = { 'behavior': '0', 'time': 'create_time' }">重置</a-button>
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
        :columns="columns"
        :data="loadData"
        :alert="false"
        showPagination="auto"
      >
        <span slot="transfer_data" slot-scope="text">
          <ellipsis :length="24" tooltip>{{ text }}</ellipsis>
        </span>
        <span slot="behavior" slot-scope="text">
          <a-badge :status="text | behaviorTypeFilter" :text="text | behaviorFilter" />
        </span>
        <span slot="time" slot-scope="text">
          {{ text | timeFilter }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="previewLogDetail(record)">查看</a>
          </template>
        </span>
      </s-table>
      <transfer-detail
        ref="transferDetail"
        :visible="visible"
        rowKey="device_sn"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="closeTransferDetail"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import { getDeviceTransferLogList } from '@/api/modules/device'
import TransferDetail from './modules/transferDetailPage'

const columns = [
  {
    title: '设备序列号',
    dataIndex: 'device_sn'
  },
  {
    title: '状态',
    dataIndex: 'behavior',
    scopedSlots: { customRender: 'behavior' }
  },
  {
    title: '节点',
    dataIndex: 'server_node'
  },
  {
    title: '端口',
    dataIndex: 'com_num'
  },
  {
    title: '数据',
    dataIndex: 'transfer_data',
    scopedSlots: { customRender: 'transfer_data' }
  },
  {
    title: '上报时间',
    dataIndex: 'create_time',
    sortOrder: 'descend',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const behaviorMap = {
    16: {
      status: 'default',
      text: '下发充电'
    },
    17: {
      status: 'default',
      text: '查询状态'
    },
    18: {
      status: 'default',
      text: '下发终止'
    },
    19: {
      status: 'default',
      text: '配置设置'
    },
    30: {
      status: 'default',
      text: '设备重启'
    },
    20: {
      status: 'processing',
      text: '开始充电'
    },
    21: {
      status: 'processing',
      text: '充电中'
    },
    22: {
      status: 'success',
      text: '充电完成'
    },
    23: {
      status: 'success',
      text: '空闲中'
    },
    24: {
      status: 'error',
      text: '故障'
    },
    25: {
      status: 'error',
      text: '空载'
    },
    26: {
      status: 'default',
      text: '固件升级'
    },
    27: {
      status: 'default',
      text: '参数刷新'
    },
    28: {
      status: 'success',
      text: '停止充电'
    },
    29: {
      status: 'default',
      text: '参数没有刷新'
    }
}

export default {
  name: 'DeviceList',
  components: {
    STable,
    TransferDetail,
    Ellipsis
  },
  data () {
    this.columns = columns
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      abx: '',
      device_sn: null,
      // 高级搜索 展开/关闭
      advanced: false,
      showBackBtn: false,
      // 查询参数
      requestCond: { 'behavior': '0', 'time': 'create_time' },
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

          if (requestParameters.requestCond.enddevice_snTime !== null && requestParameters.requestCond.endTime !== undefined) {
            requestParameters.requestCond.endTime = moment(requestParameters.requestCond.endTime).format('x')
          }
        }

        const defaultSort = { 'sortField': 'create_time', 'sortOrder': 'descend' }
        requestParameters.requestCond = Object.assign({}, requestParameters.requestCond, defaultSort)

        return getDeviceTransferLogList(requestParameters)
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    const { deviceSn } = this.$route.params
    if (deviceSn && deviceSn !== null && deviceSn !== undefined) {
      this.requestCond = Object.assign({}, this.requestCond, { 'device_sn': deviceSn })
      this.showBackBtn = true
    }
  },
  filters: {
    behaviorFilter (type) {
      return behaviorMap[type].text
    },
    behaviorTypeFilter (type) {
      return behaviorMap[type].status
    },
    timeFilter (timestamp) {
      return moment(timestamp).format('YYYYMMDD HH:mm')
    }
  },
  methods: {
    moment,
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    closeTransferDetail () {
      this.visible = false
    },
    previewLogDetail (record) {
      this.visible = true
      this.mdl = { ...record }
    },
    goBackPrevious () {
      const { curPageNum, curPageName, curPagePath, curRequestCond } = this.$route.params
      const PagePath = curPagePath + curPageNum
      this.$router.push({
        path: PagePath,
        name: curPageName,
        params: {
          pageNum: curPageNum,
          isBack: true,
          requestCond: curRequestCond
        }
      })
    }
  }
}
</script>
