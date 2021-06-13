<template>
  <div
    id="DashBoard"
    class="dashboard"
  >
    <div class="dashboard-container">
      <panel-group :total="totalData" />
      <el-row class="trend-container">
        <el-col :span="24">
          <el-row class="trend-title-container">
            <el-col
              :xs="12"
              :sm="12"
              :lg="8"
              class="card-header-title"
            >
              <span class="card-trend-title">客流量</span>
            </el-col>
            <el-col
              :xs="12"
              :sm="12"
              :lg="16"
              align="right"
            >
              <el-row class="card-trend-button">
                <el-button
                  class="card-trend-button"
                  type="text"
                  @click="getTodayTrend"
                >
                  <span
                    v-if="search.dayType===0"
                    class="card-button-select"
                  >今日</span>
                  <span v-else>今日</span>
                </el-button>
                <el-button
                  class="card-trend-button"
                  type="text"
                  @click="getSevendayTrend"
                >
                  <span
                    v-if="search.dayType===1"
                    class="card-button-select"
                  >近7日</span>
                  <span v-else>近7日</span>
                </el-button>
                <el-button
                  class="card-trend-button"
                  type="text"
                  @click="getMonthTrend"
                >
                  <span
                    v-if="search.dayType===2"
                    class="card-button-select"
                  >近30日</span>
                  <span v-else>近30日</span>
                </el-button>
                <el-button
                  class="card-trend-button"
                  type="text"
                  @click="getYearTrend"
                >
                  <span
                    v-if="search.dayType===3"
                    class="card-button-select"
                  >近一年</span>
                  <span v-else>近一年</span>
                </el-button>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="card-container">
            <el-col
              :xs="12"
              :sm="12"
              :lg="24"
            >
              <div class="card-linetrend">
                <span class="trend-title">客流趋势</span>
                <div class="chart-wrapper">
                  <bar-chart :chart-data="trendData" />
                </div>
              </div>
              <div class="rank-container">
                <span class="rank-title">门店客流排名</span>
                <el-row
                  class="rank-content"
                  v-for="(item, index) in rankingData "
                  v-bind:key="index"
                >
                  <el-col :span="16">
                    <svg-icon
                      v-if="index === 0"
                      icon-class="top-a"
                      class-name="rank-icon"
                    />
                    <svg-icon
                      v-if="index === 1"
                      icon-class="top-b"
                      class-name="rank-icon"
                    />
                    <svg-icon
                      v-if="index === 2"
                      icon-class="top-c"
                      class-name="rank-icon"
                    />
                    <svg-icon
                      v-if="index === 3"
                      icon-class="top-d"
                      class-name="rank-icon"
                    />
                    <svg-icon
                      v-if="index === 4"
                      icon-class="top-e"
                      class-name="rank-icon"
                    />
                    <span>{{ item.name }}</span>
                  </el-col>
                  <el-col
                    :span="8"
                    align="right"
                  >
                    <span class="rank-data">{{ item.num }} &nbsp;人</span>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class="second-container">
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div class="second-tips">
            <span v-if="search.dayType === 0">今日</span>
            <span v-if="search.dayType === 1">近7日</span>
            <span v-if="search.dayType === 2">近30日</span>
            <span v-if="search.dayType === 3">近一年</span>
          </div>
          <div class="trend-title-wrapper">
            <span class="trend-title">性别比例</span>
            <div class="chart-wrapper">
              <pie-chart :chart-data="genderData" />
            </div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div class="chart-title-wrapper">
            <span class="trend-title">年龄分布</span>
            <div class="chart-wrapper">
              <age-bar-chart :chart-data="ageData" />
            </div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="8"
        >
          <div class="chart-title-wrapper">
            <el-row>
              <el-col :span="12">
                <span class="trend-title">到店时段</span>
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
                    <div class="tooltip-desc"><br />分为每天和每周的到店时段分布，每天的<br />时段范围为08:00-22:00，每周则为周一<br />至周日。</div>
                  </div>
                  <svg-icon
                    icon-class="note"
                    class-name="note-icon"
                  />
                </el-tooltip>
              </el-col>
              <el-col
                :span="12"
                align="right"
              >
                <el-radio-group
                  class="radio-group-btn"
                  v-model="timeRadio"
                  size="small"
                  @change="handleTimeChange"
                >
                  <el-radio-button label="天" />
                  <el-radio-button label="周" />
                </el-radio-group>
              </el-col>
            </el-row>
            <div class="chart-wrapper">
              <line-chart :chart-data="timeData" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import AgeBarChart from './components/AgeBarChart'
