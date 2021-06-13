<template>
  <div
    id="staffManager"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <el-container>
        <el-main class="main_container">
          <el-collapse-transition>
            <div
              class="store-body"
              v-show="isShowStore"
            >
              <el-row class="filter-container">
                <el-row>
                  <el-col
                    :xs="24"
                    :sm="24"
                    :lg="12"
                    style="font-size:0px"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      style="vertical-align:middle"
                      @click="openAddAccountDialog"
                    >
                      新增子账号
                    </el-button>
                    <el-button
                      type="plain"
                      size="mini"
                      style="margin:0px 16px;vertical-align:middle"
                      :disabled="isAbleToDeleteStore"
                      @click="openDeleteDialog(selectedStore,2)"
                    >批量删除</el-button>
                    <el-select
                      v-model="search.name"
                      ref="nameSelect"
                      filterable
                      placeholder="全部角色"
                      size="mini"
                      clearable
                      class="filter-item"
                      style="width: 140px;"
                      @change="searchQuery"
                    >
                      <el-option
                        v-for="item in roleOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.value"
                      > </el-option>
                    </el-select>
                  </el-col>
                  <el-col
                    :xs="24"
                    :sm="24"
                    :lg="12"
                    align="right"
                  >
                    <el-input
                      placeholder="手机号/姓名"
                      v-model="search.smName"
                      class="input-with-select"
                      style="width:204px;height:28px;"
                      size="mini"
                      @keyup.enter.native='searchQuery'
                    >
                      <el-button
                        slot="append"
                        size="mini"
                        style="width:63px;height:28px;"
                        type="primary"
                        @click="searchQuery"
                      >搜索</el-button>
                    </el-input>
                  </el-col>
                </el-row>
              </el-row>
              <el-table
                ref="storeTable"
                :data="tableData"
                fit
                v-loading="loading"
                @selection-change="handleSelectionChange"
                :row-key="getRowKey"
                size="small"
                class="table-box"
              >
                <el-table-column
                  type="selection"
                  prop="id"
                  :selectable='isCanSelect'
                ></el-table-column>
                <el-table-column
                  prop="username"
                  label="手机号"
                  align="center"
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="姓名"
                  align="center"
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  prop="structName"
                  label="所属部门"
                  align="center"
                  :resizable="false"
                  width="212px"
                  tooltip-effect='light'
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名称"
                  align="center"
                  :resizable="false"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  :resizable="false"
                  align="center"
                >
                  <template
                    slot-scope="scope"
                    v-if="userId!==scope.row.id"
                  >
                    <el-button
                      type="text"
                      @click="openDeleteDialog([scope.row],1)"
                      size="small"
                    >删除</el-button>
                    <el-button
                      type="text"
                      @click="openEditStoreDialog(scope.row.id)"
                      size="small"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      @click=" openResetDialog(scope.row.id)"
                      size="small"
                    >重置密码</el-button>
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
          </el-collapse-transition>
          <el-collapse-transition>
          </el-collapse-transition>
        </el-main>
      </el-container>
    </div>
    <el-dialog
      :visible.sync="deleteDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确定删除{{deleteType===1?'该':`已选择的${deleteId.length}个`}}账号?</span></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="deleteDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="deleteAccount"
        >确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="resetDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog">
        <div><span class="el-icon-warning"></span><span class="confirmText">确定重置该账号密码?</span></div>
        <span style="display:inline-block;margin-left:50px">重置后,密码恢复成初始密码:88888888</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="resetDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="resetPassword"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
