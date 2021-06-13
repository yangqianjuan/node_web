<template>
  <div class="app-container">
    <div class="search-container">
      <span class="cond-name">操作时间
        <el-date-picker
          v-model="search.startTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 200px;"
          size="small"
          @change="searchQuery"
        >
        </el-date-picker>
        <span style="margin-left: 10px;margin-right: 10px">至</span>
        <el-date-picker
          v-model="search.endTime"
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 200px;"
          size="small"
          @change="searchQuery"
        >
        </el-date-picker>
      </span>
      <span class="cond-name">操作品牌
        <el-select
          v-model="operateBrand"
          filterable
          placeholder="请选择"
          size="mini"
          clearable
          @change="changeBrandResult"
        >
          <el-option
            v-for="item in operateBrandList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
      </span>
      <span class="cond-name">操作板块
        <el-select
          v-model="operateMode"
          filterable
          placeholder="请选择"
          size="mini"
          clearable
          @change="changeModelResult"
        >
          <el-option
            v-for="item in operateModeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
      </span>
      <span class="cond-name">操作命令
        <el-select
          v-model="operateAction"
          filterable
          placeholder="请选择"
          size="mini"
          clearable
          @change="changeActionResult"
        >
          <el-option
            v-for="item in operateActionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
      </span>
    </div>

    <div
      class="table-prefix-bars"
      style="margin-top: 10px;"
    >
      <span class="table-tile">操作日志列表</span><span class="table-tile-total">共{{page.total}}条</span>
    </div>
    <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
      <el-table
        ref="joutnalxmTable"
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
          label="用户名"
          align="center"
          :resizable="false"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          prop="loginTime"
          label="登录时间"
          align="center"
          :resizable="false"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          prop="opTime"
          label="操作时间"
          align="center"
          :resizable="false"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          prop="brandName"
          label="操作品牌"
          align="center"
          :resizable="false"
          min-width="8%"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.brandName === undefined">小萌科技</template>
            <template v-else>{{scope.row.brandName}}</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="modul"
          label="操作板块"
          align="center"
          :resizable="false"
          min-width="8%"
        ></el-table-column>
        <el-table-column
          prop="action"
          label="操作命令"
          align="center"
          :resizable="false"
          min-width="8%"
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
          min-width="7%"
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
      ></pagination>
    </div>
  </div>
</template>

<script>
import { getJournalListXm, getJournalBrandOption, getJournalModelOption, getJournalActionOption } from '@/api/journal'
// import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'LogXiaomeng',
  components: {
    Pagination
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
      this.getJournalBrandOption()
      this.getJournalModelOption()
      this.getJournalActionOption()
      this.query()
    },
    changeBrandResult(val) {
      this.operateBrand = val
      this.query()
    },
    changeModelResult(val) {
      this.operateMode = val
      this.operateAction = ''
      this.getJournalActionOption(val)
      this.query()
    },
    changeActionResult(val) {
      this.operateAction = val
      this.query()
    },
    getJournalBrandOption() {
      getJournalBrandOption({}).then(res => {
        this.operateBrandList = res
      })
    },
    getJournalModelOption() {
      getJournalModelOption({}).then(res => {
        this.operateModeList = res
      })
    },
    getJournalActionOption(val = '') {
      getJournalActionOption({ model: val }).then(res => {
        this.operateActionList = res
      })
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
      // if (!val || typeof val === 'object') {
      //   this.page.total = 0
      //   this.page.currentPage = 1
      // }
      const params = {
        startTime: this.search.startTime,
        endTime: this.search.endTime,
        page: this.page.currentPage,
        size: this.page.pageSize,
        brandId: this.operateBrand,
        model: this.operateMode,
        action: this.operateAction
      }
      getJournalListXm(params).then((res) => {
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
      operateBrand: '',
      operateBrandList: [],
      operateMode: '',
      operateModeList: [],
      operateAction: '',
      operateActionList: [],
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

<style  rel="stylesheet/scss" lang="scss" scoped>
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
.cond-name {
  line-height: 45px;
}
.cond-name:nth-last-child(1),
.cond-name:nth-last-child(2),
.cond-name:nth-last-child(3) {
  width: 246px;
  margin-right: 0px;
}
</style>
