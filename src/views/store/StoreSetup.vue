<template>
  <div
    id="StoreSetup"
    ref="storeSetupBox"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <el-container>
        <!-- 智慧零售 下的门店管理没有区域架构 -->
        <el-aside
          v-if="brandType !== 1"
          class="setStoreTree"
        >
          <el-row class="origin-row">
            <span class="origin-text">区域架构</span>
          </el-row>
          <div class="el-data-tree">
            <el-tree
              ref="structTree"
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              :indent=6
              default-expand-all
              highlight-current
              :current-node-key="targetNode.id"
              :expand-on-click-node="false"
              @node-click="clickTreeNode"
            >
              <span
                slot-scope="{node, data}"
                class="custom-tree-node"
              >
                <span class="custom-tree-node-label">
                  <!-- @slot 可定制的节点标签内容, 参数为 { data } -->
                  <slot
                    name="node-label"
                    :data="data"
                  >
                    <span>{{ data.label }}</span>
                    <span>({{ data.stNum }})</span>
                  </slot>
                </span>
                <span class="custom-tree-node-btns">
                  <template v-if="targetNode.id === data.id">
                    <el-button
                      v-show="data.level < 6"
                      type="text"
                      @click="handleCommand('new', node, data)"
                    ><i class="el-icon-plus"></i></el-button>
                    <el-button
                      v-show="data.type !== 0"
                      type="text"
                      @click="handleCommand('edit', node, data)"
                    ><i class="el-icon-edit"></i></el-button>
                    <el-button
                      v-show="data.type !== 0"
                      type="text"
                      @click="handleCommand('delete', node, data)"
                    ><i class="el-icon-delete" /></el-button>
                  </template>
                </span>
              </span>
            </el-tree>
          </div>
        </el-aside>
        <el-main class="main_container">
          <el-collapse-transition>
            <div
              class="store-body"
              v-show="isShowStore"
            >
              <el-row class="filter-container">
                <el-row class="origin-text">
                  <span>{{targetNode.label}}</span>
                  <span>共{{page.total}}家门店</span>
                </el-row>
                <el-row style="padding-top:16px;">
                  <el-col
                    :xs="24"
                    :sm="24"
                    :lg="12"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      style="vertical-align:middle;width: 90px;"
                      :disabled=isDisableToAddStore
                      @click="openAddStore()"
                    >
                      新增门店
                    </el-button>
                    <el-button
                      type="plain"
                      size="mini"
                      style="width: 90px;"
                      :disabled="isAbleToDeleteStore"
                      @click="deleteStoreBatch"
                    >批量删除</el-button>
                  </el-col>
                  <el-col
                    :xs="24"
                    :sm="24"
                    :lg="12"
                    align="right"
                    style="font-size:0px"
                  >
                    <el-input
                      ref="nameSelect"
                      placeholder="门店名称"
                      v-model="search.name"
                      @keyup.enter.native='searchQuery'
                      class="input-with-select"
                      style="width:204px; height:28px;"
                      size="mini"
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
                ></el-table-column>
                <el-table-column
                  prop="name"
                  label="门店名称"
                  align="center"
                  :resizable="false"
                  min-width="120px"
                ></el-table-column>
                <el-table-column
                  prop="address"
                  label="门店地址"
                  align="center"
                  :resizable="false"
                  min-width="220px"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.address.length <= 30">
                      {{ scope.row.address }}
                    </div>
                    <el-popover
                      trigger="hover"
                      placement="top"
                      v-else
                    >
                      <p>{{ scope.row.address }}</p>
                      <div
                        slot="reference"
                        class="name-wrapper"
                      >
                        {{ processAddress(scope.row.address) }}
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="linkman"
                  label="门店联系人"
                  align="center"
                  :resizable="false"
                  min-width="90px"
                ></el-table-column>
                <el-table-column
                  prop="phone"
                  label="联系人电话"
                  align="center"
                  :resizable="false"
                  min-width="100px"
                ></el-table-column>
                <el-table-column
                  prop="devNum"
                  label="设备数"
                  align="center"
                  :resizable="false"
                  min-width="80px"
                ></el-table-column>
                <el-table-column
                  label="操作"
                  :resizable="false"
                  align="center"
                  min-width="130px"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="openDeviceList(scope.row)"
                      size="small"
                    >设备</el-button>
                    <el-button
                      type="text"
                      @click="openEditStore(scope.row)"
                      size="small"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      @click="deleteStoreDialog(scope.row)"
                      size="small"
                    >删除</el-button>
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
            <device-list
              ref="deviceList"
              :pageNum="page.currentPage"
              :storeId="storeIdProp"
              :storeName="storenNameProp"
              @returnStoreList="returnStoreList"
              v-show="isShowDevice"
            ></device-list>
          </el-collapse-transition>
        </el-main>
      </el-container>
    </div>
    <!-- 新增和编辑时弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="513px"
      class="selectDepartment"
    >
      <span>区域名称：</span>
      <el-input
        v-model="inputData.label"
        type="text"
        size="mini"
        maxlength="10"
        show-word-limit
        style="width: 240px;"
      />

      <div slot="footer">
        <el-button
          size="small"
          @click="closeDialog"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmStruct"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getOrgStructDic, saveOrgStructDic, updateOrgStructDic, deleteOrgStructDic } from '@/api/dictionary'
