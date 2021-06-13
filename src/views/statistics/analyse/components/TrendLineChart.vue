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
      default: 'timeChart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '390px'
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
      const count = this.chartData.total ? Math.max(...this.chartData.total) : 5
      this.chart.setOption({
        title: {
          text: '客流趋势',
          textStyle: {
            fontSize: 16,
            fontFamily: 'PingFangSC-Regular, Microsoft YaHei',
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 600,
            lineHeight: 16
          }
        },
        legend: {
          data: ['到店总人数', '二次到店人数']
        },
        xAxis: {
          name: '日期',
          nameTextStyle: {
            color: '#545454'
          },
          type: 'category',
          data: this.chartData.time,
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
          right: '50',
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
              const cont = p.marker + ' ' + p.seriesName + ': ' + p.value + '<br/>'
              tooltipString.push(cont)
            })
            newParams = tooltipString.reverse()
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
        series: [
          {
            name: '二次到店人数',
            itemStyle: {
              normal: {
                color: '#FFA84D',
                lineStyle: {
                  color: '#FFA84D',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            symbol: 'circle',
            symbolSize: 7,
            data: this.chartData.secondTimes
          },
          {
            name: '到店总人数',
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
            symbol: 'circle',
            symbolSize: 7,
            data: this.chartData.total
          }
        ]
      })
    }
  }
}
</script>
