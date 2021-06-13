<template>
  <div class="demo">
    <div class="app-container">
      <el-container>
        <el-aside style="width: 250px;margin: 0 10px 0 0;background-color: #FFFFFF;border-radius: 5px">
          <div style="font-size: 18px;color: rgb(40, 40, 40);margin-top: 10px;height: 30px;margin-left: 15px;min-width: 200px;">选择门店和设备</div>
          <el-tree
            ref="refTree"
            :data="tree"
            :props="defaultProps"
            @node-click="handleNodeClick"
            style="font-size: 12px;margin: 0px 5px;"
          >
            <span slot-scope="{ node, data }">
              <img
                :src="treeImg(data)"
                style="width: 12px;height: 12px;vertical-align: -3%;margin-right: 3px;"
              >
              <span
                v-if="data.id === search.camera || data.id === search.structId"
                style="font-weight: bold;color: #477CFB;"
              >{{ treeLabelText(data) }}</span>
              <span v-else>{{ treeLabelText(data) }}</span>
            </span>
          </el-tree>
        </el-aside>
        <el-main style="background-color: #FFFFFF;border-radius: 5px;">
          <div style="margin: 10px 20px 20px 20px">
            <div style="height: 35px;">
              <span style="font-size: 18px;color: rgb(40, 40, 40);">{{this.storeName}}</span><span style="margin-left: 20px;font-size:14px;color:#999999;">{{this.fullName}}</span>
            </div>
            <el-tabs
              v-model="activeVideo"
              type="card"
              @tab-click="switchMode"
              class="videoTab"
            >
              <el-tab-pane
                label="实时监控"
                name="live"
              >
                <div style="width: 100%;border-left: solid 1px #e8edf7;border-right: solid 1px #e8edf7;height: 100%">
                  <div
                    class="video-box"
                    id="liveBox"
                    style="text-align: center"
                  >
                    <video
                      id="liveVideo"
                      autoplay
                      playsinline
                      controls
                      webkit-playsinline
                      style="width:100%;pointer-events: none;cursor: default;"
                    >
                      <source
                        type="application/x-mpegURL"
                        :src="http_url"
                      />
                    </video>
                    <div class="video-camera-name">{{cameraName}}</div>
                    <div
                      v-show="search.camera === ''"
                      class="video-tips"
                    >请选择摄像头</div>
                    <div
                      v-if="search.camera && ezopenConfig.deviceSerial === ''"
                      class="video-error"
                    >该设备未填写序列号</div>
                    <div
                      v-show="player && ezopenConfig.deviceSerial !== ''"
                      id="liveCapture"
                      @click="savePic('#liveVideo')"
                      class="video-capture"
                    ></div>
                    <div
                      v-show="player && ezopenConfig.deviceSerial !== ''"
                      @click="switchResolution"
                      :class="http_url.indexOf('hd.m3u8') > 0 ? 'video-resolution_hd' : 'video-resolution_sd'"
                    ></div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane
                label="录像回放"
                name="monitor"
              >
                <div style="width: 100%;border-left: solid 1px #e8edf7;border-right: solid 1px #e8edf7">
                  <div class="video-box">
                    <div
                      ref="imageWrapper"
                      id="monitorVideo"
                      style="backgroundColor: black;pointer-events: none;cursor: default;"
                    > </div>
                    <div class="video-camera-name">{{cameraName}}</div>
                    <div
                      v-if="search.camera === ''"
                      class="video-tips"
                    >请选择摄像头</div>
                    <!--<div-->
                      <!--v-if="diskNum<0"-->
                      <!--class="video-error"-->
                    <!--&gt;该设备无录像</div>-->
                    <div
                      v-if="search.camera && ezopenConfig.deviceSerial === ''"
                      class="video-error"
                    >设备序列号或验证码填写错误</div>
                    <div
                      v-show="monitorVideo && ezopenConfig.deviceSerial !== ''"
                      id="monitorCapture"
                      @click="savePic('#monitorVideo')"
                      class="video-capture"
                    ></div>
                  </div>
                  <div
                    class="search-box"
                    @mousedown="mouseDown"
                    @mouseup="mouseUp"
                  >
                    <span
                      class="cond-name"
                      style="line-height: 50px"
                    >
                      日期&nbsp;&nbsp;<el-date-picker
                        v-model="monitorDate"
                        type="date"
                        placeholder="请选择"
                        :disabled=" ezopenConfig.deviceSerial === ''"
                        :picker-options="pickerOptions"
                        :clearable="false"
                        value-format='yyyy-MM-dd'
                        @change="handleMonitorDateSelect"
                      ></el-date-picker><br>
                    </span>
                    <el-slider
                      v-model="monitorTime"
                      style="width: calc(100vw - 725px);margin-left:30px;display: inline-block;vertical-align: middle;"
                      :disabled=" ezopenConfig.deviceSerial === ''"
                      :show-tooltip="showToolTip"
                      :format-tooltip="formatTooltip"
                      :max="86400"
                      @change="handleMonitorTimeSelect"
                    ></el-slider>
                    <img
                      :src="timeflow"
                      style="width: calc(100vw - 725px);vertical-align: 0%;margin-left:30px;"
                    >
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div
              class="picture-box"
              style="padding-top: 1px;border-left: solid 1px #e8edf7;border-right: solid 1px #e8edf7;border-bottom: solid 1px #e8edf7;margin-bottom: 20px;"
            >
              <div style="margin-top: 30px;">
                <span style="margin: 0px 0px 0px 0px;font-size: 18px;">近三日截图记录</span>
                <el-tabs
                  v-model="activeDay"
                  @tab-click="handleDayTabClick"
                >
                  <el-tab-pane
                    :label="todayTab"
                    name="today"
                  ></el-tab-pane>
                  <el-tab-pane
                    :label="yesterdayTab"
                    name="yesterday"
                  ></el-tab-pane>
                  <el-tab-pane
                    :label="beforeyesterdayTab"
                    name="beforeyesterday"
                  ></el-tab-pane>
                </el-tabs>
              </div>
              <div style="margin-top: -10px;">
                <template v-for="(p, index) in pictureList">
                  <span>
                    <el-checkbox
                      @change="handleCheckAllChange($event, index)"
                      v-model="p.check"
                      v-show="pictureList[0].data.length !== 0"
                      style="margin: 20px 0px"
                    >全部</el-checkbox>
                    <el-button
                      class="confirm-button"
                      style="float: right;margin: 10px 30px 0px 0px;"
                      v-show="pictureList[0].data.length !== 0"
                      :disabled="allCheckList.length === 0"
                      @click="deleteScreenShot"
                    >删除</el-button>
                    <el-button
                      class="confirm-button"
                      style="float: right;margin: 10px 20px 0px 0px;"
                      v-show="pictureList[0].data.length !== 0"
                      :disabled="allCheckList.length === 0"
                      @click="downloadScreenShot"
                    >下载</el-button>
                  </span>
                  <el-checkbox-group
                    v-model="p.checkList"
                    @change="handleCheckPic($event, index)"
                  >
                    <div
                      v-for="d in p.data"
                      style="width: 20%;display: inline-block;margin-top: 10px;margin-bottom: 10px;padding: 0 10px;"
                    >
                      <div>
                        <img
                          :src="d.filepath+'?token='+token"
                          style="width: 100%"
                          @click="lookBigPicture(d.filepath)"
                        >
                        <template v-for="item in cameraOptions">
                          <template v-if="parseInt(item.value) === d.cameraId">
                            <span>{{item.name}}</span>
                            <el-button
                              type="text"
                              style="color: #4a4a4a;padding: 5px 0px;"
                            >{{item.name}}</el-button>
                          </template>
                        </template>
                      </div>
                      <el-checkbox
                        :label="d.id"
                        :key="d.id"
                      >
                        <div> {{d.filename}}</div>
                      </el-checkbox>
                    </div>
                  </el-checkbox-group>
                </template>
                <el-dialog
                  title="查看大图"
                  :visible.sync="bigPicture"
                  width="790px"
                >
                  <div style="width: 800px">
                    <img
                      :src="this.imgSrc+'?token='+token"
                      style="margin: auto"
                      width="750px"
                    >
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import ezuikit from '../../../static/lib/ezuikit.js'
import store from '@/image/store.png'
import cam from '@/image/cam.png'
import cut from '@/image/cut.png'
import timeflow from '@/image/timeflow.png'
import fullscreen from '@/image/fullscreen.png'
import standard from '@/image/standard.png'
import { uploadScreenShot, listScreenShot, getLiveAddress, getMonitorConfig, deleteScreenShot, listPermissionTreeForPatrol } from '@/api/patrol'
import { formatDate } from '@/utils/date'
import { getToken } from '@/utils/auth'
import { fetchCamera } from '@/api/dictionary'

