<template>
  <div
    class="list"
    id="list"
    ref="cusListBox"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <div
        style="background-color: #ffffff;font-size:14px;padding:0px 20px"
        :class="expand?'':'hidden'"
      >
        <div class="selectQuery">
          <span>
            <span class="cond-name">到店时间:</span>
            <el-date-picker
              v-model="search.startDate"
              type="date"
              value-format='yyyy-MM-dd'
              placeholder="选择日期"
              size='mini'
              style="width:140px"
              :clearable="false"
              @change="searchQuery"
            >
            </el-date-picker>
            <span class="cond-name">到</span>
            <el-date-picker
              v-model="search.endDate"
              type="date"
              value-format='yyyy-MM-dd'
              placeholder="选择日期"
              size='mini'
              style="width:140px"
              :clearable="false"
              @change="searchQuery"
            >
            </el-date-picker>
          </span>
          <span>
            <span class="cond-name name">选择门店:</span>
            <el-select
              v-model="search.structId"
              filterable
              placeholder="请选择"
              size="mini"
              clearable
              style="width:140px"
              @change="searchQuery"
            >
              <el-option
                v-for="item in storeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              > </el-option>
            </el-select>
          </span>
          <span>
            <span
              v-if="editCheckPrivilege"
              class="cond-name name"
            >阅读状态:</span>
            <el-select
              v-model="checkResult"
              filterable
              placeholder="请选择"
              size="mini"
              clearable
              style="width:140px"
              @change="searchQuery"
              v-if="editCheckPrivilege"
            >
              <el-option
                v-for="item in checkOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              > </el-option>
            </el-select>
            <span>
            </span>
            <span
              class="cond-name expand"
              @click="expandAll"
            >
              <span>
                {{expand?'收起':'展开'}}
              </span>
              <svg-icon :icon-class="expand?'arrow-up':'arrow-down'" /></span>
          </span>
        </div>
        <div class="selectQuery">
          <span>
            <span class="cond-name">属性:</span>
            <checked
              :attribute='attribute'
              @changeCheckList='changeAttributeCheckList'
              :checked='attributeChecked'
            ></checked>
          </span>
          <span>
            <span class="cond-name">性别:</span>
            <checked
              :attribute='gender'
              :checked='genderChecked'
              @changeCheckList='changeGenderCheckList'
            ></checked>
          </span>
          <span>
            <span class="cond-name">身份:</span>
            <checked
              :attribute='identity'
              :checked='identityChecked'
              @changeCheckList='changeIdentityCheckList'
            ></checked>
          </span>
          <span style="display:inline-block">
            <span class="cond-name">年龄:</span>
            <checked
              :attribute='age'
              :checked='ageChecked'
              @changeCheckList='changeAgeCheckList'
            ></checked>
          </span>
        </div>
      </div>
      <div>
        <div style="margin-top:16px;">
          <div class="table-container">
            <a
              v-bind:href="handleExport"
              target="_blank"
              class="export-btn"
            >
              <el-button
                type="primary"
                size="mini"
              >导出表格</el-button>
            </a>
            <span
              v-if='page.total==0&&!loading'
              class="noData"
            >
              <svg-icon icon-class="nodata" />
              <p class="noDataText">暂无数据</p>
            </span>
            <el-tabs
              v-model="activeName"
              type="card"
              @tab-click="handleClick"
            >
              <el-tab-pane
                :name="tab.name"
                v-for="tab in tabs"
                :key='tab.name'
                v-loading='loading'
              >
                <span slot="label">
                  <span class="tabText">{{tab.text}}</span>
                  <span v-if='activeName!==tab.name'>
                    <svg-icon
                      icon-class="sort-default"
                      style="font-size:12px;"
                    />
                  </span>
                  <span v-else>
                    <svg-icon
                      style="font-size:12px;"
                      :icon-class="sort?'sort-up':'sort-down'"
                    />
                  </span>
                </span>
                <div class="listCard">
                  <div
                    class="listCardSon"
                    v-for="(item, index) in items"
                    :key="item.userId"
                  >
                    <span @click="toDetail(index,item)">
                      <el-col style="margin:10px 0px;width:272px;height:100px">
                        <el-card :body-style="{ padding: '8px 0px 0px 10px' }">
                          <div>
                            <img
                              :src="item.img+'?token='+token"
                              class="image"
                            >
                            <div style="padding-left:72px">
                              <p style="font-size:0px">
                                <svg-icon
                                  :icon-class="item.gender===0?'female':'male-sm'"
                                  style="font-size:12px"
                                />
                                <span style="margin:0px 12px 0px 5px;font-size:12px">{{ item.ageGroup }}</span>
                                <svg-icon
                                  v-if="item.areMembers===1"
                                  icon-class="vip"
                                  style="font-size:21px"
                                />
                                <span
                                  class="operator"
                                  @click="(e)=>{e.stopPropagation()}"
                                >
                                  <el-popover
                                    trigger="hover"
                                    placement="bottom"
                                    width="84"
                                  >
                                    <div
                                      class="action"
                                      @click="toDetail(index,item)"
                                    >
                                      查看详情
                                    </div>
                                    <div
                                      v-if="item.areMembers===1"
                                      class="action"
                                      @click="withdrawMember(index,item)"
                                    >
                                      会员注销
                                    </div>
                                    <div v-else>
                                      <div
                                        class="action"
                                        @click="registerMember(index,item)"
                                      >
                                        注册会员
                                      </div>
                                      <div
                                        class="action"
                                        @click="filter(index, item)"
                                        v-if="addWhitePrivilege"
                                      >加入白名单</div>
                                      <div
                                        class="action"
                                        @click="filterBlack(index, item)"
                                        v-if="addBlackPrivilege"
                                      >加入黑名单</div>
                                    </div>
                                    <div
                                      class="more"
                                      slot="reference"
                                    ><span></span>
                                      <span></span>
                                      <span></span>
                                    </div>
                                  </el-popover>
                                </span>
                              </p>
                              <div class="line"></div>
                              <p>到店次数:<span>{{item.sum}}</span>次</p>
                              <p>最近到店:{{item.storeName}}</p>
                              <p>最近到店时间:{{item.recentTime.slice(0,10)}}</p>
                            </div>
                          </div>
                        </el-card>
                      </el-col>
                    </span>
                  </div>
                  <div
                    class="listCardSon"
                    :key="item"
                    v-for="item in surPlus"
                  >
                    <el-col style="margin:10px 0px;width:272px;height:100px">
                    </el-col>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
            <pagination
              v-if="page.total>0"
              :total="page.total"
              :page.sync="page.currentPage"
              :limit.sync="page.pageSize"
              @pagination="handlePageChange"
              :size='24'
            ></pagination>
          </div>
        </div>
      </div>
      <template>
        <el-dialog
          title="查看大图"
          :visible.sync="bigPicture"
          width="440px"
        >
          <img
            :src="this.imgSrc"
            v-if="this.imgSrc.indexOf('http://') != -1"
            @load="getSize"
            style="display: none;"
          >
          <img
            :src="'http://' + this.imgSrc"
            @load="getSize"
            style="display: none;"
            v-else
          >
          <div style="width: 400px;height: 540px;overflow: hidden;">
            <img
              v-if="this.imgWidth>=400"
              :src="this.imgSrc"
              width="400px"
              style="margin: auto;max-height: 540px"
            />
            <img
              v-else-if="this.imgHeight>=540"
              :src="this.imgSrc"
              height="540px"
              style="margin: auto;max-width: 400px"
            />
            <img
              v-else-if="this.imgHeight<540&&this.imgWidth<400"
              :src="this.imgSrc"
              width="400px"
              style="margin: auto;max-height: 540px"
            />
          </div>
        </el-dialog>
      </template>

      <el-dialog
        title="加入白名单"
        :visible.sync="operationDialog"
        width="622px"
        :before-close="reset"
        class="addTowhiteList"
      >
        <div style="padding:8px 0px 0px 30px;">
          <img
            :src="this.operation.img + '?token=' + token"
            v-if="this.operation.img.indexOf('http://') != -1"
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
                    <!-- <el-radio
                    v-model="radio"
                    label="3"
                  >快递员</el-radio> -->
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
                v-if="this.radio === '1'||this.radio === '3'"
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

              <template v-if="this.radio === '1'">
                <el-form-item
                  label="员工姓名:"
                  prop="name"
                >
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
                v-if="this.radio === '4'"
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
        title="加入黑名单"
        :visible.sync="addBlackDialog"
        width="622px"
        :before-close="resetBlack"
        class="addTowhiteList"
      >
        <div style="padding:8px 0px 0px 30px;">
          <img
            :src="black.img + '?token=' + token"
            v-if="black.img.indexOf('http://') != -1"
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
        :visible.sync="withdrawMemberDialog"
        width="350px"
        :show-close='false'
      >
        <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确认将该用户注销?</span></div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            @click="withdrawMemberDialog= false"
            size="small"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="postWithdrawMember"
          >确认</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="注册会员"
        :visible.sync="registerMemberDialog"
        width="622px"
        :before-close="resetMember"
        class="addTowhiteList"
      >
        <div style="padding:8px 0px 0px 30px">
          <img
            :src="member.img + '?token=' + token"
            v-if="member.img.indexOf('http://') != -1"
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
                prop="memberName"
              >
                <el-input
                  v-model="member.memberName"
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
                  value-format='yyyy-MM-dd'
                  v-model="member.birthday"
                  type="date"
                  style="width:276px"
                  placeholder="请选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                label="注册来源:"
                prop="status"
              >
                <el-select
                  v-model="member.status"
                  placeholder="默认最近到店"
                  style="width:276px"
                >
                  <el-option
                    v-for="item in originOptions"
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
            type="primary"
            @click="postRegisterMember"
            size="small"
          >确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCustomerList, operationCustomer, getStoreOption, getAgeGroupOption, addToBlack, postWithdrawMember, postRegisterMember } from '@/api/customer'
