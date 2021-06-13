<template>
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
            style="background-color: #ffffff;min-height: calc(100vh - 350px)"
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
            v-if="page.total>0"
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
      <div class="selectQuery">
        <span class="cond-name">到店时间:</span>
        <el-date-picker
          @change="pickerSearchStatisticTable"
          v-model="search.startDate"
          value-format='yyyy-MM-dd'
          type="date"
          placeholder="开始日期"
          :clearable="false"
          size='mini'
          style="width:140px"
        >
        </el-date-picker>
        <span class="cond-name">到</span>
        <el-date-picker
          @change="pickerSearchStatisticTable"
          v-model="search.endDate"
          type="date"
          value-format='yyyy-MM-dd'
          placeholder="结束日期"
          :clearable="false"
          size='mini'
          style="width:140px"
        >
        </el-date-picker>
        <span
          class="cond-name"
          style="margin-left: 40px"
        >选择门店: </span>
        <el-select
          v-model="search.storeId"
          placeholder="请选择"
          size='mini'
          style="width:140px"
          @change="pickerSearchStatisticTable"
        >
          <el-option
            v-for="item in storeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

      </div>
    </el-card>
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
  </el-col>
</template>

<script>
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
import Pagination from '@/components/Pagination'
import { fetchCustomerDetailByWeek, fetchCustomerDetailByHour, postAllToBeAuditedList, removeRecord, getStoreOption, getCustomerTimes } from '@/api/customer'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Pagination
  },
  // props: {
  //   searchData: {
  //     type: Object
  //   }
  // },
  data() {
    return {
      search: {
        startDate: '',
        endDate: '',
        storeId: ''
      },
      page: {
        pageSize: 24,
        total: 0,
        currentPage: 1
      },
      info: { userId: '' },
      removeComfirmDialog: false,
      loading: true,
      storeList: [],
      checkStatusList: [{ label: '全部', value: '' }, { label: '未读', value: 0 }, { label: '已读', value: 1 }],
      checkStatus: '',
      activeName2: 'first',
      tabs: [{ name: 'first', text: '时间排序' }, { name: 'second', text: '到店次数' }],
      removeRecordId: '',
      toBeAuditedList: [],
      auditedList: [],
      token: getToken()
    }
  },
  computed: {
    editCheckPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('进店详情审核') > -1
    },
    showCustomerPicture() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('showCustomerPicture') > -1
    }
  },
  created() {
    this.search.startDate = this.$route.query.startDate || ''
    this.search.endDate = this.$route.query.endDate || ''
    this.search.storeId = this.$route.query.storeId ? this.$route.query.storeId : ''
    if (this.$route.query.userId) {
      var id = this.$route.query.userId
      this.info.userId = id
    } else {
      this.info.userId === ''
    }
    this.pickerSearchStatisticTable()
    this.getStoreOption()
  },
  methods: {
    handleClick(tab, event) {
    },
    handlePageChange() {
      this.queryImg()
    },
    queryAll() {
      if (this.search.startDate > this.search.endDate) {
        this.$message.error('日期选择错误')
        this.toBeAuditedList = []
        this.auditedList = []
        this.page.total = 0
        return
      }
      this.queryImg()
      this.fetchCustomerDetailByWeek()
      this.fetchCustomerDetailByHour()
    },
    queryImg: function () {
      this.loading = true
      const params = {
        userId: this.info.userId,
        startDate: this.search.startDate || '',
        endDate: this.search.endDate || '',
        storeId: this.search.storeId,
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
    getStoreOption() {
      getStoreOption({}).then(res => {
        this.storeList = res
      })
    },
    pickerSearchStatisticTable() {
      if (this.search.startDate > this.search.endDate) {
        this.$message.error('日期选择错误')
        this.toBeAuditedList = []
        this.auditedList = []
        this.page.total = 0
        return
      }
      this.page.currentPage = 1
      this.queryImg()
      this.fetchCustomerDetailByWeek()
      this.fetchCustomerDetailByHour()
    },
    removeComfirm(id) {
      this.removeComfirmDialog = true
      this.removeRecordId = id
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
    postAllToBeAuditedList() {
      const imgIdList = this.toBeAuditedList.map(item => { return item.imgId })
      const storeName = this.toBeAuditedList[0].storeName
      postAllToBeAuditedList({ imgIdList, storeName }).then(res => {
        if (res === 0) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          // this.init()
          this.queryAll()
        } else {
          this.$message.error('审核失败')
        }
      })
    },
    fetchCustomerDetailByHour() {
      const params = {
        startDate: this.search.startDate || '',
        endDate: this.search.endDate || '',
        userId: this.info.userId,
        storeId: this.search.storeId
      }
      fetchCustomerDetailByHour(params).then((res) => {
        this.loadHourChart(res.map(r => r.label), res.map(r => r.value))
      })
    },
    fetchCustomerDetailByWeek() {
      const params = {
        startDate: this.search.startDate || '',
        endDate: this.search.endDate || '',
        userId: this.info.userId,
        storeId: this.search.storeId
      }
      fetchCustomerDetailByWeek(params).then((res) => {
        this.loadWeekChart(res.map(r => r.label), res.map(r => r.value))
      })
    },
    loadWeekChart(xData, yData) {
      var analyseChart = echarts.init(document.getElementById('weekChart'))
      const count = Math.max(...yData)
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
      const count = Math.max(...yData)
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  // width: 100%;
  // border-radius: 5px;
  border: none !important;
  // padding: 16px 20px 16px 20px;
  // font-size: 0px;
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
.selectQuery {
  font-weight: 400;
  // color: rgba(0, 0, 0, 1);
  background-color: #ffffff;
  position: absolute;
  right: 20px;
  top: 11px;
  font-size: 0px;
  .cond-name {
    padding: 0px 8px;
    margin: 0px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65) !important;
  }
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
</style>
