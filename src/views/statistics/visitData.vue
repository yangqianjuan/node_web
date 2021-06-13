<template>
  <div class="visitRecord">
    <div class="app-container">
      <!-- 搜索栏-->
      <div class="search-container">
        <div>
          <span class="cond-name">数据类型</span>
          <el-select
            filterable
            v-model="search.dataTypes"
            placeholder="请选择"
            size="mini"
            style="width:320px"
            @change="searchQuery"
            clearable
            multiple
          >
            <el-option
              v-for="item in dataTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="cond-name">门店名称</span>
          <el-select
            filterable
            v-model="search.shopName"
            placeholder="请选择"
            size="mini"
            style="width:140px"
            @change="searchQuery"
            clearable
          >
            <el-option
              v-for="item in shopNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <span class="cond-name">摄像头</span>
          <el-select
            filterable
            v-model="search.camera"
            placeholder="请选择"
            size="mini"
            style="width:140px"
            clearable
            @change="searchQuery"
          >
            <el-option
              v-for="item in cameras"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="cond-name">上传方式</span>
          <el-select
            clearable
            v-model="search.source"
            placeholder="请选择"
            size="mini"
            style="width:140px"
            @change="searchQuery"
          >
            <el-option
              v-for="item in sourceTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            > </el-option>
          </el-select>
        </div>
        <div style="margin-top:10px">
          <span class="cond-name">到店日期</span>
          <el-date-picker
            @change="searchQuery"
            v-model="search.startDate"
            value-format='yyyy-MM-dd'
            type="date"
            placeholder="开始日期"
            size='mini'
            style="width:140px"
          >
          </el-date-picker>
          <span class="cond-name">到</span>
          <el-date-picker
            @change="searchQuery"
            v-model="search.endDate"
            type="date"
            value-format='yyyy-MM-dd'
            placeholder="结束日期"
            size='mini'
            style="width:140px"
          >
          </el-date-picker>
          <span class="cond-name">到店时段</span>
          <el-select
            clearable
            v-model="search.time"
            placeholder="请选择"
            size="mini"
            style="width:140px"
            @change="searchQuery"
          >
            <el-option
              v-for="item in times"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            > </el-option>
          </el-select>
          <span v-if="!(search.dataTypes.length===1&&search.dataTypes[0]===3)">
            <span class="cond-name">身份ID</span>
            <el-input
              filterable
              v-model="search.customerId"
              placeholder="请输入"
              size="mini"
              style="width:140px"
              clearable
            >
            </el-input>
          </span>
          <span style="float: right;">
            <el-button
              @click="reset"
              plain
              style=" width: 80px;height: 30px; margin:8px 10px 0 30px"
              size="small"
            >重置</el-button>
            <el-button
              @click="searchQuery"
              type="primary"
              plain
              style="width: 80px;height: 30px; margin:8px 10px 0 0"
              size="small"
            >搜索</el-button>
          </span>
        </div>
      </div>
      <div style="background-color: #ffffff; padding-bottom: 10px; min-height: calc(100vh - 215px); border-radius: 5px;">
        <el-table
          ref="visitRecordTable"
          :data="items"
          row-key="id"
          fit
          v-loading="loading"
          width="100%"
          size="small"
          class="table-box"
        >
          <el-table-column
            prop="img"
            label="头像"
            min-width="12%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.img">
                <img
                  :src="scope.row.img + '?token=' + token"
                  v-if="scope.row.img.indexOf('http://') != -1"
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.img + '?token=' + token)"
                >
                <img
                  :src="'http://' + scope.row.img + '?token=' + token"
                  v-else
                  style="width: 63px;margin-top: 5px;cursor:pointer"
                  @click="LookBigPicture(scope.row.img + '?token=' + token)"
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="userId"
            label="身份ID"
            min-width="18%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scoped">
              {{scoped.row.userId?scoped.row.userId:'--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="数据类型"
            min-width="20%"
            :resizable="false"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="storeName"
            label="门店名称"
            min-width="20%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="cameraName"
            label="摄像头"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="到店日期"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="time"
            label="到店时段"
            min-width="18%"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="capTime"
            label="拍照时间"
            min-width="18%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scoped">
              {{scoped.row.capTime?scoped.row.capTime:'--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="picNumber"
            label="照片编号"
            min-width="18%"
            :resizable="false"
            align="center"
          >
            <template slot-scope="scoped">
              {{(scoped.row.picNumber||scoped.row.picNumber===0)?scoped.row.picNumber:'--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="sourceName"
            label="上传方式"
            min-width="18%"
            :resizable="false"
            align="center"
          >
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
    </div>
  </div>
</template>

<script>
import { getSearchCondition, getDevVisitData, getPermissionCameraOption } from '@/api/statistics'
import { getStoreOption } from '@/api/customer'
import { fetchDictionary } from '@/api/dictionary'
// import { fetchCustomerId } from '@/api/dictionary'
// import bus from '@/rootbus'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'

export default {
  name: 'VisitRecord',
  components: {
    Pagination
  },
  data() {
    return {
      filterOptions: null,
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      loading: true,
      items: [],
      search: {
        startDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        endDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        dataTypes: [],
        // dateRange: [],
        source: '',
        customerId: '',
        date: '',
        time: '',
        shopName: '',
        camera: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      token: getToken(),
      imgSrc: '',
      bigPicture: false,
      times: [],
      shopNames: [],
      dataTypes: [],
      sourceTypes: [],
      cameras: [],
      customerIds: [],
      link: false,
      imgWidth: '',
      imgHeight: '',
      focusColor: false
    }
  },
  // activated() {
  //   this.init()
  // },
  mounted() {
    Promise.all([this.getCustomerTypeOption(), this.getSourceTypeOption(), this.getSearchCondition(), this.getPermissionCameraOption(), this.getStoreOption()]).then(res => {
      this.getDevVisitData()
    })
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
      // this.getCustomerTypeOption()
      // this.getSourceTypeOption()
      // this.getSearchCondition()
      // this.getPermissionCameraOption()
      // this.getStoreOption()
      // this.getDevVisitData()
    },
    focus() {
      this.focusColor = true
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },
    LookBigPicture(val) {
      this.imgSrc = val
      this.bigPicture = true
    },
    reset: function () {
      this.search.dataTypes = []
      this.search.customerId = ''
      this.search.startDate = ''
      this.search.endDate = ''
      this.search.time = ''
      this.search.shopName = ''
      this.search.camera = ''
      this.search.source = ''
      this.searchQuery()
    },
    getCustomerTypeOption() {
      const params = {
        dictionaries: ['DATA_TYPE']
      }

      return fetchDictionary(params).then((res) => {
        this.dataTypes = res.dataType
      })
    },
    getSourceTypeOption() {
      const params = {
        dictionaries: ['IMG_SOURCE']
      }

      return fetchDictionary(params).then((res) => {
        this.sourceTypes = res.imgSource
      })
    },
    getSearchCondition: function () {
      const params = {
        dictionaries: ['STATISTICS_PERIOD']
      }
      return getSearchCondition(params).then((res) => {
        this.times = res.statisticsPeriod
      })
    },
    getStoreOption: function () {
      const params = {}
      return getStoreOption(params).then((res) => {
        this.shopNames = res
      })
    },
    getPermissionCameraOption: function () {
      const params = {}
      return getPermissionCameraOption(params).then((res) => {
        this.cameras = res
      })
    },
    searchQuery() {
      if (this.search.startDate > this.search.endDate) {
        this.$message.error('日期选择错误')
        this.items = []
        this.page.total = 0
        return
      }
      this.page.currentPage = 1
      this.pageshow = false
      this.getDevVisitData()
      this.$nextTick(() => {
        this.pageshow = true
      })
    },
    handlePageChange() {
      this.getDevVisitData()
    },
    getDevVisitData: function (val) {
      this.loading = true
      // var date1 = new Date()
      const params = {
        types: this.search.dataTypes,
        storeId: this.search.shopName,
        cameraId: this.search.camera,
        period: this.search.time,
        userId: this.search.customerId,
        startDate: this.search.startDate || '',
        endDate: this.search.endDate || '',
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        source: this.search.source
      }
      getDevVisitData(params).then((res) => {
        this.loading = false
        this.page.total = res.total
        this.items = []
        this.$nextTick(() => {
          this.items = res.data.map(item => {
            item.storeName = this.shopNames.find(it => {
              return +it.value === item.storeId
            }) ? this.shopNames.find(it => { return +it.value === item.storeId }).label : ''
            item.typeName = this.dataTypes.find(it => {
              return it.value === item.type
            }) ? this.dataTypes.find(it => { return it.value === item.type }).name : ''
            item.cameraName = this.cameras.find(it => {
              return it.value === item.cameraId
            }) ? this.cameras.find(it => { return it.value === item.cameraId }).name : ''
            item.sourceName = this.sourceTypes.find(it => {
              return it.value === item.source
            }) ? this.sourceTypes.find(it => { return it.value === item.source }).name : ''
            return item
          })
          document.querySelector('.el-main').scrollTop = 0
        })
      })
    }
  },
  updated() {
  },
  created() {
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.cond-name {
  padding: 0px 8px;
  margin: 0px;
  font-size: 14px;
}
</style>
