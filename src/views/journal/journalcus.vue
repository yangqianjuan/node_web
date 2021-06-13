<template>
  <div class="journalCus">
    <div id="journalCus">
      <div class="app-container">
        <div class="selectQuery">
          <span>
            <span class="cond-name">操作时间:</span>
            <el-date-picker
              v-model="search.startTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 140px;"
              size="mini"
              @change="searchQuery"
            >
            </el-date-picker>
            <span class="cond-name">到</span>
            <el-date-picker
              v-model="search.endTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              style="width: 140px;"
              size="mini"
              @change="searchQuery"
            >
            </el-date-picker>

          </span>
        </div>
        <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
          <el-table
            ref="journalcusTable"
            :data="items"
            row-key="id"
            fit
            v-loading="loading"
            style="width: 100%"
            size="small"
            class="table-box"
          >
            <el-table-column
              prop="operator"
              label="操作账号"
              align="center"
              :resizable="false"
              min-width="10%"
            ></el-table-column>
            <el-table-column
              prop="loginTime"
              label="登录时间"
              align="center"
              :resizable="false"
              min-width="14%"
            ></el-table-column>
            <el-table-column
              prop="opTime"
              label="操作时间"
              align="center"
              :resizable="false"
              min-width="14%"
            ></el-table-column>
            <el-table-column
              prop="modul"
              label="操作板块"
              align="center"
              :resizable="false"
              min-width="10%"
            ></el-table-column>
            <el-table-column
              prop="action"
              label="操作命令"
              align="center"
              :resizable="false"
              min-width="9%"
            ></el-table-column>
            <el-table-column
              prop="detail"
              label="具体信息"
              align="center"
              :resizable="false"
              min-width="25%"
            ></el-table-column>
            <el-table-column
              prop="ageGroup"
              label="操作结果"
              align="center"
              :resizable="false"
              min-width="8%"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.result === '1'">成功</template>
                <template v-else-if="scope.row.result === '0'">失败</template>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-if="pageshow && page.total>0"
            :total="page.total"
            :page.sync="page.currentPage"
            :limit.sync="page.pageSize"
            @pagination="handlePageChange"
            :size='10'
          ></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getJournalListCus } from '@/api/journal'
import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'CustomerLog',
  components: {
    Pagination
  },
  // activated() {
  //   this.init()
  // },
  mounted() {
    this.query(this.page.currentPage)
    bus.$on('formquery', (...args) => {
      this.query()
    })
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
      this.query()
    },
    select() {
      if (this.search.startTime !== '' && this.search.endTime !== '') {
        this.query(this.page.currentPage)
      }
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
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      getJournalListCus(params).then((res) => {
        this.loading = false
        this.page.total = res.total
        this.$nextTick(() => {
          this.items = res.data
        })
      })
    }
  },
  computed: {
    privilege() {
      return this.$store.getters.getPrivilege
    }
  },
  created() {
  },
  updated() {
    document.querySelector('.el-main').scrollTop = 0
  },
  data() {
    return {
      search: {
        startTime: this.$moment(new Date()).format('YYYY-MM-DD 00:00:00'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      token: getToken(),
      items: [],
      loading: true,
      scrollerHeight: 0
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.selectQuery {
  font-size: 0px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  background-color: #ffffff;
  // height: 60px;
  padding: 16px 20px;
  .cond-name {
    color: rgba(0, 0, 0, 0.65);
    padding: 0px 8px;
    margin: 0px;
    font-size: 14px;
    &:nth-child(1) {
      padding-left: 0px;
    }
  }
}
.search-container {
  padding: 16px 15px;
  margin-bottom: 0px;
}
.search-style {
  color: #4a4a4a;
  margin: 10px 30px 0 30px;
  line-height: 60px;
  font-size: 14px;
  display: inline-block;
}

.btnStyle :hover {
  /*text-decoration: underline;*/
  color: #7ea3fc;
  font-weight: normal;
}

.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}
</style>
