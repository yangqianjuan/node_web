<template>
  <div
    class="visitCount"
    ref="visitCountBox"
  >
    <div class="search-container">
      <span class="cond-name">门店名称</span>
      <el-select
        filterable
        clearable
        v-model="search.storeId"
        placeholder="请选择"
        size="mini"
        @change="searchQuery"
      >
        <el-option
          v-for="item in storeOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        > </el-option>
      </el-select>

      <span class="cond-name">摄像头</span>
      <el-select
        filterable
        clearable
        v-model="search.cameraId"
        placeholder="请选择"
        size="mini"
        @change="searchQuery"
      >
        <el-option
          v-for="item in cameraOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        > </el-option>
      </el-select>

      <span class="cond-name">时段</span>
      <el-select
        clearable
        v-model="search.period"
        placeholder="请选择"
        size="mini"
        @change="searchQuery"
      >
        <el-option
          v-for="item in periodOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        > </el-option>
      </el-select>
      <span class="cond-name">选择日期</span>
      <el-date-picker
        style="width:230px;"
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
        @change="searchQuery"
      >
      </el-date-picker>
    </div>
    <div
      class="table-prefix-bars"
      style="margin-top: 10px;"
    >
      <span class="table-tile">顾客统计列表</span><span class="table-tile-total">共{{page.total}}条</span>
    </div>
    <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
      <el-table
        :data="items"
        row-key="id"
        fit
        v-loading="loading"
        :default-expand-all="true"
        size="small"
        :row-style="tableRowStyle"
        class="table-box"
      >
        <el-table-column
          align="right"
          width="40px"
          type="expand"
        >
          <template slot-scope="scope">
            <el-table
              :data="scope.row.details"
              :border="false"
              size="mini"
              :show-header="false"
            >
              <el-table-column
                prop="period"
                align="left"
                label="日期"
                width="180.8px"
              >
                <template slot-scope="scope">
                  <template v-for="item in periodOptions">
                    <template v-if="parseInt(item.value) === scope.row.period"><span style="margin-left: 10px">{{item.name}}</span></template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="storeId"
                align="center"
                label="门店名称"
                min-width="12%"
              >
                <template slot-scope="scope">
                  <template v-for="item in storeOptions">
                    <template v-if="parseInt(item.value) === scope.row.storeId"><span style="margin-left: 5px">{{item.name}}</span></template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="cameraId"
                align="center"
                label="摄像头"
                min-width="12%"
              >
                <template slot-scope="scope">
                  <template v-for="item in cameraOptions">
                    <template v-if="parseInt(item.value) === parseInt(scope.row.cameraId)"><span style="margin-left: 5px">{{item.name}}</span></template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="all"
                align="center"
                label="进店总人次(去重前)"
                min-width="8.5%"
              ></el-table-column>
              <el-table-column
                prop="total"
                align="center"
                label="进店总人次(去重后)"
                min-width="8.5%"
              ></el-table-column>
              <el-table-column
                prop="confirm"
                align="center"
                label="可识别人次"
                min-width="8.5%"
              ></el-table-column>
              <el-table-column
                prop="unconfirmed"
                align="center"
                label="不可识别人次"
                min-width="10%"
              ></el-table-column>
              <el-table-column
                prop="personTime"
                align="center"
                label="可识别人数"
                min-width="8.5%"
              ></el-table-column>
              <el-table-column
                prop="oneTimes"
                align="center"
                label="1次识别人数"
                min-width="9%"
              ></el-table-column>
              <el-table-column
                prop="times"
                align="center"
                label="多次识别人数"
                min-width="10%"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          align="left"
          label="日期"
          width="140px"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeId"
          align="center"
          label="门店名称"
          min-width="12%"
        >
          <template slot-scope="scope">
            <template v-for="item in storeOptions">
              <template v-if="parseInt(item.value) === scope.row.storeId"><span style="margin-left: 5px">{{item.name}}</span></template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="cameraId"
          align="center"
          label="摄像头"
          min-width="12%"
        >
          <template slot-scope="scope">
            <template v-for="item in cameraOptions">
              <template v-if="parseInt(item.value) === parseInt(scope.row.cameraId)"><span style="margin-left: 5px">{{item.name}}</span></template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="all"
          align="center"
          label="进店总人次(去重前)"
          min-width="8.5%"
        ></el-table-column>
        <el-table-column
          prop="total"
          align="center"
          label="进店总人次(去重后)"
          min-width="8.5%"
        ></el-table-column>
        <el-table-column
          prop="confirm"
          align="center"
          label="可识别人次"
          min-width="8.5%"
        >
        </el-table-column>
        <el-table-column
          prop="unconfirmed"
          align="center"
          label="不可识别人次"
          min-width="10%"
        >
        </el-table-column>
        <el-table-column
          prop="personTime"
          align="center"
          label="可识别人数"
          min-width="8.5%"
        >
        </el-table-column>
        <el-table-column
          prop="oneTimes"
          align="center"
          label="1次识别人数"
          min-width="9%"
        ></el-table-column>
        <el-table-column
          prop="times"
          align="center"
          label="多次识别人数"
          min-width="10%"
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
  </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { log } from '@/utils/index'
