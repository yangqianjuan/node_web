<template>
  <div class="visitRepeat">
    <div class="app-container">
      <div class="table-prefix-bars">
        <span class="table-tile">数据转发列表</span>
        <span class="table-tile-total">共{{tableData.length}}条</span>
        <el-button
          type="text"
          @click="openTransFormCamera"
          style="float: right; line-height: 25px;margin: 0 10px 0 10px; font-size: 14px;"
          size="small"
        >
          <i
            class="el-icon-plus"
            style="font-weight: bolder;"
          ></i>&nbsp;添加摄像头
        </el-button>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 130px); border-radius: 5px;">
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
            label="品牌"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-for="item in brandOptions">
                <template v-if="parseInt(item.id) === scope.row.brandId"><span>{{item.brandName}}</span></template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="cameraId"
            label="摄像头"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="storeName"
            label="门店名称"
            :resizable="false"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="storeAddress"
            label="门店地址"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            label="操作"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteConfirm(scope.row)"
                size="small"
                class="operate-button"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :visible.sync="AddDialog"
        width="500px"
        :before-close="closeDialog"
        title="添加摄像头"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="110px"
          style="width: 85%;margin-left: auto;margin-right: auto"
        >
          <el-form-item
            label="品牌:"
            prop="brandId"
          >
            <el-select
              v-model="form.brandId"
              placeholder="请选择"
              @change="handleBrandChange"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.brandName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="摄像头:"
            prop="cameraId"
          >
            <el-select
              v-model="form.cameraId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in cameraOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div
            align="center"
            style="margin-top: 20px"
          >
            <el-button
              @click="closeDialog"
              style="margin-right: 30px"
              class="cancel-button"
              size="small"
            >取 消</el-button>
            <el-button
              @click="submitForm('form')"
              class="confirm-button"
              style="margin-left: 30px;"
              size="small"
            >保存</el-button>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listTransformCamera, listUnTransFormCameraOptions, addTransformCamera, deleteTransformCamera } from '@/api/statistics'
import { getOptions } from '@/api/brand'

export default {
  name: 'CameraDataTransform',
  watch: {
  },
  components: {
  },
  updated() {
    document.querySelector('.el-main').scrollTop = 0
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
      // this.page.currentPage = 1
      this.init()
    },
    init() {
      this.listTransformCamera()
      this.getOptions()
    },
    listTransformCamera() {
      this.loading = true

      listTransformCamera().then((res) => {
        this.tableData = res
        this.loading = false
      })
    },
    getOptions() {
      getOptions().then((res) => {
        this.brandOptions = res
      })
    },
    openTransFormCamera() {
      this.AddDialog = true
    },
    closeDialog() {
      this.listTransformCamera()
      this.AddDialog = false
      this.$refs.form.resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            cameraId: this.form.cameraId
          }
          addTransformCamera(params).then((res) => {
            if (res.msgCode === '200') {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.closeDialog()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },
    listUnTransFormCameraOptions: function () {
      const params = {
        brandId: this.form.brandId
      }
      listUnTransFormCameraOptions(params).then((res) => {
        this.cameraOptions = res
      })
    },
    handleBrandChange() {
      this.form.cameraId = ''
      this.listUnTransFormCameraOptions()
    },
    deleteConfirm(row) {
      this.$confirm('<span>确定移除' + row.cameraId + '设备吗?</span>', '操作提示:', {
        dangerouslyUseHTMLString: true,
        center: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.deleteCamera(row.id)
      }).catch(() => { })
    },
    deleteCamera(id) {
      const params = {
        cameraId: id
      }
      deleteTransformCamera(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.listTransformCamera()
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
    this.listTransformCamera()
    this.getOptions()
  },
  computed: {
  },
  data() {
    return {
      tableData: [],
      form: {
        brandId: '',
        cameraId: ''
      },
      AddDialog: false,
      loading: false,
      brandOptions: [],
      cameraOptions: [],
      rules: {
        cameraId: { required: true, message: '摄像头不能为空', trigger: 'blur' }
      }
    }
  }
}
</script>
<style>
</style>

