<template>
  <div class="report">
    <div class="app-container">
      <div style="background-color: #ffffff; font-size: 14px;">
        <span class="cond-name">数据报表</span>
        <span class="cond-name">门店:&nbsp;&nbsp;{{this.cache.store}}</span>
        <span class="cond-name">日期:&nbsp;&nbsp;{{this.cache.startDate}}
          <span
            v-show="this.cache.startDate !== this.cache.endDate"
          > 至 {{this.cache.endDate}}</span>
        </span>
        <a
          v-bind:href="exportChart"
          target="_blank"
        >
          <el-button
            type="text"
            style="float: right; line-height: 25px;margin: 0 10px 0 10px; font-size: 14px;"
            size="small"
          >导出</el-button>
        </a>
      </div>

      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
        <el-table
          :data="tableData"
          fit
          v-loading="loading"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="time"
            label="时间"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="total"
            label="总人数"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="oldTotal"
            label="老客"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="newTotal"
            label="新客"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="oldPercent"
            label="老客占比"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="newPercent"
            label="新客占比"
            :resizable="false"
            align="center"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { fetchStatisticsAnalyseData } from '@/api/statistics'
import { getToken } from '@/utils/auth'
export default {
  name: 'StatisticsReport',
  components: {
  },
  computed: {
    exportChart: function () {
      return process.env.BASE_API + `/statistics/analyse/export?token=${this.token}&startDate=${this.cache.startDate}&endDate=${this.cache.endDate}&timeType=${this.cache.timeType}&structId=${this.cache.structId}`
    }
  },
  filters: {
  },
  data() {
    return {
      token: '',
      page: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      cache: {
        startDate: '',
        endDate: '',
        structId: '',
        store: '',
        timeType: ''
      },
      loading: false,
      tableData: []
    }
  },
  mounted() {
    this.token = getToken()
    this.fetchStatisticsAnalyseData()
  },
  methods: {
    fetchStatisticsAnalyseData: function () {
      this.loading = true
      const params = {
        startDate: this.cache.startDate,
        endDate: this.cache.endDate,
        structId: this.cache.structId,
        timeType: this.cache.timeType
      }
      fetchStatisticsAnalyseData(params).then((res) => {
        this.loading = false
        this.tableData = res
      })
    },
    handlePageChange(val) {
      this.fetchStatisticsAnalyseData(this.page.currentPage)
    }
  },
  created() {
    if (this.$route.query.startDate === undefined && this.$route.query.startDate === undefined) {
      this.cache.startDate = ''
      this.cache.startDate = ''
    } else {
      this.cache.startDate = this.$route.query.startDate
      this.cache.startDate = this.$route.query.startDate
    }
    if (this.$route.query.endDate === undefined && this.$route.query.endDate === undefined) {
      this.cache.endDate = ''
      this.cache.endDate = ''
    } else {
      this.cache.endDate = this.$route.query.endDate
      this.cache.endDate = this.$route.query.endDate
    }
    if (this.$route.query.structId === undefined && this.$route.query.structId === undefined) {
      this.cache.structId = ''
      this.cache.structId = ''
    } else {
      this.cache.structId = this.$route.query.structId
      this.cache.structId = this.$route.query.structId
    }
    if (this.$route.query.store === undefined && this.$route.query.store === undefined) {
      this.cache.store = ''
      this.cache.store = ''
    } else {
      this.cache.store = this.$route.query.store
      this.cache.store = this.$route.query.store
    }
    if (this.$route.query.timeType === undefined && this.$route.query.timeType === undefined) {
      this.cache.timeType = ''
      this.cache.timeType = ''
    } else {
      this.cache.timeType = this.$route.query.timeType
      this.cache.timeType = this.$route.query.timeType
    }
  }
}
</script>

<style>
</style>

