<template>
  <div class="statisticsByDay">
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
            clearable
            @clear="clearStore"
            size="mini"
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
            <!-- <div slot="header" class="card-header">
                <span>客流分析</span>
              </div> -->
            <div
              id="statisticsByDayChart"
              style="height: 350px; width: 100%;"
            ></div>
            <!-- <div style="height: 300px;" v-show="dataEmptyFlag">
                <span style="text-align: center;width: 100%;display:inline-block;margin: auto; margin-top: 50px">暂无数据</span>
              </div> -->
          </el-card>
        </el-col>
      </el-row>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px"
      >
        <span class="table-tile">日客流报表</span><span class="table-tile-total">共{{page.total}}条</span>
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
            prop="store"
            label="名称"
            :resizable="false"
            align="center"
          ></el-table-column>
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
import { getToken } from '@/utils/auth'
import { getStatisticsDayData } from '@/api/statistics'
import Pagination from '@/components/Pagination'
export default {
  name: 'StatisticsByDay',
  mixins: [resize],
  components: {
    Pagination
  },
  data() {
    return {
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      search: {
        token: '',
        store: '',
        dateRange: [this.$moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'), this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')],
        structId: '',
        startDate: '',
        endDate: ''
      },
      tree: [],
      checkedStore: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      allData: [],
      loading: false,
      dataEmptyFlag: false,
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
  mounted() {
    this.token = getToken()
    this.listPermissionTree()
  },
  computed: {
    exportChart: function () {
      return process.env.BASE_API + `/statistics/day/data/export?token=${this.token}&startDate=${this.search.startDate ? this.search.startDate : this.search.dateRange[0]}` +
        `&endDate=${this.search.endDate ? this.search.endDate : this.search.dateRange[1]}&structId=${this.search.structId}`
    }
  },
  methods: {
    clearStore() {
      this.search.store = this.tree ? this.tree[0].label : ''
      this.search.structId = this.tree ? this.tree[0].id : ''
      this.checkedStore = []
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
    },
    listPermissionTree() {
      listPermissionTree().then((res) => {
        this.tree = res
        this.search.structId = this.tree[0].id
        this.search.store = this.tree[0].label
        this.getStatisticsDayData()
      })
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
        this.checkedStore = []
        this.checkedStore.push(data.id)
        this.searchQuery()
      })
    },
    handleDateChange() {
      this.search.startDate = this.search.dateRange[0]
      this.search.endDate = this.search.dateRange[1]
      if (this.search.startDate === this.search.endDate) {
        this.search.timeType = '0'
      } else if (this.search.startDate !== this.search.endDate && this.search.timeType === '0') {
        this.search.timeType = '1'
      }
      this.searchQuery()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.getStatisticsDayData()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      if (this.allData.length !== 0) {
        this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
      } else {
        this.getStatisticsDayData()
      }
    },
    getStatisticsDayData() {
      const params = {
        startDate: this.search.startDate ? this.search.startDate : this.search.dateRange[0],
        endDate: this.search.endDate ? this.search.endDate : this.search.dateRange[1],
        structId: this.search.structId
      }
      if (params.structId === '' || params.structId === undefined) {
        return
      }
      this.loading = true
      this.dataEmptyFlag = false
      getStatisticsDayData(params).then((res) => {
        this.loading = false
        let count = 0
        res.data.forEach(d => { count += parseInt(d.total) })
        if (count === 0) {
          this.dataEmptyFlag = true
        }
        this.allData = res.data
        this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
        this.page.total = res.total
        function sortByDate(a, b) {
          var val1 = a.time
          var val2 = b.time
          if (val1 > val2) {
            return 1
          } else if (val1 < val2) {
            return -1
          } else {
            return 0
          }
        }
        const echartData = res.data.sort(sortByDate)
        const data = {
          date: echartData.map((data, index) => this.$moment(data.time).format('YYYY/MM/DD')),
          total: echartData.map((data, index) => Number(data.total))
        }
        this.drawLine(data)
      })
    },
    drawLine(data) {
      this.chart = echarts.init(document.getElementById('statisticsByDayChart'))
      const count = this.getMax(data.total)
      const option = {
        color: ['rgba(91, 155, 213, 1)'],
        title: {
          text: '日客流趋势',
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false
        },
        toolbox: {
          show: true,
          right: '10px',
          top: '10px',
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        grid: {
          top: '70px',
          left: '55px',
          right: '55px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          position: 'bottom',
          boundaryGap: false,
          // 时间数据 x
          data: data.date
        }],
        yAxis: {
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
        },
        series: [
          {
            type: 'line',
            color: '#FFD86F',
            data: data.total
          }
        ]
      }
      setTimeout(() => {
        this.chart.clear()
        this.chart.setOption(option, true)
      }, 100)
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
