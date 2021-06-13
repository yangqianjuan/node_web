<template>
  <div
    class="blackListDetail"
    id="blackListDetail"
  >
    <div class="app-container">
      <div>
        <el-row :gutter="10">
          <el-col>
            <el-card
              class="card"
              shadow="hover"
            >
              <div class="identImg">
                <img
                  :src="info.img + '?token=' + token"
                  @click="()=>{LookBigPicture(info.img)}"
                >
              </div>
              <div class="identContent">
                <div class="userInfo">
                  <span>身份ID：&nbsp;{{info.userId}}</span>
                  <span>性别：&nbsp;{{info.gender}}</span>
                  <span>年龄：&nbsp;{{info.age}}岁</span>
                  <span v-show="info.total">累计到店次数：&nbsp;{{info.total}}</span>
                  <span>加入方式：&nbsp;{{info.addType}}</span>
                  <el-tag type="danger">
                    {{ info.tag }}
                  </el-tag>
                </div>
                <div>
                  <el-button
                    v-if="isBlack&&removeBlackPrivilege"
                    type="primary"
                    size="mini"
                    @click="removeFromBlackList"
                  >{{'移出黑名单'}}</el-button>

                  <div style="display:inline-block;margin-left:16px">
                    <span v-if="info.filterTime">加入黑名单时间:&nbsp&nbsp{{info.filterTime}}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          class="detailContent"
        >
          <el-col>
            <el-card
              class="card cardDetail"
              shadow="hover"
            >
              <el-tabs
                v-model="activeName2"
                @tab-click="handleClick"
              >
                <el-tab-pane
                  label="到店记录"
                  name="first"
                >
                  <div
                    class="table-prefix"
                    v-if="editCheckPrivilege"
                  >
                    <el-select
                      v-model="checkStatus"
                      placeholder="请选择"
                      size='mini'
                      @change="pickerSearchStatisticTable"
                    >
                      <el-option
                        v-for="item in checkStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-button
                      type="primary"
                      size="mini"
                      class="allRead"
                      v-if="showCustomerPicture"
                      :disabled="!toBeAuditedList.length>0"
                      @click="postAllToBeAuditedList"
                    >{{'当页已读'}}</el-button>
                  </div>
                  <div
                    width="100%"
                    style="background-color: #ffffff;min-height: calc(100vh - 380px)"
                    v-loading='loading'
                  >
                    <span v-if="showCustomerPicture">
                      <span
                        v-if='page.total==0&&!loading'
                        class="noData"
                      >
                        <svg-icon icon-class="nodata" />
                        <p style="">暂无数据</p>
                      </span>
                      <div class="record">
                        <span
                          v-if="auditedList.length>0"
                          class="infoList"
                          v-for="item in auditedList"
                          :key="item.imgId"
                        >
                          <svg-icon
                            icon-class="unread"
                            class="unread"
                            v-if="item.examine==='0'&&editCheckPrivilege"
                          />
                          <span
                            v-if="editCheckPrivilege"
                            class="el-icon-delete delete"
                            @click="removeComfirm(item.imgId)"
                          ></span>
                          <img
                            class="infoImg"
                            :src="item.customerImg + '?token=' + token"
                            alt=""
                            @click="()=>{LookBigPicture(item.customerImg)}"
                          >
                          <div class="infoContent">
                            <p>{{ item.storeName}}</p>
                            <p>{{ item.sendTime}}</p>
                          </div>
                        </span>
                      </div>
                    </span>
                    <span v-if="!showCustomerPicture">
                      <div class="record">
                        <el-table
                          :data="auditedList"
                          style="width: 100%"
                        >
                          <el-table-column
                            prop="sendTime"
                            label="到店时间"
                            width="180"
                          >
                          </el-table-column>
                          <el-table-column
                            prop="storeName"
                            label="门店"
                            width="180"
                          >
                          </el-table-column>
                        </el-table>
                      </div>
                    </span>
                  </div>
                  <pagination
                    v-if="pageshow && page.total>0"
                    :total="page.total"
                    :page.sync="page.currentPage"
                    :limit.sync="page.pageSize"
                    @pagination="handlePageChange"
                    :size='24'
                  ></pagination>
                </el-tab-pane>
                <el-tab-pane
                  label="到店规律"
                  name="second"
                >
                  <el-col>
                    <el-card
                      class="card"
                      shadow="hover"
                    >
                      <div style="height: 320px;">
                        <el-col :span='12'>
                          <div id="weekChart"></div>
                        </el-col>
                        <el-col :span='12'>
                          <div id="hourChart"></div>
                        </el-col>
                      </div>
                    </el-card>
                  </el-col>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <template>
      <el-dialog
        :visible.sync="bigPicture"
        width="420px"
        :show-close="false"
        class="bigPicture"
      >
        <img
          :src="this.imgSrc"
          width="452px"
          style="margin: auto;height: 440px;margin:-21px;vertical-align:middle"
        />
      </el-dialog>
      <el-dialog
        :visible.sync="removeComfirmDialog"
        width="350px"
        :show-close='false'
      >
        <div class="confirmDialog "> <span class="el-icon-warning"></span><span class="confirmText">确认将该照片删除？</span></div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="removeComfirmDialog= false"
            size="small"
          >取消</el-button>
          <el-button
            type="primary"
            @click="removeRecord"
            size="small"
          >移除</el-button>
        </span>
      </el-dialog>
    </template>
    <el-dialog
      :visible.sync="removeFromComfirmDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确认将该用户移出黑名单?</span></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="removeFromComfirmDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="moveFromBlack"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { getCustomerTimes, fetchCustomerDetailByWeek, fetchCustomerDetailByHour, removeRecord, postAllToBeAuditedList, getWhiteCustomerInfo, removeBlack } from '@/api/customer'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'CustomerDetail',
  components: {
    Pagination
  },
  computed: {
    editCheckPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('进店详情审核') > -1
    },
    removeBlackPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('移出黑名单') > -1
    },
    showCustomerPicture() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('showCustomerPicture') > -1
    }
  },
  filters: {
    absFilter: function (value) {
      return Math.abs(value)
    }
  },
  data() {
    return {
      isBlack: true,
      page: {
        pageSize: 24,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      checkStatusList: [{ label: '全部', value: '' }, { label: '未读', value: 0 }, { label: '已读', value: 1 }],
      checkStatus: '',
      activeName2: 'first',
      tabs: [{ name: 'first', text: '时间排序' }, { name: 'second', text: '到店次数' }],
      removeRecordId: '',
      removeComfirmDialog: false,
      removeFromComfirmDialog: false,
      bigPicture: false,
      imgSrc: '',
      imgWidth: '',
      imgHeight: '',
      token: getToken(),
      info: {
        storeName: '',
        filterTime: '',
        img: '',
        userId: '',
        gender: '',
        age: '',
        tag: '',
        addType: '',
        total: ''
      },
      loading: true,
      toBeAuditedList: [],
      auditedList: []
    }
  },
  created() {
    this.initQuery()
  },
  mounted() {
    this.init()
  },
  methods: {
    initQuery() {
      this.info.img = this.$route.query.img || ''
      this.info.userId = this.$route.query.userId || ''
    },
    moveFromBlack: function () {
      const params = {
        userId: this.info.userId
      }
      removeBlack(params).then((res) => {
        if (res === 0) {
          this.$message.success('移出黑名单成功')
          this.$router.push({ name: 'blackList' })
        } else {
          this.$message.error('移出黑名单失败')
        }
        this.removeComfirmDialog = false
      })
    },
    removeFromBlackList() {
      this.removeFromComfirmDialog = true
    },
    handlePageChange() {
      this.queryImg()
    },
    removeComfirm(id) {
      this.removeComfirmDialog = true
      this.removeRecordId = id
    },
    handleClick(tab, event) {
    },
    init() {
      this.getBlackCustomerInfo()
      this.pickerSearchStatisticTable()
    },
    getBlackCustomerInfo() {
      getWhiteCustomerInfo({ userId: this.info.userId }).then(res => {
        this.info.name = res.name || ''
        this.info.storeName = res.storeName || ''
        this.info.filterTime = res.filterTime || ''
        this.info.total = res.total || ''
        this.info.gender = res.gender + '' === '0' ? '女' : '男'
        this.info.age = res.ageGroup || ''
        this.info.tag = res.tag || ''
        this.info.addType = res.addType || ''
        this.isBlack = res.identity === 2
      })
    },
    postAllToBeAuditedList() {
      const imgIdList = this.toBeAuditedList.map(item => { return item.imgId })
      const storeName = this.toBeAuditedList[0].storeName
      postAllToBeAuditedList({ imgIdList, storeName }).then(res => {
        if (res === 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.queryAll()
        } else {
          this.$message.error('审核失败')
        }
      })
    },
    removeRecord() {
      this.removeComfirmDialog = false
      removeRecord({ removeId: this.removeRecordId }).then(res => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.queryAll()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    LookBigPicture(val, id) {
      this.imgSrc = val + '?token=' + this.token
      this.bigPicture = true
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    fetchCustomerDetailByHour() {
      const params = {
        userId: this.info.userId
      }
      fetchCustomerDetailByHour(params).then((res) => {
        this.loadHourChart(res.map(r => r.label), res.map(r => r.value))
      })
    },
    fetchCustomerDetailByWeek() {
      const params = {
        userId: this.info.userId
      }
      fetchCustomerDetailByWeek(params).then((res) => {
        this.loadWeekChart(res.map(r => r.label), res.map(r => r.value))
      })
    },
    loadWeekChart(xData, yData) {
      var analyseChart = echarts.init(document.getElementById('weekChart'))
      const count = yData ? Math.max(...yData) : 5
      var option = {
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
            const showHtm = '<i style="display: inline-block;width: 10px;height: 10px;background-color:rgba(0,199,248,0.87);margin-right: 5px;border-radius: 50%;"></i>' + params[0].name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params[0].value
            return showHtm
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: 'rgba(84,84,84,1)',
              fontFamily: 'Microsoft YaHei'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(191,191,191)'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '单位(次)',
            type: 'value',
            splitNumber: 5,
            max: count < 5 ? 5 : null,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: 'rgba(0,199,248,0.87)' },
                    { offset: 1, color: 'rgba(42,137,226,0.87)' }
                  ]
                )
              }
            },
            barMaxWidth: '44',
            data: yData
          }
        ]
      }
      analyseChart.setOption(option, true)
    },
    loadHourChart(xData, yData) {
      var analyseChart = echarts.init(document.getElementById('hourChart'))
      const count = yData ? Math.max(...yData) : 5
      var option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var showHtm = ''
            showHtm += '<i style="display: inline-block;width: 10px;height: 10px;background-color:rgba(0,199,248,0.87);margin-right: 5px;border-radius: 50%;"></i>'
            showHtm += params[0].name + '-' + (parseInt(params[0].name.split(':')[0]) + 1) + ':00' + '&nbsp;&nbsp;&nbsp;&nbsp;' + params[0].value
            return showHtm
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
              color: 'rgba(84,84,84,1)',
              fontFamily: 'Microsoft YaHei'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(191,191,191)'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '单位(次)',
            type: 'value',
            splitNumber: 5,
            max: count < 5 ? 5 : null,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            itemStyle: {
              normal: {
                color: '#59ADFD',
                lineStyle: {
                  color: '#59ADFD',
                  width: 2
                }
              }
            },
            areaStyle: {
              color: 'rgba(89, 173, 253, 0.74)'
            },
            smooth: true,
            type: 'line',
            data: yData
          }
        ]
      }
      analyseChart.setOption(option, true)
    },
    pickerSearchStatisticTable: function () {
      this.page.currentPage = 1
      this.queryImg()
      this.fetchCustomerDetailByWeek()
      this.fetchCustomerDetailByHour()
    },
    queryAll() {
      this.queryImg()
      this.fetchCustomerDetailByWeek()
      this.fetchCustomerDetailByHour()
    },
    queryImg: function () {
      this.loading = true
      const params = {
        userId: this.info.userId,
        examine: this.editCheckPrivilege ? this.checkStatus : '',
        size: this.page.pageSize,
        page: this.page.currentPage
      }
      if (params.userId === '' || params.userId === undefined) {
        return
      }
      getCustomerTimes(params).then((res) => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.queryImg()
        }
        this.loading = false
        this.page.total = res.total
        this.toBeAuditedList = res.data.filter(item => item.examine === '0')
        this.auditedList = res.data
      })
    },
    successMsg: function (msg) {
      Message({
        showClose: false,
        message: msg,
        type: 'success',
        duration: 5 * 1000
      })
    },
    errorMsg: function (msg) {
      Message({
        showClose: false,
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  width: 100%;
  border-radius: 5px;
  border: none !important;
  padding: 16px 20px 16px 20px;
  font-size: 0px;
  .el-button {
    border-radius: 4px;
  }
  &.cardDetail {
    padding: 5px 20px 16px 20px;
  }
  #weekChart {
    width: 500px;
    height: 320px;
  }
  #hourChart {
    width: 500px;
    height: 320px;
  }
}
.detailContent {
  .card {
    min-height: calc(100vh - 250px);
    position: relative;
    margin-top: 16px;
  }
}
.el-card {
  border: 1px solid #ffffff;
  border-radius: 2px;
}
.record {
  width: 100%;
  background-color: #ffffff;
  padding: 12px 0px 10px 0px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.65);
}
.table-prefix {
  margin-top: 10px;
  .allRead {
    margin-left: 16px;
  }
}
.infoList {
  float: left;
  width: 152px;
  height: 166px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 16px;
  margin: 0px 40px 20px 0px;
  text-align: center;
  position: relative;
  &:hover {
    .delete {
      visibility: visible;
    }
    .delete:hover {
      color: #1890ff;
    }
  }
  .delete {
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
  }
  .infoImg {
    height: 84px;
    width: 62px;
    cursor: pointer;
    vertical-align: middle;
  }
  .unread {
    position: absolute;
    left: 0;
    top: -1px;
    width: 32px;
    height: 32px;
  }
  .delete {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 10px;
    top: 10px;
    visibility: hidden;
  }

  .infoContent {
    p {
      font-size: 12px;
      height: 12px;
      line-height: 12px;
      margin: 0;
      &:nth-child(1) {
        margin: 16px 0px 10px 0px;
      }
    }
  }
}
.confirmDialog {
  height: 58px;
  padding-top: 2px;
  .confirmText {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
  }
  .el-icon-warning {
    vertical-align: middle;
    color: #ebb563;
    height: 22px;
    width: 22px;
    font-size: 22px;
    margin: 0px 16px 0px 12px;
  }
}
.identContent {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  float: left;
  width: calc(100% - 82px);
  padding-left: 20px;
  div:nth-child(1) {
    height: 44px;
    line-height: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    span {
      display: inline-block;
      margin-right: 68px;
      margin-bottom: 10px;
    }
  }
  div:nth-child(2) {
    padding: 10px 0px 0px;
  }
}
.identImg {
  vertical-align: middle;
  float: left;
  width: 62px;
  position: relative;
  img {
    width: 62px;
    height: 84px;
  }
  .identity {
    position: absolute;
    left: 31px;
    top: 0px;
    width: 31px;
    height: 31px;
  }
}
.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 166px;
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  transform: translate(-50%, -50%);
  .svg-icon {
    width: 166px;
    height: 100px;
  }
}
</style>

