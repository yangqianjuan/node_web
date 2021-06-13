<template>
  <div
    id="storeCompared"
    class="app-container"
  >
    <div class="search-container">
      <span style="color:rgba(0,0,0,0.65)">门店列表：</span>
      <el-tag
        v-for="item, index in selected"
        :key="item.value"
        closable
        type="info"
        @close="closeStore(item, index)"
      >
        {{item.label}}
      </el-tag>
      <el-dropdown
        trigger="click"
        v-show="selected.length<5"
      >
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          style="margin-left:10px;"
        >添加门店</el-button>
        <el-dropdown-menu
          slot="dropdown"
          class="drop-list"
        >
          <div>
            <el-input
              v-model="searchVal"
              class="search-text"
              size="mini"
              placeholder="搜索"
              prefix-icon="el-icon-search"
            >
            </el-input>
          </div>
          <template v-for="item, index in items">
            <el-dropdown-item
              :disabled="item.isDisabled"
              @click.native="moveUp(item)"
            > {{item.label}} </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="chart_container">
      <el-row style="padding:10px 20px 0;">
        <el-select
          v-model="search.timeType"
          size="mini"
          placeholder="请选择"
          style="width: 90px; margin-right:10px;"
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
        <!-- <span class="cond-name">到店时间:</span> -->
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
      </el-row>
      <template v-if='selected.length <=
          0'>
        <span class="noData">
          <svg-icon icon-class="store-compared" />
          <p class="noDataText">请添加门店进行对比</p>
        </span>
      </template>
      <template v-else>
        <div>
          <el-row class="chart-row">
            <div class="chart-wrapper">
              <trend-line-chart :chart-data="trendLineData" />
            </div>
            <div class="cond-container">
              <el-radio-group
                v-model="trendRadio"
                size="small"
                @change="handleTrendChange"
              >
                <el-radio-button label="总客流" />
                <el-radio-button label="首次到店" />
                <el-radio-button label="二次到店" />
              </el-radio-group>
            </div>
          </el-row>
          <el-row class="chart-row">
            <div class="chart-wrapper">
              <times-line-data :chart-data="timesLineData" />
            </div>
            <div class="cond-container">
              <el-radio-group
                v-model="timeRadio"
                size="small"
                @change="handleTimeChange"
              >
                <el-radio-button label="天" />
                <el-radio-button label="周" />
              </el-radio-group>
            </div>
          </el-row>
          <el-row class="chart-row">
            <div class="chart-wrapper">
              <sex-bar-chart
                :chart-data="sexBarData"
                :unit-text="genderUnit"
              />
            </div>
            <div class="cond-container">
              <el-radio-group
                v-model="sexRadio"
                size="small"
                @change="handleSexChange"
              >
                <el-radio-button label="人数" />
                <el-radio-button label="百分比" />
              </el-radio-group>
            </div>
          </el-row>
          <el-row class="chart-row">
            <div class="chart-wrapper">
              <age-bar-chart
                :chart-data="ageBarData"
                :unit-text="ageUnit"
              />
            </div>
            <div class="cond-container">
              <el-radio-group
                v-model="ageRadio"
                size="small"
                @change="handleAgeChange"
              >
                <el-radio-button label="人数" />
                <el-radio-button label="百分比" />
              </el-radio-group>
            </div>
          </el-row>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import TrendLineChart from './components/TrendLineChart'
import TimesLineData from './components/TimesLineChart'
import SexBarChart from './components/SexBarChart'
import AgeBarChart from './components/AgeBarChart'
import { getStoreOption } from '@/api/customer'
import { comparedTrend, comparedPeriod, comparedGender, comparedAge } from '@/api/statistics'
import { formatDate, getYestoday, getSevenDays, getPreviousWeek, getPreviousMonth } from '@/utils/date'

