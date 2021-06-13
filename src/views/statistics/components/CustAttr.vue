<template>
  <div class="CustAttr">
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
        >
        </el-date-picker>
        <span
          class="cond-name"
          style="margin-left: 30px;"
        >选择门店</span>
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
                        class="attr-checkbox"
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
          @click="loadChart"
          type="primary"
          plain
          style="float: right; width: 80px;height: 30px; margin:8px 10px 0 0"
          size="small"
        >搜索</el-button>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card
            class="card"
            style="margin-top: 1vh;"
            shadow="hover"
          >
            <div
              slot="header"
              class="card-header"
            >
              <span>性别分析</span>
            </div>
            <div style="height: 330px; width: 50%; float: left; position:relative;">
              <div style="height: 30%; width: 100%; border-right: 1px solid #c1c1c1; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;">
                <img
                  :src="iconMan"
                  style="float: left; height: 100%; margin-left: 20%"
                >
                <div style="height: 100%; width: 100px; margin-left: 10px; float: left; position:relative;">
                  <div style="height: 40px; font-weight: bold; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0px;color: #282828;">
                    <span>男士：{{genderData.man}}</span><br />
                    <span>占比：{{genderData.manPc}}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 330px; width: 50%; float: left; position:relative;">
              <div style="height: 30%; width: 100%; border-left: 1px solid #c1c1c1; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;color: #282828;">
                <img
                  :src="iconWoman"
                  style="float: left; height: 100%; margin-left: 20%"
                >
                <div style="height: 100%; width: 100px; margin-left: 15px; float: left; position:relative;">
                  <div style="height: 40px; font-weight: bold; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0">
                    <span>女士：{{genderData.woman}}</span><br />
                    <span>占比：{{genderData.womanPc}}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            class="card"
            style="margin-top: 1vh;"
            shadow="hover"
          >
            <div
              slot="header"
              class="card-header"
            >
              <span>年龄分布</span>
            </div>
            <div
              id="ageChart"
              style=" height: 330px; width: 100%;"
            ></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card
            class="card"
            style="margin-top: 1vh;"
            shadow="hover"
          >
            <div
              slot="header"
              class="card-header"
            >
              <span>进店时间分布</span>
            </div>
            <div
              id="periodChart"
              style=" height: 350px; width: 100%;"
            ></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card
            class="card"
            style="margin-top: 1vh;"
            shadow="hover"
          >
            <div
              slot="header"
              class="card-header"
            >
              <span>进店次数分布</span>
            </div>
            <div
              id="timesChart"
              style=" height: 350px; width: 100%;"
            ></div>
          </el-card>
        </el-col>
      </el-row>
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
import iconMan from '@/image/icon-man.png'
import iconWoman from '@/image/icon-woman.png'
import treeImg from '@/image/treeImg.png'
import { fetchDictionary } from '@/api/dictionary'
import { listPermissionTree } from '@/api/account'
import { getPeriodEchartsData, getTimesEchartsData, getSexsEchartsData, getAgeStageEchartsData } from '@/api/statistics'
import { formatDate } from '@/utils/date'
import bus from '@/rootbus'
export default {
  name: 'cust-attr',

  props: {
    tabName: {
      type: String,
      default: 'data'
    }
  },

  data() {
    return {
      iconMan,
      iconWoman,
      treeImg,
      search: {
        date: new Date(),
        store: ''
      },
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ageAxis: ['<20岁', '20-45岁', '>45岁'],
      timesAxis: ['>5次', '5次', '4次', '3次', '2次', '1次'],
      periodOptions: [],
      genderData: {
        man: 0,
        manPc: 0,
        woman: 0,
        womanPc: 0
      },
      checkedStore: []
    }
  },

  created() {
  },

  mounted() {
    this.init()
    bus.$on('formquery', (...args) => {
      this.loadChart()
    })
  },

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

  methods: {
    init() {
      this.listPermissionTree()
      this.loadChart()
    },

    loadChart() {
      this.fetchDictionary()
      this.loadAgeChartWithData()
      this.loadTimesChartWithData()
      this.loadGenderChart()
    },

    reset() {
      this.search.date = ''
      this.search.store = ''
      this.search.structId = ''
      this.checkedStore = []
    },

    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.checkedStore = []
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
    },

    listPermissionTree() {
      this.search.store = ''
      this.search.structId = ''
      listPermissionTree().then((res) => {
        this.tree = res
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

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    loadGenderChart() {
      const params = {
        date: this.search.date ? formatDate(this.search.date, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        structId: this.search.structId
      }
      getSexsEchartsData(params).then((res) => {
        var total = 0
        this.genderData.woman = 0
        this.genderData.man = 0
        res.forEach(value => {
          total += value.count
          if (value.gender === '0') {
            this.genderData.woman = value.count
          }
          if (value.gender === '1') {
            this.genderData.man = value.count
          }
        })
        this.genderData.manPc = total === 0 ? 0 : Math.round(this.genderData.man * 100 / total)
        this.genderData.womanPc = total === 0 ? 0 : Math.round(this.genderData.woman * 100 / total)
      })
    },

    loadPeriodChartWithData() {
      const params = {
        date: this.search.date ? formatDate(this.search.date, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        structId: this.search.structId
      }
      getPeriodEchartsData(params).then((res) => {
        var axisData = []
        this.periodOptions.forEach((value) => {
          axisData.push(value['name'])
        })
        var seriesManData = []
        var seriesWomanData = []
        var total = {
          manTotal: 0,
          womanTotal: 0
        }
        var existsAxis = []
        res.forEach((item, idx) => {
          total.manTotal += item.manNum
          total.womanTotal += item.womanNum
          existsAxis.push(this.periodOptions[item.period].name)
          seriesManData.push([this.periodOptions[item.period].name, item.manNum, total])
          seriesWomanData.push([this.periodOptions[item.period].name, item.womanNum, total])
        })
        axisData.forEach(it => {
          if (existsAxis.indexOf(it) < 0) {
            seriesManData.push([it, '', total])
            seriesWomanData.push([it, '', total])
          }
        })
        this.loadPeriodChart(axisData, seriesManData, seriesWomanData)
      })
    },

    loadTimesChartWithData() {
      const params = {
        date: this.search.date ? formatDate(this.search.date, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        structId: this.search.structId
      }
      getTimesEchartsData(params).then((res) => {
        var seriesManData = []
        var seriesWomanData = []
        var total = {
          manTotal: 0,
          womanTotal: 0
        }
        var existsAxis = []
        res.forEach((item, idx) => {
          total.manTotal += item.manNum
          total.womanTotal += item.womanNum
          seriesManData.push([item.manNum, item.times, total])
          seriesWomanData.push([item.womanNum, item.times, total])
          existsAxis.push(item.times)
        })
        this.timesAxis.forEach(it => {
          if (existsAxis.indexOf(it) < 0) {
            seriesManData.push(['', it, total])
            seriesWomanData.push(['', it, total])
          }
        })
        this.loadTimesChart(seriesManData, seriesWomanData)
      })
    },

    loadAgeChartWithData() {
      const params = {
        date: this.search.date ? formatDate(this.search.date, 'yyyy-MM-dd') : formatDate(new Date(), 'yyyy-MM-dd'),
        structId: this.search.structId
      }
      getAgeStageEchartsData(params).then((res) => {
        var seriesManData = []
        var seriesWomanData = []
        var total = {
          manTotal: 0,
          womanTotal: 0
        }
        var existsAxisWoman = []
        var existsAxisMan = []
        res.forEach((item, idx) => {
          if (item.gender === '0') {
            seriesWomanData.push([item.ageStage, item.count, total])
            total.womanTotal += item.count
            existsAxisWoman.push(item.ageStage)
          }
          if (item.gender === '1') {
            total.manTotal += item.count
            seriesManData.push([item.ageStage, item.count, total])
            existsAxisMan.push(item.ageStage)
          }
        })
        this.ageAxis.forEach(it => {
          if (existsAxisWoman.indexOf(it) < 0) {
            seriesWomanData.push([it, '', total])
          }
          if (existsAxisMan.indexOf(it) < 0) {
            seriesManData.push([it, '', total])
          }
        })
        this.loadAgeChart(seriesManData, seriesWomanData)
      })
    },

    loadAgeChart(seriesManData, seriesWomanData) {
      var ageChart = echarts.init(document.getElementById('ageChart'))
      var labelOption = {
        normal: {
          show: true,
          position: 'top',
          distance: 15,
          align: 'center',
          verticalAlign: 'middle',
          rotate: 0,
          formatter: '{c|{@1}}',
          fontSize: 16,
          rich: {
            c: {
              color: '#999999'
            }
          }
        }
      }
      var option = {
        color: ['#5b8ef6', '#f3628e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,228,245,0.5)'
            }
          },
          formatter: function (params, ticket, callback) {
            var htmlStr = '<div style="padding: 0px 10px 0px 10px">'
            var total = 0
            var itemTotal = 0
            for (var i = 0; i < params.length; i++) {
              var param = params[i]

              if (i === 0) {
                htmlStr += '<div style="padding: 3px">年龄段：' + param.name + '</div>'
                total = param.value[2].manTotal + param.value[2].womanTotal
              }
              itemTotal += param.value[1] === '' ? 0 : param.value[1]
            }
            for (var idx in params) {
              param = params[idx]
              var percent = itemTotal === 0 ? 0 : Math.round(((param.value[1] === '' ? 0 : param.value[1]) / itemTotal) * 100)
              htmlStr += '<div style="padding: 3px">' + param.seriesName + '：' + param.value[1] + '(' + percent + '%)' + '</div>'
            }
            htmlStr += '<div style="padding: 3px">合计：' + itemTotal + '</div>'
            var totalPercent = total === 0 ? 0 : Math.round((itemTotal / total) * 100)
            htmlStr += '<div style="padding: 3px">比重：' + totalPercent + '%</div>'
            return htmlStr
          }
        },
        legend: {
          icon: 'roundRect',
          itemHeight: 3,
          right: 60,
          data: [{ name: '男', textStyle: { color: '#999999' } }, { name: '女', textStyle: { color: '#999999' } }]
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999999'
              }
            },
            data: this.ageAxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            nameTextStyle: {
              color: '#999999',
              padding: [10, 40, 10, 0]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#f3f3f3']
              }
            },
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
        series: [
          {
            name: '男',
            type: 'bar',
            barGap: 0,
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: seriesManData
          },
          {
            name: '女',
            type: 'bar',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: seriesWomanData
          }
        ]
      }
      ageChart.setOption(option, true)
    },

    loadPeriodChart(axisData, seriesManData, seriesWomanData) {
      var periodChart = echarts.init(document.getElementById('periodChart'))
      var labelOption = {
        normal: {
          show: true,
          position: 'inside',
          distance: 15,
          align: 'center',
          verticalAlign: 'middle',
          rotate: 0,
          formatter: '{c|{@1}}',
          fontSize: 16,
          rich: {
            c: {
              color: '#ffffff'
            }
          }
        }
      }
      var option = {
        color: ['#5b8ef6', '#f3628e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,228,245,0.5)'
            }
          },
          formatter: function (params, ticket, callback) {
            var htmlStr = '<div style="padding: 0px 10px 0px 10px">'
            var total = 0
            var itemTotal = 0
            for (var i = 0; i < params.length; i++) {
              var param = params[i]

              if (i === 0) {
                htmlStr += '<div style="padding: 3px">时间段：' + param.name + '</div>'
                total = param.value[2].manTotal + param.value[2].womanTotal
              }
              itemTotal += param.value[1] === '' ? 0 : param.value[1]
            }
            for (var idx in params) {
              param = params[idx]
              var percent = itemTotal === 0 ? 0 : Math.round(((param.value[1] === '' ? 0 : param.value[1]) / itemTotal) * 100)
              htmlStr += '<div style="padding: 3px">' + param.seriesName + '：' + param.value[1] + '(' + percent + '%)' + '</div>'
            }
            htmlStr += '<div style="padding: 3px">合计：' + itemTotal + '</div>'
            var totalPercent = total === 0 ? 0 : Math.round((itemTotal / total) * 100)
            htmlStr += '<div style="padding: 3px">比重：' + totalPercent + '%</div>'
            return htmlStr + '</div>'
          }
        },
        legend: {
          icon: 'roundRect',
          itemHeight: 3,
          right: 70,
          data: [{ name: '男', textStyle: { color: '#999999' } }, { name: '女', textStyle: { color: '#999999' } }]
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            axisLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 30,
              fontSize: '8',
              textStyle: {
                color: '#999999'
              }
            },
            data: axisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '人数',
            nameTextStyle: {
              color: '#999999',
              padding: [10, 40, 10, 0]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#f3f3f3']
              }
            },
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
        series: [
          {
            name: '男',
            type: 'bar',
            barGap: 0,
            stack: 'period',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 0, 5, 5]
              }
            },
            data: seriesManData
          },
          {
            name: '女',
            type: 'bar',
            stack: 'period',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0]
              }
            },
            data: seriesWomanData
          }
        ]
      }
      periodChart.setOption(option, true)
    },

    loadTimesChart(seriesManData, seriesWomanData) {
      var timesChart = echarts.init(document.getElementById('timesChart'))
      var labelOption = {
        normal: {
          show: true,
          position: 'inside',
          distance: 15,
          align: 'center',
          verticalAlign: 'middle',
          rotate: 0,
          formatter: '{c|{@0}}',
          fontSize: 16,
          rich: {
            c: {
              color: '#ffffff'
            }
          }
        }
      }
      var option = {
        color: ['#5b8ef6', '#f3628e'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,228,245,0.5)'
            }
          },
          formatter: function (params, ticket, callback) {
            var htmlStr = '<div style="padding: 0px 10px 0px 10px">'
            var total = 0
            var itemTotal = 0
            for (var i = 0; i < params.length; i++) {
              var param = params[i]

              if (i === 0) {
                htmlStr += '<div style="padding: 3px">次数：' + param.name + '</div>'
                total = param.value[2].manTotal + param.value[2].womanTotal
              }
              itemTotal += param.value[0] === '' ? 0 : param.value[0]
            }
            for (var idx in params) {
              param = params[idx]
              var percent = itemTotal === 0 ? 0 : Math.round(((param.value[0] === '' ? 0 : param.value[0]) / itemTotal) * 100)
              htmlStr += '<div style="padding: 3px">' + param.seriesName + '：' + param.value[0] + '(' + percent + '%)' + '</div>'
            }
            htmlStr += '<div style="padding: 3px">合计：' + itemTotal + '</div>'
            var totalPercent = total === 0 ? 0 : Math.round((itemTotal / total) * 100)
            htmlStr += '<div style="padding: 3px">比重：' + totalPercent + '%</div>'
            return htmlStr + '</div>'
          }
        },
        legend: {
          icon: 'roundRect',
          itemHeight: 3,
          right: 60,
          data: [{ name: '男', textStyle: { color: '#999999' } }, { name: '女', textStyle: { color: '#999999' } }]
        },
        xAxis: [
          {
            type: 'value',
            name: '人数',
            nameTextStyle: {
              color: '#999999',
              padding: [40, 40, 10, 0]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#f3f3f3']
              }
            },
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
            type: 'category',
            axisTick: { show: false },
            axisLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              rotate: 0,
              fontSize: '10',
              textStyle: {
                color: '#999999'
              }
            },
            data: ['>5次', '5次', '4次', '3次', '2次', '1次']
          }
        ],
        series: [
          {
            name: '男',
            type: 'bar',
            barGap: 0,
            stack: 'times',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 0, 0, 5]
              }
            },
            data: seriesManData
          },
          {
            name: '女',
            type: 'bar',
            stack: 'times',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [0, 5, 5, 0]
              }
            },
            data: seriesWomanData
          }
        ]
      }
      timesChart.setOption(option, true)
    },

    fetchDictionary: function () {
      const params = {
        dictionaries: ['STATISTICS_PERIOD']
      }
      fetchDictionary(params).then((res) => {
        this.periodOptions = res.statisticsPeriod
        this.loadPeriodChartWithData()
      })
    }
  }
}
</script>

<style>
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
