<template>
  <div
    id="deviceStopTimes"
    class="app-container"
  >
    <div class="search-container">
      <span>设备编号:</span><span class="cond-name">{{search.deviceName}}</span>
    </div>
    <div class="table-prefix-bars">
      <span class="table-tile">报停记录</span>
      <span class="table-tile-total">
        共{{page.total}}条
      </span>
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
          type="index"
          label="序号"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="reportTime"
          label="报停时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="stopIntervals"
          label="持续时长"
          align="center"
        >
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
</template>

<script>
import Pagination from '@/components/Pagination'
import { getDeviceStopList } from '@/api/device'
export default {
  name: 'deviceStopTimes',
  components: {
    Pagination
  },
  data() {
    return {
      search: {
        deviceId: '',
        deviceName: ''
      },
      deviceOptions: [],
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
  created() {
    if (this.$route.query.deviceName === undefined) {
      this.search.deviceName = ''
    } else {
      this.search.deviceName = this.$route.query.deviceName
    }
    if (this.$route.query.deviceId === undefined) {
      this.search.deviceId = ''
    } else {
      this.search.deviceId = this.$route.query.deviceId
    }
  },
  updated() {
    document.querySelector('.el-main').scrollTop = 0
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.query()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.query()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        deviceId: this.search.deviceId,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getDeviceStopList(params).then((res) => {
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.items = res.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-container {
  background-color: #ffffff;
  padding-bottom: 10px;
  min-height: calc(100vh - 170px);
  border-radius: 5px;
}
</style >