import PanelGroup from './components/PanelGroup'
import { getPreMonthDay, formatDate } from '@/utils/date'
import { getHomeData, getHomePersonTrend, getGenderChart, getAgeChart, getTimeSlotChart } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    AgeBarChart
  },
  data() {
    return {
      timeRadio: '天',
      search: {
        dayType: 1,
        timeType: 0,
        dateRange: [formatDate(new Date(new Date().getTime() - 3600 * 24 * 6 * 1000), 'yyyy-MM-dd'), formatDate(new Date(), 'yyyy-MM-dd')]
      },
      options: [{
        value: 0,
        label: '今日'
      }, {
        value: 1,
        label: '近7日'
      }, {
        value: 2,
        label: '近30日'
      }, {
        value: 3,
        label: '近一年'
      }],
      totalData: [
        {
          currentData: 0,
          beforeData: 0
        },
        {
          currentData: 0,
          beforeData: 0
        },
        {
          currentData: 0,
          beforeData: 0
        },
        {
          currentData: 0,
          beforeData: 0
        }
      ],
      trendData: {},
      rankingData: [],
      genderData: [],
      ageData: {},
      timeData: {}
    }
  },
  activated() {
    this.init()
  },
  computed: {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getPassFlowData()
      this.loadData()
    },
    loadData() {
      this.getDayLineTrend()
      this.getGenderChart()
      this.getAgeChart()
      this.getTimeSlotChart()
    },
    getPassFlowData() {
      getHomeData().then((res) => {
        this.totalData = res
      })
    },
    getTodayTrend() {
      this.search.dayType = 0
      this.getDate()
      this.loadData()
    },
    getSevendayTrend() {
      this.search.dayType = 1
      this.getDate()
      this.loadData()
    },
    getMonthTrend() {
      this.search.dayType = 2
      this.getDate()
      this.loadData()
    },
    getYearTrend() {
      this.search.dayType = 3
      this.getDate()
      this.loadData()
    },
    getDayLineTrend() {
      const params = {
        tag: this.search.dayType,
        startDate: this.search.dateRange[0] ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange[1] ? this.search.dateRange[1] : ''
      }
      getHomePersonTrend(params).then((res) => {
        this.trendData = res.data
        this.rankingData = res.rank
      })
    },
    getGenderChart() {
      const params = {
        startDate: this.search.dateRange[0] ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange[1] ? this.search.dateRange[1] : ''
      }
      getGenderChart(params).then((res) => {
        this.genderData = res.data
      })
    },
    getAgeChart() {
      const params = {
        startDate: this.search.dateRange[0] ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange[1] ? this.search.dateRange[1] : ''
      }
      getAgeChart(params).then((res) => {
        this.ageData = res.data
      })
    },
    handleTimeChange(e) {
      switch (e) {
        case '天':
          this.search.timeType = 0
          break
        case '周':
          this.search.timeType = 1
          break
        default:
          break
      }
      this.getTimeSlotChart()
    },
    getTimeSlotChart() {
      const params = {
        timeType: this.search.timeType,
        startDate: this.search.dateRange[0] ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange[1] ? this.search.dateRange[1] : ''
      }
      getTimeSlotChart(params).then((res) => {
        this.timeData = res.data
      })
    },
    getDate() {
      var date = new Date()
      var nowdatestr = formatDate(date, 'yyyy-MM-dd')
      switch (this.search.dayType) {
        case 0:
          // 今日
          this.search.dateRange[0] = this.search.dateRange[1] = nowdatestr
          break
        case 1:
          // 近7日
          var oneweekdate = formatDate(new Date(date - 6 * 24 * 3600 * 1000), 'yyyy-MM-dd')
          this.search.dateRange[0] = oneweekdate
          this.search.dateRange[1] = nowdatestr
          break
        case 2:
          // 近30日
          var thirtydaysdate = formatDate(new Date(date - 29 * 24 * 3600 * 1000), 'yyyy-MM-dd')
          this.search.dateRange[0] = thirtydaysdate
          this.search.dateRange[1] = nowdatestr
          break
        case 3:
          // 近一年
          this.search.dateRange[0] = getPreMonthDay(nowdatestr, 12)
          this.search.dateRange[1] = nowdatestr
          break
      }
    }
  }
}
</script>

