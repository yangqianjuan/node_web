<template>
  <div
    class="whiteList"
    id="whiteList"
    ref="whiteListBox"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <div
        style="background-color: #ffffff;font-size:14px;padding:0px 20px;"
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
              :clearable="false"
              size='mini'
              style="width:140px"
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
          </span>
          <span>
            <span
              class="cond-name expand"
              @click="expandAll"
            >{{expand?'收起':'展开'}}
              <svg-icon :icon-class="expand?'arrow-up':'arrow-down'" /></span>
          </span>
        </div>
        <div class="selectQuery">
          <span>
            <span class="cond-name">身份: </span>
            <checked
              :attribute='identity'
              :checked='identityChecked'
              @changeCheckList='changeAttributeCheckList'
            ></checked>
          </span>
          <span>
            <span class="cond-name">性别: </span>
            <checked
              :attribute='gender'
              :checked='genderChecked'
              @changeCheckList='changeGenderCheckList'
            ></checked>
          </span>
          <span style="display:inline-block">
            <span class="cond-name">年龄: </span>
            <checked
              :attribute='age'
              :checked='ageChecked'
              @changeCheckList='changeAgeCheckList'
            ></checked>
          </span>

        </div>
      </div>
      <div
        :class="combineList.length>0?'padd':''"
        style="margin-top:16px;"
      >
        <div>

          <div
            class="table-container"
            ref="table_top"
          >
            <span class="tips">
              <span
                v-for="item in identity"
                v-if='item.value'
                style="margin-left:16px"
              >
                <span
                  class="color blue"
                  v-if="item.value==1"
                ></span>
                <span
                  class="color green"
                  v-if="item.value==2"
                ></span>
                <span
                  class="color orange"
                  v-if="item.value==3"
                ></span>
                <span
                  class="color yellow"
                  v-if="item.value==4"
                ></span>
                {{item.label}}
              </span>
            </span>
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
              v-loading='loading'
            >
              <el-tab-pane
                :name="tab.name"
                v-for="tab in tabs"
                :key='tab.name'
              >
                <span slot="label">
                  <span class="tabText">{{tab.text}}</span>
                  <span v-if='activeName!==tab.name'>
                    <svg-icon
                      style="font-size:12px;"
                      icon-class="sort-default"
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
                          <div class="infoList">
                            <span>
                              <svg-icon
                                v-if="item.identity=='员工'"
                                :icon-class="item.identity=='员工'?'worker':''"
                                class="identity"
                              />
                              <svg-icon
                                v-if="item.identity=='外卖/快递'"
                                :icon-class="item.identity=='外卖/快递'?'expressman':''"
                                class="identity"
                              />
                              <svg-icon
                                v-if="item.identity=='保洁/保安'"
                                :icon-class="item.identity=='保洁/保安'?'takeway':''"
                                class="identity"
                              />
                              <svg-icon
                                v-if="item.identity=='其他'"
                                :icon-class="item.identity=='其他'?'others':''"
                                class="identity"
                              />
                              <img
                                :src="item.img+'?token='+token"
                                class="image"
                              >
                            </span>

                            <div style="padding-left:72px">
                              <p>
                                <svg-icon :icon-class="item.gender===0?'female':'male-sm'" />
                                <span style="margin-left: 5px">{{ item.ageGroup }}</span>
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
                                      v-if="removeWhitePrivilege"
                                      class="action"
                                      @click="resetFilter(index, item)"
                                    >移出白名单</div>
                                    <!-- <div
                                  class="action"
                                  @click="filter(index, item)"
                                >加入合并</div> -->
                                    <div
                                      :class="['action',{'hadCombine':combineList.find(items=> items.id===item.userId)}]"
                                      v-if="editCheckPrivilege"
                                      @click="()=>{addToCombine(item)}"
                                    >{{combineList.find(items=> items.id===item.userId)?'已加入合并':'加入合并'}}</div>
                                    <!-- <svg-icon
                                      icon-class="more"
                                      slot="reference"
                                    /> -->
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
              v-if="pageshow && page.total>0"
              :total="page.total"
              :page.sync="page.currentPage"
              :limit.sync="page.pageSize"
              @pagination="handlePageChange"
              :size='24'
            ></pagination>
          </div>
        </div>
        <combine
          :list="combineList"
          @changeCombineList="changeCombineList"
          :retainId="retainId"
          @init="query"
        ></combine>
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
          />
          <img
            :src="'http://' + this.imgSrc"
            @load="getSize"
            style="display: none;"
            v-else
          />
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
        :visible.sync="removeComfirmDialog"
        width="350px"
        :show-close='false'
      >
        <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确认将该用户移出白名单?</span></div>
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
            @click="saveOperation"
          >确认</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { Message } from 'element-ui'
