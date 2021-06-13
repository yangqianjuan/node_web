<template>
  <div
    class="blackList"
    id="blackList"
    ref="blackListBox"
    v-if="routeLevel<3"
  >
    <div class="app-container">
      <div
        class="search-container"
        style="padding: 16px 20px;margin-bottom: 0;"
      >
        <el-button
          type="primary"
          size="mini"
          @click="addBlack()"
        >新增</el-button>
      </div>
      <div
        class="table-container"
        ref="table_top"
      >
        <span
          v-if='page.total==0&&!loading'
          class="noData"
        >
          <svg-icon icon-class="nodata" />
          <p class="noDataText">暂无数据</p>
        </span>
        <div style="min-height: calc(100vh - 204px);">
          <div class="listCard">
            <div
              class="listCardSon"
              v-for="(item, index) in items"
              :key="item.userId"
            >
              <span @click="toDetail(index,item)">
                <el-col style="margin:0 0 10px 0;width:272px;height:100px">
                  <el-card :body-style="{ padding: '8px 0 0 10px' }">
                    <div class="infoList">
                      <img
                        :src="item.img+'?token='+token"
                        class="image"
                      >
                      <div style="padding-left:72px">
                        <p>
                          <svg-icon :icon-class="item.gender===0?'female':'male-sm'" />
                          <span style="margin-left: 5px">{{ item.ageGroup }}</span>

                          <el-tag
                            type="danger"
                            style="margin-left: 5px;"
                          >
                            {{ item.tag }}
                          </el-tag>
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
                                v-if="removeBlackPrivilege"
                                class="action"
                                @click="resetFilter(index, item)"
                              >移出黑名单</div>
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
        </div>
        <pagination
          v-if="pageshow && page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="handlePageChange"
          :size='24'
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
        <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">确认将该用户移出黑名单?</span></div>
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

      <el-dialog
        title="新增黑名单"
        :visible.sync="addBlackDialog"
        width="622px"
        :before-close="reset"
        class="selectDepartment"
      >
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="form.imageUrl"
            :src="form.imageUrl"
            class="avatar"
          >
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
          />
        </el-upload>
        <span style="position: absolute; width: 200px; top: 190px;left: 380px;">
          <span class="img-tips">建议照片大小不超过2M<br />格式支持PNG、JPG、JPEG、BMP</span>
        </span>
        <el-form
          ref="addBlackForm"
          :model="form"
          label-width="145px"
          size="mini"
          style="margin-top:30px;"
          :rules="rules"
        >
          <el-form-item
            label="标记为:"
            prop="remark"
          >
            <el-input
              style="width: 276px;"
              v-model="form.remark"
              placeholder="请进行标记如：小偷"
              maxlength="5"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>

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
            @click="saveAddBlack('addBlackForm')"
            size="small"
          >确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import { getBlackList, removeBlack, saveBlack } from '@/api/customer'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
export default {
  name: 'BlackList',
  components: {
    Pagination
  },
  data() {
    return {
      addBlackDialog: false,
      removeComfirmDialog: false,
      form: {
        imageUrl: '',
        id: '',
        remark: ''
      },
      keepAlive: false,
      page: {
        pageSize: 24,
        total: 0,
        currentPage: 1
      },
      pageshow: true,
      token: getToken(),
      imgSrc: '',
      userId: '',
      surPlus: [],
      items: [],
      loading: true,
      bigPicture: false,
      imgWidth: '',
      imgHeight: '',
      scrollTop: 0,
      rules: {
        remark: [
          { required: true, message: '标记不能为空', trigger: 'blur' }
        ]
      }
    }
  },
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
    routeLevel() {
      return this.$route.matched.length
    },
    removeBlackPrivilege() {
      return JSON.parse(sessionStorage.getItem('PERMISSION_LIST')).indexOf('移出黑名单') > -1
    },
    uploadUrl: function () {
      return process.env.BASE_API + '/customer/black/upload?token=' + this.token
    }
  },
  watch: {
    routeLevel(cur) {
      if (cur < 3) {
        this.init()
      } else {
        sessionStorage.setItem('blackList', this.scrollTop)
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
    handelscroll() {
      this.scrollTop = document.querySelector('.el-main').scrollTop
    },
    init() {
      this.query()
    },
    toDetail($index, row) {
      /* eslint-disable */
      this.$router.push({ path: '/cr/customer/blackList/detail', query: { img: row.img, userId: row.userId } })
    },
    resetFilter: function ($index, row) {
      this.userId = row.userId
      this.removeComfirmDialog = true
    },
    saveOperation: function () {
      const params = {
        userId: this.userId
      }
      removeBlack(params).then((res) => {
        if (res === 0) {
          this.$message.success('移出黑名单成功')
        } else {
          this.$message.error('移出黑名单失败')
        }
        this.removeComfirmDialog = false
        this.query()
      })
    },
    getSize(event) {
      this.imgWidth = event.target.width
      this.imgHeight = event.target.height
    },

    searchQuery() {
      this.page.currentPage = 1
      this.query()
    },
    handlePageChange() {
      sessionStorage.removeItem('blackList')
      this.query()
    },
    query: function (val) {
      this.loading = true
      const params = {
        page: this.page.currentPage,
        size: this.page.pageSize
      }
      getBlackList(params).then((res) => {
        if (res.data.length === 0 && this.page.currentPage > 1) {
          this.page.currentPage--
          this.query()
          return
        }
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
        document.querySelector('.el-main').scrollTop = sessionStorage.getItem('blackList') || 0
      })
    },
    addBlack() {
      this.addBlackDialog = true
    },
    saveAddBlack(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.form.imageUrl) {
            this.$message.error('请上传黑名单照片')
            return false
          }
          const params = {
            id: this.form.id,
            tag: this.form.remark
          }

          saveBlack(params).then((res) => {
            switch (res.msgCode) {
              case '200':
                this.query()
                this.$message.success('新增黑名单成功')
                break
              case '500':
                this.$message.error('新增黑名单失败')
                break
              default:
                this.$message.error('新增黑名单失败')
                break
            }
          })


          this.reset()
        } else {
          return false
        }
      })
    },
    reset() {
      this.addBlackDialog = false
      this.form.imageUrl = ''
      this.form.remark = ''
    },
    handleAvatarSuccess(res, file) {
      switch (res.msgCode) {
        case '200':
          this.form.id = res.data.id || ''
          this.form.imageUrl = (res.data.img + '?token=' + this.token) || ''
          this.$message.success(res.message)
          break
        case '500':
          this.$message.error(res.message)
          break
        default:
          this.$message.error('上传失败')
          break
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/bmp' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG || !isLt2M) {
        this.$message.error('照片不符合人脸检测要求')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }
}
.table-container {
  background-color: #ffffff;
  padding: 0 0 10px 20px;
  min-height: calc(100vh - 144px);
  border-radius: 5px;
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
    margin-bottom: 8px;
  }
}
.infoList {
  position: relative;
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

.avatar-uploader {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 94px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  cursor: pointer;

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c8c8c;
    text-align: center;
    width: 94px;
    height: 128px;
    line-height: 128px;
  }
  .avatar {
    border: 1px dashed rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    width: 94px;
    height: 128px;
  }
}

.img-tips {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFangSC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  line-height: 12px;
}
</style>
