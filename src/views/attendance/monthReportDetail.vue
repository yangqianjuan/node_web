<template>
  <div>
    <div class="app-container">
      <div class="search-container">
        <span>考勤详情</span>
        <span class="cond-name">姓名: {{search.name}}</span>
        <span class="cond-name">考勤月份: {{search.date}}</span>
      </div>

      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">月度考勤分析</span>
      </div>
      <div
        id="attendanceDetailEchart"
        style="height: 300px; background-color: #ffffff;"
      ></div>
      <div class="table-prefix-bars">
        <span class="table-tile">月度考勤表</span><span class="table-tile-total">共{{page.total}}条</span>
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
      <div style="background-color: #ffffff; padding-bottom: 10px; border-radius: 5px;">
        <el-table
          :data="tableData"
          row-key="id"
          fit
          v-loading="loading"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="name"
            label="姓名"
            min-width="12%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            min-width="12%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="workTime"
            label="打卡时间"
            min-width="12%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === '迟到'"
                style="color: red"
              >{{scope.row.workTime}}</span>
              <span v-else>{{scope.row.workTime}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="考勤状态"
            min-width="12%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.status === '迟到'"
                style="color: red"
              >{{scope.row.status}}&nbsp;({{scope.row.lateTime}})</span>
              <span v-else>{{scope.row.status}}</span>
            </template>
          </el-table-column>
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
import { getAttendanceMonthReportPeople } from '@/api/attendance'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  mixins: [resize],
  components: {
    Pagination
  },
  computed: {
    exportChart: function () {
      return process.env.BASE_API + `/export/attendance/month/report/people?token=${this.token}&name=${this.search.name}&date=${this.search.date}`
    }
  },
  data() {
    return {
      tableData: [],
      search: {
        date: '',
        name: '',
        uId: ''
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: false,
      filterOptions: null,
      employeesNames: [],
      token: getToken()
    }
  },
  mounted() {
    this.getAttendanceMonthReportPeople()
  },
  methods: {
    filterNames(query) {
      if (!query) {
        this.filterOptions = null
        return
      }
      this.filterOptions = this.employeesNames.filter((data, index) => {
        return data.name.includes(query)
      })
    },
    getTimeList() {
      var timeList = []
      var _d = new Date('2018/01/01 07:00:00')
      for (let i = 0; i < 18001; i++) {
        timeList.push(this.$moment(_d).format('hh:mm:ss'))
        _d = new Date(_d.valueOf() + 1000)
      }
      return timeList
    },
    getAttendanceMonthReportPeople() {
      this.loading = true
      const params = {
        name: this.search.name,
        date: this.search.date ? this.$moment(this.search.date).format('YYYY-MM') : this.$moment(new Date()).format('YYYY-MM')
      }
      getAttendanceMonthReportPeople(params).then((res) => {
        this.loading = false
        this.allData = res.data
        this.page.total = res.total
        this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
        var reportData = []
        this.allData.forEach(element => {
          // let date = element.date + ' ' + element.workTime
          // date = date.substring(0, 19)
          // date = date.replace(/-/g, '/')
          // const timestamp = new Date(date).getTime()
          // reportData.push({
          //   name: this.$moment(element.date).format('MM/DD'),
          //   value: element.status !== '无记录' ? timestamp : ''
          // })
          reportData.push({
            name: this.$moment(element.date).format('MM/DD'),
            value: element.status !== '无记录' ? this.$moment(new Date(element.date + ' ' + element.workTime)).format('hh:mm:ss') : ''
          })
        })
        var timeList = this.getTimeList()
        this.drawLine(reportData, timeList)
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.tableData = this.allData.slice((this.page.currentPage - 1) * this.page.pageSize, this.page.currentPage * this.page.pageSize)
    },
    drawLine(reportData, timeList) {
      this.chart = echarts.init(document.getElementById('attendanceDetailEchart'))
      const option = {
        color: ['rgba(91, 155, 213, 1)'],
        title: {
          textStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const showHtm = `${params[0].data.name}<br/><i style="display: inline-block;width: 10px;height: 10px;background-color: #FFD86F;margin-right: 5px;border-radius: 50%;"></i>${params[0].data.value}`
            return showHtm
          }
        },
        legend: {
          show: false
        },
        toolbox: {
          show: true,
          right: '10px',
          top: '10px'
        },
        grid: {
          top: '20px',
          left: '55px',
          right: '55px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          position: 'bottom',
          boundaryGap: false,
          data: reportData.map((data, index) => data.name)
        }],
        yAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          // splitNumber: 50,
          data: timeList,
          splitLine: {
            show: true,
            interval: 1799,
            lineStyle: {
              // 使用深浅的间隔色
              color: ['#ccc', '#fff', '#ccc', '#fff', '#ccc', 'blue', '#ccc', '#fff', '#ccc', '#fff', '#ccc']
            }
          },
          axisLabel: {
            margin: 10,
            interval: 3599,
            // showMinLabel: true,
            // showMaxLabel: true,
            textStyle: {
              color: '#000',
              fontSize: 12
            }
          }
        },
        series: [
          {
            type: 'line',
            color: '#FFD86F',
            data: reportData
          }
        ]
      }
      setTimeout(() => {
        this.chart.clear()
        this.chart.setOption(option, true)
      }, 100)
    }
  },
  created() {
    if (this.$route.query.name === undefined) {
      this.search.name = ''
    } else {
      this.search.name = this.$route.query.name
    }
    if (this.$route.query.date === undefined) {
      this.search.date = ''
    } else {
      this.search.date = this.$route.query.date
    }
    if (this.$route.query.uId === undefined) {
      this.search.uId = ''
    } else {
      this.search.uId = this.$route.query.uId
    }
  }
}
</script>
<style>
</style>


