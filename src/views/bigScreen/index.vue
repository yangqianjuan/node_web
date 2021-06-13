<template>
  <div id="bigScreen">
    <div class="bigScreen">
      <el-row class="bigScreenHeader">
        <div>
          <img
            src="../../image/left.png"
            alt=""
          >
          <span>
            <img
              src="../../image/title.png"
              alt=""
            >
          </span>
          <img
            src="../../image/right.png"
            alt=""
          >
          </span>
        </div>
      </el-row>
      <div class="bigScreenContent">
        <div class="bigScreenContentLeft">
          <el-row class="totalVisitor">
            <el-row>
              <el-col
                class="title"
                :span="12"
              >
                <p>累计到店人数</p>
              </el-col>
              <el-col
                :span="12"
                class="time"
              >
                {{time}}
              </el-col>
            </el-row>
            <div class="count">
              <img
                src="../../image/line-light.png"
                alt=""
              >
              <div>{{count}}</div>
            </div>
            <el-row class="customerRecentCount">
              <el-col
                :span='12'
                v-for="item in customerRecentCount"
                :key="item.date"
              >
                <p style="text-align:center">{{item.date==='today'?'今日客流':'昨日客流'}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.count}}人</p>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="age">
            <el-col class="title">
              <p>年龄分布</p>
            </el-col>
            <div id="ageChart">

            </div>
          </el-row>
          <el-row class="gender">
            <el-col class="title">
              <p>性别比例</p>
            </el-col>
            <el-col class="genderChart">
              <div
                v-for="item in genderGroup"
                style="display:inline-block"
              >
                <svg-icon
                  style="width:66px;height:70px"
                  :icon-class="item.gender===0?'female-sm':'male-sm'"
                />
                <p>{{item.percent}}%</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="bigScreenContentRight">
          <el-row class="newVisitor">
            <el-col class="title">
              <p>最新访客</p>
            </el-col>
            <el-col class="content">
              <el-col
                class="visitor"
                v-for=" (item,index) in newVisitors"
                :key="item.userId"
              >
                <img
                  :src="item.img + '?token=' + token"
                  alt=""
                >
                <div class="visitorInfo">
                  <p class="identify">
                    <svg-icon
                      style="font-size:20px"
                      :icon-class="item.gender===0?'female-sm':'male-sm'"
                    />
                    <span>{{ item.ageRange }}</span>
                    <svg-icon
                      v-if="index===0"
                      icon-class="new"
                      style="float:right;width:36px;height:20px"
                    />
                  </p>
                  <div class="line"></div>
                  <p>第<span>{{item.count}}</span>次到店</p>
                  <p>门店:&nbsp;&nbsp;{{item.storeName}}</p>
                  <p>时间:&nbsp;&nbsp;{{item.time}}</p>
                </div>
              </el-col>
            </el-col>
          </el-row>
          <el-row class="newWeek">
            <el-col class="title">
              <p>客流实时走势图（近7天）</p>
            </el-col>
            <el-col id="trendFlow">

            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
