<template>
  <div class="brand">
    <div class="app-container">
      <div class="search-container">
        <span class="cond-name">品牌名称</span>
        <el-select
          ref="nameSelect"
          v-model="search.name"
          filterable
          placeholder="请输入"
          size="mini"
          clearable
          @change="searchQuery"
        >
          <el-option
            v-for="item in brandNameOptions"
            :key="item.id"
            :label="item.brandName"
            :value="item.id"
          > </el-option>
        </el-select>
        <span class="cond-name name">品牌联系人</span>
        <el-select
          ref="personSelect"
          v-model="search.person"
          filterable
          placeholder="请输入"
          size="mini"
          clearable
          @change="searchQuery"
        >
          <el-option
            v-for="item in peopleOptions"
            :key="item.id"
            :label="item.brandPerson"
            :value="item.id"
          > </el-option>
        </el-select>
        <!--<el-button @click="reset" class="reset-bottom">重置</el-button>-->
        <!--<el-button @click="query" class="search-bottom">搜索</el-button>-->
      </div>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">品牌列表</span><span class="table-tile-total">共{{page.total}}条</span>
        <el-button
          type="text"
          @click="addBrand"
          style="float: right; line-height: 25px; font-size: 14px; margin-right: 10px;"
          size="small"
        >
          <i
            class="el-icon-plus"
            style="font-weight: bolder;font-size: 12px;margin-left: 20px;"
          ></i>&nbsp;添加品牌</el-button>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 170px); border-radius: 5px;">
        <el-table
          :data="items"
          row-key="id"
          fit
          v-loading="loading"
          class="table-box"
        >
          <el-table-column
            prop="brandName"
            label="品牌名称"
            :resizable="false"
            align="center"
            min-width="12%"
          ></el-table-column>
          <el-table-column
            prop="brandPerson"
            label="品牌联系人"
            :resizable="false"
            align="center"
            min-width="8%"
          ></el-table-column>
          <el-table-column
            prop="phone"
            label="联系人方式"
            :resizable="false"
            align="center"
            min-width="11%"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="联系人邮箱"
            :resizable="false"
            align="center"
            min-width="13%"
          ></el-table-column>
          <el-table-column
            prop="addingTime"
            label="品牌创建时间"
            :resizable="false"
            align="center"
            min-width="13%"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.addingTime ? scope.row.addingTime.split(' ')[0].split('-').join('/') : '' }}</span>
              <span>{{ scope.row.addingTime ? scope.row.addingTime.split(' ')[1] : ''  }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userName"
            label="系统管理员账号"
            :resizable="false"
            align="center"
            min-width="11%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="getSysAdminInfo(scope.$index, scope.row)"
                size="small"
              >{{scope.row.userName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="op"
            label="操作"
            :resizable="false"
            align="center"
            min-width="10%"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="openUpdateBrandDialog(scope.$index, scope.row)"
                size="small"
              >编辑</el-button>
              <el-button
                type="text"
                @click="openDeleteBrandDialog(scope.$index, scope.row)"
                size="small"
              >删除</el-button><br />
              <el-button
                type="text"
                @click="openReplaceSysAdminDialog(scope.$index, scope.row)"
                size="small"
              >更换管理员账号</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
            :resizable="false"
            align="center"
            min-width="10%"
          ></el-table-column>
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

    <!--新建品牌弹窗-->
    <el-dialog
      title="新建品牌"
      :visible.sync="addBrandDialog"
      width="50%"
      :before-close="addReset"
    >
      <span style="font-size: 16px;margin-left: 5%">品牌信息</span>
      <el-form
        class="addPlanForm"
        label-width="30%"
        :rules="rules"
        :model="add"
        ref="add"
        label-position="right"
      >
        <el-form-item
          label="品牌名称"
          prop="name"
        >
          <el-input
            type="text"
            placeholder="请输入品牌名称"
            v-model="add.name"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌联系人"
          prop="person"
        >
          <el-input
            type="text"
            placeholder="请输入品牌负责人"
            v-model="add.person"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系方式"
          prop="phone"
        >
          <el-input
            type="text"
            placeholder="请输入负责人联系电话"
            v-model="add.phone"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            type="text"
            placeholder="请输入负责人邮箱"
            v-model="add.email"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remarks"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入"
            v-model="add.remarks"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span style="font-size: 16px;margin-left: 5%">账号信息</span>
      <el-form
        class="addPlanForm"
        label-width="30%"
        :rules="rules"
        :model="add"
        ref="add"
        label-position="right"
      >
        <el-form-item
          label="用户名"
          prop="sysUserName"
        >
          <el-input
            type="text"
            placeholder="请输入手机号"
            v-model="add.sysUserName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="管理员姓名"
          prop="sysName"
        >
          <el-input
            type="text"
            placeholder="请输入管理员姓名"
            v-model="add.sysName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="sysPassWord"
        >
          <el-input
            :type="pwdType"
            placeholder="请输入密码"
            v-model="add.sysPassWord"
            style="width: 70%"
            size="small"
          ></el-input><span
            class="show-pwd"
            @click="showPwd"
          ><i class="el-icon-view"></i></span>
          <br /><span style="font-size: 12px;float: right;margin-right: 30%">默认密码88888888，如有需要请重新编辑设置</span>
        </el-form-item>
        <!--<el-form-item label="企业工号" prop="op">-->
        <!--<el-input type="text" placeholder="请输入企业工号" v-model="add.sysJobNum" style="width: 70%" size="small"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item
          label="联系方式"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入联系方式"
            v-model="add.sysTelPhone"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入管理员邮箱"
            v-model="add.sysEmail"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <div
          align="center"
          style="margin-top: 30px"
        >
          <el-button
            @click="addReset"
            class="cancel-button"
            size="small"
          >取 消</el-button>
          <el-button
            style="margin-left: 12%"
            @click="saveBrand"
            class="confirm-button"
            size="small"
          >确 定</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!--编辑品牌弹窗-->
    <el-dialog
      title="编辑品牌"
      :visible.sync="updateBrandDialog"
      width="40%"
      :before-close="updateReset"
    >
      <span style="font-size: 16px;margin-left: 5%">品牌信息</span>
      <el-form
        class="addPlanForm"
        label-width="30%"
        :rules="rules"
        :model="update"
        ref="update"
        label-position="right"
      >
        <el-form-item
          label="品牌名称："
          prop="name"
        >
          <el-input
            type="text"
            placeholder="请输入品牌名称"
            v-model="update.name"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="品牌联系人："
          prop="person"
        >
          <el-input
            type="text"
            placeholder="请输入品牌负责人"
            v-model="update.person"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系方式："
          prop="phone"
        >
          <el-input
            type="text"
            placeholder="请输入联系方式"
            v-model="update.phone"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱："
          prop="email"
        >
          <el-input
            type="text"
            placeholder="请输入邮箱"
            v-model="update.email"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="备注："
          prop="remarks"
        >
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入"
            v-model="update.remarks"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <span style="font-size: 16px;margin-left: 5%">账号信息</span>
      <el-form
        class="addPlanForm"
        label-width="30%"
        :rules="rules"
        :model="update"
        ref="update"
        label-position="right"
      >
        <el-form-item
          label="用户名"
          prop="sysUserName"
        >
          <el-input
            :disabled="true"
            type="text"
            placeholder="请输入手机号"
            v-model="update.sysUserName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="管理员姓名"
          prop="sysName"
        >
          <el-input
            :disabled="true"
            type="text"
            placeholder="请输入管理员姓名"
            v-model="update.sysName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="sysPassWord"
        >
          <el-input
            :type="pwdType"
            placeholder="请输入密码"
            v-model="update.sysPassWord"
            style="width: 70%"
            size="small"
          ></el-input><span
            class="show-pwd"
            @click="showPwd"
          ><i class="el-icon-view"></i></span>
        </el-form-item>
        <!--<el-form-item label="企业工号" prop="op">-->
        <!--<el-input type="text" placeholder="请输入企业工号" v-model="update.sysJobNum" style="width: 70%" size="small"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item
          label="联系方式"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入联系方式"
            v-model="update.sysTelPhone"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入管理员邮箱"
            v-model="update.sysEmail"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        align="center"
        style="margin-top: 30px"
      >
        <el-button
          @click="updateReset"
          size="small"
          class="cancel-button"
        >取 消</el-button>
        <el-button
          style="margin-left: 12%"
          @click="saveUpdate"
          size="small"
          class="confirm-button"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--品牌详情弹窗-->
    <el-dialog
      title="品牌详情"
      :visible.sync="sysAdminInfoDialog"
      width="30%"
    >
      <el-form
        class="addPlanForm"
        size="mini "
        label-width="50%"
        :rules="rules2"
        :model="detail"
        ref="detail"
        label-position="right"
      >
        <el-form-item
          label="用户名："
          prop="userName"
        >
          <span>{{this.detail.userName}}</span>
        </el-form-item>
        <el-form-item
          label="姓名："
          prop="name"
        >
          <span>{{this.detail.name}}</span>
        </el-form-item>
        <!--<el-form-item label="企业工号：" prop="jobNum">-->
        <!--<span>{{this.detail.jobNum}}</span>-->
        <!--</el-form-item>-->
        <el-form-item
          label="联系电话："
          prop="telPhone"
        >
          <span>{{this.detail.telPhone}}</span>
        </el-form-item>
        <el-form-item
          label="邮箱："
          prop="email"
        >
          <span>{{this.detail.email}}</span>
        </el-form-item>
      </el-form>
      <div
        align="center"
        style="margin-top: 30px"
      >
        <el-button
          @click="sysAdminInfoDialog = false"
          size="small"
        >取 消</el-button>
      </div>
    </el-dialog>

    <!--删除品牌弹窗-->
    <el-dialog
      title="操作提示"
      :visible.sync="deleteBrandDialog"
      width="35%"
    >
      <div align="center">
        <span>您正在删除 {{this.brandName}} 的信息，<br />是否确定删除该品牌信息？</span>
      </div>
      <div
        align="center"
        style="margin-top: 30px"
      >
        <el-button
          @click="deleteBrandDialog = false"
          size="small"
        >取 消</el-button>
        <el-button
          @click="saveDelete"
          size="small"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!--更换管理员账号-->
    <el-dialog
      title="更换管理员账号"
      :visible.sync="replaceSysAdminDialog"
      width="35%"
    >
      <el-form
        class="addPlanForm"
        label-width="30%"
        :rules="rules"
        :model="replace"
        ref="replace"
        label-position="right"
      >
        <el-form-item
          label="品牌名称："
          prop="name"
        >
          <el-input
            :disabled="true"
            type="text"
            placeholder="请输入品牌名称"
            v-model="replace.name"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="sysUserName"
        >
          <el-input
            type="text"
            placeholder="请输入手机号"
            v-model="replace.sysUserName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="管理员姓名"
          prop="sysName"
        >
          <el-input
            type="text"
            placeholder="请输入管理员姓名"
            v-model="replace.sysName"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="sysPassWord"
        >
          <el-input
            :type="pwdType"
            placeholder="请输入密码"
            v-model="replace.sysPassWord"
            style="width: 70%"
            size="small"
          ></el-input><span
            class="show-pwd"
            @click="showPwd"
          ><i class="el-icon-view"></i></span>
        </el-form-item>
        <!--<el-form-item label="企业工号" prop="op">-->
        <!--<el-input type="text" placeholder="请输入企业工号" v-model="replace.sysJobNum" style="width: 70%" size="small"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item
          label="联系方式"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入联系方式"
            v-model="replace.sysTelPhone"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="管理员邮箱"
          prop="op"
        >
          <el-input
            type="text"
            placeholder="请输入管理员邮箱"
            v-model="replace.sysEmail"
            style="width: 70%"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        align="center"
        style="margin-top: 30px"
      >
        <el-button
          @click="replaceSysAdminDialog = false"
          size="small"
        >取 消</el-button>
        <el-button
          @click="saveReplaceSys"
          size="small"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBrandList, addBrand, getBrandInfo, saveUpdate, saveDelete, getSysAdminInfo, updateSysAdmin, getBrandOptions } from '@/api/brand'
import bus from '@/rootbus'
import { Message } from 'element-ui'
import Pagination from '@/components/Pagination'
import crypto from 'crypto'
export default {
  name: 'BrandManage',
  components: {
    Pagination
  },
  data() {
    const checkUserName = (rule, value, callback) => {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!value) {
        return callback(new Error('用户名不能为空'))
      } else if (isNaN(value) || !reg.test(value)) {
        return callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      search: {
        name: '',
        person: ''
      },
      add: {
        name: '',
        person: '',
        phone: '',
        email: '',
        remarks: '',
        sysUserName: '',
        sysName: '',
        sysPassWord: '88888888',
        sysJobNum: '',
        sysTelPhone: '',
        sysEmail: ''
      },
      update: {
        id: '',
        name: '',
        person: '',
        phone: '',
        email: '',
        remarks: '',
        sysUserName: '',
        sysName: '',
        sysPassWord: '',
        sysJobNum: '',
        sysTelPhone: '',
        sysEmail: '',
        oldBrandName: ''
      },
      replace: {
        id: '',
        oldUserName: '',
        name: '',
        sysUserName: '',
        sysName: '',
        sysPassWord: '',
        sysTelPhone: '',
        sysEmail: ''
      },
      detail: {
        userName: '',
        telPhone: '',
        name: '',
        jobNum: '',
        email: ''
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: true,
      addBrandDialog: false,
      updateBrandDialog: false,
      deleteBrandDialog: false,
      sysAdminInfoDialog: false,
      replaceSysAdminDialog: false,
      items: [],
      brandNameOptions: [],
      peopleOptions: [],
      brandName: '',
      id: '',
      userName: '',
      pwdType: 'password',
      rules: {
        name: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' }
        ],
        sysUserName: [
          { required: true, validator: checkUserName, trigger: 'blur' }
        ],
        sysName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        sysPassWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rules2: {
      }
    }
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
      this.page.currentPage = 1
      this.init()
    },
    init() {
      this.query()
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    addRow() {
      var data = {
        name: ''
      }
      this.items.unshift(data)
    },
    addBrand() {
      this.addBrandDialog = true
    },
    addReset() {
      this.add.name = ''
      this.add.email = ''
      this.add.person = ''
      this.add.phone = ''
      this.add.remarks = ''
      this.add.sysUserName = ''
      this.add.sysName = ''
      this.add.sysPassWord = ''
      this.add.sysJobNum = ''
      this.add.sysTelPhone = ''
      this.add.sysEmail = ''
      this.addBrandDialog = false
      this.$refs.add.resetFields()
    },
    updateReset() {
      this.updateBrandDialog = false
      this.$refs.update.resetFields()
    },
    replaceSysReset() {
      this.replaceSysAdminDialog = false
      this.$refs.replace.resetFields()
    },
    saveBrand: function () {
      if (this.add.name === '') {
        this.errorMsg('请先填写当前必填项')
        return
      }
      this.$refs.add.validate((valid) => {
        if (valid) {
          const hash = crypto.createHash('md5')
          hash.update(this.add.sysPassWord)
          const submitPassword = hash.digest('hex')
          const params = {
            brandName: this.add.name,
            email: this.add.email,
            phone: this.add.phone,
            brandPerson: this.add.person,
            remarks: this.add.remarks,
            sysUserName: this.add.sysUserName,
            sysName: this.add.sysName,
            sysPassWord: this.add.sysPassWord,
            sysJobNum: this.add.sysJobNum,
            sysTelPhone: this.add.sysTelPhone,
            sysEmail: this.add.sysEmail,
            md5PassWord: submitPassword
          }
          addBrand(params).then((res) => {
            if (res === 0) {
              this.successMsg('成功')
              this.addReset()
            } else {
              this.errorMsg('品牌名称或用户名已经存在 无法创建')
            }
            this.query()
          })
        } else {
          this.errorMsg('输入项有误  请检查')
        }
      })
    },
    openUpdateBrandDialog: function ($index, row) {
      const params = {
        id: row.id
      }
      getBrandInfo(params).then((res) => {
        this.update.id = res.id
        this.update.name = res.brandName
        this.update.person = res.brandPerson
        this.update.phone = res.phone
        this.update.email = res.email
        this.update.remarks = res.remarks
        this.update.sysUserName = res.userName
        this.update.sysName = res.name
        this.update.sysPassWord = res.passWord
        this.update.sysJobNum = res.jobNum
        this.update.sysTelPhone = res.telPhone
        this.update.sysEmail = res.sysEmail
        this.update.oldBrandName = res.oldBrandName
        this.updateBrandDialog = true
      })
    },
    saveUpdate: function () {
      if (this.update.name === '') {
        this.errorMsg('请先填写当前必填项')
        return
      }
      this.$refs.update.validate((valid) => {
        if (valid) {
          const hash = crypto.createHash('md5')
          hash.update(this.update.sysPassWord)
          const submitPassword = hash.digest('hex')
          const params = {
            brandName: this.update.name,
            brandPerson: this.update.person,
            phone: this.update.phone,
            email: this.update.email,
            remarks: this.update.remarks,
            userName: this.update.sysUserName,
            name: this.update.sysName,
            passWord: this.update.sysPassWord,
            jobNum: this.update.sysJobNum,
            telPhone: this.update.sysTelPhone,
            sysEmail: this.update.sysEmail,
            md5PassWord: submitPassword,
            oldBrandName: this.update.oldBrandName,
            id: this.update.id
          }
          saveUpdate(params).then((res) => {
            if (res === 0) {
              this.successMsg('成功')
              this.updateReset()
            } else {
              this.errorMsg('该品牌名称已经存在 无法编辑')
            }
            this.query()
          })
        } else {
          this.errorMsg('请输入必填项')
        }
      })
    },
    openReplaceSysAdminDialog: function ($index, row) {
      const params = {
        id: row.id
      }
      getBrandInfo(params).then((res) => {
        this.replace.id = res.id
        this.replace.name = res.brandName
        this.replace.sysUserName = res.userName
        this.replace.oldUserName = res.userName
        this.replace.sysName = res.name
        this.replace.sysPassWord = res.passWord
        this.replace.sysTelPhone = res.telPhone
        this.replace.sysEmail = res.sysEmail
        this.replaceSysAdminDialog = true
      })
    },
    saveReplaceSys: function () {
      if (this.replace.sysUserName === '' || this.replace.sysName === '' || this.replace.sysPassWord === '') {
        this.errorMsg('请先填写当前必填项')
        return
      }
      const hash = crypto.createHash('md5')
      hash.update(this.replace.sysPassWord)
      const submitPassword = hash.digest('hex')
      const params = {
        oldUserName: this.replace.oldUserName,
        userName: this.replace.sysUserName,
        name: this.replace.sysName,
        passWord: this.replace.sysPassWord,
        telPhone: this.replace.sysTelPhone,
        sysEmail: this.replace.sysEmail,
        md5PassWord: submitPassword,
        id: this.replace.id
      }
      updateSysAdmin(params).then((res) => {
        if (res === 0) {
          this.successMsg('成功')
          this.replaceSysReset()
        } else {
          this.errorMsg('用户名已经存在 无法创建')
        }
        // 为了在删除最后一页的最后一条数据时能成功跳转回最后一页的上一页
        const totalPage = Math.ceil((this.page.total - 1) / this.page.pageSize) // 总页数
        this.page.currentPage = this.page.currentPage > totalPage ? totalPage : this.page.currentPage
        this.page.currentPage = this.page.currentPage < 1 ? 1 : this.page.currentPage
        this.query()
      })
    },
    openDeleteBrandDialog: function ($index, row) {
      this.id = row.id
      this.userName = row.userName
      this.brandName = row.brandName
      this.deleteBrandDialog = true
    },
    saveDelete: function () {
      const params = {
        id: this.id,
        userName: this.userName
      }
      saveDelete(params).then((res) => {
        if (res === 0) {
          this.successMsg('成功')
        } else {
          this.errorMsg('该品牌下已创建门店或区域 无法删除')
        }
        this.deleteBrandDialog = false
        this.query()
      })
    },
    reset() {
      this.search.name = ''
      this.search.person = ''
      this.searchQuery()
    },
    searchQuery() {
      this.page.currentPage = 1
      this.pageshow = false
      this.query()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        name: this.search.name,
        person: this.search.person,
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      getBrandList(params).then((res) => {
        this.loading = false
        this.items = []
        this.page.total = res.total
        this.$nextTick(() => {
          this.items = res.data
        })
      })
    },
    getOptions: function () {
      const params = {}
      getBrandOptions(params).then((res) => {
        this.brandNameOptions = res[0]
        this.peopleOptions = res[1]
      })
    },
    getSysAdminInfo: function ($index, row) {
      const params = {
        id: row.id
      }
      getSysAdminInfo(params).then((res) => {
        this.detail.userName = res.userName
        this.detail.telPhone = res.telPhone
        this.detail.name = res.name
        this.detail.jobNum = res.jobNum
        this.detail.email = res.email
        this.sysAdminInfoDialog = true
      })
    },
    successMsg: function (msg) {
      Message({
        showClose: false,
        message: msg,
        type: 'success',
        duration: 5 * 1000
      })
    },
    errorMsg: function (msg) {
      Message({
        showClose: false,
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  mounted() {
    this.getOptions()
    this.query(this.page.currentPage)
    // 页面监听回车
    bus.$on('formquery', (...args) => {
      this.query()
      this.$refs['nameSelect'].blur()
      this.$refs['personSelect'].blur()
    })
  }
}
</script>

<style>
$dark_gray: #889aa4;

.show-pwd {
  position: absolute;
  right: 25%;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>