import { mapGetters } from 'vuex'
import { getWhiteCustomerList, removeWhiteCustomer, getCustomerOption, getStoreOption } from '@/api/customer'
// import { listStore } from '@/api/store'
import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
// import { listPermissionTree } from '@/api/account'
import combine from './component/combine.vue'
import checked from './component/checked'

export default {
  name: 'WhiteList',
  components: {
    Pagination,
    combine,
    checked
  },
  data() {
    return {
      removeComfirmDialog: false,
      activeName: 'recentTime',
      tabs: [{ name: 'recentTime', text: '时间排序' }, { name: 'sum', text: '到店次数' }],
      lastTab: 'recentTime',
      expand: false,
      sort: false,
      visible2: false,
      identity: [],
      gender: [{ label: '全部', value: '' }, { label: '男', value: 1 }, { label: '女', value: 0 }],
      age: [],
      identityChecked: [''],
      genderChecked: [''],
      ageChecked: [''],
      checkResult: '',
      checkOption: [{ label: '全部', value: '' }, { label: '未读', value: 0 }, { label: '已读', value: 1 }],
      retainId: '',
      combineList: [],
      keepAlive: true,
      search: {
        store: '',
        structId: '',
        storeType: '',
        identity: '',
        startDate: this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'),
        endDate: this.$moment(new Date()).format('YYYY-MM-DD')
      },
      storeList: [],
      page: {
        pageSize: 24,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      data: {
        type: 0,
        label: '',
        id: 0
      },
      select: {
        status: true,
        prohibit: false
      },
      flag: 0,
      token: getToken(),
      imgSrc: '',
      checkedStore: [],
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      storeTitle: '',
      userId: '',
      surPlus: [],
      items: [],
      loading: true,
      bigPicture: false,
      // removeComfirmDialog: false,
      imgWidth: '',
      imgHeight: '',
      dropdownFlag: false,
      scrollerHeight: 0,
      scrollTop: 0,
      rules: {
      }
    }
  },
  // activated() {
  //   this.init()
  // },
  mounted() {
    document.querySelector('.el-main').addEventListener('scroll', this.handelscroll)
  },
  activated() {
    if (this.routeLevel < 3) {
      this.init()
    }
  },
  beforeDestroy() {
    document.querySelector('.el-main').removeEventListener('scroll', this.handelscroll)
  },
  computed: {
    ...mapGetters(['getPrivilege', 'getPermissionList']),
    privilege() {
      return this.getPrivilege
    },
    editPrivilege() {
      return this.getPrivilege.indexOf('白名单编辑') > -1
    },
    editCheckPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('进店详情审核') > -1
    },
    removeWhitePrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('移出白名单') > -1
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
    }
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('whiteList', this.scrollTop)
      }
    }
  },
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
    changeAttributeCheckList(val) {
      this.identityChecked = val
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
    getStoreOption() {
      getStoreOption({}).then(res => {
        this.storeList = res
      })
    },
    getCustomerOption() {
      // getCustomerOption({ code: 'AUDIT_STATUS_CUS_DETAIL' }).then(res => {
      //   this.checkOption = res
      // })
      getCustomerOption({ code: 'WHITE_CUS_IDENTITY' }).then((res) => {
        this.identity = res
      })
      getCustomerOption({ code: 'AGE_GROUP' }).then((res) => {
        this.age = res
      })
    },
    addToCombine(row) {
      row.visible = false
      const id = row.userId
      const sum = row.sum
      const img = row.img + '?token=' + this.token
      if (this.combineList.find(item => {
        return item.id === id
      })) {
        return
      }
      if (this.combineList.length >= 5) {
        this.$message.error('身份照片已超过5张')
        return
      }
      this.combineList.push({
        id,
        img,
        sum
      })
      this.getRetainId()
    },
    getRetainId() {
      if (this.combineList.length <= 0) {
        return
      }
      const maxSum = Math.max.apply(Math, this.combineList.map(function (o) { return o.sum }))
      const maxSumArr = this.combineList.filter(item => {
        return item.sum === maxSum
      })
      this.retainId = maxSumArr.sort(function (a, b) { return a.id - b.id })[0].id
      // this.retainId = '00' + Math.min.apply(Math, maxSumArr.map(function (o) { return o.id }))
    },
    changeCombineList(val) {
      this.combineList = val
      this.getRetainId()
    },
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    resetData() {
      sessionStorage.removeItem('whiteList')
      this.search.startDate = this.$moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD')
      this.search.endDate = this.$moment(new Date()).format('YYYY-MM-DD')
      this.search.structId = ''
      this.activeName = 'recentTime'
      this.lastTab = 'recentTime'
      this.identityChecked = ['']
      this.genderChecked = ['']
      this.ageChecked = ['']
      this.checkResult = ''
      this.sort = false
      this.checkResult = ''
      this.expand = false
      this.combineList = []
      this.page = {
        currentPage: 1,
        pageSize: 24
      }
    },
    init() {
      this.query()
      // this.listStore()
      this.getStoreOption()
      // this.getIdentityOptions()
      this.getCustomerOption()
      bus.$on('formquery', (...args) => {
        this.query()
      })
    },
    toDetail($index, row) {
      /* eslint-disable */
      this.$router.push({ path: '/cr/customer/whiteList/detail', query: { storeId: row.storeId, userId: row.userId, startDate: this.search.startDate, endDate: this.search.endDate } })
    },
    resetFilter: function ($index, row) {
      this.userId = row.userId
      this.removeComfirmDialog = true
    },
    saveOperation: function () {
      const params = {
        userId: this.userId
      }
      removeWhiteCustomer(params).then((res) => {
        if (res === 0) {
          this.successMsg('移出白名单成功')
          this.query()
          this.combineList = this.combineList.filter(item => { return item.id !== this.userId })
        } else {
          this.errorMsg('移出白名单失败')
        }
        this.removeComfirmDialog = false
      })
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    handleSelectStore(data) {
      this.$nextTick(() => {
        this.search.store = data.label
        this.search.structId = data.id
        this.$refs.formDrop.hide()
        this.storeTitle = data.label
        this.searchQuery()
      })
    },
    clearStore() {
      this.search.store = ''
      this.search.structId = ''
      this.checkedStore = []
      this.$refs.formDrop.hide()
      this.searchQuery()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    searchQuery() {
      if (this.search.startDate > this.search.endDate) {
        this.$message.error('日期选择错误')
        this.items = []
        this.page.total = 0
        return
      }
      this.page.currentPage = 1
      this.query()
    },
    handlePageChange() {
      sessionStorage.removeItem('whiteList')
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        startTime: this.search.startDate,
        endTime: this.search.endDate,
        storeId: this.search.structId,
        identity: this.identityChecked.length > 3 || this.identityChecked[0] === '' ? [] : this.identityChecked,
        gender: this.genderChecked.length > 1 ? '' : this.genderChecked[0],
        ageGroup: this.ageChecked.length > 3 || this.ageChecked[0] === '' ? [] : this.ageChecked,
        flag: this.editCheckPrivilege ? 1 : 0,
        sort: this.sortOrder,
        sortField: this.sortField,
        page: this.page.currentPage,
        size: this.page.pageSize,
        examine: this.checkResult
      }
      getWhiteCustomerList(params).then((res) => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.query()
          return
        }
        this.flag = 1
        this.page.total = res.total
        this.items = res.data
        this.loading = false
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
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('whiteList') || 0
      })
    },
    visibleChange(value) {
      this.dropdownFlag = value
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

<style lang="scss" scoped>
.tabText {
  margin-right: 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}
.hidden {
  height: 56px;
  overflow: hidden;
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
    cursor: pointer;
    padding-bottom: 16px;
    margin-left: -1px;
    &:hover {
      background-color: #ecf5ff;
      color: #1890ff;
    }
    // &:nth-child(1),
    // &:nth-child(2) {
    //   margin-bottom: 17px;
    // }
  }
  .hadCombine {
    color: rgba(0, 0, 0, 0.25);
    &:hover {
      background-color: #ffff;
    }
  }
}
.table-container {
  background-color: #ffffff;
  padding: 10px 0px 10px 20px;
  min-height: calc(100vh - 170px);
  border-radius: 5px;
  position: relative;
}
.span-table {
  display: inline-block;
  width: 100px;
  text-align: center;
}

