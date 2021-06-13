<template>
  <div
    id="ConfigSetting"
    class="config"
  >
    <div class="app-container">
      <el-row class="search-container">
        <el-col
          :xs="24"
          :sm="24"
          :lg="18"
        >
          <span class="cond-name">品牌名称 </span>
          <el-select
            v-model="search.brandId"
            filterable
            placeholder="请输入"
            size="mini"
            clearable
            @change="handleBrandChange"
          >
            <el-option
              v-for="item in brandSet"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            > </el-option>
          </el-select>
          <span
            class="cond-name name"
            v-show="search.type === '1'"
          >门店名称
            <el-select
              v-show="search.type === '1'"
              v-model="search.storeId"
              filterable
              placeholder="请输入"
              size="mini"
              clearable
              @change="handleStoreChange"
            >
              <el-option
                v-for="item in options.storeOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              > </el-option>
            </el-select>
          </span>
        </el-col>

        <el-col
          :xs="24"
          :sm="24"
          :lg="6"
          align="right"
        >
          <el-radio-group
            v-model="search.type"
            size="mini"
            @change="handleTypeChange"
          >
            <el-radio-button label="0">品牌参数调整</el-radio-button>
            <el-radio-button label="1">门店参数调整</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <div class="table-prefix-bars">
        <span class="table-tile">参数列表</span><span class="table-tile-total">共{{page.total}}条</span>
        <el-button
          type="text"
          @click="openAddConfigDialog"
          style="float: right; line-height: 25px; font-size: 14px; margin-right: 10px;"
          size="small"
        >
          &nbsp;{{AddConfigText}}</el-button>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px;border-radius: 5px;">
        <el-table
          :data="tableData"
          row-key="id"
          fit
          v-loading="loading"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="brandId"
            label="品牌名称"
            :resizable="false"
            align="center"
            min-width="25%"
          >
            <template slot-scope="scope">
              <template v-for="item in options.brandOptions">
                <template v-if="parseInt(item.id) === scope.row.brandId"><span>{{item.brandName}}</span></template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="search.type === '1'"
            prop="storeId"
            label="门店名称"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-for="item in options.allStoreOptions">
                <template v-if="parseInt(item.value) === parseInt(scope.row.storeId)"><span>{{item.name}}</span></template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            v-if="search.type === '1'"
            prop="parentConfig"
            label="品牌算法参数"
            :resizable="false"
            align="center"
            min-width="30%"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.parentConfig">{{scope.row.parentConfig}}</span>
              <span v-else>/</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="currentConfig"
            label="当前算法参数"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            :resizable="false"
            align="center"
            min-width="25%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openEditConfigDialog(scope.row)"
                size="small"
                class="operate-button"
              >编辑参数</el-button>
              <el-button
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
    </div>
    <add-config-dialog
      ref="addDialog"
      :dialog="addDialogFlag"
      :closeDialog="closeAddDialog"
      :search="search"
      :options="options"
      @listConfig="listConfig"
    ></add-config-dialog>

    <edit-config-dialog
      ref="editDialog"
      :dialog="editDialogFlag"
      :closeDialog="closeEditDialog"
      :search="search"
      :options="options"
      @listConfig="listConfig"
    ></edit-config-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getOptions, listConfig, deleteConfig, listStoreOptions, listBrandOptions } from '@/api/brand'
import AddConfigDialog from './components/addConfigDialog'
import EditConfigDialog from './components/editConfigDialog'

export default {
  name: 'ConfigManage',
  components: {
    Pagination,
    AddConfigDialog,
    EditConfigDialog
  },
  data() {
    return {
      search: {
        brandId: '',
        type: '0'
      },
      tableData: [{}],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      options: {
        brandOptions: [],
        storeOptions: [],
        allStoreOptions: []
      },
      brandSet: [],
      loading: false,
      addDialogFlag: false,
      editDialogFlag: false
    }
  },
  computed: {
    AddConfigText() {
      return this.search.type === '0' ? '品牌参数设置' : '门店参数配置'
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
      this.getOptions()
      this.listStoreOptions()
      this.listConfig()
      this.listBrandOptions()
    },
    handleBrandChange() {
      this.searchQuery()
      this.listStoreOptions()
    },
    handleStoreChange() {
      this.searchQuery()
    },
    handleTypeChange() {
      this.searchQuery()
      this.listBrandOptions()
    },
    deleteConfirm(row) {
      var str
      if (this.search.type === '0') {
        str = '<span>你正在删除' + this.options.brandOptions.find((item) => { return parseInt(item.id) === row.brandId }).brandName + '品牌的算法参数，</span><span>是否继续?</span>'
      } else {
        str = '<span>你正在删除' + this.options.allStoreOptions.find((item) => { return item.value === row.storeId }).name + '门店的已有的算法参数，</span><span>是否继续?</span>'
      }
      this.$confirm(str, {
        dangerouslyUseHTMLString: true,
        showClose: false,
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteConfig(row)
      }).catch(() => { })
    },
    deleteConfig(row) {
      const params = {
        brandId: row.brandId,
        storeId: row.storeId
      }
      deleteConfig(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
          const totalPage = Math.ceil((this.page.total - 1) / this.page.pageSize) // 总页数
          this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage
          this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage
          this.listConfig()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    closeAddDialog() {
      this.addDialogFlag = false
      this.$refs.addDialog.resetForm('form')
    },
    closeEditDialog() {
      this.editDialogFlag = false
      this.$refs.editDialog.resetForm('form')
    },
    openAddConfigDialog() {
      this.addDialogFlag = true
    },
    openEditConfigDialog(row) {
      this.editDialogFlag = true
      this.$refs.editDialog.getEditConfig(row)
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.listConfig()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.listConfig()
    },
    listConfig(val) {
      this.loading = true
      const params = {
        brandId: this.search.brandId,
        storeId: this.search.storeId,
        type: this.search.type,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      listConfig(params).then((res) => {
        this.tableData = []
        this.page.total = res.total
        this.loading = false
        this.$nextTick(() => {
          this.tableData = res.data
        })
      })
    },
    listStoreOptions() {
      const params = {
        brandId: this.search.brandId
      }
      listStoreOptions(params).then((res) => {
        if (this.search.brandId !== '') {
          this.options.storeOptions = res
        } else {
          this.options.allStoreOptions = res
        }
      })
    },
    listBrandOptions() {
      const params = {
        type: this.search.type
      }
      listBrandOptions(params).then((res) => {
        this.brandSet = res
      })
    },
    getOptions() {
      getOptions().then((res) => {
        this.options.brandOptions = res
      })
    }
  }
}
</script>
<style>
</style>

