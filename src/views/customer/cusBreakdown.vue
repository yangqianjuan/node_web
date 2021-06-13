<template>
  <div class="cusBreakdown">
    <div class="app-container">
      <div style="background-color: #ffffff; font-size: 14px;">
        <span class="cond-name">顾客明细</span>
        <span class="cond-name">门店:&nbsp;&nbsp;{{this.cache.store}}</span>
        <span class="cond-name">日期:&nbsp;&nbsp;{{this.cache.startDate}}
          <span v-show="this.cache.startDate !== this.cache.endDate"> 至 {{this.cache.endDate}}</span>
        </span>
        <span class="cond-name">顾客类别:
          <span v-if="this.cache.timeType === '1'">老客</span>
          <span v-else-if="this.cache.timeType === '2'">新客</span>
          <span v-else>总人数</span>
        </span>
      </div>

      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">顾客明细列表</span><span class="table-tile-total">共{{page.total}}人</span>
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
          @sort-change="handleSortChange"
        >
          <el-table-column
            prop="img"
            label="头像"
            :resizable="false"
            align="center"
            min-width="15%"
          >
            <template slot-scope="scope">
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
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            :resizable="false"
            align="center"
            min-width="12%"
          ></el-table-column>
          <el-table-column
            prop="age"
            label="年龄段(岁)"
            :resizable="false"
            align="center"
            min-width="15%"
          ></el-table-column>
          <el-table-column
            prop="recentTime"
            label="最近到店时间"
            :resizable="false"
            align="center"
            min-width="20%"
          ></el-table-column>
          <el-table-column
            prop="count"
            label="进店次数"
            :resizable="false"
            align="center"
            sortable
            min-width="20%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="toDetail(scope.$index, scope.row)"
                size="small"
              >{{scope.row.count}}</el-button>
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
    <template>
      <el-dialog
        class="imgDialog"
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
</template>

<script type="text/javascript">
import { listCustomerBreakdown } from '@/api/customer'
import { getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
  name: 'CustomerBreakdown',
  components: {
    Pagination
  },
  computed: {
    exportChart: function () {
      return process.env.BASE_API + `/customer/breakdown/export?token=${this.token}&startDate=${this.cache.startDate}&endDate=${this.cache.endDate}&sortField=${this.sortField}&sort=${this.sort}&structId=${this.cache.structId}&timeType=${this.cache.timeType}`
    }
  },
  filters: {
  },
  data() {
    return {
      token: '',
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      cache: {
        startDate: '',
        endDate: '',
        structId: '',
        store: '',
        timeType: ''
      },
      loading: false,
      tableData: [],
      sortField: '',
      sort: '',
      imgSrc: '',
      bigPicture: false,
      imgWidth: '',
      imgHeight: ''
    }
  },
  mounted() {
    this.token = getToken()
    this.listCustomerBreakdown()
  },
  methods: {
    toDetail($index, row) {
      /* eslint-disable */
      this.$router.push({        name: 'CustomerDetail', query: {          filter: '', storeTitle: this.cache.store, img: row.img, gender: row.gender, age: row.age, userId: row.userId, structId: this.cache.structId, startDate: this.cache.startDate, endDate:
            this.cache.endDate        }      })
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    LookBigPicture(val) {
      // this.imgSrc = val + '?token=' + this.token
      this.imgSrc = val
      this.bigPicture = true
    },
    handleSortChange(props) {
      const { column, prop, order } = props
      if (!column && !prop && !order) return
      const os = {
        descending: 'desc',
        ascending: 'asc'
      }
      this.sort = os[order]
      this.sortField = prop
      this.searchQuery()
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.listCustomerBreakdown()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.listCustomerBreakdown()
    },
    listCustomerBreakdown: function () {
      this.loading = true
      const params = {
        startDate: this.cache.startDate,
        endDate: this.cache.endDate,
        structId: this.cache.structId,
        timeType: this.cache.timeType,
        sort: this.sort,
        sortField: this.sortField,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listCustomerBreakdown(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.total
        this.loading = false
      })
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

