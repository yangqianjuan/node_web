<template>
  <div class="companionList">
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <span class="cond-name">选择门店</span>
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
        <span class="cond-name name">选择日期</span>
        <el-date-picker
          style="width:230px;"
          v-model="search.dateRange"
          type="daterange"
          align="right"
          size="mini"
          unlink-panels
          :clearable=false
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="searchQuery"
        ></el-date-picker>
      </div>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">结伴人群列表</span>
        <span class="table-tile-total">共{{page.total}}条</span>
        <a
          v-bind:href="exportCompanion"
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
          :data="items"
          row-key="id"
          fit
          v-loading="loading"
          style="width: 100%"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="date"
            label="日期"
            align="center"
            :resizable="false"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="sum"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="当日进店的总人数"
                placement="top"
              >
                <span type="text">进店总人数</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="singlePerson"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="单独一人进店的顾客人数"
                placement="top"
              >
                <span type="text">单人进店数</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manyPerson"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="结伴进店总人数"
                placement="top"
              >
                <span type="text">结伴进店人数</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manySum"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="结伴进入门店的组数"
                placement="top"
              >
                <span type="text">结伴总对数</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manyChildren"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="带儿童进店的对数（小于15岁的为儿童）"
                placement="top"
              >
                <span type="text">家庭结伴 <br />(有儿童)</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manyOther"
            label="op"
            align="center"
            :resizable="false"
            min-width="15%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="2个及以上异性（不含儿童）一起进店的对数（小于15岁的为儿童）"
                placement="top"
              >
                <span type="text">异性结伴 <br />(无儿童)</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manyWoman"
            label="op"
            align="center"
            :resizable="false"
            min-width="10%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="2个及以上的女性（不含儿童）一起进入门店的对数"
                placement="top"
              >
                <span type="text">女性结伴 <br />(无儿童)</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="manyMan"
            label="op"
            align="center"
            :resizable="false"
            min-width="10%"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <el-tooltip
                style="margin: 4px"
                effect="dark"
                content="2个及以上的男性（不含儿童）一起进入门店的对数"
                placement="top"
              >
                <span type="text">男性结伴 <br />(无儿童)</span>
              </el-tooltip>
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
</template>

<script>
import Pagination from '@/components/Pagination'
import { getShopOption } from '@/api/statistics'
import { getToken } from '@/utils/auth'
import { partnershipList } from '@/api/customer'
import { formatDate } from '@/utils/date'
export default {
  components: {
    Pagination
  },
  name: 'CompanionList',
  data() {
    return {
      search: {
        dateRange: [new Date(new Date().getTime() - 3600 * 24 * 7 * 1000), new Date(new Date().getTime() - 3600 * 24 * 1000)],
        storeId: ''
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date(new Date().getTime() - 3600 * 24 * 1000)
        }
      },
      items: [],
      loading: false,
      tree: [],
      storeOptions: [],
      token: getToken()
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
  computed: {
    exportCompanion: function () {
      const startDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : ''
      const endDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : ''
      this.search.storeId = this.search.storeId ? this.search.storeId : ''
      return process.env.BASE_API + `/partnership/list/export?token=${this.token}&storeId=${this.search.storeId}&startDate=${startDate}&endDate=${endDate}`
    }
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
      this.getShopOption()
      this.query()
    },
    getShopOption: function () {
      const params = {}
      getShopOption(params).then((res) => {
        this.storeOptions = res
        this.search.storeId = this.storeOptions[0].value ? this.storeOptions[0].value : ''
        this.query()
      })
    },
    reset: function () {
      this.search.storeId = ''
      this.search.dateRange = []
      this.searchQuery()
    },
    searchQuery() {
      const startDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : ''
      const endDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : ''
      this.search.storeId = this.search.storeId ? this.search.storeId : ''
      // 门店参数，日期参数，只要有一个为空就不请求接口
      if (this.search.storeId === '' || startDate === '' || endDate === '') {
        this.$message({
          message: '请选择门店名称和日期',
          type: 'warning'
        })
        this.items = []
        this.page.total = 0
      } else {
        this.page.currentPage = 1
        this.pageshow = false
        this.query()
        this.pageshow = true
      }
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.query()
    },

    query: function (val) {
      const params = {
        storeId: this.search.storeId ? this.search.storeId : '',
        startDate: this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : '',
        endDate: this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : '',
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      this.loading = true
      partnershipList(params).then((res) => {
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.items = res.data
      })
    }
  }
}
</script>

<style>
td.sum {
  background-color: #1e90ff;
}
</style>
