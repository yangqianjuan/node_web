<template>
  <div class="dataTab">
    <div class="app-container">
      <!-- 搜索栏-->
      <div style="background-color: #ffffff;">
        <span
          class="cond-name"
          style="margin-left: 20px;"
        >选择日期</span>
        <el-date-picker
          v-model="search.date"
          type="date"
          placeholder="选择日期"
          size="mini"
          style="width: 203px;"
          clearable
        >
        </el-date-picker>
        <span class="cond-name">选择门店</span>
        <el-dropdown
          trigger="click"
          ref="formDrop"
        >
          <el-input
            v-model="search.store"
            placeholder="请选择"
            size="mini"
            clearable
            style=""
            @clear="clearStore"
          ></el-input>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkedStore">
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
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
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
          plain
          style="float: right; width: 80px;height: 30px; margin:8px 10px 0 30px"
          size="small"
        >重置</el-button>
        <el-button
          @click="query"
          type="primary"
          plain
          style="float: right; width: 80px;height: 30px; margin:8px 10px 0 0"
          size="small"
        >搜索</el-button>
      </div>
      <div style="background-color: #ffffff; margin-top: 10px;">
        <el-card
          class="card"
          shadow="hover"
        >
          <div
            slot="header"
            class="card-header"
          >
            <span>数据统计</span>
          </div>
          <el-row
            type="flex"
            class="row-bg"
            justify="space-around"
            style="font-size: 14px;color:  #282828;text-align: center;"
          >
            <el-col
              :span="4"
              style="margin: 20px 0 10px 0;"
            >&nbsp;</el-col>
            <el-col
              :span="5"
              style="margin: 20px 0 10px 0;"
            >进店顾客总人次</el-col>
            <el-col
              :span="5"
              style="margin: 20px 0 10px 0;"
            >进店顾客总人数</el-col>
            <el-col
              :span="5"
              style="margin: 20px 0 10px 0;"
            >一次进店人数(占比)</el-col>
            <el-col
              :span="5"
              style="margin: 20px 0 10px 0;"
            >多次进店人数(占比)</el-col>
          </el-row>
          <el-row
            type="flex"
            class="row-bg"
            justify="space-around"
            style="font-size: 24px;text-align: center;"
          >
            <el-col
              :span="4"
              style="margin: 10px 0;"
            >
              <div style="font-size: 14px;line-height: 27px;color:  #282828;">本期数据&nbsp;<span style="color: #999999;">&nbsp;({{search.date | dateFilter}})</span></div>
            </el-col>
            <el-col
              :span="5"
              style="margin: 10px 0;"
            >{{this.tableData.confirm}}</el-col>
            <el-col
              :span="5"
              style="margin: 10px 0;"
            >{{this.tableData.personTime}}</el-col>
            <el-col
              :span="5"
              style="margin: 10px 0;"
            >{{this.tableData.oneTimes}}({{this.tableData.oneTimesPercentage}}%)</el-col>
            <el-col
              :span="5"
              style="margin: 10px 0;"
            >{{this.tableData.times}}({{this.tableData.timesPercentage}}%)</el-col>
          </el-row>
          <el-row
            type="flex"
            class="row-bg"
            justify="space-around"
            style="font-size: 24px;text-align: center;"
          >
            <el-col
              :span="4"
              style="margin: 10px 0 20px 0;"
            >
              <div style="font-size: 14px;line-height: 27px;color:  #282828;">环比上期&nbsp;<span style="color: #999999;">&nbsp;({{lastDay | dateFilter}})</span></div>
            </el-col>
            <el-col
              :span="5"
              style="margin: 10px 0 20px 0;"
            >
              <div :class="[this.tableData.compareConfirm >=0 ? 'riseClass' : 'declineClass']">{{this.tableData.compareConfirm | absFilter}}%&nbsp;<span v-if="this.tableData.compareConfirm >=0">↑</span><span v-else>↓</span></div>
            </el-col>
            <el-col
              :span="5"
              style="margin: 10px 0 20px 0;"
            >
              <div :class="[this.tableData.comparePersonTime >=0 ? 'riseClass' : 'declineClass']">{{this.tableData.comparePersonTime | absFilter}}%&nbsp;<span v-if="this.tableData.comparePersonTime >=0">↑</span><span v-else>↓</span></div>
            </el-col>
            <el-col
              :span="5"
              style="margin: 10px 0 20px 0;"
            >
              <div :class="[this.tableData.compareOneTimes >=0 ? 'riseClass' : 'declineClass']">{{this.tableData.compareOneTimes | absFilter}}%&nbsp;<span v-if="this.tableData.compareOneTimes >=0">↑</span><span v-else>↓</span></div>
            </el-col>
            <el-col
              :span="5"
              style="margin: 10px 0 20px 0;"
            >
              <div :class="[this.tableData.compareTimes >=0 ? 'riseClass' : 'declineClass']">{{this.tableData.compareTimes | absFilter}}%&nbsp;<span v-if="this.tableData.compareTimes >=0">↑</span><span v-else>↓</span></div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      <el-row style="margin-top:10px;">
        <el-col :span="24">
          <el-card
            class="card"
            shadow="hover"
          >
            <div
              slot="header"
              class="card-header"
            >
              <span>客流趋势&nbsp;<span style="color: #999999;">(近七天)</span></span>
            </div>
            <el-row
              :gutter="10"
              style="margin-top:10px"
            >
              <el-col :span="12">
                <el-card
                  class="card"
                  shadow="hover"
                >
                  <div
                    id="lineChart"
                    style="width: 100%; height: 340px;"
                  ></div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card
                  class="card"
                  shadow="hover"
                >
                  <div
                    id="barChart"
                    style="width: 100%; height: 340px;"
                  ></div>
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { listPermissionTree } from '@/api/account'
import { fetchDictionary } from '@/api/dictionary'
import { getDataTabBarData, getDataTabLineData, getDataTabTableData } from '@/api/statistics'
import bus from '@/rootbus'
import { formatDate } from '@/utils/date'

