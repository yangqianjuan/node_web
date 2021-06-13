<template>
  <div
    class="chart"
    ref="chartBox"
  >
    <div
      class="app-container"
      style="padding: 10px; min-height: calc(100vh - 50px)"
    >
      <el-dialog
        title="数据导入"
        :visible.sync="openImportSaleDataDig"
        :close-on-click-modal="false"
        width="500px"
        @close="closeImportSaleData"
        center
      >
        <el-form
          ref="importSaleDataform"
          label-width="100px"
        >
          <el-form-item label="选择门店">
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              ref="importSaleDataFormDrop"
            >
              <el-input
                v-model="importSaleDataSelected.store"
                placeholder="请选择"
                size="mini"
                clearable
                style=""
                @clear="clearImportSaleDataStore"
              ></el-input>
              <el-dropdown-menu slot="dropdown">
                <el-scrollbar
                  wrap-class="sale-scrollbar-wrap"
                  :native="false"
                >
                  <el-dropdown-item style="padding: 0px;width: 250px">
                    <el-tree
                      :data="tree"
                      node-key="id"
                      :props="defaultProps"
                      :expand-on-click-node="false"
                      default-expand-all
                      @node-click="handleSaleSelectStore"
                    >
                      <span
                        class="custom-tree-node"
                        slot-scope="{ node, data }"
                      >
                        <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                        <span style="margin-left: 5px">{{ node.label }}</span>
                      </span>
                    </el-tree>
                  </el-dropdown-item>
                </el-scrollbar>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item label="选择文件">
            <sale-uploader ref="saleUploader"></sale-uploader>
          </el-form-item>
        </el-form>
        <div
          align="center"
          style="margin-top: 20px"
        >
          <el-button
            @click="openImportSaleDataDig = false"
            style="margin-right: 30px"
            class="cancel-button"
            size="small"
          >取 消</el-button>
          <el-button
            @click="saveSaleData()"
            style="margin-left: 30px;"
            class="confirm-button"
            size="small"
          >确 定</el-button>
        </div>
      </el-dialog>
      <!-- 搜索栏-->
      <div style="background-color: #ffffff;">
        <span class="cond-name">选择门店</span>
        <el-dropdown
          trigger="click"
          ref="formDrop"
        >
          <el-input
            v-model="search.store"
            placeholder="全部门店"
            size="mini"
            clearable
            style=""
            @clear="clearStore"
          ></el-input>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding: 0px;width: 300px;height: 300px">
              <el-scrollbar
                wrap-class="addAccount-scrollbar-wrap"
                style="height: 100%"
              >
                <el-tree
                  ref="formTree"
                  :data="tree"
                  node-key="id"
                  :props="defaultProps"
                  highlight-current
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  default-expand-all
                  @node-click="handleNodeClick"
                >
                  <span
                    class="custom-tree-node"
                    slot-scope="{ node, data }"
                  >
                    <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                    <span style="margin-left: 5px">{{ data.label }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span
          class="cond-name"
          style="margin:0 10px 0 30px;"
        >选择日期</span>
        <el-date-picker
          @change="handleDateChange"
          style="width:240px;"
          v-model="search.dateRange"
          type="daterange"
          align="right"
          size="mini"
          unlink-panels
          :clearable=false
          range-separator="至"
          value-format='yyyy-MM-dd'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <el-select
          v-model="search.timeType"
          size="mini"
          placeholder="请选择"
          style="width: 90px"
          @change="handleTimeTypeChange"
        >
          <el-option
            v-for="item in timeTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-row
        :gutter="10"
        style="margin-top: 1vh;"
      >
        <el-col :span="12">
          <el-card
            class="card"
            shadow="hover"
          >
            <div style="border-radius: 5px; height: 370px;">
              <div style="height: 100%; width: 100%; float: left;border-radius: 5px;background-color: #ffffff;">
                <div
                  style="height: 350px;position:relative;"
                  v-if="!errorFlag"
                >
                  <div style="padding-top: 1px; margin: 6px 0 0 90px;float: left;z-index: 999;position:absolute;width: 80%">
                    <div class="chart-prefix">
                      <!-- <router-link :to="{ name: 'CustomerBreakdown', query: { startDate: paramsStartDate,endDate: paramsEndDate, structId: search.structId, store: storeName,timeType: customerType }}">
                        <el-button
                          type="text"
                          size="small"
                          style="float: right;margin-right: 40px;margin-top: -5px"
                        >顾客明细</el-button>
                      </router-link> -->
                      <router-link :to="{ name: 'StatisticsReport', query: { startDate: paramsStartDate,endDate: paramsEndDate, structId: search.structId, store: storeName,timeType: search.timeType }}">
                        <el-button
                          type="text"
                          size="small"
                          style="float: right;margin-right: 40px;margin-top: -5px"
                        >数据报表</el-button>
                      </router-link>
                    </div>
                  </div>
                  <div style="padding-top: 1px; margin: 6px 0 0 9%;float: left;z-index: 999;position:absolute;">
                    <el-radio-group
                      style="margin-left: 130px"
                      v-model="customerType"
                      @change="handleCustomerTypeChange"
                    >
                      <el-radio
                        style="margin-left: -20px"
                        label="0"
                      ><span style="font-size: 10px">总人数</span></el-radio>
                      <el-radio
                        style="margin-left: -20px"
                        label="1"
                      ><span style="font-size: 10px">老客</span></el-radio>
                      <el-radio
                        style="margin-left: -20px"
                        label="2"
                      ><span style="font-size: 10px">新客</span></el-radio>
                    </el-radio-group>
                  </div>
                  <div
                    v-if="!errorFlag"
                    id="analyseChart"
                    style="height: 350px; width: 100%; "
                  ></div>
                </div>
                <div
                  class="tips_container"
                  v-else
                >
                  <span class="tips_text">按小时查看日期只能选择一天</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            class="card"
            shadow="hover"
          >
            <div style="border-radius: 5px; height: 370px;">
              <div style="height: 100%; width: 100%; float: left;border-radius: 5px;background-color: #ffffff;">
                <div
                  style="height: 350px;position:relative;"
                  v-if="!errorFlag"
                >
                  <div style="padding-top: 1px; margin: 2px 0 0 60px;float: left;z-index: 999;position:absolute;width: 80%">
                    <div class="chart-prefix">
                      <el-button
                        type="text"
                        size="small"
                        @click="openImportSaleData()"
                        style="float: right;margin-right: 20px;"
                      >数据导入</el-button>
                    </div>
                  </div>
                  <div
                    id="saleDataChart"
                    style="height: 350px; width: 100%; "
                  ></div>
                </div>
                <div
                  class="tips_container"
                  v-else
                >
                  <span class="tips_text">按小时查看日期只能选择一天</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row
        :gutter="10"
        style="margin-top: 1vh;"
      >
        <el-col :span="8">
          <el-card
            class="card"
            shadow="hover"
          >
            <div
              id="genderChart"
              style="height: 350px; width: 100%;"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            class="card"
            shadow="hover"
          >
            <div
              id="ageChart"
              style="height: 350px; width: 100%; "
            ></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            class="card"
            shadow="hover"
          >
            <div
              id="timesChart"
              style="height: 320px; width: 100%;"
            ></div>
            <div style="height: 30px;">
              <el-button
                type="text"
                @click="openTimesRangeDialog"
                style="font-size:12px;margin-left:30px; margin-top: -25px"
              >自定义x轴</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <times-range
        ref="timesRange"
        v-if="timesRangeDialog"
        :Dialog="timesRangeDialog"
        :closeDialog="closeTimesRangeDialog"
        @refreshData="fetchStatisticsTimesData"
      ></times-range>
    </div>
  </div>
</template>

<script>
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import resize from '@/mixins/resize'
import { listPermissionTree } from '@/api/account'
import { fetchStatisticsAnalyseData, fetchStatisticsGenderData, fetchStatisticsAgeData, fetchStatisticsCustomerData, fetchStatisticsTimesData } from '@/api/statistics'
import timesRange from './components/timesRange'
import { formatDate } from '@/utils/date'
import { saveSaleData, querySaleData } from '@/api/sale'
import saleUploader from './components/saleUploader'
export default {
  name: 'StatisticsChart',
  mixins: [resize],
  components: {
    timesRange,
    saleUploader
  },
  props: {
    tabName: {
      type: String,
      default: 'data'
    }
  },
  updated() {
  },

  data() {
    return {
      keepAlive: true,
      openImportSaleDataDig: false,
      importSaleDataSelected: {
        store: '',
        structId: ''
      },
      search: {
        dateRange: [new Date(), new Date()],
        startDate: formatDate(new Date(), 'yyyy-MM-dd'),
        endDate: formatDate(new Date(), 'yyyy-MM-dd'),
        store: '',
        timeType: '0'
      },
      customerType: '0',
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      timeTypeOptions: [{
        value: '0',
        label: '按小时'
      }, {
        value: '1',
        label: '按天'
      }, {
        value: '2',
        label: '按周'
      }, {
        value: '3',
        label: '按月'
      }],
      analyseData: [],
      paramsStartDate: '',
      paramsEndDate: '',
      timesRangeDialog: false,
      analyseEmptyFlag: false,
      saleDataIsEmpty: false,
      ageEmptyFlag: false,
      genderEmptyFlag: false,
      timesEmptyFlag: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            end.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick(picker) {
            const now = new Date()
            const nowTime = now.getTime()
            const day = now.getDay()
            const oneDayLong = 24 * 60 * 60 * 1000
            const MondayTime = nowTime - (day - 1) * oneDayLong
            const SundayTime = nowTime + (7 - day) * oneDayLong
            const monday = new Date(MondayTime)
            const sunday = new Date(SundayTime)
            picker.$emit('pick', [monday, sunday])
          }
        }, {
          text: '上周',
          onClick(picker) {
            const now = new Date()
            const nowTime = now.getTime()
            const day = now.getDay()
            const oneDayLong = 24 * 60 * 60 * 1000
            const MondayTime = nowTime - (day - 1) * oneDayLong
            const SundayTime = nowTime + (7 - day) * oneDayLong
            const monday = new Date(MondayTime - 3600 * 1000 * 24 * 7)
            const sunday = new Date(SundayTime - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [monday, sunday])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const start = new Date()
            start.setDate(1)
            const date = new Date()
            let currentMonth = date.getMonth()
            const nextMonth = ++currentMonth
            const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
            const oneDay = 1000 * 60 * 60 * 24
            const end = new Date(nextMonthFirstDay - oneDay)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            var nowdays = new Date()
            var year = nowdays.getFullYear()
            var month = nowdays.getMonth()
            if (month === 0) {
              month = 12
              year = year - 1
            }
            if (month < 10) {
              month = '0' + month
            }
            var firstDayOfPreMonth = year + '-' + month + '-' + '01'// 上个月的第一天
            var lastDay = new Date(year, month, 0)
            var lastDayOfPreMonth = year + '-' + month + '-' + lastDay.getDate()// 上个月的最后一天
            picker.$emit('pick', [firstDayOfPreMonth, lastDayOfPreMonth])
          }
        }, {
          text: '近7天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
  },
  mounted() {
    this.init()
    this.$refs.chartBox.addEventListener('scroll', this.handelscroll)
  },
  activated() {
    this.isUpdate()
  },
  deactivated() {
    sessionStorage.setItem('chart', this.scrollTop)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.keepAlive = vm.getKeeplive(from.query, from.name)
      vm.isUpdate()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.keepAlive = this.getKeeplive(to.query, to.name)
    next()
  },
  computed: {
    timeText() {
      let timeContent = ''
      switch (this.search.timeType) {
        case '0':
          timeContent = this.search.startDate
          this.paramsStartDate = this.search.startDate
          this.paramsEndDate = this.search.startDate
          break
        case '1':
          timeContent = this.search.startDate + ' - ' + this.search.endDate
          this.paramsStartDate = this.search.startDate
          this.paramsEndDate = this.search.endDate
          break
        case '2':
          var stDate = new Date(this.search.startDate)
          var nowDayOfWeek = stDate.getDay()
          var nowDay = stDate.getDate()
          var nowMonth = stDate.getMonth()
          var nowYear = stDate.getFullYear()
          var weekStartDate = new Date(nowYear, nowMonth, nowDayOfWeek === 0 ? nowDay - 6 : nowDay - nowDayOfWeek + 1)
          var edDate = new Date(this.search.endDate)
          var edNowDayOfWeek = edDate.getDay()
          var edNowDay = edDate.getDate()
          var edNowMonth = edDate.getMonth()
          var edNowYear = edDate.getFullYear()
          var weekEndDate = new Date(edNowYear, edNowMonth, edNowDayOfWeek === 0 ? edNowDay : edNowDay - edNowDayOfWeek + 7)
          this.paramsStartDate = formatDate(weekStartDate, 'yyyy-MM-dd')
          this.paramsEndDate = formatDate(weekEndDate, 'yyyy-MM-dd')
          timeContent = formatDate(weekStartDate, 'yyyy-MM-dd') + ' - ' + formatDate(weekEndDate, 'yyyy-MM-dd')
          break
        case '3':
          var start = new Date(this.search.startDate)
          start.setDate(1)
          var date = new Date(this.search.endDate)
          var currentMonth = date.getMonth()
          var nextMonth = ++currentMonth
          var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
          var oneDay = 1000 * 60 * 60 * 24
          var end = new Date(nextMonthFirstDay - oneDay)
          this.paramsStartDate = formatDate(start, 'yyyy-MM-dd')
          this.paramsEndDate = formatDate(end, 'yyyy-MM-dd')
          timeContent = formatDate(start, 'yyyy-MM-dd') + ' - ' + formatDate(end, 'yyyy-MM-dd')
          break
      }
      return timeContent
    },
    analyseText() {
      const tt = this.timeTypeOptions.find(t => { return t.value === this.search.timeType }).label
      let timeContent = ''
      switch (this.search.timeType) {
        case '0':
          timeContent = this.search.startDate
          this.paramsStartDate = this.search.startDate
          this.paramsEndDate = this.search.startDate
          break
        case '1':
          timeContent = this.search.startDate + ' - ' + this.search.endDate
          this.paramsStartDate = this.search.startDate
          this.paramsEndDate = this.search.endDate
          break
        case '2':
          var stDate = new Date(this.search.startDate)
          var nowDayOfWeek = stDate.getDay()
          var nowDay = stDate.getDate()
          var nowMonth = stDate.getMonth()
          var nowYear = stDate.getFullYear()
          var weekStartDate = new Date(nowYear, nowMonth, nowDayOfWeek === 0 ? nowDay - 6 : nowDay - nowDayOfWeek + 1)
          var edDate = new Date(this.search.endDate)
          var edNowDayOfWeek = edDate.getDay()
          var edNowDay = edDate.getDate()
          var edNowMonth = edDate.getMonth()
          var edNowYear = edDate.getFullYear()
          var weekEndDate = new Date(edNowYear, edNowMonth, edNowDayOfWeek === 0 ? edNowDay : edNowDay - edNowDayOfWeek + 7)
          this.paramsStartDate = formatDate(weekStartDate, 'yyyy-MM-dd')
          this.paramsEndDate = formatDate(weekEndDate, 'yyyy-MM-dd')
          timeContent = formatDate(weekStartDate, 'yyyy-MM-dd') + ' - ' + formatDate(weekEndDate, 'yyyy-MM-dd')
          break
        case '3':
          var start = new Date(this.search.startDate)
          start.setDate(1)
          var date = new Date(this.search.endDate)
          var currentMonth = date.getMonth()
          var nextMonth = ++currentMonth
          var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
          var oneDay = 1000 * 60 * 60 * 24
          var end = new Date(nextMonthFirstDay - oneDay)
          this.paramsStartDate = formatDate(start, 'yyyy-MM-dd')
          this.paramsEndDate = formatDate(end, 'yyyy-MM-dd')
          timeContent = formatDate(start, 'yyyy-MM-dd') + ' - ' + formatDate(end, 'yyyy-MM-dd')
          break
      }
      return timeContent + ',' + tt
    },
    errorFlag() {
      if (this.search.startDate !== this.search.endDate && this.search.timeType === '0') {
        return true
      }
      return false
    },
    storeName() {
      if (this.search.store) {
        return this.search.store
      } else if (this.tree.length > 0) {
        return this.tree[0].label
      } else {
        return ''
      }
    },
    storeId() {
      if (this.search.structId) {
        return this.search.structId
      } else if (this.tree.length > 0) {
        return this.tree[0].id
      } else {
        return ''
      }
    },
    stTime() {
      switch (this.search.timeType) {
        case '0':
          return this.search.startDate
        case '1':
          return this.search.startDate
        case '2':
          var stDate = new Date(this.search.startDate)
          var nowDayOfWeek = stDate.getDay()
          var nowDay = stDate.getDate()
          var nowMonth = stDate.getMonth()
          var nowYear = stDate.getFullYear()
          var weekStartDate = new Date(nowYear, nowMonth, nowDayOfWeek === 0 ? nowDay - 6 : nowDay - nowDayOfWeek + 1)
          return formatDate(weekStartDate, 'yyyy-MM-dd')
        case '3':
          var start = new Date(this.search.startDate)
          start.setDate(1)
          return formatDate(start, 'yyyy-MM-dd')
      }
    },
    edTime() {
      switch (this.search.timeType) {
        case '0':
          return this.search.endDate
        case '1':
          return this.search.endDate
        case '2':
          var edDate = new Date(this.search.endDate)
          var edNowDayOfWeek = edDate.getDay()
          var edNowDay = edDate.getDate()
          var edNowMonth = edDate.getMonth()
          var edNowYear = edDate.getFullYear()
          var weekEndDate = new Date(edNowYear, edNowMonth, edNowDayOfWeek === 0 ? edNowDay : edNowDay - edNowDayOfWeek + 7)
          return formatDate(weekEndDate, 'yyyy-MM-dd')
        case '3':
          var date = new Date(this.search.endDate)
          var currentMonth = date.getMonth()
          var nextMonth = ++currentMonth
          var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
          var oneDay = 1000 * 60 * 60 * 24
          var end = new Date(nextMonthFirstDay - oneDay)
          return formatDate(end, 'yyyy-MM-dd')
      }
    }
  },
  watch: {
  },

  methods: {
    getKeeplive(query, name) {
      var arr = Object.getOwnPropertyNames(query)
      var keepAlive = true
      if (arr.length > 0) {
        keepAlive = name === 'StatisticsReport' || name === 'CustomerBreakdown'
      } else {
        keepAlive = false
      }
      return keepAlive
    },
    isUpdate() {
      if (!this.keepAlive) {
        this.resetData()
        this.init()
      }
      this.$refs.chartBox.scrollTop = sessionStorage.getItem('chart') || 0
    },
    handelscroll() {
      this.scrollTop = this.$refs.chartBox.scrollTop
    },
    resetData() {
      this.search = {
        dateRange: [new Date(), new Date()],
        startDate: formatDate(new Date(), 'yyyy-MM-dd'),
        endDate: formatDate(new Date(), 'yyyy-MM-dd'),
        store: '',
        timeType: '0'
      }
      this.customerType = '0'
    },
    handleCustomerTypeChange() {
      this.fetchStatisticsAnalyseData()
    },
    handleTimeTypeChange() {
      this.loadData()
    },
    handleDateChange() {
      this.search.startDate = this.search.dateRange[0]
      this.search.endDate = this.search.dateRange[1]
      if (this.search.startDate === this.search.endDate) {
        this.search.timeType = '0'
      } else if (this.search.startDate !== this.search.endDate && this.search.timeType === '0') {
        this.search.timeType = '1'
      }
      this.loadData()
    },
    handleNodeClick(data) {
      this.importSaleDataSelected.store = data.label
      this.importSaleDataSelected.structId = data.id
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.loadData()
      })
    },
    openTimesRangeDialog() {
      this.timesRangeDialog = true
    },
    closeTimesRangeDialog: function () {
      this.timesRangeDialog = false
      // this.$refs.addCargoPlan.$refs.newPlan.resetFields()
    },
    init() {
      sessionStorage.removeItem('chart')
      this.listPermissionTree()
      this.loadData()
    },
    loadData() {
      this.fetchStatisticsAnalyseData()
      this.fetchStatisticsGenderData()
      this.fetchStatisticsAgeData()
      // this.fetchStatisticsCustomerData()
      this.fetchStatisticsTimesData()
      this.querySaleData()
    },
    fetchStatisticsTimesData() {
      this.timesEmptyFlag = false
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId
      }
      fetchStatisticsTimesData(params).then((res) => {
        let count = 0
        res.forEach(d => { count += parseInt(d.value) })
        if (count === 0) {
          this.timesEmptyFlag = true
        }
        this.loadTimesChart(res.map(r => {
          var arr = r.name.split('-')
          if (arr.length >= 2 && parseInt(arr[0]) === parseInt(arr[1])) {
            return arr[0]
          } else {
            return r.name
          }
        }), res.map(r => r.value))
      })
    },
    fetchStatisticsCustomerData() {
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId
      }
      fetchStatisticsCustomerData(params).then((res) => {
        res.forEach(r => { r.name = r.label })
        this.loadCustomerChart(res)
      })
    },
    fetchStatisticsGenderData() {
      this.genderEmptyFlag = false
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId
      }
      fetchStatisticsGenderData(params).then((res) => {
        let count = 0
        res.forEach(d => { count += parseInt(d.value) })
        if (count === 0) {
          this.genderEmptyFlag = true
        }
        this.loadGenderChart(res)
      })
    },
    fetchStatisticsAgeData() {
      this.ageEmptyFlag = false
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId
      }
      fetchStatisticsAgeData(params).then((res) => {
        let count = 0
        res.forEach(d => { count += parseInt(d.value) })
        if (count === 0) {
          this.ageEmptyFlag = true
        }
        res.forEach(r => { r.name = r.label })
        this.loadAgeChart(res)
      })
    },
    fetchStatisticsAnalyseData() {
      this.analyseEmptyFlag = false
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId,
        timeType: this.search.timeType
      }
      fetchStatisticsAnalyseData(params).then((res) => {
        this.analyseData = res
        let count = 0
        res.forEach(d => { count += parseInt(d.total) })
        if (count === 0) {
          this.analyseEmptyFlag = true
        }
        switch (this.customerType) {
          case '0':
            if (!this.errorFlag) {
              this.loadAnalyseChart(res.map(r => {
                if (this.search.timeType === '2') {
                  var arr = r.time.split('-')
                  return arr[0].slice(5) + '-' + arr[1].slice(5)
                } else {
                  return r.time
                }
              }), res.map(r => r.total))
            }
            break
          case '1':
            this.loadAnalyseChart(res.map(r => {
              if (this.search.timeType === '2') {
                var arr = r.time.split('-')
                return arr[0].slice(5) + '-' + arr[1].slice(5)
              } else {
                return r.time
              }
            }), res.map(r => r.oldTotal))
            break
          case '2':
            this.loadAnalyseChart(res.map(r => {
              if (this.search.timeType === '2') {
                var arr = r.time.split('-')
                return arr[0].slice(5) + '-' + arr[1].slice(5)
              } else {
                return r.time
              }
            }), res.map(r => r.newTotal))
            break
        }
      })
    },
    loadAnalyseChart(xData, yData) {
      this.analyseChart = echarts.init(document.getElementById('analyseChart'))
      const that = this
      const count = this.getMax(yData)
      var option = {
        title: {
          text: '客流分析',
          textStyle: {
            fontSize: 16
          },
          subtext: this.analyseText
        },
        grid: {
          top: '80px',
          left: '40px',
          right: '40px',
          bottom: '20px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var showHtm = ''
            if (that.search.timeType === '0') {
              var addStr = (parseInt(params[0].name.split(':')[0]) + 1)
              addStr = addStr > 9 ? addStr : '0' + addStr
              showHtm += params[0].name + '-' + addStr + ':00' + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: #FFD86F;margin-right: 5px;border-radius: 50%;"></i>' + params[0].value
            } else {
              showHtm += params[0].name + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: #FFD86F;margin-right: 5px;border-radius: 50%;"></i>' + params[0].value
            }
            return showHtm
          }
        },
        toolbox: {
          show: true,
          right: '20px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData
          }
        ],
        yAxis: [
          {
            name: '人',
            type: 'value',
            splitNumber: 5,
            max: count < 5 ? 5 : null,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            color: '#FFD86F',
            data: yData
          }
        ]
      }
      this.analyseChart.setOption(option, true)
    },
    loadGenderChart(data) {
      this.analyseChart1 = echarts.init(document.getElementById('genderChart'))
      var option = {
        title: {
          text: '性别',
          textStyle: {
            fontSize: 16
          },
          subtext: this.timeText
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          right: '20px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        color: ['#5B8EF6', '#F3628E'],
        calculable: true,
        series: [
          {
            type: 'pie',
            radius: ['30%', '45%'],
            labelLine: {
              normal: {
                length: 5,
                length2: 35,
                lineStyle: {
                  // color: '#333'
                }
              }

            },
            label: {
              normal: {
                formatter: ' {b} : {c}人\n\n',
                borderWidth: 20,
                borderRadius: 4,
                padding: [0, -38],
                rich: {
                  a: {
                    fontSize: 12,
                    lineHeight: 20
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 20
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  // color: '#4A4A4A'
                },
                labelLine: {
                  // color: '#4A4A4A',
                  length: 2
                }
              }
            },
            data: data
          }
        ]
      }
      this.analyseChart1.setOption(option, true)
    },
    loadAgeChart(data) {
      this.analyseChart2 = echarts.init(document.getElementById('ageChart'))
      var option = {
        title: {
          text: '年龄',
          textStyle: {
            fontSize: 16
          },
          subtext: this.timeText
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          right: '20px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        color: ['#1696F8', '#6A63E5', '#7D97D6', '#98B9EC'],
        calculable: true,
        series: [
          {
            type: 'pie',
            radius: ['30%', '45%'],
            labelLine: {
              normal: {
                length: 5,
                length2: 35,
                lineStyle: {
                  // color: '#333'
                }
              }

            },
            label: {
              normal: {
                formatter: ' {b} : {c}人\n\n',
                borderWidth: 20,
                borderRadius: 4,
                padding: [0, -38],
                rich: {
                  a: {
                    fontSize: 12,
                    lineHeight: 20
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 20
                  }
                }
              }
            },
            itemStyle: {
              normal: {
                label: {
                  // color: '#4A4A4A'
                },
                labelLine: {
                  // color: '#4A4A4A',
                  length: 10
                }
              }
            },
            data: data
          }
        ]
      }
      this.analyseChart2.setOption(option, true)
    },
    loadCustomerChart(data) {
      this.analyseChart3 = echarts.init(document.getElementById('customerChart'))
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        toolbox: {
          show: true,
          right: '20px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        color: ['#F3628E', '#5B8EF6'],
        calculable: true,
        series: [
          {
            type: 'pie',
            radius: ['40%', '60%'],
            itemStyle: {
              normal: {
                label: {
                  // color: '#4A4A4A'
                },
                labelLine: {
                  // color: '#4A4A4A',
                  length: 10
                }
              }
            },
            data: data
          }
        ]
      }
      this.analyseChart3.setOption(option, true)
    },
    loadTimesChart(xData, yData) {
      this.analyseChart4 = echarts.init(document.getElementById('timesChart'))
      const count = this.getMax(yData)
      var option = {
        title: {
          text: '进店次数',
          textStyle: {
            fontSize: 16
          },
          subtext: this.timeText
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '80px',
          left: '40px',
          right: '40px',
          bottom: '20px',
          containLabel: true
        },
        toolbox: {
          show: true,
          right: '20px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: xData
          }
        ],
        yAxis: [
          {
            name: '人',
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitNumber: 5,
            max: count < 5 ? 5 : null
          }
        ],
        series: [
          {
            type: 'bar',
            color: '#5B8EF6',
            barWidth: 50,
            data: yData
          }
        ]
      }
      this.analyseChart4.setOption(option, true)
    },
    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
      this.loadData()
    },

    clearImportSaleDataStore() {
      this.importSaleDataSelected.store = ''
      this.importSaleDataSelected.structId = ''
      this.$nextTick(() => {
        this.$refs.importSaleDataFormDrop.hide()
      })
    },

    handleSaleSelectStore(data) {
      if (data.type !== 2) {
        return
      }
      this.$nextTick(() => {
        this.importSaleDataSelected.store = data.label
        this.importSaleDataSelected.structId = data.id
        this.$refs.importSaleDataFormDrop.hide()
      })
    },

    listPermissionTree() {
      this.search.store = ''
      this.search.structId = ''
      listPermissionTree().then((res) => {
        this.tree = res
        this.search.structId = this.tree[0].id
        this.search.store = this.tree[0].label
      })
    },

    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.loadData()
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    openImportSaleData() {
      this.openImportSaleDataDig = true
    },

    closeImportSaleData() {
      this.$refs.saleUploader.abortUpload()
      this.importSaleDataSelected.store = ''
      this.importSaleDataSelected.structId = ''
    },

    saveSaleData() {
      const params = {
        filePath: this.$refs.saleUploader.saleFilePath,
        structId: this.importSaleDataSelected.structId
      }
      if (params.structId === '' || params.structId === undefined) {
        this.$message({
          message: '请选择门店',
          type: 'error'
        })
        return
      }
      if (params.filePath === '' || params.filePath === undefined) {
        this.$message({
          message: '请先上传文件',
          type: 'error'
        })
        return
      }
      saveSaleData(params).then((res) => {
        if (res === 'success') {
          this.$message({
            message: '数据导入成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '数据导入失败',
            type: 'error'
          })
        }
        this.querySaleData()
        this.openImportSaleDataDig = false
      })
    },

    querySaleData() {
      this.saleDataIsEmpty = false
      const params = {
        structId: this.search.structId,
        startTime: this.search.startDate ? this.$moment(this.search.startDate).format('YYYY-MM-DD') : '',
        endTime: this.search.endDate ? this.$moment(this.search.endDate).format('YYYY-MM-DD') : '',
        timeType: this.search.timeType,
        date: this.search.endDate ? this.$moment(this.search.endDate).format('YYYY-MM-DD') : ''
      }
      querySaleData(params).then((res) => {
        let count = 0
        res.data.forEach(d => { count += parseInt(d.account) + parseInt(d.orderNum) })
        if (count === 0) {
          this.saleDataIsEmpty = true
        }
        if (res.data) {
          let time = []
          switch (params.timeType) {
            case '0':
              time = res.data.map((data, index) => data.saleDatatime)
              break
            case '1':
              time = res.data.map((data, index) => this.$moment(data.saleDatatime).format('YYYY/MM/DD'))
              break
            case '2':
              time = res.data.map((data, index) => (data.firstDayOfWeek + '-' + data.lastDayOfWeek))
              break
            case '3':
              time = res.data.map((data, index) => data.saleDatatime)
              break
          }
          const data = {
            time: time,
            orderNum: res.data.map((data, index) => Number(data.orderNum)),
            account: res.data.map((data, index) => Number(data.account))
          }
          if (!this.errorFlag) {
            this.drawSaleData(data)
          }
        }
      })
    },

    drawSaleData(data) {
      const d = document.getElementById('saleDataChart')
      this.myPie = echarts.init(d)
      const count = this.getMax(data.orderNum)
      const that = this
      const option = {
        title: {
          text: '销售额',
          textStyle: {
            fontSize: 16
          },
          subtext: this.analyseText
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var showHtm = ''
            if (that.search.timeType === '0') {
              var addStr = (parseInt(params[0].name.split(':')[0]) + 1)
              addStr = addStr > 9 ? addStr : '0' + addStr
              showHtm += params[0].name + '-' + addStr + ':00' + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: rgba(191, 191, 191, 1);margin-right: 5px;border-radius: 50%;"></i>' + '销售额：' + params[0].value + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: #FFD86F;margin-right: 5px;border-radius: 50%;"></i>' + '订单量: ' + params[1].value
            } else {
              showHtm += params[0].name + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: rgba(191, 191, 191, 1);margin-right: 5px;border-radius: 50%;"></i>' + '销售额：' + params[0].value + '<br/>'
              showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color: #FFD86F;margin-right: 5px;border-radius: 50%;"></i>' + '订单量: ' + params[1].value
            }
            return showHtm
          },
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          },
          right: '20px'
        },
        legend: {
          data: ['订单量', '销售额'],
          itemWidth: 20,
          itemHeight: 12,
          textStyle: {
            fontSize: 10,
            fontWeight: 500,
            fontFamily: 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
            color: '#606266'
          },
          top: '6px'
        },
        grid: {
          top: '80px',
          left: '40px',
          right: '40px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.time
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            nameTextStyle: {
              padding: [0, 0, 0, 30]
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
              }
            },
            splitLine: {
            }
          },
          {
            type: 'value',
            name: '订单量',
            nameTextStyle: {
              padding: [0, 30, 0, 0]
            },
            splitNumber: 5,
            max: count < 5 ? 5 : null,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '销售额',
            type: 'bar',
            barWidth: '20px',
            color: 'rgba(191, 191, 191, 1)',
            data: data.account
          },
          {
            name: '订单量',
            type: 'line',
            color: '#FFD86F',
            yAxisIndex: 1,
            data: data.orderNum
          }
        ]
      }
      setTimeout(() => {
        this.myPie.clear()
        this.myPie.setOption(option)
      }, 100)
    },

    showFileSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return Math.round(size / 1024) + 'KB'
      } else if (size < 1024 * 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + 'MB'
      } else {
        return Math.round(size / 1024 / 1024 / 1024) + 'GB'
      }
    },
    getMax(array) {
      let max = 0
      for (var i = 0; i < array.length; i++) {
        max = max === 0 ? array[i] : (parseInt(max) > parseInt(array[i]) ? parseInt(max) : parseInt(array[i]))
      }
      return max
    }
  }
}
</script>

<style>
.chart {
  height: 100%;
  overflow: auto;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
.el-radio__label {
  font-size: 14px;
  padding-left: 5px;
}
.chart-prefix {
  width: 100%;
}
.chart-title {
  display: inline-block;
  line-height: 40px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
}

.attr .el-input--mini .el-input__inner {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
}

.addAccount-scrollbar-wrap {
  overflow-x: hidden;
}

.attr-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}
.sale-scrollbar-wrap {
  max-height: 45vh;
}
.card {
  width: 100%;
  border-radius: 5px;
  padding: 10px;
}
.el-card {
  border: 0px solid #ffffff;
}
.el-card__header {
  background-color: #ffffff !important;
}
.card-header {
  font-size: 16px;
  font-weight: bold;
  background-color: #ffffff;
  color: #666666;
  padding-bottom: 10px;
}

.tips_container {
  width: 100%;
  height: 350px;
  position: relative;
}

.tips_text {
  /*基本样式*/
  width: 100%;
  height: 20px;
  text-align: center;
  /*水平居中*/
  margin: auto;
  /*垂直居中*/
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