<style>
</style>
<style lang="scss" scoped>
.dashboard-container {
  .trend-container {
    background-color: #ffffff;
    margin-top: 16px;
    .card-trend-title {
      font-size: 16px;
      font-family: PingFangSC-Regular, Microsoft YaHei;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 600;
      line-height: 16px;
    }
    .trend-button-selected {
      font-family: PingFangSC-Regular, Microsoft YaHei;
      font-size: 14px;
      line-height: 14px;
      color: #1890ff;
    }

    .card-trend-button {
      font-size: 14px;
      font-family: PingFangSC-Regular, Microsoft YaHei;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.65);
    }

    .card-trend-button :focus {
      color: #1890ff;
    }

    .card-trend-button:hover {
      color: #1890ff !important;
    }

    .card-button-select {
      font-size: 14px;
      font-family: PingFangSC-Regular, Microsoft YaHei;
      line-height: 14px;
      color: #1890ff;
    }
    .card-container {
      padding: 20px 20px 0;
      height: 368px;
      .card-linetrend {
        float: left;
        width: 74%;
      }
      .rank-container {
        float: right;
        width: 24%;
        font-size: 14px;
        line-height: 14px;
        .rank-title {
          font-family: PingFangSC-Medium, Microsoft YaHei;
          font-weight: 550;
          color: rgba(0, 0, 0, 0.85);
        }
        .rank-content {
          font-family: PingFangSC-Regular, Microsoft YaHei;
          color: rgba(0, 0, 0, 0.65);
          padding: 35px 0 0 0;
        }
        .rank-icon {
          width: 16px;
          height: 16px;
          margin-right: 6px;
        }
        .rank-data {
          vertical-align: right;
        }
      }
    }
  }

  .trend-title {
    font-family: PingFangSC-Medium, Microsoft YaHei;
    font-weight: 550;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 14px;
  }
  .trend-title-container {
    padding: 0 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    .card-header-title {
      font-size: 16px;
      font-family: PingFangSC-Medium, Microsoft YaHei;
      font-weight: 500;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.85);
      padding: 12px 0;
    }
  }
  .chart-wrapper {
    padding: 20px 0 0;
    // margin-bottom: 6px;
  }
  .second-container {
    height: 366px;
    margin-top: 16px;
    background: #fff;
    .chart-title-wrapper {
      padding: 20px 20px 10px 20px;
    }
    .trend-title-wrapper {
      margin-left: 70px;
      padding: 20px 20px 10px 20px;
    }
    .group-button {
      width: 120px;
      height: 28px;
      margin-top: -10px;
      margin-right: -30px;
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
    .second-tips {
      width: 68px;
      height: 32px;
      padding: 8px 0px 8px 15px;
      background: rgba(24, 144, 255, 1);
      border-radius: 0 0 4px 4px;
      border: 1px solid rgba(64, 158, 255, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 12px;
      font-weight: 400;
      font-family: PingFangSC-Regular, Microsoft YaHei;
      line-height: 12px;
      float: left;
      margin: auto 6px auto;
    }
    .gender-chart {
      margin-left: 10px;
    }
  }
  .tooltip-container {
    font-size: 12px;
    font-family: PingFangSC-Regular, Microsoft YaHei;
    color: rgba(84, 84, 84, 1);
    line-height: 20px;
  }
  .tooltip-desc {
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
  }

  @media (max-width: 1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
}
</style>