export default {
  watch: {
    search: {
      handler(cur, old) {
        if (this.checkedStore.length !== 1) {
          this.$refs.formTree.filter(this.search.store)
        }
      },
      deep: true
    }
  },
  components: {
  },
  computed: {
    lastDay() {
      if (!this.search.date) {
        return new Date(new Date() - 24 * 60 * 60 * 1000)
      }
      return new Date(this.search.date.getTime() - 24 * 60 * 60 * 1000)
    }
  },
  filters: {
    dateFilter: function (value) {
      if (!value) {
        return formatDate(new Date(), 'yyyy-MM-dd')
      }
      return formatDate(value, 'yyyy-MM-dd')
    },
    absFilter: function (value) {
      return Math.abs(value)
    }
  },
  methods: {
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.checkedStore = []
        this.checkedStore.push(data.id)
      })
    },
    getDataTabTableData() {
      const params = {
        date: this.search.date ? formatDate(this.search.date, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        store: this.search.structId
      }
      getDataTabTableData(params).then((res) => {
        this.tableData = res
      })
    },
    getDataTabLineData() {
      const params = {
        store: this.search.structId
      }
      getDataTabLineData(params).then((res) => {
        this.drawLine(res)
      })
    },
    getDataTabBarData() {
      const params = {
        store: this.search.structId
      }
      getDataTabBarData(params).then((res) => {
        this.drawBar(res)
      })
    },
    reset() {
      this.search.store = ''
      this.search.structId = ''
      this.search.date = ''
      this.checkedStore = []
    },
    query() {
      this.getDataTabBarData()
      this.getDataTabLineData()
      this.getDataTabTableData()
    },
    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.checkedStore = []
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['USER_RANK']
      }
      fetchDictionary(params).then((res) => {
        this.rankOptions = res.userRank.splice(1)
      })
    },
    listPermissionTree() {
      this.search.store = ''
      this.search.structId = ''
      listPermissionTree().then((res) => {
        this.tree = res
      })
    },
    drawLine(data) {
      // 基于准备好的dom，初始化echarts实例
      const lineChart = this.$echarts.init(document.getElementById('lineChart'))
      // 绘制图表
      lineChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'right',
          icon: 'roundRect',
          data: [{ name: '进店总次数', textStyle: { color: '#999999' } }, { name: '进店总人数', textStyle: { color: '#999999' } }],
          itemHeight: 3
        },
        backgroundColor: 'white',
        xAxis: [
          {
            type: 'category',
            position: 'bottom',
            boundaryGap: false,
            data: data.date,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999999'
              }
            }
          }
        ],
        yAxis: [
          {
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
          }
        ],
        series: [
          {
            name: '进店总次数',
            type: 'line',
            data: data.confirm,
            smooth: true,
            color: '#F78FBD',
            symbol: 'circle',
            symbolSize: 1,
            label: {
              normal: {
                // show: true,
                position: 'top',
                color: '#999999'
              }
            }
          },
          {
            name: '进店总人数',
            type: 'line',
            data: data.personTime,
            smooth: true,
            symbol: 'circle',
            symbolSize: 1,
            color: '#6FB3FF',
            itemStyle: {
              normal: {
                label: {
                  // show: true,
                  position: 'bottom',
                  color: '#999999'
                }
              }
            }
          }
        ]
      })
    },
    drawBar(data) {
      // 基于准备好的dom，初始化echarts实例
      const barChart = this.$echarts.init(document.getElementById('barChart'))
      // 绘制图表
      barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,228,245,0.5)'
            }
          },
          formatter: function (params) {
            var showHtm = ''
            showHtm += '日期： ' + params[0].name + '<br/>'
            showHtm += '一次进店人数： ' + params[0].data.value + '(' + params[0].data.percent + '%)' + '<br/>'
            showHtm += '多次进店人数： ' + params[1].data.value + '(' + params[1].data.percent + '%)' + '<br/>'
            showHtm += '合计： ' + (parseInt(params[0].data.value) + parseInt(params[1].data.value)) + '<br/>'
            return showHtm
          }
        },
        legend: {
          x: 'right',
          icon: 'roundRect',
          data: [{ name: '一次进店人数', textStyle: { color: '#999999' } }, { name: '多次进店人数', textStyle: { color: '#999999' } }],
          itemHeight: 3,
          color: '#999999'
        },
        backgroundColor: 'white',
        xAxis: [
          {
            type: 'category',
            data: [data[0].date, data[1].date, data[2].date, data[3].date, data[4].date, data[5].date, data[6].date],
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
            }
          }
        ],
        yAxis: [
          {
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
          }
        ],
        series: [
          {
            name: '一次进店人数',
            type: 'bar',
            color: '#FFB256',
            barGap: '10%',
            data: [{ percent: data[0].oneTimesPercentage, value: data[0].oneTimes },
            { percent: data[1].oneTimesPercentage, value: data[1].oneTimes },
            { percent: data[2].oneTimesPercentage, value: data[2].oneTimes },
            { percent: data[3].oneTimesPercentage, value: data[3].oneTimes },
            { percent: data[4].oneTimesPercentage, value: data[4].oneTimes },
            { percent: data[5].oneTimesPercentage, value: data[5].oneTimes },
            { percent: data[6].oneTimesPercentage, value: data[6].oneTimes }],
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
            }
          },
          {
            name: '多次进店人数',
            type: 'bar',
            color: '#4BA4FE',
            barGap: '10%',
            data: [{ percent: data[0].timesPercentage, value: data[0].times },
            { percent: data[1].timesPercentage, value: data[1].times },
            { percent: data[2].timesPercentage, value: data[2].times },
            { percent: data[3].timesPercentage, value: data[3].times },
            { percent: data[4].timesPercentage, value: data[4].times },
            { percent: data[5].timesPercentage, value: data[5].times },
            { percent: data[6].timesPercentage, value: data[6].times }],
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
            }
          }
        ]
      })
    }
  },
  mounted() {
    this.listPermissionTree()
    this.getDataTabBarData()
    this.getDataTabLineData()
    this.getDataTabTableData()
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.getDataTabBarData()
      this.getDataTabLineData()
      this.getDataTabTableData()
    })
  },
  data() {
    return {
      search: {
        date: new Date(),
        store: ''
      },
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: {},
      checkedStore: []
    }
  }
}
</script>
<style>
.dataTab .search-data-box {
  margin: 20px 40px 20px 40px;
  background-color: #ffffff;
  border-radius: 5px;
  height: 310px;
}

.dataTab .data-charts-box {
  margin: 0px 40px 10px 40px;
  background-color: #ffffff;
  border-radius: 5px;
  height: 360px;
}

.dataTab .data-box {
  margin-left: 30px;
  margin-right: 30px;
  font-size: 12px;
}

.dataTab .title-content {
  font-size: 18px;
  margin: 5px 5px 5px 40px;
  color: #282828;
}

.dataTab .riseClass {
  color: red;
}

.dataTab .declineClass {
  color: green;
}

.addAccount-scrollbar-wrap {
  overflow-x: hidden;
}

.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
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
  font-size: 14px;
  font-weight: bold;
  background-color: #ffffff;
  color: #666666;
  padding-bottom: 10px;
}
</style>
