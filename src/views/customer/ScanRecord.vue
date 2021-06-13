<template>
  <div class="visitRecord">
    <div class="app-container">
      <!-- 搜索栏-->
      <el-row class="search-container">
        <el-col
          :xs="24"
          :sm="24"
          :lg="18"
        >
          <span class="cond-name">摄像头</span>
          <el-select
            filterable
            v-model="search.camera"
            placeholder="请选择"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in cameras"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="cond-name name">选择日期</span>
          <el-date-picker
            style="width:240px;"
            v-model="search.dateRange"
            type="daterange"
            align="right"
            size="mini"
            unlink-panels
            range-separator="至"
            value-format='yyyy-MM-dd'
            @focus="focus"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
          align="right"
        >
          <el-button
            @click="reset"
            plain
            style="float: right; width: 80px;"
            size="small"
          >重置</el-button>
          <el-button
            @click="searchQuery"
            type="primary"
            plain
            style="width: 80px;margin-right:20px;"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-row>
      <div class="table-prefix-bars">
        <span class="table-tile">扫码记录</span><span class="table-tile-total">共{{page.total}}条</span>
      </div>
      <div class="table-container">
        <el-table
          ref="visitRecordTable"
          :data="items"
          :span-method="cellMerge"
          row-key="id"
          fit
          v-loading="loading"
          width="100%"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="scanId"
            label="扫码ID"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>

          <el-table-column
            prop="scanTime"
            label="扫码时间"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cameraId"
            label="摄像头"
            min-width="16%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.cameraId === undefined ||scope.row.cameraId === '' ">--</template>
              <template
                v-else
                v-for="item in cameras"
              >
                <template v-if="item.value === scope.row.cameraId">{{item.name}}</template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="img"
            label="顾客头像"
            min-width="12%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.img">
                <img
                  :src="scope.row.img + '?token=' + token"
                  v-if="scope.row.img.indexOf('http://') != -1"
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.img + '?token=' + token)"
                >
                <img
                  :src="'http://' + scope.row.img + '?token=' + token"
                  v-else
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.img + '?token=' + token)"
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="userId"
            label="顾客ID"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="defaultUploadFailCount"
            label="未拍照片上传失败次数"
            min-width="20%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="faceUploadFailCount"
            label="拍照片上传失败次数"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="picNumber"
            label="照片编号"
            min-width="12%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="sendTime"
            label="拍照时间"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="uploadTime"
            label="上传时间"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
        </el-table>
        <pagination
          v-if="pageshow && page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="handlePageChange"
        ></pagination>
      </div>
      <template>
        <el-dialog
          title="查看大图"
          :visible.sync="bigPicture"
          width="440px"
        >
          <img
            :src="this.imgSrc"
            v-if="this.imgSrc.indexOf('http://') != -1"
            @load="getSize"
            style="display: none;"
          >
          <img
            :src="'http://' + this.imgSrc"
            @load="getSize"
            style="display: none;"
            v-else
          >
          <div style="width: 400px;height: 540px;overflow: hidden;">
            <img
              v-if="this.imgWidth>=400"
              :src="this.imgSrc"
              width="400px"
              style="margin: auto;max-height: 540px"
            />
            <img
              v-else-if="this.imgHeight>=540"
              :src="this.imgSrc"
              height="540px"
              style="margin: auto;max-width: 400px"
            />
            <img
              v-else-if="this.imgHeight<540&&this.imgWidth<400"
              :src="this.imgSrc"
              width="400px"
              style="margin: auto;max-height: 540px"
            />
          </div>
        </el-dialog>
      </template>
    </div>
  </div>
</template>