import Pagination from '@/components/Pagination'
import checked from './component/checked'
import { getToken } from '@/utils/auth'
// import { listPermissionTree } from '@/api/account'
// import { listStore } from '@/api/store'
import { Message } from 'element-ui'
export default {
  name: 'CustomerList',
  components: {
    Pagination,
    checked
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
      tabs: [{ name: 'recentTime', text: '时间排序' }, { name: 'sum', text: '到店次数' }],
      lastTab: 'recentTime',
      sort: false,
      activeName: 'recentTime',
      expand: false,
      attribute: [{ label: '全部', value: '' }, { label: '新增', value: 0 }, { label: '二次到店', value: 1 }],
      gender: [{ label: '全部', value: '' }, { label: '男', value: 1 }, { label: '女', value: 0 }],
      age: [],
      identity: [{ label: '全部', value: '' }, { label: '普通顾客', value: 0 }, { label: '会员', value: 1 }],
      attributeChecked: [''],
      genderChecked: [''],
      ageChecked: [''],
      identityChecked: [''],
      checkResult: '',
      checkOption: [{ label: '全部', value: '' }, { label: '未读', value: 0 }, { label: '已读', value: 1 }],
      keepAlive: false,
      search: {
        store: '',
        structId: '',
        storeType: '',
        startDate: this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: this.$moment(new Date()).format('YYYY-MM-DD')
      },
      storeList: [],
      page: {
        pageSize: 24,
        total: 0,
        currentPage: 1
      },
      data: {
        type: 0,
        label: '',
        id: 0
      },
      operation: {
        img: '',
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
        img: '',
        tag: ''
      },
      originOptions: [],
      withdrawMemberId: '',
      member: {
        img: '',
        memberName: '',
        registerStore: '',
        userId: '',
        phone: '',
        birthday: '',
        status: ''
      },
      flag: 0,
      radio: '1',
      token: getToken(),
      imgSrc: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      storeTitle: '',
      surPlus: [],
      items: [],
      loading: true,
      bigPicture: false,
      operationDialog: false,
      addBlackDialog: false,
      withdrawMemberDialog: false,
      registerMemberDialog: false,
      imgWidth: '',
      imgHeight: '',
      rules: {
        store: [
          { required: true, message: '请选择门店', trigger: 'blur' }
        ],
        tag: [
          { required: true, trigger: 'blur', validator: validateTag }
        ],
        memberName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validateIphone }
        ]
      }
    }
  },
  mounted() {
    document.querySelector('.el-main').addEventListener('scroll', this.handelscroll)
  },
  beforeDestroy() {
    document.querySelector('.el-main').removeEventListener('scroll', this.handelscroll)
  },
  activated() {
    if (this.routeLevel < 3) {
      this.init()
    }
  },
  computed: {
    ...mapGetters(['getPrivilege', 'getPermissionList']),
    privilege() {
      return this.getPrivilege
    },
    editPrivilege() {
      return this.getPrivilege.indexOf('顾客编辑') > -1
    },
    editCheckPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('进店详情审核') > -1
    },
    addWhitePrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('加入白名单') > -1
    },
    addBlackPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('加入黑名单') > -1
    },
    sortField: {
      get() {
        return this.activeName
      },
      set() {

      }
    },
    sortOrder: {
      get() {
        if (this.sort) {
          return 'asc'
        } else {
          return 'desc'
        }
      },
      set() {

      }
    },
    routeLevel() {
      return this.$route.matched.length
    },
    handleExport: function () {
      var ageGroup = ''
      const ageArray = this.ageChecked ? this.ageChecked : []
      for (var i in ageArray) {
        if (i > 0) {
          ageGroup += '&ageGroup[]=' + ageArray[i]
        } else {
          ageGroup += 'ageGroup[]=' + ageArray[i]
        }
      }
      var genderArray = this.genderChecked.length > 1 ? '' : this.genderChecked[0]
      var attribute = this.attributeChecked.length > 1 ? '' : this.attributeChecked[0]
      return process.env.BASE_API + `/customer/list/export?${ageGroup}&attribute=${attribute}&startTime=${this.search.startDate}&endTime=${this.search.endDate}&examine=${this.checkResult}&gender=${genderArray}&sort=${this.sortOrder}&sortField=${this.sortField}&storeId=${this.search.structId}&token=${this.token}`
    }
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('list', this.scrollTop)
      }
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
        keepAlive = name === 'CustomerDetail'
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
    getAgeGroupOption() {
      getAgeGroupOption({ code: 'AGE_GROUP' }).then(res => {
        this.age = res
      })
    },
    getStoreOption() {
      getStoreOption({}).then(res => {
        this.storeList = res
      })
    },
    changeAttributeCheckList(val) {
      this.attributeChecked = val
      this.searchQuery()
    },
    changeGenderCheckList(val) {
      this.genderChecked = val
      this.searchQuery()
    },
    changeAgeCheckList(val) {
      this.ageChecked = val
      this.searchQuery()
    },
    changeIdentityCheckList(val) {
      this.identityChecked = val
      this.searchQuery()
    },
    disabledDate(date) {
      return false
    },
    handleClick(tab, event) {
      if (this.lastTab !== tab.name) {
        this.sort = false
      } else {
        this.sort = !this.sort
      }
      this.lastTab = tab.name
      this.searchQuery()
    },
    expandAll() {
      this.expand = !this.expand
    },
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    init() {
      this.getStoreOption()
      this.getAgeGroupOption()
      // this.listStore()
      this.query()
      // this.getCustomerOption()
    },
    resetData() {
      sessionStorage.removeItem('list')
      this.search = {
        startDate: this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        store: '',
        structId: '',
        storeType: ''
      }
      this.activeName = 'recentTime'
      this.lastTab = 'recentTime'
      this.attributeChecked = ['']
      this.genderChecked = ['']
      this.ageChecked = ['']
      this.checkResult = ''
      this.expand = false
      this.sort = false
      this.page = {
        pageSize: 24,
        total: 0,
        currentPage: 1
      }
    },
    toDetail($index, row) {
      /* eslint-disable */
      this.$router.push({ path: '/cr/customer/list/detail', query: { userId: row.userId, storeId: this.search.structId, startDate: this.search.startDate, endDate: this.search.endDate, isMember: row.areMembers } })
    },
    filter: function ($index, row) {
      this.operation.img = row.img
      this.operation.userId = row.userId
      if (row.gender === 1) {
        this.operation.gender = '男'
      } else {
        this.operation.gender = '女'
      }
      this.operation.age = row.ageGroup
      this.operation.store = row.storeName
      this.operation.storeId = row.storeId
      this.operationDialog = true
    },
    filterBlack(index, row) {
      this.black.img = row.img
      this.black.userId = row.userId
      this.addBlackDialog = true
    },
    resetBlack() {
      this.$refs['black'].resetFields()
      // this.black.img = ''
      // this.black.userId = ''
      this.addBlackDialog = false
    },
    resetMember() {
      this.$refs['member'].resetFields()
      this.registerMemberDialog = false
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
    saveBlack() {
      this.$refs['black'].validate((valid) => {
        if (valid) {
          const params = {
            userId: this.black.userId,
            tag: this.black.tag
          }
          addToBlack(params).then(res => {
            if (res === 0) {
              this.successMsg('加入黑名单成功')
              this.resetBlack()
              this.query()
            } else {
              this.errorMsg('加入黑名单失败')
            }
          })
        }
      })
    },
    saveOperation: function () {
      if (this.operation.remarks.length > 15) {
        this.errorMsg('备注输入字数超过限制')
        return
      }
      const params = {
        userId: this.operation.userId,
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
          this.query()
        } else {
          this.errorMsg('加入白名单失败')
        }
      })
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    handlePageChange() {
      sessionStorage.removeItem('list')
      this.query()
    },
    searchQuery() {
      if (this.search.startDate > this.search.endDate) {
        this.$message.error('日期选择错误')
        this.items = []
        this.page.total = 0
        return
      }
      sessionStorage.removeItem('list')
      this.page.currentPage = 1
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        startTime: this.search.startDate,
        endTime: this.search.endDate,
        storeId: this.search.structId,
        attribute: this.attributeChecked.length > 1 ? '' : this.attributeChecked[0],
        gender: this.genderChecked.length > 1 ? '' : this.genderChecked[0],
        ageGroup: this.ageChecked.length > 3 || this.ageChecked[0] === '' ? [] : this.ageChecked,
        member: this.identityChecked.length > 1 ? '' : this.identityChecked[0],
        examine: this.checkResult,
        flag: this.editCheckPrivilege ? 1 : 0,
        sort: this.sortOrder,
        sortField: this.sortField,
        page: this.page.currentPage,
        size: this.page.pageSize,
      }
      getCustomerList(params).then((res) => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.query()
          return
        }
        this.page.total = res.total
        this.items = res.data.map(item => {
          item.visible = false
          return item
        })
        let sum;
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
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('list') || 0
      })
    },
    withdrawMember(index, row) {
      this.withdrawMemberDialog = true
      this.withdrawMemberId = row.userId
    },
    registerMember(index, row) {
      this.registerMemberDialog = true
      this.member.img = row.img
      this.member.registerStore = row.storeId
      this.member.userId = row.userId
    },
    postWithdrawMember() {
      this.withdrawMemberDialog = false
      const params = {
        userId: this.withdrawMemberId,
        status: 0
      }
      postWithdrawMember(params).then(res => {
        if (res === 0) {
          this.successMsg('会员注销成功')
          this.query()
        } else {
          this.errorMsg('会员注销失败')
        }
      })
    },
    postRegisterMember() {
      this.$refs['member'].validate(valid => {
        if (valid) {
          this.registerMemberDialog = false
          const { userId, phone, memberName, registerStore, birthday } = this.member
          const params = { userId, phone, name: memberName, registerStore, birthday, status: '1' }
          postRegisterMember(params).then(res => {
            if (res === 0) {
              this.successMsg('会员注册成功')
              this.query()
            } else {
              this.errorMsg('会员注册失败')
            }
          })
        }
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
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
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
.tabText {
  margin-right: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.table-container {
  background-color: #ffffff;
  padding: 10px 0px 10px 20px;
  min-height: calc(100vh - 170px);
  border-radius: 5px;
  position: relative;
  .export-btn {
    position: absolute;
    z-index: 2;
    right: 20px;
    top: 10px;
  }
}
.selectQuery {
  font-size: 0px;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
  background-color: #ffffff;
  // height: 60px;
  line-height: 56px;
  // padding: 5px 0px;
  &:nth-child(1) {
    height: 61px;
    border-bottom: 1px dashed rgba(0, 0, 0, 0.09);
  }
  &:nth-child(2) {
    min-height: 60px;
  }
}
.el-popover {
  .action {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    padding-left: 12px;
    margin-left: -1px;
    // padding: 16px 0px 16px 12px;
    &:hover {
      background-color: #e6f1fc;
      color: #1890ff;
    }
    cursor: pointer;
    // &:nth-child(1) {
    //   border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    // }
  }
}
.search-style {
  color: #4a4a4a;
  margin: 0 30px 0 20px;
  line-height: 60px;
  font-size: 14px;
  display: inline-block;
}
.btnStyle :hover {
  /*text-decoration: underline;*/
  color: #7ea3fc;
  font-weight: normal;
}
.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}
.padd {
  padding-right: 150px;
  position: relative;
}
.hidden {
  height: 56px;
  overflow: hidden;
}
.image {
  width: 62px;
  height: 84px;
  float: left;
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
  .operator {
    float: right;
    margin-right: 8px;
  }
  .line {
    height: 1px;
    background: rgba(0, 0, 0, 0.09);
    margin: 6px 0px 12px 0px;
  }
  p {
    margin: 0;
    font-size: 12px;
    height: 12px;
    line-height: 12px;
    margin-bottom: 8px;
    &:nth-child(1) {
      margin-top: 0;
    }
    &:nth-last-child(1) {
      margin-bottom: 7px;
    }
  }
}
// .dialog-footer {
// }
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
.more {
  width: 12px;
  height: 12px;
  background-color: #1890ff;
  border-radius: 50%;
  span {
    float: left;
    width: 2px;
    height: 2px;
    margin: 5px 1px;
    border-radius: 50%;
    background-color: #ffffff;
  }
}
</style>