import { listVisitCount } from '@/api/statistics'
import { fetchDictionary, fetchCamera, fetchStore } from '@/api/dictionary'
import Pagination from '@/components/Pagination'

export default {
  name: 'VisitCount',
  components: {
    Pagination
  },
  data() {
    return {
      showpagination: false,
      displaySearch: true,
      entexpands: [],
      loading: true,
      items: [],
      search: {
        dateRange: [],
        storeName: ''
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      periodOptions: [],
      cameraOptions: [],
      storeOptions: [],
      timeOptions: ['00:00:01 - 10:00:00', '10:00:01 - 12:00:00', '12:00:01 - 14:00:00', '14:00:01 - 16:00:00',
        '16:00:01 - 18:00:00', '18:00:01 - 20:00:00', '20:00:01 - 22:00:00', '22:00:01 - 24:00:00'],
      timer: null
    }
  },
  mounted() {
    this.init()
  },
  // activated() {
  //   this.init()
  // },
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
    resetData() {
      this.search.dateRange = ''
      this.search.period = ''
      this.search.storeName = ''
      this.search.cameraId = ''
      this.search.storeId = ''
      this.page = {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    init() {
      sessionStorage.removeItem('visitCount')
      this.fetchDictionary()
      this.fetchCamera()
      this.fetchStore()
      this.fetchPageForBreadcrumb()
      this.token = getToken()
      this.listVisitCount()
    },
    fetchPageForBreadcrumb() {
      const { currpage, clicked } = this.$store.state.currpage
      if (clicked) {
        if (currpage.length > 0) {
          for (let i = 0; i < currpage.length; i++) {
            const c = currpage[i]
            if (c.name === this.$route.name || c.name === this.$route.meta.name) {
              this.$store.commit('deletePage', c.name)
              this.$store.commit('cancelClicked')
              this.page.currentPage = c.pageNum
              log('debug test beforeRouteEnter', this.page.currentPage, c)
            }
          }
        }
      }
    },
    getRowKeys(row) {
      return row.id
    },
    reset() {
      this.search.dateRange = ''
      this.search.period = ''
      this.search.storeName = ''
      this.search.cameraId = ''
      this.$message({
        message: '搜索条件已经重置.',
        type: 'success'
      })
      this.searchQuery()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.listVisitCount()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      this.$refs.visitCountBox.scrollTop = 0
      this.listVisitCount()
    },
    listVisitCount: function (val) {
      this.loading = true
      this.listVisitCountRec()
    },
    listVisitCountRec: function (val) {
      const params = {
        startDate: this.search.dateRange ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange ? this.search.dateRange[1] : '',
        period: this.search.period,
        storeName: this.search.storeName,
        cameraId: this.search.cameraId,
        storeId: this.search.storeId,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listVisitCount(params).then((res) => {
        this.loading = false
        if (!val) {
          this.items = []
        }
        this.page.total = res.total
        this.$nextTick(() => {
          this.items = res.data
        })
        this.entexpands = []
        this.items.forEach(d => {
          d.uid = d.id + d.cameraId
          this.entexpands.push(d.id)
        })
        this.$nextTick(() => {
          this.showpagination = true
        })
        // const _this = this
        // this.timer = setTimeout(() => {
        // _this.listVisitCountRec(true)
        // }, 10000)
      })
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['STATISTICS_PERIOD']
      }
      fetchDictionary(params).then((res) => {
        this.periodOptions = res.statisticsPeriod
      })
    },
    fetchCamera: function () {
      fetchCamera().then((res) => {
        this.cameraOptions = res
      })
    },
    fetchStore: function () {
      fetchStore().then((res) => {
        this.storeOptions = res
      })
    },
    // rowExpand(row) {
    //   row.id = row.id * -1
    //   if (this.entexpands.indexOf(row.uid * -1) < 0) {
    //     this.entexpands.push(row.uid)
    //   } else {
    //     this.entexpands.splice(this.entexpands.findIndex(id => id === row.uid), 1)
    //   }
    // },
    tableRowStyle({ row, rowIndex }) {
      return 'background-color: #f5f6fa'
    }
    // getRowClass(row, index) {
    //   const res = []
    //   if (!row.children) {
    //     res.push('row-expand-cover')
    //   }
    //   return res.join(' ')
    // }
  },
  beforeDestroy() {
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style>
.visitCount {
  height: 100%;
  overflow: auto;
}
.el-table__body {
  width: 100% !important;
}
.visitCount .el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}

.row-expand-cover .el-table__expand-column .el-icon {
  visibility: hidden;
}

.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}

.table-box .el-table--mini td,
.el-table--mini th {
  border-bottom-color: white;
  border-right-color: white;
  padding: 2px 0;
  /* font-size: 10px; */
}

.table-box .el-table--mini .el-table__empty-block {
  position: relative;
  min-height: 35.4px;
  text-align: center;
  width: 100%;
  height: 35.4px;
}
.table-box .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}

.el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}

.visit-count .table-box th:first-child {
  height: 50px;
  padding: 0px;
  font-size: 12px;
  background-color: #f5f6fa;
  font-weight: bolder;
}
</style>
