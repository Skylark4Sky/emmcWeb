<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >

    <template v-slot:extra>
      <a-button-group style="margin-right: 4px;">
        <a-button>充电</a-button>
        <a-button>停止</a-button>
        <a-button>
          <a-icon type="ellipsis"/>
        </a-button>
      </a-button-group>
      <a-button  v-if="showBackBtn"  type="primary" @click="goBackPrevious">返回上一页</a-button>
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
        title="连接日志"
      >
        <a-table
          :columns="connetColumns"
          :dataSource="loadConnetData"
          :pagination="false"
        >
          <template
            slot="status"
            slot-scope="status">
            <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
          </template>
        </a-table>
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
        <div class="title">充电日志</div>
        <s-table
          v-if="tabActiveKey === 'comStatus'"
          style="margin-bottom: 24px"
          row-key="key"
          :columns="chargeColumns"
          :data="loadChargeData">
          <template
            slot="status"
            slot-scope="status">
            <a-badge :status="status" :text="status | statusFilter"/>
          </template>
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

  export default {
    components: {
      STable
    },
    name: 'deviceInfo',
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
            title: '充电编号',
            dataIndex: 'id',
            key: 'id'
          },
          {
            title: '充电令牌',
            dataIndex: 'token',
            key: 'token'
          },
          {
            title: '充电端口',
            dataIndex: 'com_id',
            key: 'com_id',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '电能限制',
            // - max_energy
            dataIndex: 'max_energy',
            key: 'max_energy'
          },
          {
            title: '用时限制',
            // - use_time
            dataIndex: 'max_time',
            key: 'max_time'
          },
          {
            title: '电流限制',
            // - max_charge_electricity
            dataIndex: 'max_electricity',
            key: 'max_electricity'
          },
          {
            title: '功率状态',
            // 0 - average_power - max_power
            dataIndex: 'average_power',
            key: 'average_power'
          },
          {
            title: '充电状态',
            // 0 - average_power - max_power
            dataIndex: 'state',
            key: 'state'
          },
          {
            title: '开始时间',
            // 0 - average_power - max_power
            dataIndex: 'create_time',
            key: 'create_time'
          },
          {
            title: '结束时间',
            // 0 - average_power - max_power
            dataIndex: 'end_time',
            key: 'end_time'
          }
        ],
        loadChargeData: () => {
          return new Promise(resolve => {
            resolve({
              data: [
                {
                  key: '1',
                  time: '2017-10-01 14:10',
                  rate: '联系客户',
                  status: 'processing',
                  operator: '取货员 ID1234',
                  cost: '5mins'
                },
                {
                  key: '2',
                  time: '2017-10-01 14:05',
                  rate: '取货员出发',
                  status: 'success',
                  operator: '取货员 ID1234',
                  cost: '1h'
                },
                {
                  key: '3',
                  time: '2017-10-01 13:05',
                  rate: '取货员接单',
                  status: 'success',
                  operator: '取货员 ID1234',
                  cost: '5mins'
                },
                {
                  key: '4',
                  time: '2017-10-01 13:00',
                  rate: '申请审批通过',
                  status: 'success',
                  operator: '系统',
                  cost: '1h'
                },
                {
                  key: '5',
                  time: '2017-10-01 12:00',
                  rate: '发起退货申请',
                  status: 'success',
                  operator: '用户',
                  cost: '5mins'
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
        connetColumns: [
          {
            title: '序号',
            dataIndex: 'module_sn',
            key: 'module_sn'
          },
          {
            title: '模组ID',
            dataIndex: 'module_id',
            key: 'module_id'
          },
          {
            title: '接入类型',
            dataIndex: 'access_way',
            key: 'access_way',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '连接IP',
            dataIndex: 'ip',
            key: 'ip'
          },
          {
            title: '连接时间',
            dataIndex: 'create_time',
            key: 'create_time'
          }
        ],
        loadConnetData: [
          {
            key: 'op1',
            type: '订购关系生效',
            name: '曲丽丽',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          },
          {
            key: 'op2',
            type: '财务复审',
            name: '付小小',
            status: 'reject',
            updatedAt: '2017-10-03  19:23:12',
            remark: '不通过原因'
          },
          {
            key: 'op3',
            type: '部门初审',
            name: '周毛毛',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          },
          {
            key: 'op4',
            type: '提交订单',
            name: '林东东',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '很棒'
          },
          {
            key: 'op5',
            type: '创建订单',
            name: '汗牙牙',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          }
        ]
      }
    },
    filters: {
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
      console.log('deviceInfo: ' + JSON.stringify(deviceInfo))
      this.deviceInfo = deviceInfo
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
