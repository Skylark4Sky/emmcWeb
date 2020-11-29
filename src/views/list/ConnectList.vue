<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="模组序列号">
                <a-input v-model="requestCond.module_sn" placeholder=""/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="接入类型">
                <a-select v-model="requestCond.access_way" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">移动网络</a-select-option>
                  <a-select-option value="2">WIFI</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="时间类型">
                  <a-select v-model="requestCond.time" placeholder="按最后连接时间">
                    <a-select-option value="create_time">按最后连接时间</a-select-option>
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
                <a-button style="margin-left: 8px" @click="() => this.requestCond = {}">重置</a-button>
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
        <span slot="access_way" slot-scope="text">
          {{ text | accessWayFilter }}
        </span>
        <span slot="time" slot-scope="text">
          {{ text | timeFilter }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import moment from 'moment'
  import { STable, Ellipsis } from '@/components'
  import { getModuleConnectLog } from '@/api/modules/module'

  const columns = [
    {
      title: '模组序列号',
      dataIndex: 'module_sn'
    },
    {
      title: '模组ID',
      dataIndex: 'module_id'
    },
    {
      title: '联网模式',
      dataIndex: 'access_way',
      scopedSlots: { customRender: 'access_way' }
    },
    {
      title: '连接IP',
      dataIndex: 'ip'
    },
    {
      title: '最后连接时间',
      dataIndex: 'create_time',
      sorter: true,
      sortDirections: ['descend', 'ascend'],
      scopedSlots: { customRender: 'time' }
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

  export default {
    name: 'ModuleList',
    components: {
      STable,
      Ellipsis
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
        // 查询参数
        requestCond: { 'access_way': '0', 'time': 'create_time' },
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          // console.log('this.requestCond:' + JSON.stringify(this.requestCond))
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

          return getModuleConnectLog(requestParameters)
            .then(res => {
              return res.data
            })
        }
      }
    },
    created () {
      const { moduleSn, accessWay } = this.$route.params
      const moduleSnOK = (moduleSn && moduleSn !== null && moduleSn !== undefined)
      const accessWayOK = (accessWay && accessWay !== null && accessWay !== undefined)

      if (moduleSnOK && accessWayOK) {
        this.requestCond = Object.assign({}, this.requestCond, { 'module_sn': moduleSn, 'access_way': accessWay.toString() })
      } else if (moduleSnOK) {
        this.requestCond = Object.assign({}, this.requestCond, { 'module_sn': moduleSn })
      } else if (accessWayOK) {
        this.requestCond = Object.assign({}, this.requestCond, { 'access_way': accessWay.toString() })
      }
    },
    filters: {
      accessWayFilter (type) {
        return accessWayMap[type].text
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
      }
    }
  }
</script>