// import bus from '@/rootbus'
import { listAccount, deleteAccount, listRoleOptions, resetPassword } from '@/api/account'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  name: 'staffManager',
  data() {
    return {
      getRowKey(row) {
        return row.id
      },
      deleteType: -1,
      deleteDialog: false,
      deleteId: -1,
      resetId: -1,
      resetDialog: false,
      keepAlive: false,
      treeData: [],
      treeList: [],
      nameList: [],
      accountList: [],
      roleOptions: [],
      tableData: [],
      loading: false,
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      editStoreShow: false,
      isShowDevice: false,
      isShowStore: true,
      defaultSelectTree: 0,
      curTreeNode: {},
      newStruct: {},
      selectedStore: [],
      search: {},
      storeIdProp: '',
      storenNameProp: ''
    }
  },
  mounted() {
    if (this.routeLevel < 3) {
      this.init()
    }
    document.querySelector('.el-main').addEventListener('scroll', this.handelscroll)
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('staffManager', this.scrollTop)
      }
    }
  },
  computed: {
    privilege() {
      return this.$store.getters.getPrivilege
    },
    editPrivilege() {
      return this.$store.getters.getPrivilege.indexOf('门店编辑') > -1
    },
    isAbleToDeleteStore() {
      return this.selectedStore.length < 1
    },
    routeLevel() {
      return this.$route.matched.length
    },
    userId() {
      return +sessionStorage.getItem('userId')
    }
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
        keepAlive = name === 'addStaffManager' || 'editStaffManager'
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
    isCanSelect(row) {
      if (row.id === this.userId) {
        return false
      }
      return true
    },
    deleteAccount() {
      // const ids = this.selectedStore.map(item => { return item.id })
      // const Id = type === 1 ? [this.deleteId] : ids
      const params = {
        ids: this.deleteId
      }
      this.deleteDialog = false
      deleteAccount(params).then(res => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          if (this.deleteId.length > 1) {
            this.selectedStore = []
          } else {
            this.selectedStore = this.selectedStore.filter(item => {
              return item.id !== this.deleteId[0]
            })
          }
          this.listAccount()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    resetPassword() {
      this.resetDialog = false
      resetPassword({ usrId: this.resetId }).then(res => {
        if (res.msgCode === '200') {
          this.$message({
            message: '重置密码成功',
            type: 'success'
          })
          this.listAccount()
        } else {
          this.$message({
            message: '重置密码失败',
            type: 'error'
          })
        }
      })
    },
    listRoleOptions() {
      return listRoleOptions({ type: '' }).then(res => {
        this.roleOptions = res
      })
    },
    init() {
      Promise.all([this.listRoleOptions()]).then(res => {
        this.listAccount()
      })
    },
    resetData() {
      this.search = {}
      this.page = {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    },
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    reset: function () {
      this.search.name = ''
      this.search.smName = ''
      this.searchQuery()
    },
    searchQuery() {
      sessionStorage.removeItem('staffManager')
      this.page.currentPage = 1
      this.pageshow = false
      this.listAccount()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.listAccount()
    },
    listAccount: function (val) {
      this.loading = true
      const params = {
        roleId: this.search.name,
        retrieve: this.search.smName,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listAccount(params).then((res) => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.listAccount()
        }
        this.tableData = []
        this.page.total = res.total
        this.tableData = res.data.map(item => {
          item.roleName = this.roleOptions.find(it => {
            return item.roleId === it.value
          }) ? this.roleOptions.find(it => { return item.roleId === it.value }).name : ''
          return item
        })
        this.selectRows()
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('staffManager') || 0
      })
      this.loading = false
    },
    openAddAccountDialog() {
      this.$router.push({ path: '/sys/account/addStaffManager' })
    },
    openDeleteDialog(row, type) {
      this.deleteDialog = true
      this.deleteType = type
      this.deleteId = row.map(item => {
        return item.id
      })
    },
    openResetDialog(id) {
      this.resetDialog = true
      this.resetId = id
    },
    openEditStoreDialog(id) {
      this.$router.push({
        path: '/sys/account/editStaffManager',
        query: { id }
      })
    },
    handleSelectionChange(selection) {
      this.selectedStore = selection
    },
    selectRows() {
      this.selectedStore.forEach(row => this.$refs.storeTable.toggleRowSelection(row, true))
    }
  },
  beforeDestroy() {
    document.querySelector('.el-main').removeEventListener('scroll', this.handelscroll)
  },
  destroyed() {
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.confirmDialog {
  height: 58px;
  padding-top: 2px;
  .confirmText {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
  }
  .el-icon-warning {
    vertical-align: middle;
    color: #ebb563;
    height: 22px;
    width: 22px;
    font-size: 22px;
    margin: 0px 16px 0px 12px;
  }
}

.main_container {
  background-color: #ffffff;
  padding: 0px;
  min-height: calc(100vh - 85px);
}
.origin-row {
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}

.origin-text {
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.side_tree {
  font-size: 12px;
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  margin: 14px 20px;
}
.side_tree i {
  margin-top: 10px;
  line-height: 12px;
}
.setStoreTree {
  width: 210px;
  background-color: #ffffff;
  margin: 0px 16px 0px 0px;
  border-radius: 2px;
  padding: 0;
}
.main_table {
  margin: 20px 0px 50px -2px;
  width: auto;
  font-size: 16px;
  border-radius: 0 0 5px 5px;
}
.marin_table_page {
  position: absolute;
  bottom: 0;
  right: 0;
  /*width: calc(100vw - 500px)!important;*/
}
.store-scrollbar-wrap {
  overflow-x: hidden;
}
.store-filter .el-input--small .el-input__inner {
  height: 38px;
  line-height: 38px;
}
.el-input-group__append {
  background-color: #1890ff;
  color: #ffff;
}
</style>
