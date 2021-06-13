<template>
  <div
    :class="combineList.length>0?'img':''"
    v-show="combineList.length>0"
    v-loading="loading"
  >
    <div class="combine">
      <div style="height:45px;padding:0px 20px;">

        <span
          class="table-tile combineList"
          style="float:left"
        >合并清单
          <el-tooltip
            class="item"
            effect="dark"
            content="最多可选择5个身份进行合并"
            placement="top-start"
          >
            <span class="el-icon-warning-outline"></span>
          </el-tooltip>
        </span>
        <div
          @click="removeAllCombineList"
          class="removeAllCombineList"
        >清空</div>
      </div>
      <div class="imgMa">
        <div
          v-for="item in combineList"
          :key="item.id"
          style="width:73px"
          class="imgSon"
        >
          <el-row class="imgfa">
            <img
              :src="item.img"
              alt=""
              @click="()=>{LookBigPicture(item.img)}"
            >
            <span
              class="el-icon-delete delete removeId"
              @click="()=>{removeUserId(item.id)}"
            ></span>
          </el-row>
          <p>{{item.id}}</p>
        </div>
      </div>
      <el-col class="retainId">
        <span class="cond-name">身份ID:</span>
        <el-select
          v-model="retainId"
          placeholder="请选择"
          size='mini'
          style="width:145px"
        >
          <el-option
            v-for="item in combineList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-col>
      <div style="text-align:center">
        <el-button
          size='small'
          @click="removeAllCombineList"
          style="width:90px"
        >取消</el-button>
        <el-button
          :type="combineList.length>1?'primary':'info'"
          size='small'
          :disabled="combineList.length>1?false:true"
          @click="comfirmCombineDialog=true"
          style="width:90px;margin-left:20px"
        >确认合并</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="comfirmCombineDialog"
      width="350px"
      :show-close='false'
    >
      <div class="confirmDialog"> <span class="el-icon-warning"></span><span class="confirmText">是否确定合并这<span style="color: blue">{{combineList.length}}</span>个身份?</span></div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click="comfirmCombineDialog= false"
          size="small"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="postAllCombineList"
        >确认</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="bigPicture"
      width="450px"
      :show-close="false"
    >
      <img
        :src="this.imgSrc"
        width="452px"
        style="margin: auto;height: 440px;margin:-21px;vertical-align:middle"
      />
    </el-dialog>
  </div>

</template>
<script>
import { postPombineCutomerList } from '@/api/customer'
export default {
  name: 'combine',
  props: {
    list: {
      default: []
    },
    retainId: {
      default: ''
    }
  },
  data() {
    return {
      // retainId: '',
      bigPicture: false,
      imgSrc: '',
      comfirmCombineDialog: false,
      loading: false,
      // token: getToken(),
      token: '28abc06bd4bbe7965714c267be7b9214'
    }
  },
  computed: {
    combineList: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('changeCombineList', val)
      }
    }
  },
  methods: {
    LookBigPicture(val, id) {
      this.imgSrc = val
      this.bigPicture = true
    },
    postAllCombineList() {
      this.comfirmCombineDialog = false
      this.loading = true
      const params = {
        mergeId: this.retainId,
        mergeList: this.combineList.map(item => { return item.id })
      }
      postPombineCutomerList(params).then(res => {
        this.loading = false
        if (res.msgCode === '200') {
          this.combineList = []
          this.$message({
            type: 'success',
            message: res.message
          })
          this.$emit('init')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    removeUserId(id) {
      this.combineList = this.combineList.filter(item => {
        return item.id !== id
      })
    },
    removeAllCombineList() {
      this.combineList = []
    }
  }
}
</script>
<style lang="scss" scoped>
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
.cond-name {
  margin: 0 10px 0 0px;
  color: rgba(0, 0, 0, 0.65);
  span {
    font-size: 14px;
  }
}
.combineList {
  display: inline-block;
  height: 45px;
  line-height: 45px;
  font-weight: 600;
  margin: 0;
  color: rgba(0, 0, 0, 0.85);
  .el-button {
    border-radius: 4px;
  }
}
.img {
  position: absolute;
  right: 0;
  top: 0;
  width: 272px;
  height: 100%;
  overflow: auto;
  margin-left: 10px;
  background-color: #fff;
  padding: 0px 0px 10px 0px;
  .retainId {
    margin: 10px 0px 20px 0px;
    text-align: center;
    // font-size: 14px;
    font-size: 0px;
    span {
      margin-bottom: 5px;
    }
  }
  p {
    margin: 0px 0px 10px 0px;
    font-size: 12px;
  }
  .imgMa {
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    padding: 16px 0px 0px 7px;
    // text-align: center;
    .imgSon {
      display: inline-block;
      width: 73px;
      margin: 0px 29px;
      text-align: center;
    }
  }
  .imgfa {
    width: 73px;
    position: relative;
    img {
      width: 62px;
      height: 84px;
    }
    &:hover {
      .delete {
        visibility: visible;
      }
      .delete:hover {
        color: #1890ff;
      }
    }
  }
  .delete {
    width: 16px;
    height: 16px;
    position: absolute;
    right: 12px;
    bottom: 6px;
    font-size: 12px;
    padding: 2px;
    visibility: hidden;
    background-color: #fff;
    cursor: pointer;
  }
  // .removeId {
  //   position: absolute;
  //   right: 20px;
  //   bottom: 0px;
  //   width: 15px;
  //   height: 15px;
  //   line-height: 15px;
  //   background-color: rgba(255, 255, 255, 0.904);
  //   cursor: pointer;
  // }
  // p {
  //   text-align: left;
  // }
}
.el-icon-warning {
  vertical-align: middle;
  color: #ebb563;
  height: 22px;
  width: 22px;
  font-size: 22px;
  margin-right: 16px;
}
.el-icon-warning-outline {
  height: 12px;
  width: 12px;
  font-size: 12px;
}
.removeAllCombineList {
  float: right;
  font-size: 12px;
  margin-top: 20px;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
}
</style>
