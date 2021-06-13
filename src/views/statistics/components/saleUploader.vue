<template>
  <div>
    <el-upload
      ref="uploadSaleData"
      :action="uploadUrl"
      :show-file-list="false"
      :on-change="changeFileList"
      :auto-upload="false"
      :file-list="saleFileList"
      :on-progress="saleFileOnProgress"
      :on-success="saleFileSuccess"
    >
      <el-button
        size="small"
        slot="trigger"
      >
        <span v-if="saleFileList.length === 0">浏览</span>
        <span v-else>更换</span>
      </el-button>
      <el-button
        style="margin-left: 10px;"
        size="small"
        @click="submitUpload"
        v-if="saleFileList.length !== 0"
      >确认上传</el-button>
      <div v-if="saleFileList.length !== 0">
        <span>文件名:{{saleFileList[0].name}}&nbsp;&nbsp;大小:{{showFileSize(saleFileList[0].size)}}</span><br>
      </div>
      <el-progress
        :percentage="uploadingPercentage"
        v-if="saleFileUploading || saleFileUploaded"
      ></el-progress>
    </el-upload>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
  },
  data() {
    return {
      saleFileList: [],
      saleFileUploading: false,
      saleFileUploaded: false,
      uploadingPercentage: 0,
      saleFilePath: ''
    }
  },
  methods: {
    submitUpload() {
      this.$refs.uploadSaleData.submit()
    },
    changeFileList(files, fileList) {
      this.saleFileList = fileList.slice(-1)
    },
    saleFileOnProgress(event, file, fileList) {
      this.saleFileUploading = true
      this.uploadingPercentage = Math.round(event.percent)
    },
    saleFileSuccess(response, file, fileList) {
      if (response.code === '0') {
        this.saleFilePath = response.data
        this.$message({
          message: response.message,
          type: 'success'
        })
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
      this.saleFileUploading = false
      this.saleFileUploaded = true
    },
    closeImportSaleData() {
      this.saleFileList = []
    },
    showFileSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return Math.round(size / 1024) + 'KB'
      } else if (size < 1024 * 1024 * 1024) {
        return Math.round(size / 1024 / 1024) + 'MB'
      } else {
        return Math.round(size / 1024 / 1024 / 1024) + 'GB'
      }
    },
    abortUpload() {
      this.saleFileList = []
      this.uploadingPercentage = 0
      if (this.saleFileUploading) {
        this.$refs.uploadSaleData.clearFiles()
        this.$refs.uploadSaleData.abort()
      }
    }
  },
  computed: {
    uploadUrl: function () {
      return process.env.BASE_API + '/sale/data/upload?token=' + getToken()
    }
  }
}
</script>
<style>
</style>
