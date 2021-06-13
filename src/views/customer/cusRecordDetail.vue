<template>
  <div
    class="cusRecordDetail"
    id="cusRecordDetail"
  >
    <div class="app-container">
      <div>
        <el-row
          :gutter="10"
          style="margin-bottom:16px"
        >
          <el-col>
            <el-card
              class="card"
              shadow="hover"
            >
              <div class="identImg">
                <img
                  :src="info.img + '?token=' + token"
                  @click="()=>{LookBigPicture(info.img)}"
                >
                <svg-icon
                  v-if="info.identity=='员工'"
                  :icon-class="info.identity=='员工'?'worker':''"
                  class="identity"
                />
                <svg-icon
                  v-if="info.identity=='外卖/快递'"
                  :icon-class="info.identity=='外卖/快递'?'expressman':''"
                  class="identity"
                />
                <svg-icon
                  v-if="info.identity=='保洁/保安'"
                  :icon-class="info.identity=='保洁/保安'?'takeway':''"
                  class="identity"
                />
                <svg-icon
                  v-if="info.identity=='其他'"
                  :icon-class="info.identity=='其他'?'others':''"
                  class="identity"
                />
                <svg-icon
                  v-if="isMember"
                  icon-class="vip"
                  class="vip"
                />
              </div>
              <div class="identContent">
                <div class="userInfo">
                  <span>身份ID：&nbsp;{{info.userId}}</span>
                  <span>性别：&nbsp;{{info.gender}}</span>
                  <span>年龄：&nbsp;{{info.age}}岁</span>
                  <span v-show="info.total1">累计到店次数：&nbsp;{{info.total1}}</span>
                  <span v-show="info.name">员工姓名：&nbsp;{{info.name}}</span>
                  <span v-show="info.jobNum">员工编号：&nbsp;{{info.jobNum}}</span>
                  <span v-show="info.storeName">所属门店：&nbsp;{{info.storeName}}</span>
                  <span v-show="info.email">员工邮箱：&nbsp;{{info.email}}</span>
                </div>
                <div>
                  <span v-if="isWhite">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="removeWhitePrivilege"
                      @click="removeFromComfirmDialog = true"
                    >{{'移出白名单'}}</el-button>
                  </span>
                  <span v-else>
                    <el-button
                      v-if="!isMember"
                      type="primary"
                      size="mini"
                      @click="registerMemberDialog = true"
                    >{{'注册会员'}}</el-button>
                    <el-button
                      v-if="!isWhite"
                      type="primary"
                      size="mini"
                      @click="addTag"
                    >{{'打标签'}}</el-button>
                    <el-button
                      v-if="addWhitePrivilege"
                      type="primary"
                      size="mini"
                      @click="operationDialog = true"
                    >{{'加入白名单'}}</el-button>
                    <el-button
                      v-if="addBlackPrivilege"
                      type="primary"
                      size="mini"
                      @click="addToBlackList"
                    >{{'加入黑名单'}}</el-button>
                  </span>
                  <span style="display:inline-block;margin-left:16px">
                    <span v-if="info.removeTime">移出白名单时间:&nbsp&nbsp{{info.removeTime}}</span>
                    <span v-if="info.filterTime">加入白名单时间:&nbsp&nbsp{{info.filterTime}}</span>
                  </span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          style="margin-bottom:16px"
          v-if="!isWhite"
        >
          <el-col>
            <el-card
              class="card"
              shadow="hover"
            >
              <div class="identContent">
                标签：&nbsp;
                <span
                  v-if="cusTags.length>0"
                  style="display:inline-block;height:28px;line-height:28px"
                >
                  <el-tag
                    v-for="tag in cusTags"
                    :key="tag.value"
                    closable
                    @close="handleClose(tag.value)"
                    type="info"
                    size="medium"
                    style="margin-right:10px"
                  >
                    {{tag.label}}
                  </el-tag>
                </span>
                <span v-else>
                  暂无标签
                </span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          v-if="!isWhite&&isMember"
          style="margin-bottom:16px"
        >
          <el-col>
            <el-card
              class="card"
              shadow="hover"
            >
              <div class="identContent">
                <p>会员信息:<i
                    class="el-icon-edit"
                    style="color:#1890FF;margin-left:10px"
                    @click="registerMemberDialog = true"
                  ></i></p>
                <div class="memberInfo">
                  <span>姓名：&nbsp;{{member.name}}</span>
                  <span>会员生日：&nbsp;{{member.birthday}}</span>
                  <span>注册门店：&nbsp;{{member.registerStore}}</span>
                  <span>手机号：&nbsp;{{member.phone}}</span>
                  <span>成为会员时间：&nbsp;{{member.addTime}}</span>
                  <span>注册方式：&nbsp;{{member.registerType}}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row
          :gutter="10"
          class="detailContent"
        >
          <CusVisitDetail></CusVisitDetail>
        </el-row>
      </div>
    </div>
    <template>
      <el-dialog
        :visible.sync="bigPicture"
        width="420px"
        :show-close="false"
        class="bigPicture"
      >
        <img
          :src="imgSrc"
          width="452px"
          style="margin: auto;height: 440px;margin:-21px;vertical-align:middle"
        />
      </el-dialog>
    </template>
    <el-dialog
      :visible.sync="removeTagDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog "> <span class="el-icon-warning"></span><span class="confirmText">确认移除该标签？</span></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="removeTagDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          @click="customerLabelRemove"
          size="small"
        >移除</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="加入白名单"
      :visible.sync="operationDialog"
      width="622px"
      :before-close="reset"
      class="addTowhiteList"
    >
      <div style="padding:8px 0px 0px 30px;">
        <img
          :src="info.img + '?token=' + token"
          v-if="info.img.indexOf('http://') != -1"
          style="width: 94px;height: 128px;float:left;"
        >
        <div style="width:478px;height:284px;float:left">
          <el-form
            class="addPlanForm"
            label-width="90px"
            :rules="rules"
            :model="operation"
            ref="operation"
            label-position="right"
            style="margin-top: 5%"
            size="small"
          >
            <el-form-item
              label="身份标记:"
              prop="identity"
            >
              <template>
                <el-radio-group
                  v-model="radio"
                  size="mini"
                >
                  <el-radio
                    label="1"
                    border
                    size="mini"
                  >员工</el-radio>
                  <el-radio
                    label="2"
                    border
                  >外卖&快递</el-radio>
                  <el-radio
                    label="3"
                    border
                  >保洁&保安</el-radio>
                  <el-radio
                    label="4"
                    border
                  >其他</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item
              label="所属门店:"
              prop="store"
              v-if="radio === '1'||radio === '3'"
            >
              <el-select
                ref="nameSelect"
                v-model="operation.storeId"
                filterable
                placeholder="请输入"
                :clearable=false
                style="width:272px"
              >
                <el-option
                  v-for="item in storeList.slice(1)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                > </el-option>
              </el-select>
            </el-form-item>
            <template v-if="radio === '1'">
              <el-form-item label="员工姓名:">
                <el-input
                  v-model="operation.name"
                  placeholder=""
                  style="width:272px"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="员工编号:"
                prop="jobNum"
              >
                <el-input
                  v-model="operation.jobNum"
                  placeholder=""
                  style="width:272px"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="员工邮箱:"
                prop="email"
              >
                <el-input
                  v-model="operation.email"
                  placeholder=""
                  style="width:272px"
                ></el-input>
              </el-form-item>
            </template>

            <el-form-item
              label="备注:"
              prop="remarks"
              v-if="radio === '4'"
            >
              <el-input
                v-model="operation.remarks"
                type="text"
                style="width:276px"
                :maxlength='15'
                show-word-limit
              ></el-input>
            </el-form-item>

          </el-form>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="reset"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveOperation"
          size="small"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="removeFromComfirmDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确认将该用户移出白名单?</span></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="removeFromComfirmDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="moveFromWhite"
        >确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="加入黑名单"
      :visible.sync="addBlackDialog"
      width="622px"
      :before-close=" resetBlack"
      class="addTowhiteList"
    >
      <div style="padding:8px 0px 0px 30px">
        <img
          :src="info.img + '?token=' + token"
          v-if="info.img.indexOf('http://') != -1"
          style="width: 94px;height: 128px;margin-left:214px"
        >
        <div style="width:478px;height:284px;margin:30px 0px 0px 88px">
          <el-form
            class="addPlanForm"
            label-width="70px"
            :rules="rules"
            :model="black"
            ref="black"
            label-position="center"
            style="width:346px"
            size="small"
          >
            <el-form-item
              label="标记为:"
              prop="tag"
            >
              <el-input
                v-model="black.tag"
                placeholder="请进行标记如：小偷"
                style="width:276px"
                :maxlength='5'
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="resetBlack"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveBlack"
          size="small"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="isMember?'编辑会员':'注册会员'"
      :visible.sync="registerMemberDialog"
      width="622px"
      :before-close="resetMember"
      class="addTowhiteList"
    >
      <div style="padding:8px 0px 0px 30px">
        <img
          :src="info.img + '?token=' + token"
          v-if="info.img.indexOf('http://') != -1"
          style="width: 94px;height: 128px;float:left"
        >
        <div style="width:478px;height:284px;float:left">
          <el-form
            class="addPlanForm"
            label-width="90px"
            :rules="rules"
            :model="member"
            ref="member"
            label-position="center"
            style="width:346px"
            size="small"
          >
            <el-form-item
              label="姓名:"
              prop="name"
            >
              <el-input
                v-model="member.name"
                :maxlength='5'
                show-word-limit
                placeholder="请输入姓名"
                style="width:276px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="手机号:"
              prop="phone"
            >
              <el-input
                v-model="member.phone"
                placeholder="请输入手机号"
                style="width:276px"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="生日:"
              prop="birthday"
            >
              <el-date-picker
                v-model="member.birthday"
                value-format='yyyy-MM-dd'
                type="date"
                style="width:276px"
                placeholder="请选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="注册门店:"
              prop="registerStore"
            >
              <el-select
                v-model="member.registerStoreId"
                placeholder="默认最近到店"
                style="width:276px"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="resetMember"
          size="small"
        >取消</el-button>
        <el-button
          v-if="isMember"
          type="primary"
          @click="customerUpdateMember"
          size="small"
        >确定</el-button>
        <el-button
          v-else
          type="primary"
          @click="postRegisterMember"
          size="small"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择标签"
      :visible.sync="selectTagDialog"
      width="622px"
      :before-close="resetTag"
      class="addTowhiteList"
    >
      <div style="padding:0px 20px 20px 0px;margin-top:-14px">
        <div style="textAlign:right;margin-bottom:16px">
          <el-input
            placeholder="请输入标签名称关键字"
            v-model="searchTag"
            class="input-with-select"
            style="width:204px;height:28px"
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
        </div>
        <div class="selectTags">
          <checked
            :attribute='tags'
            :maxTags='10-cusTags.length'
            @changeCheckList='changeTagCheckList'
            :checked='tagsChecked'
          ></checked>
        </div>
        <div style="color:rgba(0,0,0,0.45);font-size:12px;height:24px;line-height:24px">注：每位顾客最多可打10个标签</div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="resetTag"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          @click="postTagChecked"
          size="small"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
