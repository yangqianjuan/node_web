<template>
  <div
    class="atmonthReport"
    id="atmonthReport"
    ref="atmonthReportBox"
    v-if="routeLevel<3"
  >
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
        />
        <img
          :src="'http://' + this.imgSrc"
          @load="getSize"
          style="display: none;"
          v-else
        />
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
    <div class="search-container">
      <el-row>
        <el-col
          :xs="24"
          :sm="24"
          :lg="18"
        >
          <span class="cond-name">考勤月份:</span>
          <el-date-picker
            v-model="search.date"
            type="month"
            placeholder="选择月份"
            :clearable=false
            size="mini"
            :picker-options="pickerOptions"
            @change="querySearch"
          >
          </el-date-picker>
          <span class="cond-name">姓名:</span>
          <el-input
            v-model="search.name"
            @keyup.enter.native="querySearch"
            placeholder="全部"
            style="width: 200px;"
            size="small"
            clearable
            @clear="querySearch"
          ></el-input>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
          align="right"
        >
          <el-button
            @click="querySearch"
            type="primary"
            plain
            style="width: 80px;"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-row>

    </div>

    <div class="table-prefix-bars">
      <span class="table-tile">月度汇总表</span><span class="table-tile-total">共{{page.total}}人</span><span class="table-tile-total">（每月1号中午12点准时发送上个月月度汇总表邮件）</span>
    </div>
    <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
      <el-table
        :data="items"
        row-key="id"
        fit
        v-loading="loading"
        size="small"
        class="table-box"
      >
        <el-table-column
          prop="img"
          label="头像"
          min-width="12%"
          :resizable="false"
          align="center"
        >
          <template
            slot-scope="scope"
            v-if="scope.row.img"
          >
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
          prop="name"
          label="姓名"
          min-width="12%"
          :resizable="false"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          min-width="12%"
          :resizable="false"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lateDay"
          label="迟到天数"
          min-width="12%"
          :resizable="false"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lateTimeSum"
          label="累计迟到时长"
          min-width="12%"
          :resizable="false"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="op"
          label="考勤明细"
          min-width="12%"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            <router-link :to="{ name: 'MonthlyDetail',
                query: {
                  date: search.date ? $moment(search.date).format('YYYY-MM') : $moment(new Date()).format('YYYY-MM'),
                  name: scope.row.name ? scope.row.name : '',
                  uId: scope.row.uId ? scope.row.uId : ''
                }}">
              <el-button
                type="text"
                size="small"
              >详情</el-button>
            </router-link>
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
  <router-view v-else></router-view>
</template>
<script>
import { getAttendanceMonthReport, getAttendanceNameOptions } from '@/api/attendance'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      keepAlive: false,
      imgSrc: '',
      imgWidth: '',
      imgHeight: '',
      bigPicture: false,
      items: [],
      search: {
        date: new Date(),
        name: ''
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: false,
      filterOptions: null,
      employeesNames: [],
      token: getToken(),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
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
        sessionStorage.setItem('atmonthReport', this.scrollTop)
      }
    }
  },
  computed: {
    routeLevel() {
      return this.$route.matched.length
    }
  },
  updated() {
    document.querySelector('.el-main').scrollTop = 0
  },
  // activated() {
  //   this.init()
  // },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.keepAlive = vm.getKeeplive(from.query, from.name)
      vm.isUpdate()
    })
  },
  methods: {
    getKeeplive(query, name) {
      var arr = Object.getOwnPropertyNames(query)
      var keepAlive = true
      if (arr.length > 0) {
        keepAlive = name === 'MonthlyDetail'
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
    querySearch() {
      sessionStorage.removeItem('atmonthReport')
      this.page.currentPage = 1
      this.getAttendanceMonthReport()
    },
    init() {
      this.getAttendanceMonthReport()
      // this.getAttendanceNameOptions()
    },

    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    resetData() {
      sessionStorage.removeItem('atmonthReport')
      this.search = {
        date: new Date(),
        name: ''
      }
      this.page = {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    filterNames(query) {
      if (!query) {
        this.filterOptions = null
        return
      }
      this.filterOptions = this.employeesNames.filter((data, index) => {
        return data.name.includes(query)
      })
    },
    toDetail($index, row) {
      const { href } = this.$router.resolve({
        name: '打卡详情', query: {
          date: this.search.date ? this.$moment(this.search.date).format('YYYY-MM') : this.$moment(new Date()).format('YYYY-MM'),
          name: row.name ? row.name : '',
          uId: row.uId ? row.uId : ''
        }
      })
      window.open(href, '_blank')
    },
    getAttendanceMonthReport() {
      this.loading = true
      const params = {
        name: this.search.name,
        date: this.search.date ? this.$moment(this.search.date).format('YYYY-MM') : this.$moment(new Date()).format('YYYY-MM'),
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getAttendanceMonthReport(params).then((res) => {
        this.loading = false
        this.items = res.data
        this.page.total = res.total
      })
    },
    getAttendanceNameOptions() {
      const params = {}
      getAttendanceNameOptions(params).then((res) => {
        this.employeesNames = res
      })
    },
    handlePageChange() {
      sessionStorage.removeItem('atmonthReport')
      this.getAttendanceMonthReport()
    },
    LookBigPicture(val) {
      this.imgSrc = val
      this.bigPicture = true
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    }
  }
}
</script>
<style>
.atmonthReport {
  height: 100%;
  overflow: auto;
}
</style>


