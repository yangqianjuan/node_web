<template>
  <div
    id="analyseStatistic"
    class="app-container"
  >
    <!-- 搜索栏-->
    <el-row class="search-container">
      <el-col
        :xs="24"
        :sm="24"
        :lg="18"
      >
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
        <span class="cond-name">到店时间:</span>
        <template v-if="search.timeType === 0">
          <el-date-picker
            v-model="search.startDate"
            type="date"
            size="mini"
            :clearable="false"
            placeholder="开始时间"
            :picker-options="startDateOpt"
            @change="handleStartDateChange"
          >
          </el-date-picker>
          <span class="cond-name">到</span>
          <el-date-picker
            v-model="search.endDate"
            type="date"
            size="mini"
            :clearable="false"
            placeholder="结束时间"
            :picker-options="endDateOpt"
            @change="handleEndDateChange"
          >
          </el-date-picker>
        </template>
        <template v-else-if="search.timeType === 1">
          <el-date-picker
            v-model="search.startDate"
            type="week"
            size="mini"
            :clearable="false"
            format="yyyy 第 WW 周"
            placeholder="开始时间"
            :picker-options="startDateOpt"
            @change="handleStartDateChange"
          >
          </el-date-picker>
          <span class="cond-name">到</span>
          <el-date-picker
            v-model="search.endDate"
            type="week"
            size="mini"
            :clearable="false"
            format="yyyy 第 WW 周"
            placeholder="结束时间"
            :picker-options="endDateOpt"
            @change="handleEndDateChange"
          >
          </el-date-picker>
        </template>
        <template v-else-if="search.timeType === 2">
          <el-date-picker
            v-model="search.startDate"
            type="month"
            size="mini"
            :clearable="false"
            placeholder="开始时间"
            :picker-options="startDateOpt"
            @change="handleStartDateChange"
          >
          </el-date-picker>
          <span class="cond-name">到</span>
          <el-date-picker
            v-model="search.endDate"
            type="month"
            size="mini"
            :clearable="false"
            placeholder="结束时间"
            :picker-options="endDateOpt"
            @change="handleEndDateChange"
          >
          </el-date-picker>
        </template>
        <span class="cond-name">选择门店:</span>
        <el-select
          v-model="search.storeId"
          filterable
          placeholder="全部"
          size="mini"
          clearable
          style="width:140px"
          @change="loadData"
        >
          <el-option
            v-for="item in storeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="6"
        align="right"
      >
        <a
          v-bind:href="handleExport"
          target="_blank"
        >
          <el-button
            type="primary"
            size="mini"
          >导出表格</el-button>
        </a>
      </el-col>
    </el-row>

    <el-row class="chart-wrapper">
      <trend-line-chart :chart-data="trendLineData" />
    </el-row>

    <el-row :gutter="16">
      <el-col
        :xs="24"
        :sm="24"
        :lg="10"
      >
        <div class="chart-wrapper">
          <times-line-chart :chart-data="timesLineData" />
        </div>
        <div class="cond-container">
          <el-tooltip
            effect="dark"
            placement="top"
            :visible-arrow=false
          >
            <div
              slot="content"
              class="tooltip-container"
            >
              <span class="tooltip-title">说明:</span>
              <div class="tooltip-desc"><br />分为每天和每周的到店时段分布，<br />每天的时段范围为08:00-22:00，<br />每周则为周一至周日。</div>
            </div>
            <svg-icon
              icon-class="note"
              class-name="note-icon"
            />
          </el-tooltip>
          <el-radio-group
            class="radio-group-btn"
            v-model="timeRadio"
            size="small"
            @change="handleTimeChange"
          >
            <el-radio-button label="天" />
            <el-radio-button label="周" />
          </el-radio-group>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :lg="14"
      >
        <el-row>
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <gender-pie-chart :chart-data="genderPieData" />
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <age-bar-chart :chart-data="ageBarData" />
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TrendLineChart from './components/TrendLineChart'
import GenderPieChart from './components/GenderPieChart'
import AgeBarChart from './components/AgeBarChart'
import TimesLineChart from './components/TimesLineChart'
import { getStoreOption } from '@/api/customer'
import { analyseTrend } from '@/api/statistics'
import { getGenderChart, getAgeChart, getTimeSlotChart } from '@/api/dashboard'
import { formatDate, getYestoday, getSevenDays, getPreviousWeek, getPreviousMonth } from '@/utils/date'
import { getToken } from '@/utils/auth'
export default {
  name: 'StatisticsAnalyse',
  components: {
    TrendLineChart,
    GenderPieChart,
    AgeBarChart,
    TimesLineChart
  },
  props: {
    tabName: {
      type: String,
      default: 'data'
    }
  },
  data() {
    return {
      trendLineData: {},
      timesLineData: {},
      genderPieData: [],
      ageBarData: {},
      dayType: 0,
      timeRadio: '天',
      search: {
        startDate: getSevenDays(),
        endDate: getYestoday(),
        storeId: '',
        timeType: 0,
        token: getToken()
      },
      storeList: [],
      downloadLoading: false,
      exportData: '',
      timeTypeOptions: [{
        value: 0,
        label: '按天'
      }, {
        value: 1,
        label: '按周'
      }, {
        value: 2,
        label: '按月'
      }],
      endDateOpt: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          var millisecond = 1000 * 60 * 60 * 24
          const date = formatDate(new Date(new Date(this.search.startDate).getTime() - millisecond), 'yyyy-MM-dd')
          return time.getTime() < new Date(date) || time.getTime() > new Date()
        }
      },
      startDateOpt: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          return time.getTime() > new Date(this.search.endDate)
        }
      }
    }
  },
  computed: {
    stTime() {
      switch (this.search.timeType) {
        case 0:
          this.search.startDate = getSevenDays()
          break
        case 1:
          this.search.startDate = getPreviousWeek(4)[0] // 默认开始时间是前四周第一天
          break
        case 2:
          this.search.startDate = getPreviousMonth(6)[0] // 默认开始时间是前6个月第一天
          break
      }
      return this.search.startDate
    },
    edTime() {
      switch (this.search.timeType) {
        case 0:
          this.search.endDate = getYestoday()
          break
        case 1:
          this.search.endDate = getPreviousWeek(1)[1] // 默认结束时间是上周最后一天
          break
        case 2:
          this.search.endDate = getPreviousMonth(1)[1] // 默认开始时间是前6个月最后一天
          break
      }
      return this.search.endDate
    },
    handleExport: function () {
      return process.env.BASE_API + `/analyse/export?token=${this.search.token}&startDate=${this.search.startDate}&endDate=${this.search.endDate}&storeId=${this.search.storeId}&timeType=${this.search.timeType}`
    }
  },
  activated() {
    this.init()
  },
  mounted() {
    this.init()
  },
  methods: {
    handleTimeTypeChange() {
      this.search.startDate = this.stTime
      this.search.endDate = this.edTime
      this.loadData()
    },
    handleStartDateChange() {
      // 一天的毫秒数
      var millisecond = 1000 * 60 * 60 * 24
      switch (this.search.timeType) {
        // 按天
        case 0:
          this.search.startDate = formatDate(new Date(this.search.startDate), 'yyyy-MM-dd')
          break
        // 按周
        case 1:
          // 周日为一周的开始时间
          this.search.startDate = formatDate(new Date(new Date(this.search.startDate).getTime() - millisecond), 'yyyy-MM-dd')
          break
        // 按月
        case 2:
          this.search.startDate = formatDate(new Date(this.search.startDate), 'yyyy-MM-dd')
          break
      }
      this.loadData()
    },
    handleEndDateChange() {
      // 一天的毫秒数
      var millisecond = 1000 * 60 * 60 * 24
      switch (this.search.timeType) {
        // 按天
        case 0:
          this.search.endDate = formatDate(new Date(this.search.endDate), 'yyyy-MM-dd')
          break
        // 按周
        case 1:
          // 周日为一周的结束时间
          this.search.endDate = formatDate(new Date(new Date(this.search.endDate).getTime() + 5 * millisecond), 'yyyy-MM-dd')
          break
        // 按月
        case 2:
          this.search.endDate = formatDate(new Date(this.search.endDate), 'yyyy-MM-dd')
          var date = this.search.endDate.split('-')
          var month1 = Number(date[1])
          var month2 = month1 + 1 < 10 ? '0' + (month1 + 1) : (month1 + 1)
          var date2 = date[0] + '-' + month2 + '-' + date[2]
          // 本月底最后一天即下个月的前一天
          this.search.endDate = formatDate(new Date(new Date(date2).getTime() - millisecond), 'yyyy-MM-dd')
          break
      }
      this.loadData()
    },
    init() {
      this.getStoreOption()
      this.loadData()
    },
    loadData() {
      this.getTrendData()
      this.getTimesData()
      this.getGenderData()
      this.getAgeData()
    },
    handleTimeChange(e) {
      switch (e) {
        case '天':
          this.dayType = 0
          break
        case '周':
          this.dayType = 1
          break
        default:
          break
      }
      this.getTimesData()
    },
    getStoreOption() {
      getStoreOption().then(res => {
        this.storeList = res
      })
    },
    getTrendData() {
      analyseTrend(this.search).then(res => {
        const echartData = res.data
        var data = {
          time: echartData.map((data, index) => `${data.time}\n${data.timeTip || ''}`),
          total: echartData.map((data, index) => Number(data.total)),
          secondTimes: echartData.map((data, index) => Number(data.secondTimes))
        }
        this.trendLineData = data
      })
    },
    getTimesData() {
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        storeId: this.search.storeId,
        timeType: this.dayType
      }
      getTimeSlotChart(params).then(res => {
        this.timesLineData = res.data
      })
    },
    getGenderData() {
      getGenderChart(this.search).then(res => {
        this.genderPieData = res.data
      })
    },
    getAgeData() {
      getAgeChart(this.search).then(res => {
        this.ageBarData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input_store {
  width: 140px;
}
.cond-container {
  position: absolute;
  left: 100px;
  top: 16px;
  .radio-group-btn {
    margin-left: 20px;
  }
}

.group-button {
  width: 120px;
  height: 28px;
  margin-left: 24px;
  font-size: 14px;
  font-family: PingFangSC-Regular, Microsoft YaHei;
  .group-day-button {
    padding: 10px 15px;
    border-radius: 4px 0px 0px 4px;
    border: 1px solid rgba(220, 223, 230, 1);
    color: rgba(0, 0, 0, 0.65);
  }
  .group-day-selected {
    padding: 10px 15px;
    background: rgba(230, 241, 252, 1);
    border-radius: 4px 0px 0px 4px;
    border: 1px solid rgba(163, 208, 253, 1);
    color: rgba(24, 144, 255, 1);
  }
  .group-week-button {
    padding: 10px 15px;
    border-radius: 0px 4px 4px 0px;
    border: 1px solid rgba(220, 223, 230, 1);
    color: rgba(0, 0, 0, 0.65);
  }
  .group-week-selected {
    padding: 10px 15px;
    background: rgba(230, 241, 252, 1);
    border-radius: 0px 4px 4px 0px;
    border: 1px solid rgba(163, 208, 253, 1);
    color: rgba(24, 144, 255, 1);
  }
}
.group-button :focus {
  border: 1px solid rgba(163, 208, 253, 1);
}

.current-time-type {
  background: rgba(230, 241, 252, 1);
  color: #1890ff;
  border: 1px solid rgba(163, 208, 253, 1);
}
</style>
