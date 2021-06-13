<template>
  <div class="el-data-tree">
    <section class="body">
      <el-tree
        ref="tree"
        v-loading="loading"
        :data="treeData"
        class="data-tree"
        default-expand-all
        @defaultExpandedKeys="defaultExpandedKeys"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
      >
        <span
          slot-scope="{node, data}"
          class="custom-tree-node"
        >
          <span class="custom-tree-node-label">
            <!-- @slot 可定制的节点标签内容, 参数为 { data } -->
            <slot
              name="node-label"
              :data="data"
            >{{ node.label }}</slot>
          </span>
          <span class="custom-tree-node-btns">
            <template>
              <el-button
                type="text"
                @click="handleCommand('new', node, data)"
              ><i class="el-icon-plus"></i></el-button>
              <el-button
                type="text"
                @click="handleCommand('edit', node, data)"
              ><i class="el-icon-edit"></i></el-button>
              <el-button
                type="text"
                class="delete-button"
                @click="handleCommand('delete', node, data)"
              ><i class="el-icon-delete" /></el-button>
            </template>
          </span>
        </span>
      </el-tree>
    </section>

    <!-- 新增和编辑时弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      @close="closeDialog"
    >
      <span>区域名称：</span>
      <el-input
        v-model="inputData"
        type="text"
        maxlength="10"
        show-word-limit
        style="width: 310px;"
      />

      <div slot="footer">
        <el-button
          size="small"
          @click="cancel"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          :loading="confirmLoading"
          @click="confirm"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultParentKey = 'parentId'

export default {
  name: 'ElDataTree',
  props: {
    /**
     * el-tree 树形数据
     */
    treeData: {
      type: Array,
      default: () => {
        return {}
      }
    },

    /**
     * 父级id的key，默认值 parentKey，
     * 修改时会用到,请求会根据定义的属性值获取parentKey,即row[this.parentKey]
     */
    parentKey: {
      type: String,
      default: defaultParentKey
    },
    /**
     * 用于转换获取的数据为目标数据
     */
    transform: {
      type: Function
    },
    /**
     * 点击新增按钮时的方法, 当默认新增方法不满足需求时使用, 需要返回promise。
     * 参数(data, row) data 是form表单的数据, row 是当前行的数据
     */
    onNew: {
      type: Function
    },
    /**
     * 点击修改按钮时的方法, 当默认修改方法不满足需求时使用, 需要返回promise。
     * 参数(data, row) data 是form表单的数据, row 是当前行的数据
     */
    onEdit: {
      type: Function
    },
    /**
     * 点击删除按钮时的方法, 当默认删除方法不满足需求时使用, 需要返回promise。
     * 参数(data, row) data 是form表单的数据, row 是当前行的数据
     */
    onDelete: {
      type: Function
    },
    /**
     * 默认新增操作菜单文字
     */
    newText: {
      type: String,
      default: '添加子区域'
    },
    /**
     * 默认修改操作菜单文字
     */
    editText: {
      type: String,
      default: '修改名称'
    },
    /**
     * 默认删除操作菜单文字
     */
    deleteText: {
      type: String,
      default: '确认删除该区域?'
    }
  },
  data() {
    return {
      loading: false,

      dialogTitle: '',
      dialogVisible: false,
      isNew: true,
      isEdit: false,
      confirmLoading: false,
      // 要修改的那一行
      row: {},

      // 默认展开节点 keys
      defaultExpandedKeys: [],

      // 展开操作后的节点 keys，用于保存新增、编辑、删除等操作后的展开状态
      cacheExpandedKeys: new Set(),
      inputData: ''
    }
  },
  computed: {

  },
  watch: {
    treeData: {
      deep: true,
      handler(val) {
        this.updateDefaultExpandKeys(val)
      }
    }
  },
  methods: {
    updateDefaultExpandKeys() {
      this.defaultExpandedKeys = [...this.cacheExpandedKeys]
    },
    /**
     * 获取el-tree对象，方便调用其方法
     * @returns {tree object}
     * @public
     */
    getTree() {
      return this.$refs.tree
    },
    handleCommand(command, data, node) {
      const handler = {
        new: this.onDefaultNew,
        edit: this.onDefaultEdit,
        delete: this.onDefaultDelete
      }

      if (handler[command]) {
        handler[command](data, node)
        return
      }
    },

    onDefaultNew(data = {}) {
      this.row = data
      this.isNew = true
      this.isEdit = false
      this.dialogTitle = this.newText
      this.dialogVisible = true
    },
    onDefaultEdit(data) {
      this.row = data
      this.isNew = false
      this.isEdit = true
      this.dialogTitle = this.editText
      this.dialogVisible = true
    },
    onDefaultDelete(data, node) {
      this.$confirm(this.deleteText, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action !== 'confirm') {
            done()
            return
          }
          instance.confirmButtonLoading = true

          const request =
            // (this.onDelete && this.onDelete(data, node)) ||
            // this.$axios.delete(
            //   this.url + '/' + data[this.treeAttributes.nodeKey]
            // )
            request
              .then(() => {
                done()
                this.showMessage()
              })
              .catch(err => {
                this.$emit('error', err)
              })
              .finally(() => {
                instance.confirmButtonLoading = false
              })
        }
      }).catch(err => {
        this.$emit('error', err)
      })
    },

    // 组件可以绑定多个相同的事件，不需要emit node-expand/node-collapse 来兼容el-tree
    handleNodeExpand(data) {
      // const nodeKey = this.treeAttributes.nodeKey
      // this.cacheExpandedKeys.add(data[nodeKey])
    },
    handleNodeCollapse(data) {
      // const nodeKey = this.treeAttributes.nodeKey
      // this.cacheExpandedKeys.delete(data[nodeKey])
    },

    cancel() {
      this.dialogVisible = false
    },
    confirm() {

    },
    closeDialog() {
      this.isNew = false
      this.isEdit = false
      this.confirmLoading = false
    },
    showMessage(isSuccess = true) {
      if (isSuccess) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      } else {
        this.$message({
          type: 'error',
          message: '操作失败'
        })
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$delete-color: #e24156;
.el-data-tree {
  overflow: hidden;
  transition: 0.3s;

  .body {
    padding: 20px;
  }

  .data-tree {
    // padding-top: 8px;
  }

  .custom-tree-node {
    overflow: hidden;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 6px;
    font-size: 12px;
    font-family: PingFangSC, Microsoft YaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 16px;

    .custom-tree-node-label {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .custom-tree-node-btns {
      .el-button {
        font-family: inherit;
      }
    }
  }

  .delete-button {
    color: $delete-color;

    &:hover,
    &:focus {
      color: $delete-color;
    }
  }
}
</style>
