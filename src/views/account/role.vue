<template>
  <div class="role">
    <div class="app-container">
      <div class="table-prefix-bars">
        <span class="table-tile">角色列表</span><span class="table-tile-total">共{{page.total}}条</span>
        <el-button
          v-if="editPrivilege"
          type="text"
          @click="openAddRoleDialog"
          style="float: right; line-height: 25px; font-size: 14px; margin-right: 10px;"
          size="small"
        >
          <i
            class="el-icon-plus"
            style="font-weight: bolder;font-size: 12px;margin-left: 20px;"
          ></i>&nbsp;添加角色</el-button>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 115px); border-radius: 5px;">
        <el-table
          :data="tableData"
          row-key="id"
          fit
          v-loading="loading"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="name"
            label="角色名称"
            :resizable="false"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="accountNum"
            label="账号个数"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="添加时间"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime ? scope.row.createTime.split(' ')[0].split('-').join('/') : '' }}</span>
              <span>{{ scope.row.createTime ? scope.row.createTime.split(' ')[1] : ''  }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openRoleDetailDialog(scope.row)"
                size="small"
                class="operate-button"
              >详情</el-button>
              <el-button
                v-if="editPrivilege"
                type="text"
                @click="openEditAccountDialog(scope.row)"
                size="small"
                class="operate-button"
              >编辑</el-button>
              <el-button
                v-if="editPrivilege"
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
      <add-role
        ref="addRole"
        :dialog="addRoleDialog"
        :closeDialog="closeRoleDialog"
        @listRoles="listRoles"
      ></add-role>
      <role-detail
        ref="roleDetail"
        :dialog="roleDetailDialog"
        :closeDialog="closeRoleDetailDialog"
      ></role-detail>
    </div>
  </div>
</template>

<script>
import addRole from './components/addRole'
import roleDetail from './components/roleDetail'
import { listRoles, deleteRole } from '@/api/account'
import { fetchDictionary } from '@/api/dictionary'
import Pagination from '@/components/Pagination'
import bus from '@/rootbus'

export default {
  name: 'RoleManage',
  watch: {
  },
  components: {
    addRole,
    roleDetail,
    Pagination
  },
  methods: {
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.listRoles()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.listRoles()
    },
    listRoles(val) {
      this.loading = true
      const params = {
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listRoles(params).then((res) => {
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
    closeRoleDialog() {
      this.addRoleDialog = false
      this.$refs.addRole.resetForm('form')
    },
    closeRoleDetailDialog() {
      this.roleDetailDialog = false
    },
    openAddRoleDialog() {
      this.addRoleDialog = true
    },
    openRoleDetailDialog(row) {
      this.roleDetailDialog = true
      this.$refs.roleDetail.getRoleDetail(row.id)
    },
    openEditAccountDialog(row) {
      this.addRoleDialog = true
      this.$refs.addRole.getEditRoleInfo(row)
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['USER_RANK']
      }
      fetchDictionary(params).then((res) => {
        this.rankOptions = res.userRank.splice(1)
      })
    },
    deleteConfirm(row) {
      this.$confirm('<span>你正在删除' + row.name + '的信息,</span><br><span>是否确定删除该角色信息?</span>', '操作提示:', {
        dangerouslyUseHTMLString: true,
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteRole(row.id)
      }).catch(() => { })
    },
    deleteRole(id) {
      const params = {
        id: id
      }
      deleteRole(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
          const totalPage = Math.ceil((this.page.total - 1) / this.page.pageSize) // 总页数
          this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage
          this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage
          this.listRoles()
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
    this.listRoles()
    this.fetchDictionary()
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.listRoles()
    })
  },
  computed: {
    privilege() {
      return this.$store.getters.getPrivilege
    },
    editPrivilege() {
      return this.$store.getters.getPrivilege.indexOf('角色编辑') > -1
    }
  },
  data() {
    return {
      search: {},
      tableData: [{}],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: false,
      addRoleDialog: false,
      roleDetailDialog: false,
      rankOptions: [],
      accountOptions: [],
      nameOptions: []
    }
  }
}
</script>
<style>
</style>