export default {
  name: 'StoreCompared',
  components: {
    TrendLineChart,
    TimesLineData,
    SexBarChart,
    AgeBarChart
  },
  data() {
    return {
      selected: [],
      searchVal: '',
      storeList: [],
      // datalist: [],
      trendLineData: {},
      timesLineData: {},
      sexBarData: {},
      ageBarData: {},
      ageUnit: '人',
      genderUnit: '人',
      dayType: 0,
      search: {
        startDate: getSevenDays(),
        endDate: getYestoday(),
        storeId: '',
        timeType: 0,
        trendTag: 0,
        periodTag: 0,
        genderTag: 0,
        ageTag: 0
      },
      trendRadio: '总客流',
      timeRadio: '天',
      sexRadio: '人数',
      ageRadio: '人数',
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
    // length() {
    //   return this.datalist.length
    // },
    selectStore() {
      var storeList = []
      for (const item of this.selected) {
        storeList.push(item.value)
      }
      return storeList
    },
    // 过滤方法
    items: function () {
      var _search = this.searchVal
      if (_search) {
        // 不区分大小写处理
        var reg = new RegExp(_search, 'ig')
        // es6 filter过滤匹配，有则返回当前，无则返回所有
        return this.storeList.filter(function (e) {
          // 匹配所有字段
          // return Object.keys(e).some(function (key) {
          //   return e[key].match(reg)
          // })
          // 匹配某个字段
          return e.label.match(reg)
        })
      }
      return this.storeList
    }
  },

  activated() {
    this.init()
  },

  mounted() {
    this.init()
  },

  methods: {
    getStoreList() {
      getStoreOption({}).then(res => {
        var store = res
        var store2 = []
        store.map((item, index) => {
          if (item.value !== '') {
            store2.push(Object.assign({}, item, { isDisabled: false }))
          }
        })
        this.storeList = store2
      })
    },
    moveUp(item) {
      if (this.selected.length < 5) {
        this.searchVal = ''
        item.isDisabled = true
        this.selected.push(item)
        this.loadData()
      }
    },
    closeStore(item, index) {
      this.searchVal = ''
      item.isDisabled = false
      this.selected.splice(index, 1)
      this.loadData()
    },
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
      this.getStoreList()
    },
    loadData() {
      this.getTrendData()
      this.getTimesData()
      this.getGenderData()
      this.getAgeData()
    },
    handleTrendChange(e) {
      switch (e) {
        case '总客流':
          this.search.trendTag = 0
          break
        case '首次到店':
          this.search.trendTag = 1
          break
        case '二次到店':
          this.search.trendTag = 2
          break
        default:
          break
      }
      this.getTrendData()
    },
    handleTimeChange(e) {
      switch (e) {
        case '天':
          this.search.periodTag = 0
          break
        case '周':
          this.search.periodTag = 1
          break
        default:
          break
      }
      this.getTimesData()
    },
    handleSexChange(e) {
      switch (e) {
        case '人数':
          this.search.genderTag = 0
          this.genderUnit = '人'
          break
        case '百分比':
          this.search.genderTag = 1
          this.genderUnit = '%'
          break
        default:
          break
      }
      this.getGenderData()
    },
    handleAgeChange(e) {
      switch (e) {
        case '人数':
          this.search.ageTag = 0
          this.ageUnit = '人'
          break
        case '百分比':
          this.search.ageTag = 1
          this.ageUnit = '%'
          break
        default:
          break
      }
      this.getAgeData()
    },
    getTrendData() {
      if (this.selectStore.length === 0) {
        return
      }
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        storeList: this.selectStore,
        timeType: this.search.timeType,
        tag: this.search.trendTag
      }
      comparedTrend(params).then(res => {
        this.trendLineData = {}
        this.trendLineData = res.data
      })
    },
    getTimesData() {
      if (this.selectStore.length === 0) {
        return
      }
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        storeList: this.selectStore,
        tag: this.search.periodTag
      }
      comparedPeriod(params).then(res => {
        this.timesLineData = {}
        this.timesLineData = res.data
      })
    },
    getGenderData() {
      if (this.selectStore.length === 0) {
        return
      }
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        storeList: this.selectStore,
        tag: this.search.genderTag
      }
      comparedGender(params).then(res => {
        this.sexBarData = res.data
      })
    },
    getAgeData() {
      if (this.selectStore.length === 0) {
        return
      }
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        storeList: this.selectStore,
        tag: this.search.ageTag
      }
      comparedAge(params).then(res => {
        this.ageBarData = res.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bdcolor: #e4e4e4;

.chart_container {
  background-color: #ffffff;
  padding: 0;
  min-height: calc(100vh - 160px);

  .chart-row {
    .cond-container {
      position: absolute;
      right: 20px;
      top: 10px;
    }
  }
}

.drop-list {
  width: 230px;
  max-height: 300px;
  overflow: auto;
  .search-text {
    margin: 5px 10px;
    width: 190px;
    font-size: 14px;
    // &:focus {
    //   border-color: #2198f2;
    // }
  }
}

.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 166px;
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  transform: translate(-50%, -50%);
  .svg-icon {
    width: 166px;
    height: 100px;
  }
}
.chart-wrapper {
  background: #fff;
  padding: 16px 20px 0;
  margin-bottom: 20px;
}
</style>
