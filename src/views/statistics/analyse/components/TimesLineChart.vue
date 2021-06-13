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
      default: '360px'
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
    setOptions({ expectedData, actualData } = {}) {
      const count = this.chartData.yData ? Math.max(...this.chartData.yData) : 5
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
        xAxis: {
          nameTextStyle: {
            color: '#545454'
          },
          type: 'category',
          data: this.chartData.xData,
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
            var showHtm = ''
            showHtm += '<i style="display: inline-block;width: 8px;height: 8px;background-color: #59ADFD;margin-right: 8px;border-radius: 50%;"></i>' + params[0].name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params[0].value + '人'
            return showHtm
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
          name: '单位：人',
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
        series: [{
          itemStyle: {
            normal: {
              color: '#59ADFD',
              lineStyle: {
                color: '#59ADFD',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          // symbol: 'circle',
          // symbolSize: 4,
          data: this.chartData.yData,
          areaStyle: {
            color: 'rgba(89, 173, 253, 0.74)'
          }
        }]
      })
    }
  }
}
</script>
