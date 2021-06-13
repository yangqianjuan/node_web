<template>
  <div
    class="app-container"
    id="tagList"
    ref="tagList"
  >
    <div class="search-container">
      <el-row>
        <el-col :span="12">
          <el-button
            type="primary"
            size="mini"
            @click="openAddTagDialog"
          >新增标签</el-button>
        </el-col>
        <el-col
          :span="12"
          align="right"
        >
          <el-input
            ref="nameSelect"
            placeholder="请输入标签名称"
            v-model="search.tagName"
            style="width:204px; height:28px;"
            size="mini"
            @keyup.enter.native='searchQuery'
          >
            <el-button
              slot="append"
              size="mini"
              type="primary"
              @click="searchQuery"
            >搜索</el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>

    <div class="content-div">
      <div class="table-container">
        <div
          class="title-text"
          style="padding-bottom:20px;"
        >标签列表</div>
        <span
          v-if='page.total==0&&!loading'
          class="noData"
        >
          <svg-icon icon-class="nodata" />
          <p class="noDataText">暂无标签</p>
        </span>
        <div class="listCard">
          <el-row
            class="listCardSon"
            v-for="(item, index) in items"
            :key="index"
          >
            <el-col style="margin:10px 0px;width:272px;height:132px">
              <el-card :body-style="{ padding: '16px 20px' }">
                <div>
                  <p class="tag-title">{{item.name}}</p>
                  <p>用户数量:{{item.userNum}}</p>
                  <p>创建时间:{{item.createTime}}</p>
                </div>
                <div style="float:right; margin-bottom:9px;">
                  <el-button
                    type="text"
                    size="mini"
                    @click="editTagDialog(index, item)"
                  >编辑</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="deleteTagDialog(index, item)"
                  >删除</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div
            class="listCardSon"
            :key="item"
            v-for="item in surPlus"
          >
            <el-col style="margin:10px 0px;width:272px;height:100px">
            </el-col>
          </div>
        </div>
      </div>
      <pagination
        v-if="page.total>0"
        :total="page.total"
        :page.sync="page.currentPage"
        :limit.sync="page.pageSize"
        @pagination="handlePageChange"
        :size='24'
      >
      </pagination>
    </div>
    <el-dialog
      :visible.sync="removeComfirmDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog">
        <span class="el-icon-warning"></span>
        <span class="confirmText">确认删除该标签?</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="removeComfirmDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="deleteTagConfirm"
        >确认</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="addTagDialog"
      width="513px"
      :before-close="reset"
      class="selectDepartment"
    >
      <el-form
        ref="addTagForm"
        :model="form"
        label-width="145px"
        size="mini"
        style="margin-top:30px;"
        :rules="rules"
      >
        <el-form-item
          label="标记名称:"
          prop="tagName"
        >
          <el-input
            style="width: 276px;"
            v-model="form.tagName"
            maxlength="10"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          @click="reset"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          @click="addTagConfirm('addTagForm')"
          size="small"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTagList, deleteTag, saveTag, updateTag } from '@/api/customer'
import Pagination from '@/components/Pagination'
export default {
  name: 'TagList',
  components: {
    Pagination
  },
  data() {
    return {
      items: [],
      surPlus: [],
      search: {
        tagName: '',
        id: ''
      },
      page: {
        pageSize: 24,
        total: 1,
        currentPage: 1
      },
      loading: true,
      form: {
        tagName: ''
      },
      removeComfirmDialog: false,
      addTagDialog: false,
      dialogTitle: '',
      rules: {
        tagName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handlePageChange() {
      this.query()
    },
    init() {
      this.query()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.query()
    },
    query() {
      this.loading = true
      const params = {
        name: this.search.tagName,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getTagList(params).then(res => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.query()
          return
        }
        this.items = res.data
        this.page.total = res.total
        let sum
        if (this.items.length <= 12) {
          sum = 12 - this.items.length
        } else {
          sum = 24 - this.items.length
        }
        this.surPlus = []
        for (let i = 0; i < sum; i++) {
          this.surPlus.push(i + 'a')
        }
        this.loading = false
      })
    },
    deleteTagDialog: function ($index, row) {
      this.search.id = row.id
      this.removeComfirmDialog = true
    },
    deleteTagConfirm: function () {
      const params = {
        id: this.search.id
      }
      deleteTag(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message.success(res.message)
          this.query()
        } else {
          this.$message.error(res.message)
        }
        this.removeComfirmDialog = false
      })
    },
    reset() {
      this.addTagDialog = false
      this.form.tagName = ''
    },
    editTagDialog: function ($index, row) {
      this.search.id = row.id
      this.dialogTitle = '修改标签'
      this.form.tagName = row.name
      this.addTagDialog = true
    },
    openAddTagDialog() {
      this.dialogTitle = '新增标签'
      this.addTagDialog = true
    },
    addTagConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.search.id,
            name: this.form.tagName
          }
          switch (this.dialogTitle) {
            case '新增标签':
              saveTag(params).then((res) => {
                if (res.msgCode === '200') {
                  this.query()
                  this.$message.success(res.message)
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '修改标签':
              updateTag(params).then((res) => {
                if (res.msgCode === '200') {
                  this.query()
                  this.$message.success(res.message)
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            default:
              break
          }
          this.reset()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.content-div {
  background-color: #ffffff;
  padding: 16px 0px 13px 20px;
}
.table-container {
  min-height: calc(100vh - 240px);
  border-radius: 5px;
  position: relative;
}

.listCard {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  .listCardSon {
    width: 25%;
    min-width: 272px;
  }
  .el-card {
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: none;
    color: rgba(0, 0, 0, 0.65);
  }
  p {
    margin: 0;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    margin-bottom: 10px;
  }
  .tag-title {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: 550;
    color: rgba(0, 0, 0, 0.85);
    line-height: 12px;
  }
}
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
.noData {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 166px;
  text-align: center;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  transform: translate(-50%, -50%);
  .svg-icon {
    width: 166px;
    height: 100px;
  }
}
</style>