<script>
import { listScanRecord, getSearchCondition, getCameraOption, getShopOption } from '@/api/statistics'
import { fetchCustomerId } from '@/api/dictionary'
// import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'ScanRecord',
  components: {
    Pagination
  },
  data() {
    return {
      filterOptions: null,
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: true,
      items: [],
      search: {
        dateRange: [],
        customerId: '',
        date: '',
        time: '',
        shopName: '',
        camera: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      token: '',
      imgSrc: '',
      bigPicture: false,
      times: [],
      shopNames: [],
      cameras: [],
      customerIds: [],
      link: false,
      imgWidth: '',
      imgHeight: '',
      focusColor: false
    }
  },
  // activated() {
  //   this.init()
  // },
  mounted() {
    this.init()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.isUpdate()
    })
  },
  methods: {
    isUpdate() {
      this.page.currentPage = 1
      this.init()
    },
    init() {
      this.token = getToken()
      this.getTableData()
      this.getSearchCondition()
      this.getCameraOption()
      this.getShopOption()
      this.getCustomerIdOption()
    },
    focus() {
      this.focusColor = true
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    LookBigPicture(val) {
      this.imgSrc = val
      this.bigPicture = true
    },
    reset: function () {
      this.search.customerId = ''
      this.search.dateRange = ''
      this.search.time = ''
      this.search.shopName = ''
      this.search.camera = ''
      this.searchQuery()
    },
    getSearchCondition: function () {
      const params = {
        dictionaries: ['STATISTICS_PERIOD']
      }
      getSearchCondition(params).then((res) => {
        this.times = res.statisticsPeriod
      })
    },
    getShopOption: function () {
      const params = {}
      getShopOption(params).then((res) => {
        this.shopNames = res
      })
    },
    getCustomerIdOption: function () {
      const params = {}
      fetchCustomerId(params).then((res) => {
        if (this.link) {
          this.filterOptions = res
        }
        this.customerIds = res
      })
    },
    getCameraOption: function () {
      const params = {}
      getCameraOption(params).then((res) => {
        this.cameras = res
      })
    },
    handlePageChange() {
      this.getTableData()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.getTableData()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    getTableData: function (val) {
      this.loading = true
      const params = {
        customerId: this.search.customerId,
        startDate: this.search.dateRange ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange ? this.search.dateRange[1] : '',
        time: this.search.time,
        shopName: this.search.shopName,
        cameraId: this.search.camera,
        page: (this.page.currentPage - 1) * this.page.pageSize,
        size: this.page.pageSize
      }
      listScanRecord(params).then((res) => {
        this.loading = false
        this.page.total = res.total
        this.items = []
        // res.total为0时，res.data为undefined
        this.items = res.total > 0 ? res.data : []
        // this.mergeTableRow(this.items, ['scanTime', 'cameraId'])
        this.getSpanArr(this.items)
        document.querySelector('.el-main').scrollTop = 0
      })
    },
    filterCustomerIds(query) {
      if (!query) {
        this.filterOptions = null
        return
      }
      // const d = query.toString().toLowerCase()
      this.filterOptions = this.customerIds.filter((data, index) => {
        return data.name.includes(query)
      })
    },
    getSpanArr(data) {
      this.spanArr = []
      this.spanArr1 = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr1.push(1)
          this.spanArr.push(1)
          this.pos = 0
          this.pos1 = 0
        } else {
          if (data[i].scanTime === data[i - 1].scanTime) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
            if (data[i].cameraId === data[i - 1].cameraId) {
              this.spanArr1[this.pos1] += 1
              this.spanArr1.push(0)
            } else {
              this.spanArr1.push(1)
              this.pos1 = i
            }
          } else {
            this.spanArr.push(1)
            this.pos = i
            this.spanArr1.push(1)
            this.pos1 = i
          }
        }
      }
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return { rowspan: _row, colspan: _col }
      }
      if (columnIndex === 2) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return { rowspan: _row, colspan: _col }
      }
    }
  },
  created() {
    this.search.shopName = parseInt(this.$route.query.shopName) || ''
    if (this.$route.query.camera === '' || this.$route.query.camera === undefined) {
      this.search.camera = ''
    } else {
      this.search.camera = parseInt(this.$route.query.camera) || ''
    }
    if (this.$route.query.userId === '' || this.$route.query.userId === undefined) {
      this.search.customerId === ''
    } else {
      this.link = true
      this.search.customerId = parseInt(this.$route.query.userId)
    }
    if (this.$route.query.camera === '' || this.$route.query.camera === undefined) {
      this.search.camera === ''
    } else {
      this.search.camera = parseInt(this.$route.query.camera) || ''
    }
    if (this.$route.query.store === '' || this.$route.query.store === undefined) {
      this.search.shopName === ''
    } else {
      this.search.shopName = parseInt(this.$route.query.store) || ''
    }
    if (this.$route.query.date === '' || this.$route.query.date === undefined) {
      this.search.dateRange = []
    } else {
      this.search.dateRange[0] = this.$route.query.date
      this.search.dateRange[1] = this.$route.query.date
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-container {
  background-color: #ffffff;
  padding-bottom: 10px;
  min-height: calc(100vh - 214px);
  border-radius: 5px;
}
</style>
