<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >

    <template v-slot:extra>
      <a-button-group v-if="tabActiveKey === 'detail'" style="margin-right: 4px;">
        <a-button>修改备注</a-button>
        <a-button>修改地址</a-button>
        <a-button>修改空载时间</a-button>
        <!--        <a-button>-->
        <!--          <a-icon type="ellipsis"/>-->
        <!--        </a-button>-->
      </a-button-group>
      <a-button v-if="showBackBtn" type="primary" @click="goBackPrevious">返回上一页</a-button>
    </template>

    <template v-if="tabActiveKey === 'detail'">
      <a-card style="margin-top: 24px" :bordered="false" title="状态信息">
        <a-descriptions :column="1">
          <a-descriptions-item label="ID">{{ this.deviceInfo.id }}</a-descriptions-item>
          <a-descriptions-item label="运行端口">{{ this.deviceInfo.worker }}</a-descriptions-item>
          <a-descriptions-item label="模组类型">{{ getType(this.deviceInfo.access_way) }}</a-descriptions-item>
          <a-descriptions-item label="在线状态">{{ onLineStats(this.deviceInfo.status) }}</a-descriptions-item>
          <a-descriptions-item label="固件版本">{{ this.deviceInfo.device_version }}</a-descriptions-item>
          <a-descriptions-item label="绑定时间">{{ moment(this.deviceInfo.create_time).format('YYYYMMDD HH:mm:ss') }}
          </a-descriptions-item>
          <a-descriptions-item label="更新时间">{{ moment(this.deviceInfo.update_time).format('YYYYMMDD HH:mm:ss') }}
          </a-descriptions-item>
          <a-descriptions-item label="设备序列号">{{ this.deviceInfo.device_sn }}</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin: 16px 0"/>
        <a-descriptions title="其他信息" :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
          <a-descriptions-item label="机器备注">{{ this.deviceInfo.remark }}</a-descriptions-item>
          <a-descriptions-item label="投放地址">{{ this.deviceInfo.localtion }}</a-descriptions-item>
        </a-descriptions>
        </a-descriptions>
      </a-card>
      <a-card
        style="margin-top: 24px"
        :bordered="false"
        title="充电日志"
      >
        <s-table
          style="margin-bottom: 24px"
          row-key="key"
          :columns="chargeColumns"
          :data="loadChargeData">
          <template slot="status" slot-scope="status">
            <a-badge :status="status" :text="status | statusFilter"/>
          </template>
          <span slot="energyData" slot-scope="record">
          <font color="#FF3030">{{ record.max_energy }}</font> <br/> <font color="#00CD66">{{ record.use_energy }}</font>
        </span>
          <span slot="timeData" slot-scope="record">
          <font color="#FF3030">{{ record.max_time }}</font> <br/> <font color="#00CD66">{{ record.use_time }}</font>
        </span>
          <span slot="electricityData" slot-scope="record">
          <font color="#FF3030">{{ record.max_electricity }}</font> <br/> <font color="#00CD66">{{ record.max_charge_electricity }}</font>
        </span>
          <span slot="powerData" slot-scope="record">
          <font color="#FF3030">{{ record.max_power }}</font>  <br/>  <font color="#00CD66">{{ record.average_power }}</font>
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
    </template>

    <template v-if="tabActiveKey === 'comStatus'">
      <a-card :bordered="false">
        <div class="title">端口状态</div>
        <s-table
          v-if="tabActiveKey === 'comStatus'"
          style="margin-bottom: 24px"
          row-key="id"
          :columns="comStatusColumns"
          :data="loadComStatusData">
        </s-table>
      </a-card>
    </template>

    <template v-if="tabActiveKey === 'rule'">
      <a-card :bordered="false">
        <div class="title">端口规则</div>
        <s-table
          v-if="tabActiveKey === 'rule'"
          style="margin-bottom: 24px"
          row-key="id"
          :columns="ruleColumns"
          :data="loadRuleData">
        </s-table>
      </a-card>
    </template>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { baseMixin } from '@/store/app-mixin'
  import { STable } from '@/components'
  import { getDeviceChargeList } from '@/api/modules/device'

  export default {
    components: {
      STable
    },
    name: 'DeviceInfo',
    mixins: [baseMixin],
    showBackBtn: false,
    deviceInfo: null,
    data () {
      return {
        tabList: [
          { key: 'detail', tab: '设备详情' },
          { key: 'comStatus', tab: '端口状态' },
          { key: 'rule', tab: '收费规则' }
        ],
        tabActiveKey: 'detail',
        comStatusColumns: [
          {
            title: '端口编号',
            dataIndex: 'com_id',
            key: 'com_id'
          },
          {
            title: '工作状态',
            dataIndex: 'enable',
            key: 'enable'
          },
          {
            title: '共计电量',
            dataIndex: 'total_energy',
            key: 'total_energy'
          },
          {
            title: '共计用时',
            dataIndex: 'total_time',
            key: 'total_time',
            align: 'right'
          },
          {
            title: '收费类型',
            dataIndex: 'bill_type',
            key: 'bill_type',
            align: 'right'
          },
          {
            title: '操作',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right'
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadComStatusData: () => {
          return new Promise(resolve => {
            resolve({
              data: [
                {
                  id: '1234561',
                  name: '矿泉水 550ml',
                  barcode: '12421432143214321',
                  price: '2.00',
                  num: '1',
                  amount: '2.00'
                },
                {
                  id: '1234562',
                  name: '凉茶 300ml',
                  barcode: '12421432143214322',
                  price: '3.00',
                  num: '2',
                  amount: '6.00'
                },
                {
                  id: '1234563',
                  name: '好吃的薯片',
                  barcode: '12421432143214323',
                  price: '7.00',
                  num: '4',
                  amount: '28.00'
                },
                {
                  id: '1234564',
                  name: '特别好吃的蛋卷',
                  barcode: '12421432143214324',
                  price: '8.50',
                  num: '3',
                  amount: '25.50'
                }
              ],
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10
            })
          }).then(res => {
            return res
          })
        },
        chargeColumns: [
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
            title: '更新时间',
            dataIndex: 'update_time',
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
        ],
        requestCond: { 'charge_over': '0', 'state': '0', 'sortField': 'create_time', 'sortOrder': 'descend' },
        loadChargeData: parameter => {
          const requestParameters = Object.assign({}, { userID: this.$store.getters.userID }, parameter)
          if (Object.keys(this.requestCond).length !== 0) {
            if (requestParameters.requestCond !== null) {
              requestParameters.requestCond = Object.assign({}, this.requestCond, requestParameters.requestCond, { device_id: this.deviceInfo.id })
            } else {
              requestParameters.requestCond = Object.assign({}, this.requestCond, { device_id: this.deviceInfo.id })
            }

            if (requestParameters.requestCond.startTime !== null && requestParameters.requestCond.startTime !== undefined) {
              requestParameters.requestCond.startTime = moment(requestParameters.requestCond.startTime).format('x')
            }

            if (requestParameters.requestCond.endTime !== null && requestParameters.requestCond.endTime !== undefined) {
              requestParameters.requestCond.endTime = moment(requestParameters.requestCond.endTime).format('x')
            }
          }

          console.log(requestParameters)
          return getDeviceChargeList(requestParameters)
            .then(res => {
              return res.data
            })
        }
      }
    },
    filters: {
      timeFilter (timestamp) {
        if (timestamp > 0) {
          return moment(timestamp).format('YYYYMMDD HH:mm:ss')
        }
      },
      statusFilter (status) {
        const statusMap = {
          'agree': '成功',
          'reject': '驳回'
        }
        return statusMap[status]
      },
      statusTypeFilter (type) {
        const statusTypeMap = {
          'agree': 'success',
          'reject': 'error'
        }
        return statusTypeMap[type]
      }
    },
    created () {
      const { deviceInfo } = this.$route.params
      if (deviceInfo === undefined) {
        this.$router.go(-1)
      }
      this.deviceInfo = deviceInfo
      // console.log('deviceInfo: ' + JSON.stringify(this.deviceInfo))
      this.showBackBtn = true
    },
    methods: {
      moment,
      handleTabChange (key) {
        this.tabActiveKey = key
      },
      onLineStats (status) {
        let text = '未知'
        switch (status) {
          case 0:
            text = '离线'
            break
          case 1:
            text = '在线'
            break
          case 2:
            text = '工作中'
            break
          case 3:
            text = '异常'
            break
        }
        return text
      },
      getType (type) {
        let text = '未知'
        switch (type) {
          case 1:
            text = 'GSM'
            break
          case 2:
            text = 'WIFI'
            break
        }
        return text
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
      goBackPrevious () {
        const { curPageNum, curPageName, curPagePath, curRequestCond, curShowBackBtn, otherRouterParam } = this.$route.params
        const PagePath = curPagePath + curPageNum
        this.$router.push({
          path: PagePath,
          name: curPageName,
          params: {
            pageNum: curPageNum,
            showBackBtn: curShowBackBtn,
            otherRouterParam: otherRouterParam,
            isBack: true,
            requestCond: curRequestCond
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .title {
    color: rgba(0, 0, 0, .85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .detail-layout {
    margin-left: 44px;
  }

  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }

    .text {

    }

    .status-list {
      text-align: left;
    }
  }
</style>
