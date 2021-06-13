<template>
  <div class="visitRepeat">
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <el-row>
          <span>门店名称</span>
          <el-select
            filterable
            v-model="search.shopName"
            placeholder="请选择"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in shopNames"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>

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

          <span class="cond-name">顾客ID</span>
          <el-select
            filterable
            v-model="search.customerId"
            placeholder="请输入"
            size="mini"
            clearable
            remote
            :remote-method="filterCustomerIds"
            @clear="filterOptions = null"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col
            :xs="24"
            :sm="24"
            :lg="18"
          >
            <span>选择日期</span>
            <el-date-picker
              style="width:240px;"
              v-model="search.dateRange"
              type="daterange"
              align="right"
              size="mini"
              unlink-panels
              range-separator="至"
              value-format='yyyy-MM-dd'
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <span class="cond-name">时段</span>
            <el-select
              clearable
              v-model="search.time"
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in times"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              > </el-option>
            </el-select>
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
      </div>
      <div class="table-prefix-bars">
        <span class="table-tile">去重人次列表</span><span class="table-tile-total">共{{page.total}}条</span>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
        <el-table
          ref="visitRecordTable"
          :data="items"
          row-key="id"
          fit
          v-loading="loading"
          min-width="100%"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="customerImg"
            label="顾客头像"
            min-width="12%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.customerImg">
                <img
                  :src="scope.row.customerImg + '?token=' + token"
                  v-if="scope.row.customerImg.indexOf('http://') != -1"
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.customerImg + '?token=' + token)"
                >
                <img
                  :src="'http://' + scope.row.customerImg + '?token=' + token"
                  v-else
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.customerImg + '?token=' + token)"
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="customerId"
            label="顾客ID"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="shopName"
            label="门店名称"
            min-width="20%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="camera"
            label="摄像头"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="到店日期"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="到店时间"
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
import { getVisitRepeat, getSearchCondition, getCameraOption, getShopOption } from '@/api/statistics'
import { fetchCustomerId } from '@/api/dictionary'
import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'VisitRepeat',
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
      imgHeight: ''
    }
  },
  watch: {
  },
  updated() {
  },
  mounted() {
    this.token = getToken()
    this.getVisitRepeat()
    this.getSearchCondition()
    this.getCameraOption()
    this.getShopOption()
    this.getCustomerIdOption()
    bus.$on('formquery', (...args) => {
      this.getVisitRepeat()
    })
  },
  methods: {
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
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.getVisitRepeat()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      this.getVisitRepeat()
    },
    getVisitRepeat: function (val) {
      this.loading = true
      const params = {
        customerId: this.search.customerId,
        startDate: this.search.dateRange ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange ? this.search.dateRange[1] : '',
        time: this.search.time,
        shopName: this.search.shopName,
        camera: this.search.camera,
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      getVisitRepeat(params).then((res) => {
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.$nextTick(() => {
          this.items = res.data
        })
        document.querySelector('.el-main').scrollTop = 0
      })
    },
    filterCustomerIds(query) {
      if (!query) {
        this.filterOptions = null
        return
      }
      this.filterOptions = this.customerIds.filter((data, index) => {
        return data.name.includes(query)
      })
    }
  }
}

</script>
<style>
</style>
