<template>
  <div class="dataTabDemo">
    <div class="search-data-box">
      <img
        :src="iconLocate"
        alt=""
        style="width: 12px; margin: 32px 10px 0 60px;;float: left;"
      >
      <span style="font-size: 14px; line-height: 80px;color: #4a4a4a;">{{showCurrentStore()}}</span>
      <span
        class="cond-name"
        style="margin:0 10px 0 100px;line-height: 80px;font-size: 14px;"
      >选择门店</span>
      <el-dropdown
        trigger="click"
        ref="formDrop"
        placement="bottom-start"
      >
        <el-input
          v-model="search.store"
          placeholder="请选择"
          size="mini"
          clearable
          style=""
        ></el-input>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="checkedStore">
            <el-dropdown-item style="padding: 0px;width: 300px;height: 300px">
              <el-scrollbar
                wrap-class="dataTab-scrollbar-wrap"
                style="height: 100%"
              >
                <el-tree
                  ref="formTree"
                  :data="tree"
                  node-key="id"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                >
                  <span
                    class="custom-tree-node"
                    slot-scope="{ node, data }"
                  >
                    <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                    <span style="margin-left: 5px">{{ data.label }}</span>
                    <el-checkbox
                      :label="data.id"
                      @change="handleSelectStore(data)"
                      class="dataTab-checkbox"
                    ></el-checkbox>
                  </span>
                </el-tree>
              </el-scrollbar>
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        @click="reset"
        class="reset-bottom"
      >重置</el-button>
      <el-button
        @click="query"
        class="search-bottom"
      >搜索</el-button>
    </div>

    <div class="total-data-box">
      <div><span class="title-content">数据统计</span></div>
      <div class="data-box">
        <el-row
          type="flex"
          justify="center"
        >
          <el-col :span="8">
            <el-card class="total-data-body">
              <el-row>
                <el-col :span="14"><span style="font-size: 16px; line-height: 90px; margin-left: 30px;color: #282828;color: #282828;">今日当前人次</span></el-col>
                <el-col :span="10"><span style="font-size: 30px; line-height: 90px;color: #282828;">{{totalData['今天']}}</span></el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="total-data-body">
              <el-row>
                <el-col :span="14"><span style="font-size: 16px; line-height: 90px; margin-left: 30px;color: #282828;">昨日人次</span></el-col>
                <el-col :span="10"><span style="font-size: 30px; line-height: 90px;color: #282828;">{{totalData['昨天']}}</span></el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="total-data-body">
              <el-row>
                <el-col :span="14"><span style="font-size: 16px; line-height: 90px; margin-left: 30px;color: #282828;">前日人次</span></el-col>
                <el-col :span="10"><span style="font-size: 30px; line-height: 90px;color: #282828;">{{totalData['前天']}}</span></el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="data-charts-box">
      <span class="title-content">客流趋势</span>
      <span
        class="cond-name"
        style="margin:0 10px 0 30px; line-height: 80px; font-size: 14px;"
      >选择日期</span>
      <el-date-picker
        class="trend-daterange"
        v-model="search.trendDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 250px;"
        value-format='yyyy-MM-dd'
      ></el-date-picker>
      <el-button
        @click="queryTrendData"
        class="search-bottom"
        style="float: none;margin-left: 20px;"
      >搜索</el-button>
      <!--<span style="font-size: 14px; color: #999999;vertical-align: -58%;">(默认展示近7天数据，筛选可选择时间段)</span>-->
      <div
        id="dataTrendChart"
        style="margin: 0 10px;"
      ></div>
    </div>

    <div class="data-charts-box">
      <span class="title-content">客流时段分布</span>
      <span
        class="cond-name"
        style="margin:0 10px 0 30px;line-height: 80px;font-size: 14px;"
      >选择日期</span>
      <el-date-picker
        class="period-date"
        v-model="search.periodDate"
        type="date"
        placeholder="选择日期"
        size="mini"
        style="width: 250px;"
        value-format='yyyy-MM-dd'
      ></el-date-picker>
      <el-button
        @click="fetchDictionary"
        class="search-bottom"
        style="float: none;margin-left: 20px;"
      >搜索</el-button>
      <!--<span style="font-size: 14px; color: #999999;vertical-align: -58%;">(默认展示当天数据，仅能选择某一天)</span>-->
      <div
        id="dataPeriodChart"
        style="margin: 0 10px;"
      ></div>
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

