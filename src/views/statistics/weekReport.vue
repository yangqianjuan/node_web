<template>
  <div class="weekReport">
    <div class="app-container">
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
                wrap-class="store-scrollbar-wrap"
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
      </div>
      <el-row
        :gutter="10"
        style="margin-top: 10px"
      >
        <el-col :span="24">
          <el-card
            class="card"
            shadow="hover"
          >
            <div
              id="weekReportChart"
              style="height: 350px; width: 100%;"
            ></div>
          </el-card>
        </el-col>
      </el-row>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px"
      >
        <span class="table-tile">周客流报表</span><span class="table-tile-total">共{{page.total}}条</span>
        <a
          v-bind:href="exportChart"
          target="_blank"
        >
          <el-button
            type="text"
            style="float: right; line-height: 25px;margin: 0 10px 0 10px; font-size: 14px;"
            size="small"
          >导出</el-button>
        </a>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 550px); border-radius: 5px;">
        <el-table
          :data="tableData"
          row-key="id"
          fit
          v-loading="loading"
          size="small"
          class="table-box"
        >
          <el-table-column
            label="名称"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{storeName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="日期"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="total"
            label="进店总人数"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="newTotal"
            label="新客"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="oldTotal"
            label="老客"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="newPercent"
            label="新客占比"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="oldPercent"
            label="老客占比"
            :resizable="false"
            align="center"
          ></el-table-column>
        </el-table>
        <pagination
          v-if="pageshow && page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="handlePageChange"
        ></pagination>
      </div>
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
import { formatDate } from '@/utils/date'
import { getToken } from '@/utils/auth'
import { fetchWeekReportData } from '@/api/statistics'
import Pagination from '@/components/Pagination'

export default {
  name: 'StatisticsByWeek',
  mixins: [resize],
  watch: {
  },
  components: {
    Pagination
  },
  data() {
    return {
      token: '',
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      search: {
        dateRange: [new Date(new Date().getTime() - 6 * 3600 * 24 * 7 * 1000), new Date()],
        startDate: formatDate(new Date(new Date().getTime() - 6 * 3600 * 24 * 7 * 1000), 'yyyy-MM-dd'),
        endDate: formatDate(new Date(), 'yyyy-MM-dd'),
        store: '',
        structId: '',
        timeType: '0'
      },
      tableData: [],
      allData: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    storeName() {
      if (this.search.store) {
        return this.search.store
      } else if (this.tree.length > 0) {
        return this.tree[0].label
      } else {
        return ''
      }
    },
    exportChart: function () {
      return process.env.BASE_API + `/report/week/export?token=${this.token}&startDate=${this.stTime}&endDate=${this.edTime}&structId=${this.search.structId}&store=${encodeURI(this.storeName)}`
    },
    stTime() {
      var stDate = new Date(this.search.startDate)
      var nowDayOfWeek = stDate.getDay()
      var nowDay = stDate.getDate()
      var nowMonth = stDate.getMonth()
      var nowYear = stDate.getFullYear()
      var weekStartDate = new Date(nowYear, nowMonth, nowDayOfWeek === 0 ? nowDay - 6 : nowDay - nowDayOfWeek + 1)
      return formatDate(weekStartDate, 'yyyy-MM-dd')
    },
    edTime() {
      var edDate = new Date(this.search.endDate)
      var edNowDayOfWeek = edDate.getDay()
      var edNowDay = edDate.getDate()
      var edNowMonth = edDate.getMonth()
      var edNowYear = edDate.getFullYear()
      var weekEndDate = new Date(edNowYear, edNowMonth, edNowDayOfWeek === 0 ? edNowDay : edNowDay - edNowDayOfWeek + 7)
      return formatDate(weekEndDate, 'yyyy-MM-dd')
    }
  },
  mounted() {
    this.token = getToken()
    this.listPermissionTree()
  },
  methods: {
    handleDateChange() {
      this.search.startDate = this.search.dateRange[0]
      this.search.endDate = this.search.dateRange[1]
      this.searchQuery()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.searchQuery()
      })
    },
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.searchQuery()
      })
    },
    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
      this.searchQuery()
    },
    listPermissionTree() {
      listPermissionTree().then((res) => {
        this.tree = res
        this.search.structId = this.tree[0].id
        this.search.store = this.tree[0].label
        this.fetchWeekReportData()
      })
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.fetchWeekReportData()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      if (this.allData.length !== 0) {
        this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
      } else {
        this.fetchWeekReportData()
      }
    },
    fetchWeekReportData(val) {
      this.loading = true
      const params = {
        startDate: this.stTime,
        endDate: this.edTime,
        structId: this.search.structId
      }
      fetchWeekReportData(params).then((res) => {
        this.loading = false
        this.allData = res
        this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
        this.page.total = res.length
        const echartData = res
        const data = {
          date: echartData.map((data, index) => (data.time).substr(5, 6) + (data.time.substr(16, 5))),
          total: echartData.map((data, index) => Number(data.total))
        }
        this.loadWeekReportChart(data)
      })
    },
    loadWeekReportChart(data) {
      this.chart = echarts.init(document.getElementById('weekReportChart'))
      const count = this.getMax(data.total)
      var option = {
        title: {
          text: '周客流趋势',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          top: '10px',
          right: '10px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        calculable: true,
        grid: {
          top: '70px',
          left: '55px',
          right: '55px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: data.date
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
            data: data.total
          }
        ]
      }
      this.chart.setOption(option, true)
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
  font-size: 14px;
  font-weight: bold;
  background-color: #ffffff;
  color: #666666;
  padding-bottom: 10px;
}
</style>