// import { mapGetters } from 'vuex'
import { getWhiteCustomerInfo, getStoreOption, operationCustomer, removeWhiteCustomer, addToBlack, postRegisterMember, customerUpdateMember, postTagChecked, getLabelList, customerLabelRemove } from '@/api/customer'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import checked from './component/tagChecked'
import CusVisitDetail from './cusVisitDetail'
export default {
  name: 'CustomerDetail',
  components: {
    checked,
    CusVisitDetail
  },
  computed: {
    editCheckPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('进店详情审核') > -1
    },
    addWhitePrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('加入白名单') > -1
    },
    addBlackPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('加入黑名单') > -1
    },
    removeWhitePrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('移出白名单') > -1
    }
  },
  data() {
    const validateTag = (rule, value, callback) => {
      if (value.replace(/\s*/g, '') === '') {
        callback(new Error('标记不能为空'))
      } else {
        callback()
      }
    }
    const validateIphone = (rule, value, callback) => {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (!value) {
        callback(new Error('手机号不能为空'))
      } else if (isNaN(value) || !reg.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      search: {},
      isWhite: true,
      isMember: false,
      operationDialog: false,
      addBlackDialog: false,
      registerMemberDialog: false,
      selectTagDialog: false,
      removeFromComfirmDialog: false,
      removeTagDialog: false,
      bigPicture: false,
      imgSrc: '',
      imgWidth: '',
      imgHeight: '',
      token: getToken(),
      storeList: [],
      info: {
        storeName: '',
        storeId: '',
        img: '',
        userId: '',
        gender: '',
        age: '',
        identity: '',
        times: '',
        removeTime: '',
        total1: '',
        total: ''
      },
      radio: '1',
      dateTitle: '',
      operation: {
        userId: '',
        gender: '',
        age: '',
        identity: 0,
        store: '',
        storeId: '',
        jobNum: '',
        name: '',
        remarks: '',
        email: ''
      },
      black: {
        tag: ''
      },
      originOptions: [],
      cusTags: [],
      searchTag: '',
      tags: [],
      tagsChecked: [],
      member: {
        img: '',
        registerStore: '',
        registerStoreId: '',
        name: '',
        phone: '',
        birthday: '',
        status: ''
      },
      rules: {
        store: [
          { required: true, message: '请选择门店', trigger: 'blur' }
        ],
        tag: [
          { required: true, trigger: 'blur', validator: validateTag }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validateIphone }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    moveFromWhite: function () {
      const params = {
        userId: this.info.userId
      }
      removeWhiteCustomer(params).then((res) => {
        if (res === 0) {
          this.successMsg('移出白名单成功')
          this.$router.push({ name: 'WhiteList' })
        } else {
          this.errorMsg('移出白名单失败')
        }

        this.removeFromComfirmDialog = false
      })
    },
    reset() {
      this.$refs['operation'].resetFields()
      this.operationDialog = false
      this.radio = '1'
      this.operation.jobNum = ''
      this.operation.name = ''
      this.operation.email = ''
      this.operation.remarks = ''
    },
    resetBlack() {
      this.$refs.black.resetFields()
      this.addBlackDialog = false
    },
    resetMember() {
      this.$refs.member.resetFields()
      this.member.img = ''
      this.registerMemberDialog = false
    },
    postRegisterMember() {
      this.$refs['member'].validate(valid => {
        if (valid) {
          this.registerMemberDialog = false
          const { phone, name, birthday, registerStoreId } = this.member
          const params = {
            userId: this.info.userId,
            registerStore: registerStoreId,
            phone,
            name: name,
            birthday,
            status: '1'
          }
          postRegisterMember(params).then(res => {
            if (res === 0) {
              this.successMsg('会员注册成功')
              this.getWhiteCustomerInfo()
            } else {
              this.errorMsg('会员注册失败')
            }
          })
        }
      })
    },
    customerUpdateMember() {
      this.$refs['member'].validate(valid => {
        if (valid) {
          this.registerMemberDialog = false
          const { phone, name, birthday, registerStoreId } = this.member
          const params = {
            userId: this.info.userId,
            registerStore: registerStoreId,
            phone,
            name: name,
            birthday
          }
          customerUpdateMember(params).then(res => {
            if (res === 0) {
              this.successMsg('会员信息更新成功')
              this.getWhiteCustomerInfo()
            } else {
              this.errorMsg('会员信息更新失败')
            }
          })
        }
      })
    },
    postTagChecked() {
      if (this.tagsChecked.length < 1) {
        this.errorMsg('请至少选择一个标签')
        return
      }
      this.selectTagDialog = false
      const params = { tagIds: this.tagsChecked, userId: this.info.userId }
      postTagChecked(params).then(res => {
        if (res.code === 0) {
          this.successMsg(res.message)
          this.tagsChecked = []
          this.getWhiteCustomerInfo()
        } else {
          this.errorMsg(res.message)
        }
      })
    },
    handleClose(val) {
      this.removeTagDialog = true
      this.labelValue = val
    },
    customerLabelRemove() {
      const params = { userId: this.info.userId, labelValue: this.labelValue }
      this.removeTagDialog = false
      customerLabelRemove(params).then(res => {
        if (res === 0) {
          this.successMsg('标签移除成功')
          this.labelValue = ''
          this.getWhiteCustomerInfo()
        } else {
          this.errorMsg('标签移除失败')
        }
      })
    },
    searchQuery() {
      this.getLabelList(this.searchTag)
    },
    saveOperation: function () {
      if (this.operation.remarks.length > 15) {
        this.errorMsg('备注输入字数超过限制')
        return
      }
      const params = {
        userId: this.info.userId,
        identity: this.radio,
        storeId: this.operation.storeId,
        jobNum: this.operation.jobNum,
        name: this.operation.name,
        email: this.operation.email,
        remarks: this.operation.remarks
      }
      operationCustomer(params).then((res) => {
        if (res === 0) {
          this.successMsg('加入白名单成功')
          this.reset()
          this.$router.push({ name: 'CustomerList' })
        } else {
          this.errorMsg('加入白名单失败')
        }
      })
    },
    saveBlack() {
      this.$refs['black'].validate((valid) => {
        if (valid) {
          const params = {
            userId: this.info.userId,
            tag: this.black.tag
          }
          addToBlack(params).then(res => {
            if (res === 0) {
              this.successMsg('加入黑名单成功')
              this.resetBlack()
              this.$router.push({ name: 'CustomerList' })
            } else {
              this.errorMsg('加入黑名单失败')
            }
          })
        }
      })
    },
    getStoreOption() {
      getStoreOption({}).then(res => {
        this.storeList = res
      })
    },
    addTag() {
      this.getLabelList()
      this.selectTagDialog = true
    },
    resetTag() {
      this.selectTagDialog = false
    },
    changeTagCheckList(val) {
      this.tagsChecked = val
    },
    addToBlackList() {
      this.addBlackDialog = true
    },
    init() {
      this.getStoreOption()
      this.getWhiteCustomerInfo()
      this.getLabelList()
    },
    getLabelList(val) {
      const params = { userId: this.info.userId, keyWord: val || '' }
      getLabelList(params).then(res => {
        this.tags = res
      })
    },
    getWhiteCustomerInfo() {
      getWhiteCustomerInfo({ userId: this.info.userId }).then(res => {
        this.info = res.customer
        this.cusTags = res.tags
        if (res.member) {
          this.isMember = true
          this.member = res.member
        }
        this.member.registerStoreId = res.customer.storeId
      })
    },
    LookBigPicture(val, id) {
      this.imgSrc = val + '?token=' + this.token
      this.bigPicture = true
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
  created() {
    this.isWhite = this.$route.matched[2].meta.title === '白名单详情'
    this.operation.storeId = this.$route.query.storeId ? this.$route.query.storeId : ''
    this.isMember = this.$route.query.isMember === 1
    if (this.$route.query.userId) {
      var id = this.$route.query.userId
      this.info.userId = id
    } else {
      this.info.userId === ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.card {
  width: 100%;
  border-radius: 5px;
  border: none !important;
  padding: 16px 20px 16px 20px;
  font-size: 0px;
  .el-button {
    border-radius: 4px;
  }
  // &.cardDetail {
  //   padding: 5px 20px 16px 20px;
  // }
  // #weekChart {
  //   width: 500px;
  //   height: 320px;
  // }
  // #hourChart {
  //   width: 500px;
  //   height: 320px;
  // }
}
.detailContent {
  .card {
    min-height: calc(100vh - 200px);
    position: relative;
  }
}
.el-card {
  border: 1px solid #ffffff;
  border-radius: 2px;
}
.confirmDialog {
  margin-top: -34px;
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
.identContent {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  float: left;
  width: calc(100% - 82px);
  padding-left: 20px;
  div:nth-child(1) {
    height: 44px;
    line-height: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    span {
      // float: left;
      display: inline-block;
      margin-right: 68px;
      margin-bottom: 10px;
    }
    // margin-bottom: 18px;
  }
  div:nth-child(2) {
    padding: 10px 0px 0px;
  }
  // padding-bottom: 11px;
}
.identImg {
  vertical-align: middle;
  float: left;
  width: 62px;
  position: relative;
  height: 84px;
  img {
    width: 62px;
    height: 84px;
  }
  .identity {
    position: absolute;
    left: 31px;
    top: 0px;
    width: 31px;
    height: 31px;
  }
  .vip {
    position: absolute;
    right: 0px;
    bottom: -3px;
    font-size: 21px;
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
.memberInfo {
  display: flex;
  flex-wrap: wrap;
  span {
    width: 30%;
    margin-bottom: 16px;
  }
}
.selectTags {
  background: rgba(0, 0, 0, 0.04);
  padding: 20px 0px 20px 20px;
  height: 200px;
  overflow-y: auto;
}
</style>

