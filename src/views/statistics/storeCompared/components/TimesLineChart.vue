<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from 'echarts'
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'timesChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '290px'
    },
    chartData: {
      type: Object,
      required: true
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.setOptions(this.chartData)
    },
    setOptions(data) {
      var count = 5
      var newData = []
      var lineData = []
      var xData = data.xData
      lineData = data.series
      for (var i = 0; i < (lineData ? lineData.length : 0); i++) {
        var lineItem = {}
        lineItem.type = 'line'
        // lineItem.stack = '人数'
        lineItem.areaStyle = {}
        lineItem.barMaxWidth = '44'
        lineItem.smooth = true
        lineItem.symbol = 'circle'
        lineItem.name = lineData[i].name
        lineItem.data = lineData[i].data
        lineItem.data = lineData[i].data
        const cnt = Math.max(...lineData[i].data)
        count = count >= cnt ? count : cnt
        newData.push(lineItem)
      }
      this.chart.setOption({
        title: {
          text: '到店时段',
          textStyle: {
            fontSize: 16,
            fontFamily: 'PingFangSC-Regular, Microsoft YaHei',
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 600,
            lineHeight: 16
          }
        },
        legend: {
          data: data.legend,
          left: '90'
        },
        xAxis: {
          nameTextStyle: {
            color: '#545454'
          },
          type: 'category',
          data: xData,
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(191,191,191)'
            }
          },
          axisLabel: {
            color: 'rgba(84,84,84,1)',
            fontFamily: 'Microsoft YaHei'
          }
        },
        grid: {
          left: '30',
          right: '60',
          bottom: '20',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(0, 0, 0, 0.26)',
          textStyle: {
            color: '#545454',
            fontSize: 12,
            fontFamily: 'Microsoft YaHei'
          },
          extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.46);',
          formatter: function (params) {
            let newParams = []
            const tooltipString = []
            params.forEach((p) => {
              const cont = p.marker + ' ' + p.seriesName + ': ' + '&nbsp;&nbsp;&nbsp;&nbsp;' + p.value + ' 人' + '<br/>'
              tooltipString.push(cont)
            })
            newParams = tooltipString
            return `${params[0].axisValue}</br>${newParams.join('')}`
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载'
            }
          }
        },
        yAxis: {
          nameTextStyle: {
            color: '#545454'
          },
          // nameLocation: 'center',
          splitNumber: 5,
          max: count <= 5 ? 5 : null,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#E9E9E9',
              type: 'dashed'
            }
          }
        },
        color: ['#3FA1FF', '#62D4D4', '#FBD444', '#FF9F7F', '#F2637B'],
        series: newData
      }, true)
    }
  }
}
</script>
