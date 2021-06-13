<template>
  <div>
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
          <span class="cond-name">考勤日期:</span>
          <el-date-picker
            v-model="search.date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            size="mini"
            :clearable="false"
            :picker-options="pickerOptions"
            @change="searchQuery"
          >
          </el-date-picker>
          <span class="cond-name">考勤状态:</span>
          <el-select
            v-model="search.status"
            placeholder="全部"
            size="mini"
            clearable
            @change="searchQuery"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="cond-name">姓名:</span>
          <el-input
            v-model="search.name"
            @keyup.enter.native="searchQuery"
            placeholder="全部"
            style="width: 200px;"
            size="small"
            clearable
            @clear="searchQuery"
          ></el-input>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
          align="right"
        >
          <el-button
            @click="searchQuery"
            type="primary"
            plain
            style=" width: 80px;"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div
      class="table-prefix-bars"
      style="margin-top: 10px;"
    >
      <span class="table-tile">每日统计表</span><span class="table-tile-total">共{{page.total}}人</span><span class="table-tile-total">（每个工作日12点准时发送当日统计表邮件）</span>
      <span style="color: #1890ff; font-size: 14px; margin-right: 20px; float: right;">考勤时间：9:30:00</span>
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
          prop="workTime"
          label="打卡时间"
          min-width="12%"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status === '迟到'"
              style="color: red"
            >{{scope.row.workTime}}</span>
            <span v-else-if="scope.row.status === '正常'">{{scope.row.workTime}}</span>
            <span v-else>/</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="考勤状态"
          min-width="12%"
          :resizable="false"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status === '迟到'"
              style="color: red"
            >{{scope.row.status}}&nbsp;({{scope.row.lateTime}})</span>
            <span v-else>{{scope.row.status}}</span>
            <br v-if="scope.row.status === '迟到'">
            <el-button
              v-if="scope.row.status === '迟到' && scope.row.emailWarn === '0'"
              type="text"
              size="small"
              @click="sendLateEmail(scope.row)"
              :disabled="scope.row.email === undefined || scope.row.email === ''"
            >发送邮件</el-button>
            <el-button
              v-if="scope.row.status === '迟到' && scope.row.emailWarn === '1'"
              type="text"
              size="small"
              disabled
            >发送成功</el-button>
            <el-button
              v-if="scope.row.status === '迟到' && scope.row.emailWarn === '2'"
              type="text"
              size="small"
              disabled
            >发送失败</el-button>
            <el-button
              v-if="scope.row.status === '迟到' && scope.row.emailWarn === '2'"
              type="text"
              size="small"
              @click="sendLateEmail(scope.row)"
              :disabled="scope.row.email === undefined || scope.row.email === ''"
            >重发</el-button>
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
</template>
<script>
import { sendLateEmail, getAttendanceDayReport, getAttendanceNameOptions } from '@/api/attendance'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      imgSrc: '',
      imgWidth: '',
      imgHeight: '',
      bigPicture: false,
      items: [],
      search: {
        date: new Date(),
        status: 0,
        name: ''
      },
      statusOptions: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '迟到'
        },
        {
          value: 3,
          label: '无记录'
        }
      ],
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
  updated() {
    document.querySelector('.el-main').scrollTop = 0
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
      this.getAttendanceDayReport()
      // this.getAttendanceNameOptions()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.getAttendanceDayReport()
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
    sendLateEmail(row) {
      const params = {
        email: row.email,
        lateTime: row.lateTime,
        workTime: row.workTime,
        date: row.date,
        uId: row.uId
      }
      sendLateEmail(params).then((res) => {
        if (res === 'success') {
          this.$message.success('邮件发送成功')
        } else if (res === 'fail') {
          this.$message.error('邮件发送失败，请重试')
        }
        this.getAttendanceDayReport()
      })
    },
    getAttendanceDayReport() {
      this.loading = true
      //  this.page.currentPage=1
      const params = {
        name: this.search.name,
        status: this.search.status,
        date: this.search.date ? this.$moment(this.search.date).format('YYYY-MM-DD') : this.$moment(new Date()).format('YYYY-MM-DD'),
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getAttendanceDayReport(params).then((res) => {
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
      document.querySelector('.el-main').scrollTop = 0
      this.getAttendanceDayReport()
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
</style>