import { listPermissionTree } from '@/api/account'
import { fetchDictionary } from '@/api/dictionary'
import { personStatisticsDemo, personTrendDemo, getPersonPeriod } from '@/api/statistics'
import bus from '@/rootbus'
import iconLocate from '@/image/icon-locate.png'

export default {
  data() {
    return {
      search: {
        periodDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        store: '',
        structId: '',
        trendDate: [this.$moment().subtract(6, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      },
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      totalData: '',
      checkedStore: [],
      iconLocate,
      periodOptions: [],
      totalCardStyle: {
        styleA: {
          width: '18vw'
        },
        styleB: {
          width: '300px'
        }
      },
      currentStore: ''
    }
  },
  watch: {
  },
  components: {
  },
  computed: {
    showCheckBox() {
      return function (data) {
        if (data.type === 2) {
          return true
        } else {
          return false
        }
      }
    }
  },
  filters: {
  },
  methods: {
    listPermissionTree() {
      this.search.store = ''
      this.search.structId = ''
      listPermissionTree().then((res) => {
        this.tree = res
        this.search.structId = this.tree[0] ? this.tree[0].id : ''
        this.query()
      })
    },
    query() {
      this.fetchDictionary()
      this.queryTotalData()
      this.queryTrendData()
    },
    reset() {
      this.search.store = ''
      this.search.structId = this.tree[0] ? this.tree[0].id : ''
      this.search.date = ''
      this.search.periodDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.search.trendDate = [this.$moment().subtract(7, 'days').format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      this.checkedStore = []
    },
    queryTotalData() {
      const params = {
        structId: this.search.structId
      }
      if (params.structId === '' || params.structId === undefined) {
        return
      }
      personStatisticsDemo(params).then((res) => {
        this.totalData = res
      })
    },
    queryTrendData() {
      const params = {
        structId: this.search.structId,
        startDate: this.search.trendDate[0],
        endDate: this.search.trendDate[1]
      }
      if (params.structId === '' || params.structId === undefined) {
        return
      }
      personTrendDemo(params).then((res) => {
        function sortByDate(a, b) {
          var val1 = a.date
          var val2 = b.date
          if (val1 > val2) {
            return 1
          } else if (val1 < val2) {
            return -1
          } else {
            return 0
          }
        }
        res.sort(sortByDate)
        const data = {
          num: res.map((data, index) => Number(data.num)),
          date: res.map((data, index) => this.$moment(data.date).format('YYYY-MM-DD'))
        }
        this.drawLine(data)
      })
    },
    drawLine(data) {
      const d = document.getElementById('dataTrendChart')
      const myPie = echarts.init(d)
      const option = {
        color: ['#F78FBD'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          show: false
        },
        backgroundColor: 'white',
        xAxis: [{
          type: 'category',
          position: 'bottom',
          boundaryGap: false,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: data.date.length > 10 ? Math.ceil(data.date.length / 7) - 1 : 0,
            fontSize: 10,
            textStyle: {
              color: '#999999'
            }
          },
          // 时间数据 x
          data: data.date
        }],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999999'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f3f3f3'
            }
          }
        },
        grid: {
          top: '5%'
        },
        series: [
          {
            name: '人数',
            type: 'line',
            smooth: true,
            smoothMonotone: 'x',
            symbol: 'circle',
            symbolSize: 1,
            lineStyle: {
              width: 3,
              color: '#F78FBD',
              shadowColor: '#F78FBD',
              shadowOffsetY: 5,
              shadowBlur: 10
            },
            data: data.num
          }
        ]
      }
      setTimeout(() => {
        myPie.clear()
        myPie.resize({
          height: '300'
        })
        myPie.setOption(option)
      }, 100)
    },
    queryPeriodData() {
      const params = {
        structId: this.search.structId,
        date: this.search.periodDate
      }
      if (params.structId === '' || params.structId === undefined) {
        return
      }
      getPersonPeriod(params).then((res) => {
        var axisData = []
        this.periodOptions.forEach((value) => {
          axisData.push(value['name'])
        })
        var seriesData = []
        var existsAxis = []
        res.forEach((item, idx) => {
          existsAxis.push(this.periodOptions[item.period].name)
          seriesData.push([this.periodOptions[item.period].name, item.num])
        })
        axisData.forEach(it => {
          if (existsAxis.indexOf(it) < 0) {
            seriesData.push([it, ''])
          }
        })
        const data = {
          period: this.periodOptions.map((data, index) => data.name),
          num: seriesData
        }
        this.drawBar(data)
      })
    },
    drawBar(data) {
      const d = document.getElementById('dataPeriodChart')
      const myPie = echarts.init(d)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          show: false
        },
        backgroundColor: 'white',
        xAxis: [{
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            interval: 0,
            fontSize: 10,
            rotate: 10,
            textStyle: {
              color: '#999999'
            }
          },
          // 时间数据 x
          data: data.period
        }],
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999999'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f3f3f3'
            }
          }
        },
        grid: {
          top: '5%'
        },
        series: [
          {
            name: '人数',
            type: 'bar',
            color: '#72bcff',
            barWidth: '30px',
            itemStyle: {
              emphasis: {
                barBorderRadius: 5
              },
              normal: {
                barBorderRadius: 5,
                label: {
                  show: true,
                  position: 'top',
                  color: '#999999'
                }
              }
            },
            data: data.num
          }
        ]
      }
      setTimeout(() => {
        myPie.clear()
        myPie.resize({
          height: '300'
        })
        myPie.setOption(option)
      }, 100)
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['STATISTICS_PERIOD']
      }
      fetchDictionary(params).then((res) => {
        this.periodOptions = res.statisticsPeriod
        this.queryPeriodData()
      })
    },
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.checkedStore = []
        this.checkedStore.push(data.id)
      })
    },
    showCurrentStore() {
      if (this.search.store) {
        this.currentStore = this.search.store
      } else if (this.tree[0]) {
        this.currentStore = this.tree[0].label
      } else {
        this.currentStore = ''
      }
      return this.currentStore
    }
  },
  mounted() {
    this.listPermissionTree()
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.query()
    })
  }
}
</script>
<style>
.dataTabDemo .search-data-box {
  margin: 20px 50px 20px 50px;
  background-color: #ffffff;
  border-radius: 5px;
  height: 80px;
}

.dataTabDemo .total-data-box {
  margin: 0 50px 20px 50px;
  background-color: #ffffff;
  border-radius: 5px;
}

.dataTabDemo .total-data-body {
  width: 300px;
  height: 90px;
  border: 0px;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
}

.dataTabDemo .total-data-body.is-always-shadow {
  box-shadow: 10 10px 10px 10;
}

.dataTabDemo .data-charts-box {
  margin: 0px 50px 20px 50px;
  background-color: #ffffff;
  border-radius: 5px;
}

.dataTabDemo .data-box {
  font-size: 12px;
  padding-bottom: 30px;
}

.dataTabDemo .title-content {
  font-size: 18px;
  margin-left: 40px;
  line-height: 80px;
  color: #282828;
}

.dataTabDemo .riseClass {
  color: red;
}

.dataTabDemo .declineClass {
  color: green;
}

.dataTabDemo .el-input--mini .el-input__inner {
  height: 38px;
  line-height: 385px;
  font-size: 14px;
}

.dataTab-scrollbar-wrap {
  overflow-x: hidden;
}

.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}

.period-date .el-input__inner {
  color: #999999;
}
</style>


