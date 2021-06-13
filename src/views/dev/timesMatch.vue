<template>
  <div class="manyTimes">
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <span class="cond-name">选择门店</span>
        <el-dropdown
          trigger="click"
          ref="formDrop"
        >
          <el-input
            v-model="search.store"
            placeholder="全部门店"
            size="mini"
            clearable
            style=""
            @clear="clearStore"
          ></el-input>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding: 0px;width: 300px;height: 300px">
              <el-scrollbar
                wrap-class="store-scrollbar-wrap"
                style="height: 100%"
              >
                <el-tree
                  ref="formTree"
                  :data="tree"
                  node-key="id"
                  :props="defaultProps"
                  highlight-current
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  default-expand-all
                  @node-click="handleNodeClick"
                >
                  <span
                    class="custom-tree-node"
                    slot-scope="{ node, data }"
                  >
                    <svg-icon :icon-class="data.type === 2 ? 'shop' : 'tree'" />
                    <span style="margin-left: 5px">{{ data.label }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="cond-name name">选择日期</span>
        <el-date-picker
          @change="handleDateChange"
          style="width:240px;"
          v-model="search.dateRange"
          type="daterange"
          align="right"
          size="mini"
          unlink-panels
          :clearable=false
          range-separator="至"
          value-format='yyyy-MM-dd'
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">匹配人次列表</span>
        <span class="table-tile-total">共{{page.total}}条</span>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 200px); border-radius: 5px;">
        <el-table
          :data="tableData"
          style="width: 100%"
          size="small"
          class="table-box"
          v-loading="loading"
        >
          <el-table-column
            label="时间"
            prop="times"
            align="center"
          ></el-table-column>
          <el-table-column
            label="顾客ID"
            prop="customerId"
            align="center"
          ></el-table-column>
          <el-table-column
            label="头像"
            prop="img"
            align="center"
          >
            <template slot-scope="scope">
              <img
                :src="scope.row.img + '?token=' + token"
                v-if="scope.row.img.indexOf('http://') != -1"
                style="width: 78px;margin-top: 7px;cursor:pointer"
                @click="LookBigPicture(scope.row.img + '?token=' + token)"
              >
              <img
                :src="'http://' + scope.row.img + '?token=' + token"
                v-else
                style="width: 78px;margin-top: 7px;cursor:pointer"
                @click="LookBigPicture(scope.row.img + '?token=' + token)"
              >
            </template>
          </el-table-column>
          <div class="table-suffix-bars"></div>
        </el-table>
        <pagination
          v-if="pageshow && page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="handlePageChange"
        ></pagination>
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
  </div>
</template>

<script type="text/javascript">
import { listPermissionTree } from '@/api/account'
import { formatDate } from '@/utils/date'
import { listTimesMatch } from '@/api/dev'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
export default {
  name: 'MatchTimes',
  components: {
    Pagination
  },
  computed: {
  },
  filters: {
  },
  data() {
    return {
      token: getToken(),
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      pageshow: true,
      search: {
        dateRange: [new Date(new Date().getTime() - 3600 * 24 * 1000), new Date()],
        startDate: formatDate(new Date(new Date().getTime() - 3600 * 24 * 1000), 'yyyy-MM-dd'),
        endDate: formatDate(new Date(), 'yyyy-MM-dd'),
        structId: '',
        store: ''
      },
      loading: false,
      tableData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      tree: [],
      bigPicture: false,
      imgWidth: '',
      imgHeight: '',
      imgSrc: ''
    }
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
      this.listTimesMatch()
      this.listPermissionTree()
    },
    handlePageChange() {
      this.listTimesMatch()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.listTimesMatch()
      this.$nextTick(() => {
        this.pageshow = true
      })
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
    handleDateChange() {
      this.search.startDate = this.search.dateRange[0]
      this.search.endDate = this.search.dateRange[1]
      this.listTimesMatch()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.listTimesMatch()
      })
    },
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.listTimesMatch()
      })
    },
    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.$nextTick(() => {
        this.$refs.formDrop.hide()
      })
      this.searchQuery()
    },
    listPermissionTree() {
      this.search.store = ''
      this.search.structId = ''
      listPermissionTree().then((res) => {
        this.tree = res
        this.search.structId = this.tree[0].id
        this.search.store = this.tree[0].label
      })
    },
    listTimesMatch: function () {
      this.loading = true
      const params = {
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        structId: this.search.structId,
        pageSize: this.page.pageSize,
        currentPage: this.page.currentPage
      }
      listTimesMatch(params).then((res) => {
        this.tableData = res.data
        this.page.total = res.total
        this.loading = false
        document.querySelector('.el-main').scrollTop = 0
      })
    }
  },
  created() {
  }
}
</script>

<style>
</style>

