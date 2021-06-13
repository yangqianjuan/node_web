<template>
  <div
    :class="className"
    :style="{height:height,width:width}"
  />
</template>

<script>
import echarts from 'echarts'
import resize from '@/mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'ageChart'
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
    unitText: {
      type: String,
      default: '人'
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
      var text = this.unitText
      lineData = data.series
      for (var i = 0; i < (lineData ? lineData.length : 0); i++) {
        var lineItem = {}
        lineItem.type = 'bar'
        lineItem.barMaxWidth = '44'
        lineItem.barGap = 0
        lineItem.name = lineData[i].name
        lineItem.data = lineData[i].data
        const cnt = Math.max(...lineData[i].data)
        count = count > cnt ? count : cnt
        newData.push(lineItem)
      }
      this.chart.setOption({
        title: {
          text: '年龄分布',
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
          left: '90',
          itemHeight: '6'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
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
              const cont = p.marker + ' ' + p.seriesName + ': ' + '&nbsp;&nbsp;&nbsp;&nbsp;' + p.value + text + '<br/>'
              tooltipString.push(cont)
            })
            newParams = tooltipString
            return `${params[0].axisValue}</br>${newParams.join('')}`
          }
        },
        grid: {
          left: '30',
          right: '50',
          bottom: '20',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: data.xData,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(191,191,191)'
            }
          },
          axisLabel: {
            color: 'rgba(84,84,84,1)',
            fontFamily: 'Microsoft YaHei'
          }
        }],
        yAxis: [{
          type: 'value',
          min: 0,
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
        }],
        color: ['#3FA1FF', '#FF9F7F', '#FCD530', '#62D4D4'],
        series: newData
      }, true)
    }
  }
}
</script>
