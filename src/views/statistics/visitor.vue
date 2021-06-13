<template>
  <div
    class="visitor"
    ref="visitorBox"
  >
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <span class="cond-name">门店名称</span>
        <el-select
          @change="searchQuery"
          v-model="search.store"
          filterable
          placeholder="请选择"
          size="mini"
          clearable
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
          @change="searchQuery"
          v-model="search.camera"
          filterable
          placeholder="请选择"
          size="mini"
          clearable
        >
          <el-option
            v-for="item in cameraOptions"
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
        <!-- <el-button @click="reset" plain style="float: right; width: 80px;height: 30px; margin:8px 10px 0 30px" size="small">重置</el-button> -->
        <!-- <el-button @click="query" type="primary" plain style="float: right; width: 80px;height: 30px; margin:8px 10px 0 0" size="small">搜索</el-button> -->
      </div>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">顾客人数列表</span><span class="table-tile-total">共{{page.total}}条</span>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
        <el-table
          ref="visitorTable"
          :data="items"
          fit
          v-loading="loading"
          style="width: 100%"
          size="small"
          class="table-box"
          @sort-change="tableSearchStatisticTable"
        >
          <el-table-column
            prop="img"
            label="顾客头像"
            min-width="10%"
            :resizable="false"
            align="center"
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
            prop="userId"
            label="顾客ID"
            align="center"
            :resizable="false"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            align="center"
            :resizable="false"
            min-width="10%"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.gender === '1'">男</template>
              <template v-else-if="scope.row.gender === '0'">女</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄"
            align="center"
            :resizable="false"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="storeName"
            label="门店名称"
            align="center"
            :resizable="false"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="camera"
            label="摄像头"
            align="center"
            :resizable="false"
            min-width="10%"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="最近一次到店时间"
            align="center"
            :resizable="false"
            min-width="20%"
          ></el-table-column>
          <el-table-column
            prop="count"
            label="到店次数"
            align="center"
            :resizable="false"
            min-width="10%"
            sortable="custom"
          >
            <!-- <template slot-scope="scope">
              <router-link :to="{ path: '/dev/statistics/visitRecord', query: { userId: scope.row.id,name:scope.row.userId, camera: scope.row.cameraId, store: scope.row.storeId, date: scope.row.date }}">
                <a class="btnStyle">{{scope.row.count}}</a>
              </router-link>
            </template> -->
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

<script>
import { getPeopleList } from '@/api/statistics'
import { fetchCamera, fetchStore } from '@/api/dictionary'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'VisitorNum',
  components: {
    Pagination
  },
  data() {
    return {
      search: {
        dateRange: [],
        store: '',
        camera: ''
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
      flag: 0,
      token: '',
      imgSrc: '',
      sortField: '',
      sortOrder: '',
      cameraTitle: '',
      storeTitle: '',
      cameraOptions: [],
      storeOptions: [],
      displaySearch: true,
      items: [],
      loading: true,
      bigPicture: false,
      imgWidth: '',
      imgHeight: ''
    }
  },
  created() {
    this.routerQuery()
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
    routerQuery() {
      this.search.store = parseInt(this.$route.query.store) || ''
      this.search.camera = parseInt(this.$route.query.camera) || ''
      if (this.$route.query.date === '' || this.$route.query.date === undefined) {
        this.search.dateRange = []
      } else {
        this.search.dateRange[0] = this.$route.query.date
        this.search.dateRange[1] = this.$route.query.date
        this.flag = 1
      }
    },
    init() {
      sessionStorage.removeItem('visitor')
      this.token = getToken()
      this.query()
      this.fetchCamera()
      this.fetchStore()
      setTimeout(() => {
        if (this.search.store === '' || this.search.store === undefined) {
          return
        } else {
          this.getStoreTitle(this.search.store)
        }
        if (this.search.camera === '' || this.search.camera === undefined) {
          return
        } else {
          this.getCameraTitle(this.search.camera)
        }
      }, 1000)
    },
    resetData() {
      this.search = { dateRange: [], period: '', camera: '', store: '', sortOrder: '' }
      this.page = {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
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
    tableSearchStatisticTable(props) {
      const { column, prop, order } = props
      if (!column && !prop && !order) return
      const os = {
        descending: 'desc',
        ascending: 'asc'
      }
      this.sortField = prop
      this.sortOrder = os[order]
      this.searchQuery()
    },
    reset() {
      // if (process.env.BASE_API === 'http://test.store.xmartmonkey.com/manage/') {
      //   this.search.store = 46
      //   this.search.dateRange = [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      // } else {
      this.search.store = ''
      this.search.dateRange = []
      // }
      this.search.camera = ''
      this.searchQuery()
    },
    getCameraTitle(val) {
      let obj = {}
      obj = this.cameraOptions.find((item) => {
        return item.value === val
      })
      this.cameraTitle = obj.name
    },
    getStoreTitle(val) {
      let obj = {}
      obj = this.storeOptions.find((item) => {
        return item.value === val
      })
      this.storeTitle = obj.name
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
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.query()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      this.$refs.visitorBox.scrollTop = 0
      this.query()
    },
    query: function (val) {
      // if (process.env.BASE_API === 'http://test.store.xmartmonkey.com/manage/' && this.flag === 0) {
      //   this.search.store = 46
      //   this.search.dateRange = [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
      // }
      this.loading = true
      const params = {
        startDate: this.search.dateRange ? this.search.dateRange[0] : '',
        endDate: this.search.dateRange ? this.search.dateRange[1] : '',
        cameraId: this.search.camera,
        store: this.search.store,
        sort: this.sortOrder,
        sortField: this.sortField,
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      getPeopleList(params).then((res) => {
        this.flag = 1
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.$nextTick(() => {
          this.items = res.data
        })
        this.$refs.visitorBox.scrollTop = 0
      })
    }
  }
}
</script>

<style>
.visitor {
  height: 100%;
  overflow: auto;
}
.btnStyle {
  /*text-decoration: underline;*/
  color: #1890ff;
  font-weight: normal;
}

.btnStyle :hover {
  /*text-decoration: underline;*/
  color: #7ea3fc;
  font-weight: normal;
}
</style>