import { listStore, deleteStore, deleteStoreBatch } from '@/api/store'
import { getUserInfo } from '@/api/account'
import Pagination from '@/components/Pagination'
import deviceList from './deviceList'
export default {
  components: {
    Pagination,
    deviceList
  },
  name: 'StoreManage',
  data() {
    return {
      getRowKey(row) {
        return row.id
      },
      keepAlive: false,
      tableData: [],
      loading: false,
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      isShowDevice: false,
      isShowStore: true,
      targetNode: {},
      defaultNode: '',
      selectedStore: [],
      search: {},
      storeIdProp: '',
      storenNameProp: '',
      scrollTop: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      newText: '添加子区域',
      editText: '修改名称',
      deleteText: '确认删除该区域',
      inputData: '',
      dialogTitle: '',
      dialogVisible: false,
      isNew: true,
      isEdit: false,
      brandType: ''
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
        this.updateDicStore()
      } else {
        sessionStorage.setItem('storeSetup', this.scrollTop)
      }
    }
  },
  computed: {
    processAddress() {
      return function (value) {
        return value.slice(0, 30) + '...'
      }
    },
    isDisableToAddStore() {
      return !this.targetNode.id
    },
    isAbleToDeleteStore() {
      return this.selectedStore.length < 1
    },
    routeLevel() {
      return this.$route.matched.length
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
        keepAlive = name === 'addStore' || 'editStore'
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
    init() {
      this.initDic()
      this.getUserInfo()
    },
    updateDicStore() {
      this.getDic()
      this.listStore()
    },
    handelscroll() {
      if (this.isShowStore) {
        this.scrollTop = document.querySelector('.el-main').scrollTop
      }
    },
    showStoreList() {
      this.isShowDevice = false
      this.$nextTick(() => {
        this.isShowStore = true
      })
    },

    returnStoreList(pageNum) {
      this.showStoreList()
      this.listStore(pageNum)
    },

    showDeviceList() {
      this.isShowStore = false
      sessionStorage.setItem('storeSetup', this.scrollTop)
      document.querySelector('.el-main').scrollTop = 0
      this.$nextTick(() => { this.isShowDevice = true })
    },

    initDic() {
      getOrgStructDic({ 'type': 1 }).then((res) => {
        this.treeData = res
        if (res.length > 0) {
          this.defaultNode = res[0]
          this.targetNode = res[0]
          this.listStore()
          if (this.brandType !== 1) { // 智慧零售没有区域架构
            this.setDefaultCurrentKey(this.targetNode)
          }
        }
      })
    },
    getDic: function () {
      getOrgStructDic({ 'type': 1 }).then((res) => {
        this.treeData = res
        // if (res.length > 0 && JSON.stringify(this.defaultNode) !== JSON.stringify(res[0])) {
        //   this.defaultNode = res[0]
        // }
      })
    },

    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.listStore()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.listStore()
    },
    listStore: function () {
      this.loading = true
      const params = {
        name: this.search.name,
        structId: this.targetNode.id,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listStore(params).then((res) => {
        this.tableData = []
        this.page.total = res.total
        this.$nextTick(() => {
          this.tableData = res.data
        })
        this.selectRows()
        if (this.isShowStore) {
          document.querySelector('.el-main').scrollTop = sessionStorage.getItem('storeSetup') || 0
        }
      })
      this.loading = false
    },
    openAddStore() {
      this.$router.push({
        name: 'addStore',
        query: {
          parentStructId: (this.targetNode.id ? this.targetNode.id : ''),
          parentStructName: (this.targetNode.label ? this.targetNode.label : ''),
          level: (this.targetNode.level ? this.targetNode.level : '')
        }
      })
    },

    openDeviceList(row) {
      this.storeIdProp = String(row.id)
      this.storenNameProp = String(row.name)
      this.$refs.deviceList.deviceLisItems = []
      this.$nextTick(() => { this.$refs.deviceList.queryDeviceList() })
      this.showDeviceList()
    },

    openEditStore(row) {
      this.$router.push({
        name: 'editStore',
        query: { structId: row.structId, parentStructId: row.parentStructId, id: row.id }
      })
    },

    deleteStoreDialog(row) {
      this.$confirm('确认删除此门店？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        deleteStore(row).then((res) => {
          if (res.message === '成功！') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.updateDicStore()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.updateDicStore()
      })
    },
    deleteStoreBatch() {
      if (this.selectedStore.length < 1) {
        this.errorMsg('请先选择门店')
        return
      }
      const storeIds = []
      this.selectedStore.forEach(s => {
        if (storeIds.indexOf(s.id) < 0) {
          storeIds.push(s.id)
        }
      })
      this.$confirm('<span>确定删除已选择的' + storeIds.length + '家门店?</span>', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStoreBatch(storeIds).then((res) => {
          if (res.message === '成功！') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.updateDicStore()
            this.deselectRows()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
    },

    deleteStore(storeInfo) {
      this.$confirm('<span>你正在删除' + storeInfo.name + '的信息,</span><br><span>是否确定删除该门店信息?</span>', '操作提示:', {
        dangerouslyUseHTMLString: true,
        // center: true,
        showClose: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStore(storeInfo).then((res) => {
          if (res.message === '成功！') {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.updateDicStore()
            this.deselectRows()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
      }).catch(() => { })
    },

    handleSelectionChange(selection) {
      this.selectedStore = selection
    },

    selectRows() {
      this.selectedStore.forEach(row => this.$refs.storeTable.toggleRowSelection(row, true))
    },

    deselectRows() {
      this.selectedStore.forEach(row => this.$refs.storeTable.toggleRowSelection(row, false))
    },

    deleteTreeStruct(deleteNode) {
      const params = {
        id: deleteNode.id
      }
      deleteOrgStructDic(params).then((res) => {
        if (res.message === '成功！') {
          this.init()
        }
        this.$message({
          message: res.message,
          type: 'success'
        })
      })
    },

    setDefaultCurrentKey(node) {
      const key = node.id ? node.id : ''
      this.$nextTick(function () {
        this.$refs['structTree'].setCurrentKey(key)
      })
    },

    /**
      * 获取el-tree对象，方便调用其方法
      * @returns {tree object}
      * @public
      */
    handleCommand(command, data, node) {
      switch (command) {
        case 'new':
          this.onDefaultNew(data, node)
          break
        case 'edit':
          this.onDefaultEdit(data, node)
          break
        case 'delete':
          this.onDefaultDelete(data, node)
          break
        default:
      }
    },

    clickTreeNode: function (node) {
      if (node) {
        this.targetNode = node
      }
      this.showStoreList()
      this.searchQuery()
    },

    onDefaultNew(data, node) {
      this.row = data
      this.isNew = true
      this.isEdit = false
      this.dialogTitle = this.newText
      this.inputData = ''
      this.inputData = {
        level: node.level + 1,
        parentId: node.id,
        type: 1,
        label: ''
      }
      this.inputData.parentId = node.id
      this.inputData
      this.dialogVisible = true
    },
    onDefaultEdit(data, node) {
      this.row = data
      this.isNew = false
      this.isEdit = true
      this.dialogTitle = this.editText
      this.inputData = node
      this.dialogVisible = true
    },
    onDefaultDelete(data, node) {
      this.$confirm(this.deleteText, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      })
        .then(() => {
          if (node.type === 0) {
            this.$message({
              message: '品牌不能删除',
              type: 'error'
            })
          } else if (node.children && node.children.length > 0) {
            this.$message({
              message: '该区域下有子节点,不能删除',
              type: 'error'
            })
          } else if (node.stNum && node.stNum > 0) {
            this.$message({
              message: '请将该区域下所有门店删除后，再删除该区域',
              type: 'error'
            })
          } else {
            this.deleteTreeStruct(node)
          }
        }).catch(() => { })
    },
    cancel() {
      this.dialogVisible = false
    },
    confirmStruct() {
      const node = this.inputData
      if (this.isNew) {
        saveOrgStructDic(node).then((res) => {
          if (res.data) {
            this.init()
          }
          if (res.message === '成功！') {
            this.$message({
              message: '子架构添加成功',
              type: 'success'
            })
          }
        })
      } else if (this.isEdit) {
        updateOrgStructDic(node).then((res) => {
          if (res.data) {
            this.init()
          }
          if (res.message !== '' && !res.message) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          }
        })
      }
      this.dialogVisible = false
    },
    closeDialog() {
      this.dialogVisible = false
      this.isNew = false
      this.isEdit = false
    },
    getUserInfo() {
      getUserInfo().then((res) => {
        this.brandType = res.brandType
        console.log(this.brandType)
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$delete-color: #e24156;
.el-data-tree {
  overflow: hidden;
  transition: 0.3s;
  padding: 14px 16px;

  .custom-tree-node {
    overflow: hidden;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 4px;
    font-size: 12px;
    font-family: PingFangSC, Microsoft YaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 16px;

    .custom-tree-node-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .custom-tree-node-btns {
      .el-button {
        font-family: inherit;
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }

  .delete-button {
    color: $delete-color;

    &:hover,
    &:focus {
      color: $delete-color;
    }
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
  font-size: 16px;
  font-family: PingFangSC-Regular, Microsoft YaHei;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  line-height: 16px;
}
.setStoreTree {
  background-color: #ffffff;
  margin: 0px 16px 0px 0px;
  border-radius: 2px;
  padding: 0;
}
</style>

<style>
.el-tree-node.is-current > .el-tree-node__content .custom-tree-node-label {
  font-weight: bold;
  color: #4d95fd !important;
}
</style>