// 引入基本模板
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/account'
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'BigScreen',
  data() {
    return {
      newVisitors: [],
      genderGroup: [],
      customerRecentCount: 0,
      count: 0,
      token: getToken(),
      time: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      today: '',
      yesterday: '',
      websocket: '',
      timer: '',
      sendMessageTimer: ''
    }
  },
  mounted() {
    this.reset()
    window.addEventListener('online', this.getUserInfo)
    window.addEventListener('offline', this.reset)
    this.getUserInfo()
  },
  beforeDestroy() {
    this.reset()
    window.removeEventListener('online', this.getUserInfo)
    window.removeEventListener('offline', this.reset)
  },
  methods: {
    getUserInfo() {
      this.timer = setInterval(() => {
        this.time = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
      getUserInfo().then((res) => {
        if (res.code !== '50012') {
          this.getWebSocket()
        }
      })
    },
    reset() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (this.sendMessageTimer) {
        clearInterval(this.sendMessageTimer)
      }
      if (this.websocket.readyState === 1) {
        this.websocket.close()
      }
    },
    getWebSocket() {
      const token = this.token
      let str = process.env.BASE_API
      const index = str.indexOf(':') + 3
      const lastIndex = str.lastIndexOf('com') + 3
      str = str.slice(index, lastIndex)
      this.websocket = new WebSocket(`ws://${str}/ws/screen/store?token=${token}&type=0`)
      this.websocket.onopen = (evt) => {
        const obj = {
          token,
          type: 0
        }
        this.websocket.send(JSON.stringify(obj))
        this.sendMessageTimer = setInterval(() => {
          this.websocket.send(JSON.stringify({ type: 1 }))
        }, 600000)
      }
      this.websocket.onclose = (evt) => {
      }
      this.websocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        this.init(data)
      }
      this.websocket.onerror = (evt) => {
      }
    },
    init(data) {
      this.newVisitors = data.recentCustomer
      this.count = (data.customerCount || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
      this.customerRecentCount = data.customerRecentCount
      this.ageGroup = data.customerAgeRangeCount.map(item => {
        const obj = {}
        obj.name = item.ageRange
        return obj
      })
      this.ageGroupList = data.customerAgeRangeCount.map(item => {
        const obj = {}
        obj.name = item.ageRange
        obj.value = item.count
        return obj
      })
      this.genderGroup = data.customerGenderCount
      this.customerLastSevenDays = data.customerLastSevenDaysCount.map(item => {
        return item.date
      })
      this.customerLastSevenDaysList = data.customerLastSevenDaysCount.map(item => {
        const obj = {}
        obj.name = item.date
        obj.value = item.count
        return obj
      })
      this.loadAgeChart()
      this.loadTrendFlowChart()
    },
    loadAgeChart() {
      const loadAgeChart = echarts.init(document.getElementById('ageChart'))
      const ageGroupList = this.ageGroupList
      const ageGroup = this.ageGroup
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        color: ['#56BFFC', '#1891FB', '#7163CD', '#C862E7'],
        legend: {
          bottom: -5,
          left: 'center',
          data: ageGroup,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 40,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          // top: 40,
          bottom: 30
        },
        series: [
          {
            name: '年龄分布',
            type: 'pie',
            radius: ['50%', '70%'],
            // avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.name + ': ' + Math.round(params.percent) + '%'
                },
                textStyle: {
                  color: 'rgba(255, 255, 255, 1)'
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '10',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: ageGroupList
          }
        ]
      }
      loadAgeChart.setOption(option, true)
    },
    loadTrendFlowChart() {
      const customerLastSevenDaysList = this.customerLastSevenDaysList
      const customerLastSevenDays = this.customerLastSevenDays
      const loadTrendFlowChart = echarts.init(document.getElementById('trendFlow'))
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            const showHtm = '<i style="display: inline-block;width: 10px;height: 10px;background-color:rgba(0,199,248,0.87);margin-right: 5px;border-radius: 50%;"></i>' + params[0].name + '  ' + params[0].value
            return showHtm
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: customerLastSevenDays,
          name: '日期',
          nameLocation: 'end',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        textStyle: {
          color: '#fff'
        },
        yAxis: {
          type: 'value',
          name: '客流（人）',
          // nameRotate: 90,
          // nameGap: 10,
          minInterval: 1,
          nameLocation: 'end',
          nameTextStyle: {
            align: 'center'
            // padding: [30, 5, 0, 5]
          },
          splitLine: { lineStyle: { type: 'dotted', color: '#225972' }, show: true },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [{
          data: customerLastSevenDaysList,
          type: 'line',
          smooth: true,
          color: '#00E3F1',
          areaStyle: {
            color: '#00A4EA'
          }
        }]
      }
      loadTrendFlowChart.setOption(option, true)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#bigScreen {
  width: 100%;
  height: 100%;
}
.bigScreen {
  margin: 0 auto;
  width: 1920px;
  height: 1080px;
  padding-top: 70px;
  position: relative;
  background: url("../../image/bg.png");
  .bigScreenHeader {
    text-align: center;
    height: 70px;
    position: absolute;
    width: 100%;
    top: 0;
    padding-top: 36px;
    div {
      text-align: center;
      img {
        vertical-align: middle;
      }
      span {
        &:nth-child(2) {
          margin: 0px 29px;
        }
      }
    }
  }
  .bigScreenContent {
    width: 100%;
    height: 100%;
    padding: 66px 140px 69px;
    display: flex;
    .bigScreenContentLeft {
      width: 391px;
      height: 100%;
      margin-right: 60px;
      .totalVisitor {
        height: 201px;
        margin-bottom: 30px;
        background: url("../../image/bg-client.png");
        .count {
          margin-top: 5px;
          height: 63px;
          font-size: 0px;
          font-family: Impact;
          font-weight: 400;
          color: rgba(0, 252, 246, 1);
          text-align: center;
          div {
            font-size: 50px;
            height: 46px;
            line-height: 46px;
            margin-top: 10px;
          }
        }
      }
      .totalVisitor,
      .age,
      .gender {
        .title {
          margin: 0;
          height: 60px;
          padding-left: 29px;
          p {
            margin: 0;
            height: 17px;
            font-size: 18px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 60px;
          }
        }
        .time {
          color: #fff;
          font-size: 14px;
          line-height: 48px;
          text-align: right;
        }
      }
      .age {
        height: 373px;
        background: url("../../image/bg-age.png");
        margin-bottom: 30px;
        #ageChart {
          height: 270px;
          margin-top: 73px;
        }
      }
      .gender {
        height: 241px;
        background: url("../../image/bg-gender.png");
        .genderChart {
          // display: flex;
          text-align: center;
          padding: 41px 0px 0px;
          div {
            text-align: center;
            &:nth-child(1) {
              margin-right: 70px;
            }
            img {
              height: 70px;
            }
            p {
              margin: 15px 0px 0px;
              height: 13px;
              font-size: 16px;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }
    }
    .bigScreenContentRight {
      width: 1191px;
      height: 100%;
      // background-color: aqua;
      .newVisitor,
      .newWeek {
        .title {
          margin: 0;
          height: 60px;
          padding-left: 29px;
          // background-color: pink;
          p {
            margin: 0;
            // width: 74px;
            height: 17px;
            font-size: 18px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 74px;
          }
        }
        .content {
          width: 100%;
          height: 331px;
          padding: 0px 14px 14px 30px;
          // background-color: #fff;
          display: flex;
          flex-wrap: wrap;
          .visitor {
            color: #fff;
            margin: 0px 16px 16px 0px;
            padding: 20px 19px 0px 21px;
            background-color: rgba(69, 229, 228, 0.1);
            height: 144px;
            flex: 1;
            min-width: 30%;
            &:nth-child(1) {
              background-color: rgba(69, 229, 228, 0.32);
              border: 2px solid rgba(69, 229, 228, 1);
            }
            .visitorInfo {
              padding-left: 117px;
              .identify {
                margin-bottom: 6px;
                font-size: 0px;
                span {
                  margin-left: 15px;
                  font-size: 14px;
                }
              }
            }
            .line {
              height: 2px;
              background-color: #4c9dc1;
              margin: 6px 0px 16px 0px;
            }
            p {
              font-size: 14px;
              margin: 0px 0px 9px;
              span {
                font-weight: 600;
                margin: 0px 5px;
              }
            }
            img {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              float: left;
              margin-top: 5px;
            }
          }
        }
      }
      #trendFlow {
        height: 394px;
        width: 1190px;
      }
    }
    .newVisitor {
      height: 391px;
      // width: 100%;
      background: url("../../image/bg-newclient.png");
      margin-bottom: 30px;
    }
    .newWeek {
      height: 454px;
      // width: 100%;
      background: url("../../image/bg-trendofpassendersflow.png");
    }
  }
  .customerRecentCount {
    margin-top: 29px;
    color: #fff;
    font-size: 14px;
    height: 14px;
    line-height: 14px;
    p {
      margin: 0;
    }
  }
}
</style>
