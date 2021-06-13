<template>
  <div class="accountList">
    <div class="app-container">
      <el-row class="search-container">
        <el-col
          :xs="24"
          :sm="24"
          :lg="18"
        >
          <span>账号ID</span>
          <el-select
            ref="accountSelect"
            v-model="search.account"
            filterable
            placeholder="请输入"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in accountOptions"
              :key="item"
              :label="item"
              :value="item"
            > </el-option>
          </el-select>

          <span class="cond-name">姓名</span>
          <el-select
            ref="nameSelect"
            v-model="search.name"
            filterable
            placeholder="请输入"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in nameOptions"
              :key="item"
              :label="item"
              :value="item"
            > </el-option>
          </el-select>
          <span class="cond-name">职级岗位 </span>
          <el-select
            ref="rankSelect"
            v-model="search.rank"
            filterable
            placeholder="请输入"
            size="mini"
            clearable
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            > </el-option>
          </el-select>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
          align="right"
        >

          <el-button
            @click="reset"
            plain
            style="float: right; width: 80px;"
            size="small"
          >重置</el-button>
          <el-button
            @click="searchQuery"
            type="primary"
            plain
            style=" width: 80px; margin-right:20px;"
            size="small"
          >搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div
      class="table-prefix-bars"
      style="margin-top: 10px;"
    >
      <span class="table-tile">账号列表</span><span class="table-tile-total">共{{page.total}}条</span>
      <el-button
        v-if="editPrivilege"
        type="text"
        @click="openAddAccountDialog"
        style="float: right; line-height: 25px; font-size: 14px; margin-right: 10px;"
        size="small"
      >
        <i
          class="el-icon-plus"
          style="font-weight: bolder;"
        ></i>&nbsp;添加账号</el-button>
    </div>
    <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
      <el-table
        :data="tableData"
        row-key="id"
        fit
        v-loading="loading"
        size="small"
        class="table-box"
      >
        <el-table-column
          prop="account"
          label="账号ID"
          :resizable="false"
          align="center"
          min-width="14%"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          :resizable="false"
          align="center"
          min-width="12%"
        ></el-table-column>
        <el-table-column
          prop="roleId"
          label="职级岗位"
          :resizable="false"
          align="center"
          min-width="14%"
        >
          <template slot-scope="scope">
            <template v-for="item in roleOptions">
              <template v-if="parseInt(item.value) === scope.row.roleId"><span>{{item.name}}</span></template>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          :resizable="false"
          align="center"
          min-width="20%"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          :resizable="false"
          align="center"
          min-width="20%"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime ? scope.row.createTime : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          :resizable="false"
          align="center"
          min-width="18%"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="openAccountDetailDialog(scope.row)"
              size="small"
              class="operate-button"
            >详情</el-button>
            <el-button
              v-show="editPrivilege"
              type="text"
              @click="openEditAccountDialog(scope.row)"
              size="small"
              class="operate-button"
            >编辑</el-button>
            <el-button
              v-show="editPrivilege"
              type="text"
              @click="deleteConfirm(scope.row)"
              size="small"
              class="operate-button"
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
      ></pagination>
    </div>
    <add-account
      ref="addAccount"
      :dialog="addAccountDialog"
      :closeDialog="closeAccountDialog"
      @listAccount="listAccount"
      :roleOptions="roleOptions"
    ></add-account>
    <account-detail
      ref="accountDetail"
      :dialog="accountDetailDialog"
      :closeDialog="closeAccountDetailDialog"
      :roleOptions="roleOptions"
    ></account-detail>
  </div>
  </div>
</template>

<script>
import addAccount from './components/addAccount'
import { listAccount, deleteAccount, listAccountOptions, listNameOptions, listRoleOptions } from '@/api/account'
import accountDetail from './components/accountDetail'
import { fetchDictionary } from '@/api/dictionary'
import Pagination from '@/components/Pagination'
import bus from '@/rootbus'

export default {
  name: 'AccountManage',
  watch: {
  },
  components: {
    accountDetail,
    addAccount,
    Pagination
  },
  methods: {
    searchQuery() {
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
    listAccount(val) {
      this.loading = true
      const params = {
        account: this.search.account,
        name: this.search.name,
        roleId: this.search.rank,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listAccount(params).then((res) => {
        this.tableData = []
        this.page.total = res.total
        this.loading = false
        this.$nextTick(() => {
          this.tableData = res.data
        })
      })
    },
    reset() {
      this.search.account = ''
      this.search.name = ''
      this.search.rank = ''
      this.searchQuery()
    },
    closeAccountDialog() {
      this.addAccountDialog = false
      this.$refs.addAccount.resetForm('form')
    },
    closeAccountDetailDialog() {
      this.accountDetailDialog = false
    },
    openAddAccountDialog() {
      this.addAccountDialog = true
      this.$refs.addAccount.listOrgTree()
    },
    openEditAccountDialog(row) {
      this.addAccountDialog = true
      this.$refs.addAccount.listOrgTree()
      this.$refs.addAccount.getEditAccountInfo(row)
    },
    openAccountDetailDialog(row) {
      this.accountDetailDialog = true
      this.$refs.accountDetail.getAccountDetail(row)
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['USER_RANK']
      }
      fetchDictionary(params).then((res) => {
        this.rankOptions = res.userRank.splice(1)
      })
    },
    listAccountOptions: function () {
      listAccountOptions().then((res) => {
        this.accountOptions = res
      })
    },
    listNameOptions: function () {
      listNameOptions().then((res) => {
        this.nameOptions = res
      })
    },
    listRoleOptions() {
      const params = {
        brandId: null
      }
      listRoleOptions(params).then((res) => {
        this.roleOptions = res
      })
    },
    deleteConfirm(row) {
      this.$confirm('<span>你正在删除' + row.account + '的信息,</span><br><span>是否确定删除该账号信息?</span>', '操作提示:', {
        dangerouslyUseHTMLString: true,
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteAccount(row.id)
      }).catch(() => { })
    },
    deleteAccount(id) {
      const params = {
        usrId: id
      }
      deleteAccount(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
          const totalPage = Math.ceil((this.page.total - 1) / this.page.pageSize) // 总页数
          this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage
          this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage
          this.listAccount()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    }
  },
  mounted() {
    this.listAccount()
    this.fetchDictionary()
    this.listAccountOptions()
    this.listNameOptions()
    this.listRoleOptions()
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.listAccount()
      this.$refs['rankSelect'].blur()
      this.$refs['nameSelect'].blur()
      this.$refs['accountSelect'].blur()
    })
  },
  computed: {
    privilege() {
      return this.$store.getters.getPrivilege
    },
    editPrivilege() {
      return this.$store.getters.getPrivilege.indexOf('账号编辑') > -1
    }
  },
  data() {
    return {
      search: {
        account: '',
        name: '',
        rank: ''
      },
      tableData: [{}],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: false,
      addAccountDialog: false,
      accountDetailDialog: false,
      rankOptions: [],
      accountOptions: [],
      nameOptions: [],
      roleOptions: []
    }
  }
}
</script>
<style>
</style>

