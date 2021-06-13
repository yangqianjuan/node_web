<template>
  <div
    id="DeviceMonitor"
    ref="deviceMonitorBox"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <div class="search-container">
        <span>设备编号</span>
        <el-select
          @change="searchQuery"
          v-model="search.deviceId"
          filterable
          placeholder="请输入"
          size="mini"
          clearable
        >
          <el-option
            v-for="item in deviceOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
        <span class="cond-name">品牌名称</span>
        <el-select
          ref="nameSelect"
          v-model="search.brandId"
          filterable
          placeholder="请输入"
          size="mini"
          clearable
          @change="handleBrandChange"
        >
          <el-option
            v-for="item in brandNameOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          > </el-option>
        </el-select>
        <span class="cond-name">门店名称</span>
        <el-select
          ref="personSelect"
          v-model="search.storeId"
          filterable
          placeholder="请输入"
          size="mini"
          clearable
          @change="searchQuery"
        >
          <el-option
            v-for="item in storeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
        <span class="cond-name">报活状态</span>
        <el-select
          ref="personSelect"
          v-model="search.reportStatus"
          filterable
          placeholder="全部"
          size="mini"
          clearable
          @change="searchQuery"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
      </div>
      <div class="table-prefix-bars">
        <span class="table-tile">设备监控列表</span><span style="font-size: 12px;">-客流计</span>
        <span class="table-tile-total">共{{page.total}}条</span>
      </div>
      <div class="table-container">
        <el-table
          :data="items"
          row-key="id"
          fit
          v-loading="loading"
          class="table-box"
        >
          <el-table-column
            prop="deviceName"
            label="设备编号"
            align="center"
            min-width="13%"
          >
          </el-table-column>
          <el-table-column
            prop="reportStatus"
            label="报活状态"
            align="center"
            min-width="7%"
          >
            <template slot-scope="scope">
              <template v-for="item in statusOptions">
                <template v-if="parseInt(item.value) === parseInt(scope.row.reportStatus)">
                  <span
                    v-if="scope.row.reportStatus === 2"
                    style="color: red"
                  >{{item.name}}</span>
                  <span v-else>{{item.name}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="stopIntervals"
            label="最近报停时长"
            align="center"
            min-width="18%"
          >
            <template slot-scope="scope">
              <span style="color: red">{{scope.row.stopIntervals}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="stopTimes"
            label="报停次数"
            align="center"
            min-width="7%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toDeviceStopTimes(scope.row)"
                size="small"
              >{{scope.row.stopTimes}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandId"
            label="品牌名称"
            align="center"
            min-width="12%"
          >
            <template slot-scope="scope">
              <template v-for="item in brandNameOptions">
                <template v-if="parseInt(item.id) === parseInt(scope.row.brandId)">
                  {{item.brandName}}
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="storeId"
            label="门店名称"
            align="center"
            min-width="12%"
          >
            <template slot-scope="scope">
              <template v-for="item in storeOptions">
                <template v-if="parseInt(item.value) === parseInt(scope.row.storeId)">
                  {{item.name}}
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="门店地址"
            align="center"
            min-width="18%"
          >
            <template slot-scope="scope">
              <span v-show="scope.row.address">
                {{ scope.row.address }}
                <br />
              </span>
              <span>
                {{ scope.row.addressDetail }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="addTime"
            label="添加时间"
            align="center"
            min-width="10%"
          >
            <template slot-scope="scope">
              <span>
                {{ scope.row.addTime ? scope.row.addTime.split(' ')[0].split('-').join('/') : '' }}
              </span>
              <br />
              <span>
                {{ scope.row.addTime ? scope.row.addTime.split(' ')[1] : ''  }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="op"
            align="center"
            min-width="8%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="近三日报活记录"
                placement="top"
              >
                <span type="text">报活记录</span>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toDeviceLiveDetail(scope.row)"
                size="small"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-if="pageshow && page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="handlePageChange"
        ></pagination>
      </div>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getBrandOptions } from '@/api/brand'
import { fetchCamera, fetchStore, fetchDictionary } from '@/api/dictionary'
import { getDeviceMonitorList } from '@/api/device'
export default {
  name: 'DeviceMonitor',
  components: {
    Pagination
  },
  data() {
    return {
      keepAlive: false,
      // scrollTop: '',
      search: {
        deviceId: '',
        brandId: '',
        storeId: '',
        reportStatus: ''
      },
      deviceOptions: [],
      brandNameOptions: [],
      storeOptions: [],
      statusOptions: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      items: [],
      loading: true
    }
  },
  updated() {
    document.querySelector('.el-main').scrollTop = 0
  },
  mounted() {
    if (this.routeLevel < 3) {
      this.init()
    }
    document.querySelector('.el-main').addEventListener('scroll', this.handelscroll)
  },
  beforeDestroy() {
    document.querySelector('.el-main').removeEventListener('scroll', this.handelscroll)
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('deviceMonitor', this.scrollTop)
      }
    }
  },
  computed: {
    routeLevel() {
      return this.$route.matched.length
    }
  },
  // activated() {
  //   this.isUpdate()
  // },
  deactivated() {
    sessionStorage.setItem('deviceMonitor', this.scrollTop)
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.keepAlive = vm.getKeeplive(from.query, from.name)
      vm.isUpdate()
    })
  },
  // beforeRouteLeave(to, from, next) {
  //   this.keepAlive = this.getKeeplive(to.query, to.name)
  //   next()
  // },
  methods: {
    getKeeplive(query, name) {
      var arr = Object.getOwnPropertyNames(query)
      var keepAlive = true
      if (arr.length > 0) {
        keepAlive = name === 'DeviceStopTimes' || 'DeviceLiveDetail'
      } else {
        keepAlive = false
      }
      return keepAlive
    },
    isUpdate() {
      if (this.keepAlive === false) {
        this.page.currentPage = 1
      }
      this.init()
    },
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    init() {
      this.getBrandOptions()
      this.getDeviceOptions()
      this.getStoreOptions()
      this.getStatusOptions()
      this.query()
    },
    resetData() {
      sessionStorage.removeItem('list')
      this.search = {
        deviceId: '',
        brandId: '',
        storeId: '',
        reportStatus: ''
      }
      this.page = {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    searchQuery() {
      sessionStorage.removeItem('list')
      this.page.currentPage = 1
      this.pageshow = false
      this.query()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handleBrandChange() {
      this.getStoreOptions()
      this.searchQuery()
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        deviceId: this.search.deviceId,
        brandId: this.search.brandId,
        storeId: this.search.storeId,
        reportStatus: this.search.reportStatus,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getDeviceMonitorList(params).then((res) => {
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.items = res.data
      })
      document.querySelector('.el-main').scrollTop = sessionStorage.getItem('list') || 0
    },
    getBrandOptions: function () {
      const params = {}
      getBrandOptions(params).then((res) => {
        this.brandNameOptions = res[0]
      })
    },
    getDeviceOptions: function () {
      fetchCamera().then((res) => {
        this.deviceOptions = res
      })
    },
    getStoreOptions: function () {
      const params = {
        brandId: this.search.brandId
      }
      fetchStore(params).then((res) => {
        this.storeOptions = res
      })
    },
    getStatusOptions: function () {
      const params = {
        dictionaries: ['REPORT_STATUS']
      }
      fetchDictionary(params).then((res) => {
        this.statusOptions = res.reportStatus
      })
    },
    toDeviceLiveDetail(row) {
      /* eslint-disable */
      this.$router.push({
        name: 'DeviceLiveDetail',
        query: { deviceId: row.deviceId, deviceName: row.deviceName }
      })
    },
    toDeviceStopTimes(row) {
      this.$router.push({
        name: 'DeviceStopTimes',
        query: { deviceId: row.deviceId, deviceName: row.deviceName }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container {
  background-color: #ffffff;
  padding-bottom: 10px;
  min-height: calc(100vh - 194px);
  border-radius: 5px;
}
.el-input {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 180px;
}
</style >
