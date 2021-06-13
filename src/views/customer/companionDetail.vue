<template>
  <div class="companionList">
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <span class="cond-name">选择门店</span>
        <el-select
          filterable
          clearable
          v-model="search.storeId"
          placeholder="请选择"
          size="mini"
          @change="searchQuery"
        >
          <el-option
            v-for="item in storeOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          > </el-option>
        </el-select>
        <span class="cond-name">选择日期</span>
        <el-date-picker
          style="width:230px;"
          v-model="search.dateRange"
          type="daterange"
          align="right"
          size="mini"
          unlink-panels
          :clearable=false
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="searchQuery"
        ></el-date-picker>
        <span class="cond-name">结伴类型</span>
        <el-select
          filterable
          clearable
          v-model="search.type"
          placeholder="请选择"
          size="mini"
          @change="searchQuery"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
        <span class="cond-name">审核结果</span>
        <el-select
          filterable
          clearable
          v-model="search.status"
          placeholder="请选择"
          size="mini"
          @change="searchQuery"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          > </el-option>
        </el-select>
      </div>
      <div
        class="table-prefix-bars"
        style="margin-top: 10px;"
      >
        <span class="table-tile">结伴明细列表</span>
        <span class="table-tile-total">共{{page.total}}对</span>
        <a
          v-bind:href="exportCompanionDetail"
          target="_blank"
        >
          <el-button
            type="text"
            class="export"
            size="small"
          >导出</el-button>
        </a>
      </div>
      <div class="content">
        <el-table
          :data="detailTableData"
          row-key="id"
          fit
          v-loading="loading"
          style="width: 100%"
          size="small"
          class="table-box"
          :default-expand-all="true"
        >
          <el-table-column
            type="expand"
            width="50px"
          >
            <template slot-scope="props">
              <div class="expandContent">
                <div class="expandContentLeft">
                  <p>结伴成员:</p>
                  <el-button
                    type="text"
                    size="mini"
                    @click="()=>{isExpand(props.row.id)}"
                    v-if="props.row.info.length>4"
                  >{{expandAll&&props.row.id===activeIndex?"收起全部":"展开全部"}}</el-button>
                </div>
                <div class="expandContentRight">
                  <div :class="expandAll&&props.row.id===activeIndex?'':'img'">
                    <span
                      v-for="item in props.row.info"
                      class="infoList"
                    >
                      <img
                        :src="item.img+'?token=' + token"
                        class="infoImg"
                        @click="LookBigPicture(item.img + '?token=' + token)"
                      >
                      <span class="infoContent">
                        <p style="margin:0">{{item.gender}}</p>
                        <p style="margin:0">{{item.age}}岁</p>
                        <p style="margin:0">{{item.time&&item.time.split(' ')[0]}}</p>
                        <p style="margin:0">{{item.time&&item.time.split(' ')[1]}}</p>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="结伴序号"
            type="index"
            width="100px"
            :index="indexMethod"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="结伴类型"
            prop="type"
            width="150px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="结伴人数"
            prop="num"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="审核结果"
            prop="status"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remarks"
            show-overflow-tooltip
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="()=>{checkResult(scope.row)}"
              >{{scope.row.status==='待审核'?'审核':'审核详情'}}</el-button>
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
    <el-dialog
      title="结伴明细审核"
      :visible.sync="dialogVisible"
      width="80%"
      class="companionDetailDialog"
    >
      <template width="90%">
        <h3 style="margin-top:0px">{{checkResultInfo.type}}共{{checkResultInfo.num}}人</h3>
        <div class="test">
          <div class="carouselText">
            <div class="largeImg">大图照片</div>
            <div class="singleImg">顾客头像</div>
          </div>
          <el-carousel
            :autoplay="false"
            :arrow="+checkResultInfo.num>4?'always':'never'"
            :loop="false"
            class="test"
          >
            <el-carousel-item
              v-for="item in checkResultInfo.result"
              :key="item.group"
            >
              <div class="carouselImg">
                <span v-for="it in item.info">
                  <div class="largeImg">
                    <img
                      v-if="it.imgWhole"
                      :src="it.imgWhole+'?token=' + token"
                      alt=""
                    >
                    <strong v-else="it.imgWhole">无大图</strong>
                  </div>
                  <div class="singleImg">
                    <img
                      :src="it.img+'?token=' + token"
                      alt=""
                    >
                  </div>
                </span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-row>
          <h3> 审核结果:</h3>
          <template>
            <el-radio
              v-model="result"
              :label="2"
            >正确</el-radio>
            <el-radio
              v-model="result"
              :label="3"
            >错误</el-radio>
          </template>
          <el-row class="teaxtArea">
            <div v-show="result===3">
              <span>备注</span>
              <el-input
                type="textarea"
                v-model="remarks"
                maxlength="30"
                show-word-limit
                resize="false"
              ></el-input>
            </div>
          </el-row>
        </el-row>
      </template>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="dialogVisible = false"
          size="small"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="updateCheckResultInfo"
          size="small"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
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
        <div class="largeImgLook">
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getShopOption } from '@/api/statistics'
import { getToken } from '@/utils/auth'
import { partnershipDeatailList, getCustomerOption, getCheckResultInfo, updateCheckResultInfo } from '@/api/customer'
import { formatDate } from '@/utils/date'
export default {
  components: {
    Pagination
  },
  name: 'CompanionList',
  data() {
    return {
      activeIndex: -1,
      imgWidth: '',
      imgHeight: '',
      imgSrc: '',
      bigPicture: false,
      result: 1,
      remarks: '',
      checkResultInfo: {},
      dialogVisible: false,
      expandAll: false,
      search: {
        dateRange: [new Date(new Date().getTime() - 3600 * 24 * 7 * 1000), new Date(new Date().getTime() - 3600 * 24 * 1000)],
        storeId: '',
        type: '',
        status: '1'
      },
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      typeOptions: [{ value: 1, name: '全部' }],
      statusOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date(new Date().getTime() - 3600 * 24 * 1000)
        }
      },
      detailTableData: [],
      loading: false,
      tree: [],
      storeOptions: [],
      token: getToken()
    }
  },
  mounted() {
    this.init()
  },
  computed: {
    exportCompanionDetail: function () {
      const startDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : ''
      const endDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : ''
      const type = this.search.type ? this.search.type : ''
      const status = this.search.status ? this.search.status : ''
      this.search.storeId = this.search.storeId ? this.search.storeId : ''
      return process.env.BASE_API + `/companions/detail/export?token=${this.token}&storeId=${this.search.storeId}&startDate=${startDate}&endDate=${endDate}&type=${type}&status=${status}`
    }
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
      this.getShopOption()
      this.getCustomerOption()
      this.query()
    },
    isExpand(id) {
      if (this.activeIndex !== id) {
        this.expandAll = true
        this.activeIndex = id
      } else {
        this.expandAll = !this.expandAll
      }
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    LookBigPicture(val) {
      this.imgSrc = val
      this.bigPicture = true
    },
    checkResult: function (row) {
      this.dialogVisible = true
      this.checkResultInfo = row
      if (row.status === '待审核') {
        this.result = 1
      } else {
        row.status === '正确' ? this.result = 2 : this.result = 3
      }
      this.remarks = row.remarks || ''
      getCheckResultInfo({ id: row.id }).then(res => {
        var result = []
        var id = 1
        for (var i = 0; i < res.length; i += 4) {
          result.push({ group: id, info: res.slice(i, i + 4) })
          id++
        }
        this.checkResultInfo.result = result
      })
    },
    updateCheckResultInfo() {
      const { id } = this.checkResultInfo
      const params = {
        id,
        remarks: this.remarks,
        result: this.result
      }
      updateCheckResultInfo(params).then(res => {
        this.dialogVisible = false
        this.query()
      })
    },
    getCustomerOption: function () {
      getCustomerOption({ code: 'CUS_GROUP' }).then(res => {
        this.typeOptions = res
      })
      getCustomerOption({ code: 'AUDIT_STATUS' }).then(res => {
        this.statusOptions = res
      })
    },
    indexMethod: function (index) {
      index = index + 1
      if (index < 10) {
        index = '00' + index
      }
      if (index >= 10 & index < 100) {
        index = '0' + index
      }
      return index
    },
    getShopOption: function () {
      const params = {}
      getShopOption(params).then((res) => {
        this.storeOptions = res
        this.search.storeId = this.storeOptions[0].value ? this.storeOptions[0].value : ''
        this.query()
      })
    },
    reset: function () {
      this.search.storeId = ''
      this.search.dateRange = []
      this.searchQuery()
    },
    searchQuery() {
      const startDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : ''
      const endDate = this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : ''
      this.search.storeId = this.search.storeId ? this.search.storeId : ''
      // 门店参数，日期参数，只要有一个为空就不请求接口
      if (this.search.storeId === '' || startDate === '' || endDate === '') {
        this.$message({
          message: '请选择门店名称和日期',
          type: 'warning'
        })
        this.detailTableData = []
        this.page.total = 0
      } else {
        this.page.currentPage = 1
        this.pageshow = false
        this.query()
        this.pageshow = true
      }
    },
    handlePageChange() {
      document.querySelector('.el-main').scrollTop = 0
      this.query()
    },

    query: function (val) {
      const params = {
        storeId: this.search.storeId ? this.search.storeId : '',
        startDate: this.search.dateRange ? formatDate(new Date(this.search.dateRange[0]), 'yyyy-MM-dd') : '',
        endDate: this.search.dateRange ? formatDate(new Date(this.search.dateRange[1]), 'yyyy-MM-dd') : '',
        page: this.page.currentPage,
        size: this.page.pageSize,
        type: this.search.type,
        status: this.search.status
      }
      this.loading = true
      partnershipDeatailList(params).then((res) => {
        this.loading = false
        this.detailTableData = []
        this.page.total = 0
        if (res.total >= 0) {
          this.page.total = res.total
          this.detailTableData = res.data
        }
        document.querySelector('.el-main').scrollTop = 0
      })
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
.cond-name {
  margin: 0px 10px;
}
.infoList {
  float: left;
  width: 25%;
  min-width: 190px;
  .infoImg {
    height: 68px;
    margin-top: 5px;
    cursor: pointer;
    float: left;
    max-width: 110px;
  }
  .infoContent {
    vertical-align: middle;
    text-align: left;
    float: left;
    padding: 10px 0px 10px 10px;
  }
}
.export {
  float: right;
  line-height: 25px;
  margin: 0 10px 0 10px;
  font-size: 14px;
}
.content {
  background-color: #ffffff;
  padding-bottom: 10px;
  min-height: calc(100vh - 170px);
  border-radius: 5px;
}
.companionDetailDialog > div {
  height: 100%;
  background-color: #fff;
}
.teaxtArea {
  height: 130px;
  margin-top: 10px;
  .companionDetailDialog {
    .el-textarea__inner {
      min-height: 100px !important;
    }
  }
}
.el-dialog__body,
.el-dialog__footer {
  background-color: #fff;
}
td.sum {
  background-color: #1e90ff;
}
.img {
  overflow: hidden;
}
.carouselImg {
  height: 100%;
  padding: 0px 60px;
  margin: 0px 20px;
  display: flex;
  span {
    width: 25%;
    height: 100%;
    padding: 20px;
    // border: 1px solid #000;
    text-align: center;
  }
}
.carouselText {
  position: absolute;
  width: 60px;
  .largeImg {
    border: none;
    background-color: #fff;
    line-height: 200px;
  }
  .singleImg {
    line-height: 110px;
  }
}
.test {
  position: relative;
  margin: 0px 40px;
}

.largeImg {
  height: 180px;
  margin-bottom: 10px;
  border: 10px solid #ccc;
  box-sizing: border-box;
  background-color: ghostwhite;
  strong {
    text-align: center;
    line-height: 180px;
  }
  img {
    height: 100%;
    max-width: 100%;
  }
}
.singleImg {
  height: 90px;
  img {
    height: 100%;
    border: 10px solid #ccc;
    box-sizing: border-box;
    max-width: 100%;
  }
}
.dialog-footer {
  text-align: center;
}
.largeImgLook {
  width: 400px;
  height: 540px;
  overflow: hidden;
}
.expandContent {
  display: flex;
  text-align: center;
  .expandContentLeft {
    margin-right: 20px;
    width: 150px;
    p {
      font-size: 16px;
    }
  }
  .expandContentRight {
    padding: 0px 15px;
    flex: 1;
    div {
      height: 68px;
    }
  }
}
</style>
