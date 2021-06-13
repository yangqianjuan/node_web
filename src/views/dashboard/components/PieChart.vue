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
      default: 'genderChart'
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
      type: Array,
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
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
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
            if (params.name === '男') {
              showHtm += '<i style="display: inline-block;width: 8px;height: 8px;background-color: #59ADFD;margin-right: 8px;border-radius: 50%;"></i>'
            } else {
              showHtm += '<i style="display: inline-block;width: 8px;height: 8px;background-color: rgba(255,155,50, 0.87);margin-right: 8px;border-radius: 50%;"></i>'
            }
            showHtm += params.name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params.percent + '%'
            return showHtm
          }
        },
        color: ['#59ADFD', 'rgba(255,155,50, 0.87)'],
        series: [
          {
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '45%'],
            labelLine: {
              normal: {
                length: 2
              }
            },
            label: {
              formatter: [
                '{b}\n{d}%'
              ].join('\n')
            },
            data: this.chartData
          }
        ]
      })
    }
  }
}
</script>
