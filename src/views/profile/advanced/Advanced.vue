<template>
  <page-header-wrapper
    title="序号:57ff69067878495148300967"
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    @tabChange="handleTabChange"
  >
    <template v-if="tabActiveKey === 'detail'">
    <a-card style="margin-top: 24px" :bordered="false" title="状态信息">
      <a-descriptions :column="1">
        <a-descriptions-item label="ID">10000000</a-descriptions-item>
        <a-descriptions-item label="在线状态">在线</a-descriptions-item>
        <a-descriptions-item label="运行端口">10</a-descriptions-item>
        <a-descriptions-item label="模组类型">WIFI</a-descriptions-item>
        <a-descriptions-item label="固件版本">202011042330</a-descriptions-item>
        <a-descriptions-item label="绑定时间">2020-01-12 13:26</a-descriptions-item>
        <a-descriptions-item label="更新时间">2020-12-16 14:26</a-descriptions-item>
      </a-descriptions>
        <a-divider style="margin: 16px 0" />
      <a-descriptions title="其他信息" :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }">
        <a-descriptions-item label="机器备注">浙江省杭州市西湖区黄姑山路工专路交叉路口</a-descriptions-item>
        <a-descriptions-item label="投放地址">浙江省杭州市西湖区黄姑山路工专路交叉路口</a-descriptions-item>
      </a-descriptions>
      </a-descriptions>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="连接日志"
    >
      <a-table
        :columns="operationColumns"
        :dataSource="operation1"
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
    <template v-if="tabActiveKey === 'rule'">
      <a-card :bordered="false" >
        <a-descriptions title="退款申请">
          <a-descriptions-item label="取货单号">1000000000</a-descriptions-item>
          <a-descriptions-item label="状态">已取货</a-descriptions-item>
          <a-descriptions-item label="销售单号">1234123421</a-descriptions-item>
          <a-descriptions-item label="子订单">3214321432</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>
        <a-descriptions title="用户信息">
          <a-descriptions-item label="用户姓名">付小小</a-descriptions-item>
          <a-descriptions-item label="联系电话">18100000000</a-descriptions-item>
          <a-descriptions-item label="常用快递">菜鸟仓储</a-descriptions-item>
          <a-descriptions-item label="取货地址">浙江省杭州市西湖区万塘路18号</a-descriptions-item>
          <a-descriptions-item label="备注">	无</a-descriptions-item>
        </a-descriptions>
        <a-divider style="margin-bottom: 32px"/>
        <div class="title">退货进度</div>
        <s-table
          v-if="tabActiveKey === 'rule'"
          style="margin-bottom: 24px"
          row-key="id"
          :columns="goodsColumns"
          :data="loadGoodsData">
        </s-table>
        <div class="title">退货进度</div>
        <s-table
          v-if="tabActiveKey === 'rule'"
          style="margin-bottom: 24px"
          row-key="key"
          :columns="scheduleColumns"
          :data="loadScheduleData">
          <template
            slot="status"
            slot-scope="status">
            <a-badge :status="status" :text="status | statusFilter"/>
          </template>
        </s-table>
      </a-card>
    </template>
  </page-header-wrapper>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import { STable } from '@/components'

export default {
  components: {
    STable
  },
  name: 'Advanced',
  mixins: [baseMixin],
  data () {
    return {
      tabList: [
        { key: 'detail', tab: '详情' },
        { key: 'rule', tab: '规则' }
      ],
      tabActiveKey: 'detail',
      goodsColumns: [
        {
          title: '商品编号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '商品条码',
          dataIndex: 'barcode',
          key: 'barcode'
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
          align: 'right'
        },
        {
          title: '数量（件）',
          dataIndex: 'num',
          key: 'num',
          align: 'right'
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadGoodsData: () => {
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
      scheduleColumns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '当前进度',
          dataIndex: 'rate',
          key: 'rate'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作员ID',
          dataIndex: 'operator',
          key: 'operator'
        },
        {
          title: '耗时',
          dataIndex: 'cost',
          key: 'cost'
        }
      ],
      loadScheduleData: () => {
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
      operationColumns: [
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
      operation1: [
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
  methods: {
    handleTabChange (key) {
      console.log('qqqqq:' + key)
      this.tabActiveKey = key
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .title {
    color: rgba(0,0,0,.85);
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
