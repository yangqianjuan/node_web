<template>
  <div
    style="overflow-y: auto; background-color: #f2f7f9; padding: 0px 50px 35px 50px"
    class="attr"
  >
    <!-- 搜索栏-->
    <div style="border-radius: 5px; background-color: #ffffff; margin-top: 20px;overflow: hidden;">
      <img
        :src="iconPosition"
        alt=""
        style="width: 12px; margin: 32px 10px 0 60px;float: left;"
      >
      <span style="font-size: 14px; line-height: 60px;color: #4a4a4a;">{{showCurrentStore()}}</span>
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

      <span
        class="cond-name"
        style="margin: 0 10px 0 60px;; line-height: 80px; font-size: 14px;"
      >选择日期&nbsp;&nbsp;
        <el-date-picker
          class="trend-daterange"
          v-model="search.dateRange"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 250px; height: 38px; font-max-size: smaller"
          value-format='yyyy-MM-dd'
          :clearable="false"
        ></el-date-picker>
      </span>
      <span class="search-box-button">
        <el-button
          @click="reset"
          class="reset-bottom"
        >重置</el-button>
        <el-button
          @click="loadChart"
          class="search-bottom"
        >搜索</el-button>
      </span>
    </div>

    <!-- 第一段 -->
    <div style="border-radius: 5px; background-color: #ffffff; height: 350px; margin-top: 20px">
      <div style="height: 100%; width: 50%; float: left;">
        <div style="padding: 30px 0px 0px 40px">
          <div style="font-size: 18px;color: #282828;">性别分析</div>
        </div>
        <div style="height: 200px; width: 50%; float: left; position:relative;">
          <div style="height: 40%; width: 100%; border-right: 1px solid #c1c1c1; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;">
            <img
              :src="iconMan"
              style="float: left; height: 100%; margin-left: 20%"
            >
            <div style="height: 100%; width: 100px; margin-left: 10px; float: left; position:relative;">
              <div style="height: 40px; font-weight: normal; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0px;color: #282828;">
                <span>男士：{{genderData.man}}</span><br />
                <span>占比：{{genderData.manPc}}%</span>
              </div>
            </div>
          </div>
        </div>

        <div style="height: 200px; width: 50%; float: left; position:relative;">
          <div style="height: 40%; width: 100%; border-left: 1px solid #c1c1c1; margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0;">
            <img
              :src="iconWoman"
              style="float: left; height: 100%; margin-left: 20%"
            >
            <div style="height: 100%; width: 100px; margin-left: 15px; float: left; position:relative;">
              <div style="height: 40px; font-weight: normal; margin: auto; position: absolute; top: 0; bottom: 0; left: 0; right: 0;color: #282828;">
                <span>女士：{{genderData.woman}}</span><br />
                <span>占比：{{genderData.womanPc}}%</span>
              </div>
            </div>
          </div>
        </div>
        <div
          style=""
          align="center"
        >
          <span style="margin:0 10px 0 0;color: #282828;">{{search.dateRange[0]}}至{{search.dateRange[1]}}</span><br />
          <span style="margin:0 10px 0 0;color: #282828;">人数合计：{{genderData.total}}</span>
        </div>
      </div>

      <div style="height: 100%; width: 50%; float: left">
        <div style="padding: 30px 0px 0px 40px">
          <div style="font-size: 18px;color: #282828;">年龄分布</div>
        </div>

        <div style="height: 295px; margin-right: 50px;">
          <div
            id="ageChart"
            style="margin-left: 5%; height: 100%; width: 100%;"
          ></div>
        </div>
      </div>
    </div>

    <!-- 第二段 -->
    <div style="border-radius: 5px; background-color: #ffffff; height: 350px; margin-top: 20px">
      <div style="height: 100%; width: 50%; float: left">
        <div style="padding: 30px 0px 0px 40px">
          <div style="font-size: 18px;color: #282828;">客流趋势-性别分析</div>
        </div>

        <div style="height: 295px; margin-right: 50px;">
          <div
            id="sexTrend"
            style="margin-left: 5%; height: 100%; width: 100%;"
          ></div>
        </div>
      </div>

      <div style="height: 100%; width: 50%; float: left">
        <div style="padding: 30px 0px 0px 40px">
          <div style="font-size: 18px;color: #282828;">客流趋势-年龄分布</div>
        </div>

        <div style="height: 295px;  margin-right: 50px;">
          <div
            id="ageTrendChart"
            style="margin-left: 5%; height: 100%; width: 100%;"
          ></div>
        </div>
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
import iconPosition from '@/image/icon-locate.png'
import iconMan from '@/image/icon-man.png'
import iconWoman from '@/image/icon-woman.png'
import treeImg from '@/image/treeImg.png'
import { listPermissionTree } from '@/api/account'
import { getSexStatisticsClient, getSexStatisticsClientTrend, getAgeStatisticsClient, getAgeStatisticsClientTrend } from '@/api/statistics'
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
      iconPosition,
      iconMan,
      iconWoman,
      treeImg,
      search: {
        dateRange: [this.$moment().subtract(6, 'd').format('YYYY-MM-DD'), this.$moment().subtract(0, 'd').format('YYYY-MM-DD')],
        store: '',
        structId: ''
      },
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      genderData: {
        man: 0,
        manPc: 0,
        woman: 0,
        womanPc: 0,
        total: 0
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      checkedStore: [],
      currentStore: ''
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
    },

    loadChart() {
      this.loadGenderChart()
      this.loadGenderTrendWithData()
      this.loadAgeChartWithData()
      this.loadAgeTrendWithData()
    },

    reset() {
      this.search.dateRange = ''
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
        this.search.structId = this.tree[0] ? this.tree[0].id : ''
        this.loadChart()
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
    },

    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    loadGenderChart() {
      const params = {
        startDate: this.search.dateRange[0],
        endDate: this.search.dateRange[1],
        structId: this.search.structId
      }
      getSexStatisticsClient(params).then((res) => {
        var total = 0
        this.genderData.woman = 0
        this.genderData.man = 0
        this.genderData.total = 0
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
        this.genderData.total = total
      })
    },

    loadGenderTrendWithData() {
      const params = {
        startDate: this.search.dateRange[0],
        endDate: this.search.dateRange[1],
        structId: this.search.structId
      }
      getSexStatisticsClientTrend(params).then((res) => {
        const data = {
          manNum: res.map((data, index) => Number(data.manNum)),
          womanNum: res.map((data, index) => Number(data.womanNum)),
          date: res.map((data, index) => this.$moment(data.date).format('YYYY-MM-DD'))
        }
        this.loadGenderTrendChart(data)
      })
    },

    loadGenderTrendChart(data) {
      var sexTrend = echarts.init(document.getElementById('sexTrend'))
      var labelOption = {
        normal: {
          show: false,
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
            var htmlStr = ''
            const total = params[0].value + params[1].value
            htmlStr += '日期: ' + params[0].name + '<br/>'
            htmlStr += '男:' + params[0].value + '(' + Math.round(total === 0 ? 0 : (params[0].value / total * 100)) + '%)' + '<br/>'
            htmlStr += '女:' + params[1].value + '(' + Math.round(total === 0 ? 0 : (params[1].value / total * 100)) + '%)' + '<br/>'
            htmlStr += '合计：' + total
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
            data: data.date
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
            axisTick: { show: false },
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
            stack: '人数',
            barMaxWidth: '50',
            barGap: 0,
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: data.manNum
          },
          {
            name: '女',
            type: 'bar',
            stack: '人数',
            barMaxWidth: '50',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: data.womanNum
          }
        ]
      }
      sexTrend.setOption(option, true)
    },

    loadAgeChartWithData() {
      const params = {
        startDate: this.search.dateRange[0],
        endDate: this.search.dateRange[1],
        structId: this.search.structId
      }
      getAgeStatisticsClient(params).then((res) => {
        const seriesCountData = {
          ageStage: res.map((data, index) => data.ageStage),
          count: res.map((data, index) => data.count)
        }
        this.loadAgeChart(seriesCountData)
      })
    },

    loadAgeChart(seriesCountData) {
      var ageChart = echarts.init(document.getElementById('ageChart'))
      var option = {
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
            var itemTotal = 0
            for (var i = 0; i < params.length; i++) {
              var param = params[i]

              if (i === 0) {
                htmlStr += '<div style="padding: 3px">年龄段：' + param.name + '</div>'
              }
              itemTotal += param.value ? param.value : 0
            }
            htmlStr += '<div style="padding: 3px">人数：' + itemTotal + '</div>'
            return htmlStr
          }
        },
        legend: {
          icon: 'roundRect',
          itemHeight: 3,
          right: 60,
          data: [{ name: '<20岁', textStyle: { color: '#999999' } }, { name: '20-45岁', textStyle: { color: '#999999' } }, { name: '>45岁', textStyle: { color: '#999999' } }]
        },
        grid: {
          left: '13%'
        },
        xAxis: [
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
        yAxis: [
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
            data: ['>45岁', '20-45岁', '<20岁']
          }
        ],
        series: [
          {
            name: '>45岁',
            type: 'bar',
            stack: '年龄段',
            barGap: 0,
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ['#9d8efa', '#9d8efa', '#9d8efa']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: [seriesCountData.count[2]]
          },
          {
            name: '<20岁',
            type: 'bar',
            stack: '年龄段',
            barGap: 0,
            data: [0, 0, seriesCountData.count[0]],
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ['#ff9f01', '#ff9f01', '#ff9f01']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [5, 5, 5, 5]
              }
            }
          },
          {
            name: '20-45岁',
            type: 'bar',
            stack: '年龄段',
            barGap: 0,
            data: [0, seriesCountData.count[1]],
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = ['#6767f7', '#6767f7', '#6767f7']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [5, 5, 5, 5]
              }
            }
          }
        ]
      }
      ageChart.setOption(option, true)
    },

    loadAgeTrendWithData() {
      const params = {
        startDate: this.search.dateRange[0],
        endDate: this.search.dateRange[1],
        structId: this.search.structId
      }
      getAgeStatisticsClientTrend(params).then((res) => {
        const data = {
          lNum: res.map((data, index) => Number(data.lNum)),
          mNum: res.map((data, index) => Number(data.mNum)),
          laNum: res.map((data, index) => Number(data.laNum)),
          date: res.map((data, index) => this.$moment(data.dateTrend).format('YYYY-MM-DD'))
        }
        this.loadAgeTrendChart(data)
      })
    },

    loadAgeTrendChart(data) {
      var ageTrendChart = echarts.init(document.getElementById('ageTrendChart'))
      var labelOption = {
        normal: {
          show: false,
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
        color: ['#ff9f01', '#6767f7', '#9d8efa'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(220,228,245,0.5)'
            }
          },
          formatter: function (params, ticket, callback) {
            var htmlStr = ''
            const total = params[0].value + params[1].value + params[2].value
            htmlStr += '日期: ' + params[0].name + '<br/>'
            htmlStr += '<20岁:' + params[0].value + '(' + Math.round(total === 0 ? 0 : (params[0].value / total * 100)) + '%)' + '<br/>'
            htmlStr += '20-45岁:' + params[1].value + '(' + Math.round(total === 0 ? 0 : (params[1].value / total * 100)) + '%)' + '<br/>'
            htmlStr += '>45岁:' + params[2].value + '(' + Math.round(total === 0 ? 0 : (params[2].value / total * 100)) + '%)' + '<br/>'
            htmlStr += '合计：' + total
            return htmlStr
          }
        },
        legend: {
          icon: 'roundRect',
          itemHeight: 3,
          right: 60,
          data: [{ name: '<20岁', textStyle: { color: '#999999' } }, { name: '20-45岁', textStyle: { color: '#999999' } }, { name: '>45岁', textStyle: { color: '#999999' } }]
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
            data: data.date
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
            axisTick: { show: false },
            axisLabel: {
              textStyle: {
                color: '#999999'
              }
            }
          }
        ],
        series: [
          {
            name: '<20岁',
            type: 'bar',
            stack: '人数',
            barMaxWidth: '50',
            barGap: 0,
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: data.lNum
          },
          {
            name: '20-45岁',
            type: 'bar',
            stack: '人数',
            barMaxWidth: '50',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: data.mNum
          },
          {
            name: '>45岁',
            stack: '人数',
            barMaxWidth: '50',
            type: 'bar',
            label: labelOption,
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 5, 5]
              }
            },
            data: data.laNum
          }
        ]
      }
      ageTrendChart.setOption(option, true)
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
</style>
