<template>
  <div class="app-container">
    <div id="deviceList">
      <el-dialog
        title="添加设备"
        :visible.sync="addDeviceDialog"
        width="520px"
        class="selectDepartment"
        @close="resetAddDevice"
        :before-close="closeAddDeviceDialog"
      >
        <el-form
          ref="addDeviceForm"
          :model="addDeviceData"
          label-width="100px"
          size="mini"
          :rules="addDeviceRules"
        >
          <el-form-item
            label="设备编号:"
            prop="cameraId"
          >
            <el-input
              class="device-input"
              v-model="addDeviceData.cameraId"
              placeholder="请输入设备编号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设备用途:"
            prop="cameraUse"
          >
            <el-radio-group v-model="addDeviceData.cameraUse">
              <el-radio
                :label="item.value"
                :key="item.value"
                v-for="item in cameraUseOption"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="设备序列号:"
            prop="cameraSerial"
          >
            <el-input
              class="device-input"
              v-model="addDeviceData.cameraSerial"
              placeholder="请输入设备序列号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="验证码:"
            prop="cameraVerify"
          >
            <el-input
              class="device-input"
              v-model="addDeviceData.cameraVerify"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设备名称:"
            prop="cameraName"
          >
            <el-input
              class="device-input"
              v-model="addDeviceData.cameraName"
              placeholder="请输入设备名称"
            ></el-input>
            <div style="line-height: 20px">
              <span style="font-size: 12px; color: rgb(153, 153, 153);">（建议设备命名规则：产品类型-监控位置 如：枪机-收银台）</span>
            </div>
          </el-form-item>
          <el-form-item
            label="备注:"
            prop="comment"
          >
            <el-input
              class="device-input"
              type="textarea"
              v-model="addDeviceData.comment"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="closeAddDeviceDialog"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="addDeviceSave"
          >保存</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑设备"
        :visible.sync="editDeviceDialog"
        width="520px"
        class="selectDepartment"
      >
        <el-form
          ref="editDeviceForm"
          :model="editDeviceData"
          label-width="100px"
          size="mini"
          :rules="editDeviceRules"
        >
          <el-form-item
            label="设备编号:"
            prop="cameraId"
          >
            <span style="color: #999999">{{editDeviceData.cameraId}}</span>
          </el-form-item>
          <el-form-item
            label="设备用途:"
            prop="cameraUse"
          >
            <el-radio-group v-model="editDeviceData.cameraUse">
              <el-radio
                :label="item.value"
                :key="item.value"
                v-for="item in cameraUseOption"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="设备序列号:"
            prop="cameraSerial"
          >
            <el-input
              class="device-input"
              v-model="editDeviceData.cameraSerial"
              placeholder="请输入设备序列号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="验证码:"
            prop="cameraVerify"
          >
            <el-input
              class="device-input"
              v-model="editDeviceData.cameraVerify"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设备名称:"
            prop="cameraName"
          >
            <el-input
              class="device-input"
              v-model="editDeviceData.cameraName"
              placeholder="请输入设备名称"
            ></el-input>
            <div style="line-height: 20px">
              <span style="font-size: 12px; color: rgb(153, 153, 153);">（建议设备命名规则：产品类型-监控位置 如：枪机-收银台）</span>
            </div>
          </el-form-item>
          <el-form-item
            label="备注:"
            prop="comment"
          >
            <el-input
              class="device-input"
              type="textarea"
              v-model="editDeviceData.comment"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="closeEditDeviceDialog"
          >取消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editDeviceSave"
          >保存</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :visible.sync="delDeviceDialog"
        width="350px"
        class="selectDepartment"
      >
        <div class="confirmDialog">
          <span class="el-icon-warning"></span>
          <span class="confirmText">确定删除{{delDeviceData.cameraId}}设备吗？</span>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="mini"
            @click="delDeviceDialog = false"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="delDevice"
          >删除</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="设备详情"
        :visible.sync="deviceDetailDialog"
        width="500px"
        class="selectDepartment"
      >
        <el-form
          ref="deviceDetailForm"
          :model="deviceDetailData"
          label-width="150px"
          :rules="deviceDetailRules"
        >
          <el-form-item
            label="设备编号:"
            prop="cameraId"
          >
            <span style="margin-left: 30px">{{deviceDetailData.cameraId}}</span>
          </el-form-item>
          <el-form-item
            label="设备用途:"
            prop="cameraUse"
          >
            <span style="margin-left: 30px">{{deviceDetailData.cameraUse}}</span>
          </el-form-item>
          <el-form-item
            label="设备序列号:"
            prop="cameraSerial"
          >
            <span
              style="margin-left: 30px"
              v-if="deviceDetailData.cameraSerial"
            >{{deviceDetailData.cameraSerial}}</span>
            <span
              style="margin-left: 30px"
              v-else
            >无</span>
          </el-form-item>
          <el-form-item
            label="验证码:"
            prop="cameraVerify"
          >
            <span
              style="margin-left: 30px"
              v-if="deviceDetailData.cameraVerify"
            >{{deviceDetailData.cameraVerify}}</span>
            <span
              style="margin-left: 30px"
              v-else
            >无</span>
          </el-form-item>
          <el-form-item
            label="设备名称:"
            prop="cameraName"
          >
            <span
              style="margin-left: 30px"
              v-if="deviceDetailData.cameraName"
            >{{deviceDetailData.cameraName}}</span>
            <span
              style="margin-left: 30px"
              v-else
            >无</span>
          </el-form-item>
          <el-form-item
            label="设备添加人:"
            prop="addPerson"
          >
            <span style="margin-left: 30px">{{deviceDetailData.addPerson}}</span>
          </el-form-item>
          <el-form-item
            label="设备添加时间:"
            prop="addTime"
          >
            <span style="margin-left: 30px">{{deviceDetailData.addTime}}</span>
          </el-form-item>
          <el-form-item
            label="备注:"
            prop="comment"
          >
            <div style="margin-left: 30px">
              <span v-if="deviceDetailData.comment">{{deviceDetailData.comment}}</span>
              <span v-else>无</span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-row class="filter-container">
        <el-row class="origin-text">{{storeName}}设备列表</el-row>
        <el-row style="padding-top:16px;">
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <el-button
              type="primary"
              size="small"
              class="add-button"
              @click="openAddDeviceDialog"
            >
              添加设备
            </el-button>
            <el-button
              type="plain"
              size="small"
              class="delete-button"
              :disabled="isAbleToDeleteDevices"
              @click="deleteDevicesBatch"
            >批量删除</el-button>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
            align="right"
          >
            <el-button
              class="filter-item"
              type="text"
              size="mini"
              @click="returnStoreList"
            >
              &lt; &nbsp;返回门店列表</el-button>
          </el-col>
        </el-row>
      </el-row>
      <el-table
        ref="deviceTable"
        :data="deviceLisItems"
        :row-key="getRowKey"
        fit
        v-loading="loading"
        @selection-change="handleSelectionChange"
        size="small"
        class="table-box"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          prop="id"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cameraId"
          label="设备编号"
          min-width="120px"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cameraName"
          label="设备名称"
          min-width="90px"
        ></el-table-column>
        <!--<el-table-column align="center" prop="cameraType" label="设备品牌" min-width="10%"></el-table-column>-->
        <el-table-column
          align="center"
          prop="cameraUse"
          label="设备用途"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="runStatus"
          label="运行状态"
          min-width="70px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.minute > 30"><span style="color: red">离线</span><br />
              <span v-if="scope.row.reportTime !== ''">{{scope.row.reportTime}}</span>
            </span>
            <span
              v-else
              style="color: green;"
            >在线</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="addTime"
          label="添加时间"
          min-width="140px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.addTime ? scope.row.addTime.split(' ')[0].split('-').join('/') : '' }}</span>
            <span>{{ scope.row.addTime ? scope.row.addTime.split(' ')[1] : ''  }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="addPerson"
          label="添加人"
          min-width="100px"
        ></el-table-column>
        <el-table-column
          align="center"
          prop=""
          label="操作"
          min-width="130px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="openDeviceDetailDialog(scope.row)"
            >详情</el-button>
            <el-button
              type="text"
              size="small"
              @click="openEditDeviceDialog(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="openDelDeviceDialog(scope.row)"
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
  </div>
</template>
<script>
import { fetchDictionary } from '@/api/dictionary'
import { getStoreDevice, addDeviceFromStore, editDeviceFromStore, delDeviceFromStore } from '@/api/store'
import Pagination from '@/components/Pagination'

export default {
  props: {
    storeId: {
      type: String,
      default: ''
    },
    storeName: {
      type: String,
      default: ''
    },
    pageNum: {
      type: Number,
      default: 1
    }
  },
  components: {
    Pagination
  },
  data() {
    const checkInstallLoc = (rule, value, callback) => {
      if (value) {
        if (value.length > 15) {
          return callback(new Error('字数不超过15个字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkComment = (rule, value, callback) => {
      if (value) {
        if (value.length > 50) {
          return callback(new Error('字数不超过50个字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkAddPerson = (rule, value, callback) => {
      if (value) {
        if (value.length > 10) {
          return callback(new Error('字数不超过10个字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      getRowKey(row) {
        return row.id
      },
      loading: false,
      deviceLisItems: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      cameraTypeOptions: [],
      addDeviceDialog: false,
      editDeviceDialog: false,
      delDeviceDialog: false,
      deviceDetailDialog: false,
      addDeviceData: {
        cameraId: '',
        cameraType: '',
        installLoc: '',
        addPerson: '',
        comment: '',
        storeId: '',
        username: '',
        cameraName: '',
        cameraUse: '',
        cameraSerial: '',
        cameraVerify: ''
      },
      editDeviceData: {
        cameraId: '',
        cameraType: '',
        installLoc: '',
        addPerson: '',
        comment: '',
        storeId: '',
        username: '',
        cameraName: '',
        cameraUse: '',
        cameraSerial: '',
        cameraVerify: ''
      },
      delDeviceData: '',
      deviceDetailData: '',
      cameraUseOption: [],
      selectedDevice: [],
      addDeviceRules: {
        cameraId: [
          { required: true, message: '设备编号不能为空', trigger: 'blur' }
        ],
        // cameraType: [
        //   { required: true, message: '设备品牌不能为空', trigger: 'change' }
        // ],
        cameraUse: [
          { required: true, message: '设备用途不能为空', trigger: 'change' }
        ],
        installLoc: [
          { required: false, validator: checkInstallLoc, trigger: 'blur' }
        ],
        comment: [
          { required: false, validator: checkComment, trigger: 'blur' }
        ],
        addPerson: [
          { required: false, validator: checkAddPerson, trigger: 'blur' }
        ]
      },
      editDeviceRules: {
        installLoc: [
          { required: false, validator: checkInstallLoc, trigger: 'blur' }
        ],
        comment: [
          { required: false, validator: checkComment, trigger: 'blur' }
        ],
        addPerson: [
          { required: false, validator: checkAddPerson, trigger: 'blur' }
        ]
      },
      deviceDetailRules: {
        cameraId: [
          { required: true, trigger: 'blur' }
        ],
        cameraType: [
          { required: true, trigger: 'blur' }
        ],
        cameraUse: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isAbleToDeleteDevices() {
      return this.selectedDevice.length < 1
    }
  },
  mounted() {
    this.fetchDictionary()
  },
  methods: {
    resetAddDevice() {
      this.addDeviceData = {
        cameraId: '',
        cameraType: '',
        installLoc: '',
        addPerson: '',
        comment: '',
        storeId: '',
        username: '',
        cameraName: '',
        cameraUse: '',
        cameraSerial: '',
        cameraVerify: ''
      }
    },
    fetchDictionary: function () {
      const params = {
        dictionaries: ['CAMERA_TYPE', 'CAMERA_USE']
      }
      fetchDictionary(params).then((res) => {
        this.cameraTypeOptions = res.cameraType
        this.cameraUseOption = res.cameraUse
      })
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.queryDeviceList()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.queryDeviceList()
    },
    queryDeviceList() {
      const params = {
        storeId: this.storeId,
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize
      }
      getStoreDevice(params).then((res) => {
        this.deviceLisItems = []
        this.page.total = res.total
        this.$nextTick(() => {
          this.deviceLisItems = res.data
        })
      })
    },
    openAddDeviceDialog() {
      this.addDeviceDialog = true
    },
    openEditDeviceDialog(row) {
      this.editDeviceDialog = true
      this.editDeviceData.cameraId = row.cameraId
      this.editDeviceData.cameraType = row.cameraType
      this.editDeviceData.installLoc = row.installLoc
      this.editDeviceData.comment = row.comment
      this.editDeviceData.addPerson = row.addPerson
      this.editDeviceData.username = row.addPerson
      this.editDeviceData.cameraName = row.cameraName
      this.editDeviceData.cameraSerial = row.cameraSerial
      this.editDeviceData.cameraVerify = row.cameraVerify
      for (let i = 0; i < this.cameraUseOption.length; i++) {
        if (row.cameraUse === this.cameraUseOption[i].name) {
          this.editDeviceData.cameraUse = this.cameraUseOption[i].value
        }
      }
    },
    openDelDeviceDialog(row) {
      this.delDeviceDialog = true
      this.delDeviceData = row
    },
    openDeviceDetailDialog(row) {
      this.deviceDetailDialog = true
      this.deviceDetailData = row
    },
    addDeviceSave(row) {
      this.$refs.addDeviceForm.validate((valid) => {
        if (valid) {
          this.addDeviceData.storeId = this.storeId
          this.addDeviceData.username = this.$store.getters.name
          const params = this.addDeviceData
          if (params.storeId === '' || params.storeId === undefined) {
            return
          }
          addDeviceFromStore(params).then((res) => {
            this.queryDeviceList()
            this.closeAddDeviceDialog()
            this.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(function (res) { })
        }
      })
    },
    editDeviceSave(row) {
      this.$refs.editDeviceForm.validate((valid) => {
        if (valid) {
          const params = this.editDeviceData
          editDeviceFromStore(params).then((res) => {
            this.queryDeviceList()
            this.closeEditDeviceDialog()
            this.$message({
              message: res.message,
              type: 'success'
            })
          }).catch(function (res) { })
        }
      })
    },
    delDevice(row) {
      const params = {
        cameraId: this.delDeviceData.cameraId,
        storeId: this.storeId
      }
      if (params.cameraId === '' || params.cameraId === undefined) {
        return
      }
      delDeviceFromStore(params).then((res) => {
        this.queryDeviceList()
        this.delDeviceDialog = false
        this.$message({
          message: res.message,
          type: 'success'
        })
      }).catch(function (res) { })
    },
    deleteDevicesBatch() {
      if (this.selectedDevice.length < 1) {
        this.errorMsg('请先选择门店')
        return
      }
      this.$confirm('<span>确定删除已选中的' + this.selectedDevice.length + '家门店?</span>', '删除门店:', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedDevice.forEach(s => {
          delDeviceFromStore(s).then((res) => {
            this.queryDeviceList()
            this.$message({
              message: res.message,
              type: 'success'
            })
          })
        })
      }).catch(() => this.deselectRows())
    },
    returnStoreList() {
      this.$emit('returnStoreList', this.pageNum)
    },
    closeAddDeviceDialog() {
      this.addDeviceDialog = false
      this.$refs.addDeviceForm.resetFields()
    },
    closeEditDeviceDialog() {
      this.editDeviceDialog = false
      this.$refs.editDeviceForm.resetFields()
    },

    handleSelectionChange(selection) {
      this.selectedDevice = selection
    },

    selectRows() {
      this.selectedDevice.forEach(row => this.$refs.deviceTable.toggleRowSelection(row, true))
    },

    deselectRows() {
      this.selectedDevice.forEach(row => this.$refs.deviceTable.toggleRowSelection(row, false))
    }
  }
}
</script>
<style lang="scss" scoped>
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
.add-device-dialog .el-dialog {
  border-radius: 5px;
}

.origin-text {
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: bold;
  font-size: 16px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