export default {
  name: 'VideoStore',
  watch: {
  },
  data() {
    return {
      search: {
        structId: '',
        camera: ''
      },
      player: '',
      http_url: '',
      checkedStore: [],
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      cameraOptions: [],
      screenShot: '',
      imgShow: true,
      liveVideo: '',
      monitorVideo: '',
      pictureList: [],
      ezopenConfig: {
        accessToken: '',
        deviceSerial: 1,
        channelNo: 1,
        monitorUrlPrefix: 'ezopen://open.ys7.com/'
      },
      monitorDate: formatDate(new Date(), 'yyyy-MM-dd'),
      monitorTime: 0,
      monitorTimeParam: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      width: 0,
      height: 0,
      sd: '',
      showToolTip: false,
      activeVideo: 'live',
      activeDay: 'today',
      fullName: '',
      storeName: '待选择门店',
      cameraName: '',
      cam,
      store,
      timeflow,
      standard,
      fullscreen,
      cut,
      tLength: 0,
      yLength: 0,
      bLength: 0,
      timer: '',
      captureFlag: false,
      bigPicture: false,
      imgSrc: '',
      diskNum: 0,
      token: getToken(),
      clickTime: '',
      msgFlag: false
    }
  },
  components: {
  },
  methods: {
    lookBigPicture(val) {
      this.imgSrc = val
      this.bigPicture = true
    },
    handleNodeClick(data) {
      if (data.parentId !== 0) {
        const nowTime = new Date().getTime()
        if (this.clickTime !== undefined && (nowTime - this.clickTime < 800)) {
          if (!this.msgFlag) {
            this.msgFlag = true
            this.$message.error('操作过于频繁,稍后再试')
            const that = this
            setTimeout(function () {
              that.msgFlag = false
            }, 3000)
          }
          return
        }
        this.clickTime = nowTime

        this.search.camera = data.id
        if (this.activeVideo === 'live') {
          this.getLiveAddress()
        } else {
          this.getMonitorConfig()
        }

        this.fullName = data.parentLabel
        const arr = data.parentLabel.split('/')
        this.storeName = arr[arr.length - 1]
        this.cameraName = data.label
        this.search.structId = data.parentId
        this.listScreenShot()
      }
    },
    handleDayTabClick() {
      this.listScreenShot()
    },
    mouseDown() {
      this.showToolTip = true
    },
    mouseUp() {
      this.showToolTip = false
    },
    formatTooltip(val) {
      if (val === 86400) {
        val--
      }
      const h = ('0' + Math.floor(val / 3600)).slice(-2)
      const m = ('0' + Math.floor(val / 60 % 60)).slice(-2)
      const s = ('0' + Math.floor(val % 60)).slice(-2)
      this.monitorTimeParam = h + m + s
      return h + ':' + m + ':' + s
    },
    handleCheckAllChange(val, index) {
      this.pictureList[index].checkList = val ? this.pictureList[index].data.map(d => d.id) : []
    },
    handleCheckPic(val, index) {
      this.pictureList[index].check = val.length === this.pictureList[index].data.length
    },
    downloadScreenShot() {
      if (this.allCheckList.length > 0) {
        window.open(process.env.BASE_API + '/patrol/screenshot/download' + '?fileId=' + this.allCheckList + '&cameraName=' + this.cameraName + '&token=' + getToken())
      } else {
        this.$message.error('请选择图片')
      }
    },
    deleteScreenShot() {
      if (this.allCheckList.length <= 0) {
        this.$message.error('请选择图片')
        return
      }
      const params = {
        fileId: this.allCheckList
      }
      deleteScreenShot(params).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.listScreenShot()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    listScreenShot: function () {
      let searchDate = formatDate(new Date(), 'yyyy-MM-dd')
      switch (this.activeDay) {
        case 'today':
          break
        case 'yesterday':
          searchDate = formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
          break
        case 'beforeyesterday':
          searchDate = formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2), 'yyyy-MM-dd')
      }
      const params = {
        structId: this.search.structId,
        date: searchDate
      }
      listScreenShot(params).then((res) => {
        this.pictureList = res
        if (this.pictureList.length > 0) {
          this.tLength = this.pictureList[0].todayLength || 0
          this.yLength = this.pictureList[0].yesterdayLength || 0
          this.bLength = this.pictureList[0].beforeYesterdayLength || 0
        } else {
          this.tLength = 0
          this.yLength = 0
          this.bLength = 0
        }
      })
    },
    getLiveAddress: function () {
      const params = {
        cameraId: this.search.camera
      }
      getLiveAddress(params).then((res) => {
        // 异步获取直播地址，并赋值给http_url
        this.http_url = res[0].hls
        this.sd = res[0].hls
        this.hd = res[0].hlsHd
        const that = this
        setTimeout(function () {
          if (!that.ezopenConfig.deviceSerial) {
            if (that.player) {
              that.player.stop()
            }
          } else {
            if (that.activeVideo === 'live') {
              if (that.player) {
                that.player.stop()
              }
              that.initLiveVideo()
            }
          }
        }, 500)
      })
    },
    getMonitorConfig: function () {
      const params = {
        cameraId: this.search.camera
      }
      getMonitorConfig(params).then((res) => {
        this.diskNum = res.diskNum
        this.ezopenConfig.accessToken = res.accessToken
        this.ezopenConfig.deviceSerial = res.cameraSerial
        this.ezopenConfig.channelNo = res.channel
        const that = this
        setTimeout(function () {
          if (!that.ezopenConfig.deviceSerial) {
            if (that.monitorVideo) {
              that.monitorVideo.stop()
            }
          } else {
            if (that.monitorVideo) {
              that.monitorVideo.stop()
            }
            that.initMonitorVideo()
          }
        }, 500)
      })
    },
    handleMonitorDateSelect() {
      if (this.timer) {
        window.clearInterval(this.timer)
      }
      const now = new Date()
      const today = formatDate(now, 'yyyy-MM-dd')
      if (today === this.monitorDate) {
        const nh = now.getHours()
        const nm = now.getMinutes()
        const h = Math.floor(this.monitorTime / 3600)
        const m = Math.floor(this.monitorTime / 60 % 60)
        if (h > nh || (h === nh && m > (nm - 2))) {
          this.$message.error('选择时间大于当前时间,请重新选择')
          return
        }
      }
      if (this.monitorVideo) {
        this.monitorVideo.stop()
      }
      const that = this
      setTimeout(function () {
        that.initMonitorVideo()
      }, 500)
    },
    handleMonitorTimeSelect() {
      const nowTime = new Date().getTime()
      if (this.clickTime !== undefined && (nowTime - this.clickTime < 2000)) {
        if (!this.msgFlag) {
          this.msgFlag = true
          this.$message.error('操作过于频繁,稍后再试')
          const that = this
          setTimeout(function () {
            that.msgFlag = false
          }, 3000)
        }
        return
      }
      this.clickTime = nowTime
      if (this.timer) {
        window.clearInterval(this.timer)
      }
      const now = new Date()
      const today = formatDate(now, 'yyyy-MM-dd')
      if (today === this.monitorDate) {
        const nh = now.getHours()
        const nm = now.getMinutes()
        const h = Math.floor(this.monitorTime / 3600)
        const m = Math.floor(this.monitorTime / 60 % 60)
        if (h > nh || (h === nh && m > (nm - 2))) {
          this.$message.error('选择时间大于当前时间,请重新选择')
          return
        }
      }
      if (this.monitorVideo) {
        this.monitorVideo.stop()
      }
      const that = this
      setTimeout(function () {
        that.initMonitorVideo()
      }, 500)
    },
    listPermissionTree() {
      listPermissionTreeForPatrol().then((res) => {
        this.tree = res
      })
    },
    fetchCamera: function () {
      fetchCamera().then((res) => {
        this.cameraOptions = res
      })
    },
    switchMode(tab, event) {
      if (this.activeVideo === 'live') {
        if (this.monitorVideo) {
          this.monitorVideo.stop()
          window.clearInterval(this.timer)
        }
        if (this.ezopenConfig.deviceSerial === '') {
          return
        }
        if (this.search.camera) {
          this.getLiveAddress()
        }
      } else {
        if (this.player) {
          this.player.stop()
        }

        if (this.width === 0 && this.height === 0) {
          const box = document.getElementById('liveVideo')
          this.width = box.offsetWidth
          this.height = box.offsetHeight
        }
        this.$refs.imageWrapper.style.width = this.width + 'px'
        this.$refs.imageWrapper.style.height = this.height + 'px'
        if (this.ezopenConfig.deviceSerial === '') {
          return
        }
        if (this.monitorVideo) {
          this.monitorVideo.stop()
          window.clearInterval(this.timer)
        }
        if (this.search.camera) {
          this.getMonitorConfig()
        }
      }
    },
    switchResolution() {
      if (this.http_url.indexOf('hd.m3u8') > 0) {
        this.http_url = this.sd
      } else {
        this.http_url = this.hd
      }
      if (this.player) {
        this.player.stop()
        this.initLiveVideo()
      }
    },
    // 截取当前帧的图片
    savePic(selector) {
      if (this.captureFlag) {
        return
      }
      this.activeDay = 'today'
      if (this.pictureList.length > 0) {
        this.pictureList[0].data.unshift({
          id: 0,
          date: formatDate(new Date(), 'yyyy-MM-dd'),
          filename: formatDate(new Date(), 'hh:mm:ss'),
          filepath: '../../../static/img/imgsaving.png',
          cameraId: this.search.camera
        })
      }
      var btn
      var strDataURL
      if (this.activeVideo === 'live') {
        btn = document.getElementById('liveCapture') // 首先需要获取的是哪一个按钮的id
        btn.style = 'cursor: not-allowed' // 只要点击就将按钮的可点击的状态更改为不可以点击的状态
        this.captureFlag = true
        var video = document.querySelector(selector) // 找到需要截图的video标签
        var canvas = window.canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height) // 图片大小和视频分辨率一致
        strDataURL = canvas.toDataURL('image/png') // canvas中video中取一帧图片并转成dataURL
      } else {
        btn = document.getElementById('monitorCapture') // 首先需要获取的是哪一个按钮的id
        btn.style = 'cursor: not-allowed' // 只要点击就将按钮的可点击的状态更改为不可以点击的状态
        this.captureFlag = true
        var webglCanvas = document.querySelector(selector).childNodes[0].childNodes[0].childNodes[0]
        var gl = webglCanvas.getContext('webgl', { preserveDrawingBuffer: true })
        strDataURL = gl.canvas.toDataURL('image/png') // canvas中video中取一帧图片并转成dataURL
      }
      var arr = strDataURL.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      var blob = new Blob([u8arr], {
        type: mime
      })
      this.screenShot = blob
      this.uploadScreenShot()
    },
    uploadScreenShot() {
      var fd = new FormData()
      fd.append('file', this.screenShot, this.filename(new Date()))
      fd.append('structId', this.search.structId)
      fd.append('cameraId', this.search.camera)
      fd.append('token', getToken())
      uploadScreenShot(fd).then((res) => {
        if (res.msgCode === '200') {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.listScreenShot()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        this.listScreenShot()
        this.captureFlag = false
        var btn
        if (this.activeVideo === 'live') {
          btn = document.getElementById('liveCapture') // 首先需要获取的是哪一个按钮的id
          btn.style = 'cursor: pointer' // 只要点击就将按钮的可点击的状态更改为不可以点击的状态
        } else {
          btn = document.getElementById('monitorCapture') // 首先需要获取的是哪一个按钮的id
          btn.style = 'cursor: pointer' // 只要点击就将按钮的可点击的状态更改为不可以点击的状态
        }
      })
    },
    initLiveVideo() {
      this.liveVideo = document.getElementById('liveVideo')
      this.liveVideo.src = ''
      this.liveVideo.src = this.http_url
      this.player = new ezuikit.EZUIPlayer('liveVideo')
    },
    initMonitorVideo() {
      if (this.timer) {
        window.clearInterval(this.timer)
      }
      if (!this.search.camera) {
        return
      }
      this.monitorVideo = new ezuikit.EZUIPlayer({
        id: 'monitorVideo',
        autoplay: true,
        url: this.monitorUrl,
        accessToken: this.ezopenConfig.accessToken,
        decoderPath: './static/lib',
        width: this.width,
        height: this.height,
        handleSuccess: this.handleSuccess(),
        handleError: this.handleError
      })
      setTimeout(function () {
        document.querySelector('#monitorVideo').childNodes[0].childNodes[0].childNodes[0].getContext('webgl', { preserveDrawingBuffer: true })
      }, 1000)
    },
    changeMonitorTime() {
      const that = this
      var callback = function(iTime) {
        console.log('iTime', iTime)
        var time = new Date(iTime)
        that.monitorTime = time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()
      }
      this.monitorVideo.getOSDTime(callback)
    },
    handleError(e) {
      this.$message.error('服务器繁忙,请稍后刷新页面重试')
      console.log('handleError', e)
    },
    handleSuccess() {
      this.timer = null
      this.timePlus()
    },
    timePlus() {
      const that = this
      this.timer = setInterval(function () {
        that.changeMonitorTime()
      }, 5000)
    }
  },
  mounted() {
    this.listPermissionTree()
    this.fetchCamera()
  },
  updated() {
    this.liveVideo = document.getElementById('liveVideo')
    this.liveVideo.style.height = this.liveVideo.offsetWidth * 0.56 + 'px'
  },
  computed: {
    allCheckList() {
      const temp = []
      this.pictureList.forEach(p => {
        p.checkList.forEach(i => {
          temp.push(i)
        })
      })
      return temp
    },
    filename() {
      return function (date) {
        return this.cameraName + '_' + formatDate(date, 'yyyyMMdd_hhmmss') + '.png'
      }
    },
    monitorUrl() {
      const reg = new RegExp('-', 'g')
      const date = this.monitorDate.replace(reg, '')
      const timeParams = '?begin=' + date + this.monitorTimeParam
      return this.ezopenConfig.monitorUrlPrefix + this.ezopenConfig.deviceSerial + '/' + this.ezopenConfig.channelNo + '.rec' + timeParams
    },
    treeLabelText() {
      return function (data) {
        if (data.parentId !== 0) {
          return data.label
        } else {
          const arr = data.label.split('/')
          return arr[0] + '/.../' + arr[arr.length - 1]
        }
      }
    },
    treeImg() {
      return function (data) {
        if (data.parentId !== 0) {
          return cam
        } else {
          return store
        }
      }
    },
    todayTab() {
      return '今日-' + formatDate(new Date(), 'yyyyMMdd') + '(' + this.tLength + '张)'
    },
    yesterdayTab() {
      return '昨日-' + formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyyMMdd') + '(' + this.yLength + '张)'
    },
    beforeyesterdayTab() {
      return '前日-' + formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 2), 'yyyyMMdd') + '(' + this.bLength + '张)'
    }
  },
  destroyed: function () {
    if (this.player) {
      this.player.stop()
    }
    if (this.monitorVideo) {
      this.monitorVideo.stop()
    }
  },
  beforeDestroy() {
    const that = this
    if (that.timer) {
      window.clearInterval(that.timer)
      that.timer = ''
    }
  }
}
</script>
<style>
.mystyle {
  line-height: 100px;
  text-align: center;
  font-size: 16px;
  color: #282828;
  .num {
    font-size: 30px;
    span {
      font-size: 16px;
      display: inline-block;
      vertical-align: top;
    }
  }
}
.video-box {
  position: relative;
  margin-top: 20px;
  padding-top: 15px;
  margin-left: 14%;
  margin-right: 14%;
  padding-bottom: 15px;
}
.video-box video {
  display: inline-block;
  vertical-align: baseline;
}
.video-box .video-capture {
  position: absolute;
  top: 48%;
  left: 87%;
  width: 50px;
  height: 50px;
  /*z-index: 999;*/
  /*background: url(/src/icons/svg/capture.svg) no-repeat;*/
  background: url(../../../static/img/cut.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}

.video-box .video-resolution_sd {
  position: absolute;
  top: 30%;
  left: 87%;
  width: 50px;
  height: 50px;
  /*z-index: 999;*/
  background: url(../../../static/img/standard.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  color: #1296db;
  font-size: 30px;
  text-align: center;
}

.video-box .video-camera-name {
  position: absolute;
  top: 10%;
  left: 6.5%;
  width: auto;
  height: 50px;
  /*z-index: 999;*/
  background-size: 100% 100%;
  cursor: pointer;
  color: white;
  font-size: 18px;
  text-align: center;
}

.video-box .video-tips {
  position: absolute;
  top: 45%;
  left: 40%;
  /*width: 50px;*/
  /*height: 50px;*/
  /*z-index: 999;*/
  background-size: 100% 100%;
  cursor: pointer;
  color: white;
  font-size: 18px;
  text-align: center;
}

.video-box .video-error {
  position: absolute;
  top: 45%;
  left: 36%;
  /*width: 50px;*/
  /*height: 50px;*/
  /*z-index: 999;*/
  background-size: 100% 100%;
  cursor: pointer;
  color: white;
  font-size: 18px;
  text-align: center;
}

.video-box .video-resolution_hd {
  position: absolute;
  top: 30%;
  left: 87%;
  width: 50px;
  height: 50px;
  /*z-index: 999;*/
  background: url(../../../static/img/hd.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  color: #1296db;
  font-size: 30px;
  text-align: center;
}

/*video::-webkit-media-controls-play-button{*/
/*display: none;*/
/*visibility: hidden;*/
/*}*/

.addAccount-scrollbar-wrap {
  overflow-x: hidden;
}

.dataTab-checkbox .el-checkbox__label {
  display: none;
  padding-left: 10px;
  line-height: 19px;
  font-size: 14px;
}

.picture-box {
  overflow: hidden;
  min-height: 80px;
  background-color: #ffffff;
  padding: 20px 30px 20px 30px;
}

audio::-webkit-media-controls-enclosure,
video::-webkit-media-controls-enclosure {
  display: none;
  visibility: hidden;
  bottom: 0px;
  text-indent: 0px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 0px;
  margin: 0px;
  flex: 1 1 0%;
}

.videoTab .el-tabs__item {
  background-color: #e8edf7;
}

.videoTab .el-tabs__item.is-active {
  background-color: white;
}

.videoTab .el-tabs__content {
  overflow: hidden;
  position: relative;
  margin-top: -36px;
}
</style>

