<template>
  <el-dialog
    :visible.sync="dialog"
    width="785px"
    :before-close="closeDialog"
    title="角色详情"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="130px"
      size="mini"
      style="width: 85%;margin-left: auto;margin-right: auto"
    >
      <el-form-item
        label="角色名称:"
        prop="name"
      >
        <span>{{this.data.name}}</span>
      </el-form-item>
      <el-form-item
        label="角色绑定账号个数:"
        prop="accountNum"
      >
        <span>{{this.data.accountNum}}</span>
      </el-form-item>
      <el-form-item
        label="角色权限:"
        prop="rank"
      >
        <div
          class="permissionBox"
          v-show="data.structType>=0"
        >
          <div class="permission-title">门店客流</div>
          <el-radio-group
            v-show="data.structType >= 0"
            v-model="data.structType"
            class="radioPermissionClass"
          >
            <el-radio
              class="radio-item"
              :label="2"
              v-show="data.structType === 2"
            >查看所属门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
            <el-radio
              class="radio-item"
              :label="1"
              v-show="data.structType === 1"
            >查看所属区域所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
            <el-radio
              class="radio-item"
              :label="0"
              v-show="data.structType === 0"
            >查看品牌下所有门店数据(含客流分析、日报表、周报表、月报表)</el-radio>
          </el-radio-group>
        </div>
        <div
          class="permissionBox"
          v-show="data.customerPermission>=0"
        >
          <div class="permission-title">顾客管理</div>
          <el-radio-group
            v-show="data.customerPermission > 0"
            v-model="data.customerPermission"
            class="radioPermissionClass"
          >
            <el-radio
              class="radio-item"
              :label="10"
              v-show="data.customerPermission === 10"
            >查看顾客列表数据</el-radio>
            <el-radio
              class="radio-item"
              :label="11"
              v-show="data.customerPermission === 11"
            >编辑(支持查询顾客、白名单、转为白名单、删除白名单等操作权限)</el-radio>
          </el-radio-group>
          <!--<el-radio-group v-show="data.devicePermission > 0" v-model="data.devicePermission" class="radioPermissionClass">-->
          <!--<el-radio class="radio-item" :label="5" v-show="data.devicePermission === 5">添加设备</el-radio>-->
          <!--</el-radio-group>-->
        </div>
        <div
          class="permissionBox"
          v-show="data.storePermission>=0"
        >
          <div class="permission-title">门店列表</div>
          <el-radio-group
            v-show="data.storePermission > 0"
            v-model="data.storePermission"
            class="radioPermissionClass"
          >
            <el-radio
              class="radio-item"
              :label="3"
              v-show="data.storePermission === 3"
            >查看门店列表数据</el-radio>
            <el-radio
              class="radio-item"
              :label="4"
              v-show="data.storePermission === 4"
            >编辑门店（支持设备、门店及其架构的新增、删除、修改、查询功能）</el-radio>
          </el-radio-group>
          <!--<el-radio-group v-show="data.devicePermission > 0" v-model="data.devicePermission" class="radioPermissionClass">-->
          <!--<el-radio class="radio-item" :label="5" v-show="data.devicePermission === 5">添加设备</el-radio>-->
          <!--</el-radio-group>-->
        </div>
        <div
          class="permissionBox"
          v-show="data.accountPermission>=0"
        >
          <div class="permission-title">账号列表</div>
          <el-radio-group
            v-show="data.accountPermission > 0"
            v-model="data.accountPermission"
            class="radioPermissionClass"
          >
            <el-radio
              class="radio-item"
              :label="6"
              v-show="data.accountPermission === 6"
            >查看账号列表数据</el-radio>
            <el-radio
              class="radio-item"
              :label="7"
              v-show="data.accountPermission === 7"
            >编辑账号（支持账号的新增、删除、修改、查询功能）</el-radio>
          </el-radio-group>
        </div>
        <div
          class="permissionBox"
          v-show="data.rolePermission>=0"
        >
          <div class="permission-title">角色列表</div>
          <el-radio-group
            v-show="data.rolePermission > 0"
            v-model="data.rolePermission"
            class="radioPermissionClass"
          >
            <el-radio
              class="radio-item"
              :label="8"
              v-show="data.rolePermission === 8"
            >查看角色列表数据</el-radio>
            <el-radio
              class="radio-item"
              :label="9"
              v-show="data.rolePermission === 9"
            >编辑角色（支持角色的新增、删除、修改、查询功能）</el-radio>
          </el-radio-group>
        </div>
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
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
import { getRoleDetail } from '@/api/account'
export default {
  props: {
    dialog: {
      type: Boolean,
      default: true
    },
    closeDialog: {
      type: Function,
      default: null
    }
  },
  watch: {
  },
  data() {
    return {
      form: {
        name: ''
      },
      data: {},
      editStatus: false,
      repeatFlag: false,
      rules: {
      }
    }
  },
  methods: {
    getRoleDetail(id) {
      this.editStatus = true
      const params = {
        id: id
      }
      getRoleDetail(params).then((res) => {
        this.data = res
      })
    }
  },
  mounted() {
  },
  computed: {
  }
}
</script>
<style>
.addAccountDialog .el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  /*border-color: #67c23a;*/
  border-color: #dcdfe6;
}

.addAccount-scrollbar-wrap {
  overflow-x: hidden;
}

.addAccount-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}
</style>
