<template>
  <div
    id="photosCompare"
    class="app-container"
    v-if="routeLevel<3"
  >
    <div class="photo-compare">
      <!--导航栏-->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="今日待审"
          name="pendding"
        >
          <!-- 搜索栏-->
          <el-row style="padding-bottom:10px;">
            <el-col
              :xs="24"
              :sm="24"
              :lg="12"
            >
              <span class="cond-name">选择门店：</span>
              <el-select
                v-model="search.capStoreId"
                filterable
                placeholder="全部"
                size="mini"
                clearable
                style="width:140px"
                @change="searchQuery"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                > </el-option>
              </el-select>
              <span class="cond-name name">
                <el-button
                  type="plain"
                  size="mini"
                  style="width: 90px;"
                  @click="sameCheckBatch"
                >批量相同</el-button>
                <el-button
                  type="plain"
                  size="mini"
                  style="width: 90px;"
                  @click="diffCheckBatch"
                >批量不同</el-button>
              </span>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :lg="12"
              align="right"
            >
              <p class="search-tips">核对对象为匹配分55-70的照片，今日未审完的照片系统将按照参数设置进行处理</p>
            </el-col>
          </el-row>
          <div class="table-container">
            <el-table
              ref="capImgTable"
              :data="capItems"
              fit
              v-loading="loading"
              @sort-change="getSortChange"
              @selection-change="handleSelectionChange"
              :row-key="getRowKey"
              size="small"
              class="table-box"
            >
              <el-table-column
                type="selection"
                prop="id"
              ></el-table-column>
              <el-table-column
                prop="currentPic"
                label="抓拍照"
                min-width="100px"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.currentPic + '?token=' + token"
                    @click="()=>{LookBigPicture(scope.row.currentPic, scope.row.basePic)}"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="basePic"
                label="底库照"
                min-width="100px"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.basePic + '?token=' + token"
                    @click="()=>{LookBigPicture(scope.row.currentPic,scope.row.basePic)}"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="userId"
                label="身份ID"
                min-width="100px"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="openCusDetail(scope.row)"
                    size="small"
                  >{{scope.row.userId}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="storeName"
                label="门店名称"
                min-width="120px"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="time"
                label="到店时间"
                min-width="130px"
                :resizable="false"
                sortable="photoCompare"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="matchScore"
                label="匹配分"
                min-width="70px"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                label="操作"
                :resizable="false"
                align="center"
                min-width="100px"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="checkImage(scope.row, '1')"
                    size="small"
                  >相同</el-button>
                  <el-button
                    type="text"
                    @click="checkImage(scope.row, '2')"
                    size="small"
                  >不同</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-if="capPage.total>0"
              :total="capPage.total"
              :page.sync="capPage.currentPage"
              :limit.sync="capPage.pageSize"
              @pagination="handlePageChange"
            ></pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="已审记录"
          name="approved"
        >
          <!-- 搜索栏-->
          <div style="padding-bottom:10px;">
            <span class="cond-name">选择门店：</span>
            <el-select
              v-model="search.cheStoreId"
              filterable
              placeholder="全部"
              size="mini"
              clearable
              style="width:140px"
              @change="searchQuery"
            >
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              > </el-option>
            </el-select>
            <span class="cond-name name">审核时间:</span>
            <el-date-picker
              v-model="search.startDate"
              type="date"
              size="mini"
              :clearable="false"
              placeholder="开始时间"
              :picker-options="startDateOpt"
              @change="handleStartDateChange"
            >
            </el-date-picker>
            <span class="cond-name">到</span>
            <el-date-picker
              v-model="search.endDate"
              type="date"
              size="mini"
              :clearable="false"
              placeholder="结束时间"
              :picker-options="endDateOpt"
              @change="handleEndDateChange"
            >
            </el-date-picker>
            <span class="cond-name name">审核结果：</span>
            <el-select
              v-model="search.checkedResult"
              filterable
              placeholder="全部"
              size="mini"
              clearable
              style="width:140px"
              @change="searchQuery"
            >
              <el-option
                v-for="item in checkList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              > </el-option>
            </el-select>
          </div>
          <div class="table-container">
            <el-table
              ref="baseImgTable"
              :data="checkedItems"
              fit
              v-loading="loading"
              @sort-change="getSortChange"
              size="small"
              class="table-box"
            >
              <el-table-column
                prop="currentPic"
                label="抓拍照"
                min-width="12%"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.currentPic + '?token=' + token"
                    @click="()=>{LookBigPicture(scope.row.currentPic,scope.row.basePic)}"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="basePic"
                label="底库照"
                min-width="12%"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.basePic + '?token=' + token"
                    @click="()=>{LookBigPicture(scope.row.currentPic,scope.row.basePic)}"
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="userId"
                label="身份ID"
                min-width="18%"
                :resizable="false"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="openCusDetail(scope.row)"
                    size="small"
                  >{{scope.row.userId}}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="storeName"
                label="门店名称"
                min-width="20%"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="time"
                label="到店时间"
                min-width="18%"
                :resizable="false"
                sortable="photoCompare"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="matchScore"
                label="匹配分"
                min-width="18%"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="checkedResult"
                label="审核结果"
                min-width="18%"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="checkedPerson"
                label="审核人"
                min-width="18%"
                :resizable="false"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="checkedTime"
                label="审核时间"
                min-width="18%"
                :resizable="false"
                sortable="photoCompare"
                align="center"
              ></el-table-column>
            </el-table>
            <pagination
              v-if="checkedPage.total>0"
              :total="checkedPage.total"
              :page.sync="checkedPage.currentPage"
              :limit.sync="checkedPage.pageSize"
              @pagination="handlePageChange"
            ></pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template>
        <el-dialog
          :visible.sync="bigPicture"
          :show-close="false"
          class="bigPicture"
        >
          <el-row class='big-img-container'>
            <el-col
              :xs="24"
              :sm="24"
              :lg="12"
              align="right"
            >
              <div class="div1">
                <span class="span1">抓拍照</span>
                <img
                  :src="this.baseImgSrc"
                  class="img1"
                />
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :lg="12"
            >
              <div class="div1">
                <span class="span1">底库照</span>
                <img
                  :src="this.capImgSrc"
                  class="img1"
                />
              </div>
            </el-col>
          </el-row>
        </el-dialog>
      </template>
    </div>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import { getStoreOption } from '@/api/customer'
import { getCapList, getCheckedList, checkPic, batchCheckPic } from '@/api/dev'
import { formatDate, getPreNday } from '@/utils/date'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
export default {
  name: 'PhotosCompare',
  components: {
    Pagination
  },
  data() {
    return {
      activeName: 'pendding',
      storeList: [],
      search: {
        startDate: getPreNday(6),
        endDate: getPreNday(0),
        capStoreId: '',
        cheStoreId: '',
        checkedResult: ''
      },
      capPage: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      checkedPage: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      approvedPage: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      loading: false,
      sort: 'desc',
      sortFiled: 'time',
      capItems: [],
      checkedItems: [],
      token: getToken(),
      capImgSrc: '',
      baseImgSrc: '',
      bigPicture: false,
      selectedUser: [],
      checkList: [
        { label: '全部', value: '' },
        { label: '相同', value: '1' },
        { label: '不同', value: '2' }
      ],
      keepAlive: false,
      getRowKey(row) {
        return row.id
      },
      endDateOpt: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          var millisecond = 1000 * 60 * 60 * 24
          const date = formatDate(new Date(new Date(this.search.startDate).getTime() - millisecond), 'yyyy-MM-dd')
          return time.getTime() < new Date(date) || time.getTime() > new Date()
        }
      },
      startDateOpt: {
        firstDayOfWeek: 1,
        disabledDate: (time) => {
          return time.getTime() > new Date(this.search.endDate)
        }
      }
    }
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('photosCompare', this.scrollTop)
      }
    }
  },
  computed: {
    routeLevel() {
      return this.$route.matched.length
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
        keepAlive = name === 'CustomerDetail'
      } else {
        keepAlive = false
      }
      return keepAlive
    },
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    isUpdate() {
      if (this.keepAlive === false) {
        this.capPage.currentPage = 1
        this.checkedPage.currentPage = 1
      }
      this.init()
    },
    getStoreOption() {
      getStoreOption().then(res => {
        this.storeList = res
      })
    },
    init() {
      this.getStoreOption()
      this.loadData()
    },
    loadData() {
      switch (this.activeName) {
        case 'pendding':
          this.getCapList()
          break
        case 'approved':
          this.getCheckedList()
          break
        default:
          break
      }
    },
    handleStartDateChange() {
      this.search.startDate = formatDate(new Date(this.search.startDate), 'yyyy-MM-dd')
      this.searchQuery()
    },
    handleEndDateChange() {
      this.search.endDate = formatDate(new Date(this.search.endDate), 'yyyy-MM-dd')
      this.searchQuery()
    },
    getCapList() {
      const params = {
        storeId: this.search.capStoreId,
        sort: this.sort,
        sortFiled: this.sortFiled,
        page: this.capPage.currentPage,
        size: this.capPage.pageSize
      }
      getCapList(params).then((res) => {
        this.capItems = res.data
        this.capPage.total = res.total
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('photosCompare') || 0
      })
    },
    getCheckedList() {
      const params = {
        storeId: this.search.cheStoreId,
        startDate: this.search.startDate,
        endDate: this.search.endDate,
        checkedResult: this.search.checkedResult,
        sort: this.sort,
        sortFiled: this.sortFiled,
        page: this.checkedPage.currentPage,
        size: this.checkedPage.pageSize
      }
      getCheckedList(params).then((res) => {
        this.checkedItems = res.data
        this.checkedPage.total = res.total
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('photosCompare') || 0
      })
    },
    searchQuery() {
      sessionStorage.removeItem('photosCompare')
      switch (this.activeName) {
        case 'pendding':
          this.capPage.currentPage = 1
          this.getCapList()
          break
        case 'approved':
          this.checkedPage.currentPage = 1
          this.getCheckedList()
          break
        default:
          break
      }
    },
    handlePageChange() {
      sessionStorage.removeItem('list')
      this.loadData()
    },
    // getSortChange方法表示每次点击排序按钮触发该事件，参数column表示每次点击的排序条件及规则
    getSortChange(column) {
      this.sortFiled = column.prop
      this.sort = column.order === 'descending' ? 'desc' : 'asc'
      this.searchQuery()
    },
    handleSelectionChange(selection) {
      this.selectedUser = selection
    },
    selectRows() {
      this.selectedUser.forEach(row => this.$refs.capImgTable.toggleRowSelection(row, true))
    },
    checkImage(row, type) {
      this.$confirm('确定抓拍照与底库照是' + (type === '1' ? '相同' : '不同') + '的人？', {
        showClose: false,
        confirmButtonText: '确定' + (type === '1' ? '相同' : '不同'),
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id,
          checkedResult: type
        }
        checkPic(params).then((res) => {
          if (Number(res.msgCode) === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.loadData()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
    },
    sameCheckBatch() {
      const resultType = '1'
      this.batchCheckPic(resultType)
    },
    diffCheckBatch() {
      const resultType = '2'
      this.batchCheckPic(resultType)
    },
    batchCheckPic(type) {
      if (this.selectedUser.length < 1) {
        this.$message({
          message: '请先选择选项',
          type: 'warning'
        })
        return
      }
      const userIds = []
      this.selectedUser.forEach(s => {
        if (userIds.indexOf(s.id) < 0) {
          userIds.push(s.id)
        }
      })
      this.$confirm('确定抓拍照与底库照是' + (type === '1' ? '相同' : '不同') + '的人？', {
        showClose: false,
        confirmButtonText: '确定' + (type === '1' ? '相同' : '不同'),
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          ids: userIds,
          checkedResult: type
        }
        batchCheckPic(params).then((res) => {
          if (Number(res.msgCode) === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.loadData()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
    },
    openCusDetail(row) {
      const startDate = this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
      const endDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.$router.push({
        path: '/cr/customer/photosCompare/detail',
        query: { startDate: startDate, endDate: endDate, userId: row.userId, storeId: row.storeId }
      })
    },
    handleClick(tab, event) {
      this.activeName = tab.name
      this.loadData()
    },
    LookBigPicture(capVal, baseVal, id) {
      this.capImgSrc = capVal + '?token=' + this.token
      this.baseImgSrc = baseVal + '?token=' + this.token
      this.bigPicture = true
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.photo-compare {
  background-color: #ffffff;
  padding: 0 20px 14px;
  font-size: 14px;
  min-height: calc(100vh - 84px);
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: 400;
  .search-tips {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 12px;
  }

  .table-container {
    padding-bottom: 10px;
  }

  .big-img-container {
    align-items: center;
  }

  /*div1下面 包含着1个图片和1段文字*/
  .div1 {
    position: relative; /*相对定位*/
    width: 400px;
    height: 450px;
    margin-right: 20px;
  }
  /*图片部分的设置*/
  .img1 {
    /*position: static;默认定位,可以省略*/
    width: 100%;
    height: 100%;
  }
  /*文字的设置*/
  .span1 {
    position: absolute; /*绝对定位*/
    width: 100%;
    height: 40px;
    bottom: 0px; /*离底下0像素*/
    left: 0px; /*离左边0像素*/
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 40px;
    vertical-align: middle;
    background: rgba(0, 0, 0, 0.8);
    font-family: PingFangSC, Microsoft YaHei;
    color: rgba(255, 255, 255, 1);
  }
}
</style>
