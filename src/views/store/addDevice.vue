<template>
  <div>
    <div class="addDevice-body-box">
      <el-form
        label-width="80px"
        align="center"
        style="padding-top: 20vh"
      >
        <el-input
          v-model="deviceId"
          style="padding-bottom: 30px; width: 730px;"
          placeholder="请输入设备序列号"
          clearable
        ></el-input><br>

        <el-dropdown
          trigger="click"
          placement="bottom-start"
          ref="addDevFormDrop"
        >
          <!-- <el-input v-model="select.label" placeholder="请选择门店名称" style="width: 730px;" @change="changeInput"></el-input> -->
          <el-select
            class="select-store"
            v-model="select.label"
            placeholder="请选择门店名称"
            style="width: 730px;"
            remote
            clearable
            @clear="clearStore"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-dropdown-menu slot="dropdown">
            <el-scrollbar
              wrap-class="scrollbar-wrap"
              :native="false"
            >
              <el-dropdown-item style="padding: 0px;width: 250px">
                <el-tree
                  :data="storeIdOptions"
                  node-key="id"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                >
                  <span
                    class="custom-tree-node"
                    slot-scope="{ node, data }"
                  >
                    <img
                      :src="treeImg"
                      alt=""
                      style="height:18px;width:18px;line-height: 12px;display:inline-block;float: left;margin-top: 8px"
                    >
                    <span style="margin-left: 5px">{{ node.label }}</span>
                    <el-checkbox
                      v-show="showCheckBox(data)"
                      v-model='data.checked'
                      @change="positionChange(data)"
                    ></el-checkbox>
                  </span>
                </el-tree>
              </el-dropdown-item>
            </el-scrollbar>
          </el-dropdown-menu>
        </el-dropdown><br>
        <div style="padding-top: 60px">
          <el-button
            @click="cancleAddDevice"
            class="cancel-button"
            style="margin-right: 90px;"
          >取消</el-button>
          <el-button
            @click="addDevice"
            class="confirm-button"
          >确定</el-button>
        </div>
      </el-form>

    </div>
  </div>
</template>

<script>
import treeImg from '@/image/treeImg.png'
import { listOrgTree } from '@/api/account'
import { addDevice } from '@/api/store'
export default {
  data() {
    return {
      treeImg,
      filterOptions: null,
      deviceId: '',
      storeIdOptions: [],
      select: {
        label: '',
        id: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
  },
  components: {
  },
  methods: {
    getStoreIdOptions: function () {
      this.select.id = ''
      const params = {}
      listOrgTree(params).then(res => {
        this.storeIdOptions = res
      })
    },
    positionChange(data) {
      this.$nextTick(() => {
        this.select.label = data.label
        this.select.id = data.id
        this.$refs.addDevFormDrop.hide()
        this.recursive(this.storeIdOptions, data.id)
      })
    },
    recursive: function (arrs, id) {
      for (var i = 0; i < arrs.length; i++) {
        if (arrs[i].id === id) {
          arrs[i].checked = true
        } else {
          arrs[i].checked = false
        }
        if (arrs[i].children !== undefined) {
          this.recursive(arrs[i].children, id)
        }
      }
    },
    addDevice: function () {
      const params = {
        structId: this.select.id,
        deviceId: this.deviceId
      }
      if (params.deviceId === undefined || params.deviceId === '') {
        this.$message.error('请输入设备序列号')
        return
      }
      if (params.structId === undefined || params.structId === '') {
        this.$message.error('请选择门店')
        return
      }
      addDevice(params).then(res => {
        this.cancleAddDevice()
        this.$message({
          message: res.message,
          type: 'success'
        })
      }).catch(function (res) { })
    },
    cancleAddDevice: function () {
      this.clearStore()
      this.deviceId = ''
    },
    clearStore: function () {
      this.select.id = ''
      this.select.label = ''
      this.recursive(this.storeIdOptions)
    }
  },
  mounted() {
    this.getStoreIdOptions()
  },
  computed: {
    showCheckBox() {
      return function (data) {
        if (data.type === 2) {
          return true
        } else {
          return false
        }
      }
    }
  }
}
</script>
<style>
.addDevice-body-box {
  border-radius: 5px;
  background-color: #ffffff;
  margin: 20px 50px 0px 50px;
  height: 900px;
}
.addDevice-body-box .el-input__inner {
  width: 730px;
  height: 40px;
  font-size: 14px;
}
.addDevice-body-box .el-input__suffix {
  height: 30px;
}
.addDevice-body-box .el-input__icon {
  line-height: unset;
}
.addDevice-body-box .el-button {
  font-size: 14px;
  padding: unset;
  width: 120px;
  height: 40px;
}
.addDevice-body-box .select-store .el-icon-arrow-up:before {
  content: "";
}
.scrollbar-wrap {
  max-height: 45vh;
}
</style>

