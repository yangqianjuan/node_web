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
    setOptions({ expectedData, actualData } = {}) {
      const count = this.chartData.yData ? Math.max(...this.chartData.yData) : 5
      this.chart.setOption({
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
            var showHtm = ''
            showHtm += '<i style="display: inline-block;width: 8px;height: 8px;background-color: rgba(137,240,221,0.87);margin-right: 8px;border-radius: 50%;"></i>' + params[0].name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params[0].value + '人'
            return showHtm
          }
        },
        grid: {
          top: 30,
          left: 20,
          right: 40,
          bottom: 10,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.chartData.xData,
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
          name: '人',
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
        series: [{
          type: 'bar',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(137,240,221,0.87)' },
                  { offset: 1, color: 'rgba(83,187,240,0.87)' }
                ]
              )
            }
          },
          barMaxWidth: '44',
          data: this.chartData.yData
        }]
      })
    }
  }
}
</script>