.whiteList .el-radio {
  margin-right: 10px;
}

.search-style {
  color: #4a4a4a;
  margin: 0 30px 0 20px;
  line-height: 60px;
  font-size: 14px;
  display: inline-block;
}

.btnStyle {
  /*text-decoration: underline;*/
  color: #477cfb;
  font-weight: normal;
}

.btnStyle :hover {
  /*text-decoration: underline;*/
  color: #7ea3fc;
  font-weight: normal;
}

.dataTab-scrollbar-wrap {
  overflow-x: hidden;
}

.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}

.location {
  position: relative;
  left: 40%;
}

.padd {
  padding-right: 298px;
  position: relative;
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
      margin: 0;
    }
    &:nth-last-child(1) {
      margin-bottom: 7px;
    }
  }
}
.infoList {
  position: relative;
  // width: 62px;
  // height: 84px;
  .identity {
    position: absolute;
    left: 31px;
    top: 0px;
    width: 31px;
    height: 31px;
  }
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
.tips {
  position: absolute;
  color: rgba(0, 0, 0, 0.45);
  left: 240px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  margin-right: 16px;
  .color {
    display: inline-block;
    width: 8px;
    height: 8px;
  }
  .blue {
    background-color: #59adfd;
  }
  .green {
    background-color: #3ecbcb;
  }
  .orange {
    background-color: #ff9b32;
  }
  .yellow {
    background-color: #fbd444;
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
