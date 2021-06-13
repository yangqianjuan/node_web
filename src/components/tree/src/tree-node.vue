<template>
  <div
    class="el-tree-node"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
  >
    <div
      :class="{'el-tree-node__content': true, 'select_bgc': isSelect}"
      @contextmenu.prevent="mousedown($event)"
      @click="handleLeftClick"
      @mouseover="isMouseOver = true"
      @mouseout="isMouseOver = false"
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px', 'width': '100%' }"
    >
      <span
        @click="handleClick"
        class="el-tree-node__expand-icon el-icon-caret-right"
        :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }"
      >
      </span>
      <el-checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </el-checkbox>
      <span
        v-if="node.loading"
        class="el-tree-node__loading-icon el-icon-loading"
      >
      </span>
      <!--<svg-icon v-if="node.data.type === 2" icon-class="shop"/>
      <svg-icon v-else icon-class="tree"/>-->
      <node-content
        style="margin-left: 5px; width: 100%;"
        v-if="$parent.renderContent || (node.label !== null && isEdit === false)"
        :node="node"
        :isMouseOver="isMouseOver"
        :handleClickAddNode="handleClickAddNode"
        :handleClickEditNode="handleClickEditNode"
        :handleClickDeleteNode="handleClickDeleteNode"
      ></node-content>
      <input
        v-else
        ref="input"
        type="text"
        size="mini"
        placeholder="请输入分组层级名称"
        maxlength="10"
        :value="node.label"
        v-on:blur="onCompleteInput"
        v-on:keyup.enter="onCompleteInput"
        v-on:focus="focusInput"
        @click="focusInput"
      >
    </div>
    <el-collapse-transition>
      <div
        class="el-tree-node__children"
        v-if="childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <el-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand"
          @right-click="handleRightClick"
          @right-click-node="rightClickNode"
          @left-click-node="leftClickNode"
          @complete-input="handleInputCompleteInput"
          @handleEditNode="handleEditNode"
        >
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition';
import ElCheckbox from 'element-ui/packages/checkbox';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  mixins: [emitter],

  props: {
    node: {
      default() {
        return {};
      }
    },
    defaultSelect: Number,
    props: {},
    renderContent: Function
  },

  components: {
    ElCollapseTransition,
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        },
        isMouseOver: {
          required: true
        },
        handleClickAddNode: {
          required: true
        },
        handleClickEditNode: {
          required: true
        },
        handleClickDeleteNode: {
          required: true
        }
      },
      render(createElement) {
        const parent = this.$parent;
        const node = this.node;
        const data = node.data;
        const store = node.store;
        this.stNumHtml = node.data.type === 2 ? '' : '(' + node.data.stNum + ')'
        if (parent.renderContent) {
          return parent.renderContent.call(parent._renderProxy, createElement, { _self: parent.tree.$vnode.context, node, data, store })
        } else {
          return createElement('div', {
            style: {
              width: '100%',
              fontSize: '12px'
            }
          }, [
            createElement('span', {
              'class': {
                'el-tree-node__label': true
              },
              style: {
                fontSize: '12px'
              },
              domProps: {
                innerHTML: this.node.label + '&nbsp;' + this.stNumHtml
              }
            }),
            createElement('i', {
              'class': {
                'el-icon-delete': true,
                'color_active': true,
                'display_none': !this.isMouseOver || node.data.type !== 1
              },
              style: {
                float: 'right',
                paddingRight: '5px',
                fontSize: '12px'
              },
              on: {
                click: this.handleClickDeleteNode
              }
            }),
            createElement('i', {
              'class': {
                'el-icon-edit': true,
                'color_active': true,
                'display_none': !this.isMouseOver || node.data.type !== 1
              },
              style: {
                float: 'right',
                paddingRight: '5px',
                fontSize: '12px'
              },
              on: {
                click: this.handleClickEditNode
              }
            }),
            createElement('i', {
              'class': {
                'el-icon-plus': true,
                'color_active': true,
                'display_none': !this.isMouseOver || node.data.level > 5
              },
              style: {
                float: 'right',
                paddingRight: '5px',
                fontSize: '12px'
              },
              on: {
                click: this.handleClickAddNode
              }
            })
          ])
        }
        // return (
        //   parent.renderContent
        //     ? parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store })
        //     : <span class="el-tree-node__label" style="font-size: 12px">{ this.node.label }&nbsp;{ this.stNumHtml }</span>
        // );
      }
    }
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null,
      stNumHtml: '',
      isSelect: false,
      isEdit: false,
      isMouseOver: false
    };
  },

  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val);
    },

    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate);
    },

    'node.expanded'(val) {
      this.$nextTick(() => this.expanded = val);
      if (val) {
        this.childNodeRendered = true;
      }
    }
  },

  methods: {
    handleClickAddNode() {
      var key = 0
      this.handleClickEditNodePre(key)
    },
    handleClickEditNode() {
      var key = 2
      this.handleClickEditNodePre(key)
    },
    handleClickDeleteNode() {
      var key = 3
      this.handleClickEditNodePre(key)
    },
    handleClickEditNodePre(key) {
      var target = {
        id: this.node.data.id,
        label: this.node.data.label,
        stNum: this.node.data.stNum,
        type: this.node.data.type,
        children: this.node.data.children,
        level: this.node.data.level,
        insertChild: this.insertChild,
        deleteNode: this.deleteNode,
        editNode: this.editNode,
        toggleSelect: this.toggleSelect
      }
      this.$emit('handleEditNode', key, target)
    },
    handleEditNode(key, target) {
      // 使用右键菜单写好的架构， 0 新增区域
      this.$emit('handleEditNode', key, target)
    },
    mousedown(e) {
      e.preventDefault()
      if (e.button === 2) {
        const x = e.clientX
        const y = e.clientY
        this.handleRightClick(x, y);
        this.rightClickNode()
      } else if (e.button === 0) {
        this.handleRightClick('close');
        this.leftClickNode()
        this.handleClick()
      }
    },

    handleLeftClick() {
      this.handleRightClick('close');
      this.leftClickNode()
      // this.handleClick()
    },

    rightClickNode(target) {
      if (target === undefined) {
        target = {
          id: this.node.data.id,
          label: this.node.data.label,
          stNum: this.node.data.stNum,
          type: this.node.data.type,
          children: this.node.data.children,
          level: this.node.data.level,
          insertChild: this.insertChild,
          deleteNode: this.deleteNode,
          editNode: this.editNode,
          toggleSelect: this.toggleSelect
        }
      }
      this.$emit('right-click-node', target)
    },

    leftClickNode(target) {
      if (target === undefined) {
        target = {
          id: this.node.data.id,
          label: this.node.data.label,
          stNum: this.node.data.stNum,
          type: this.node.data.type,
          children: this.node.data.children,
          level: this.node.data.level,
          insertChild: this.insertChild,
          deleteNode: this.deleteNode,
          editNode: this.editNode,
          toggleSelect: this.toggleSelect
        }
      }
      this.$emit('left-click-node', target)
    },

    toggleSelect() {
      this.isSelect = !this.isSelect
    },

    handleRightClick(x, y) {
      this.$emit('right-click', x, y);
    },

    insertChild: function (newChild) {
      const data = this.node.data;
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
      this.node.expand()
    },

    editNode: function () {
      this.isEdit = true
      this.$nextTick(() => this.$refs.input.focus());
    },

    deleteNode: function () {
      const data = this.node.data;
      const parent = this.node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    focusInput: function () {
      this.$refs.input.focus()
    },

    onCompleteInput: function (self) {
      const value = self.target.value

      // 编辑不删除
      if (!this.isEdit) {
        this.deleteNode()
      }

      if (value !== '' && value !== null && value !== undefined) {
        const parentData = this.$parent.node.data
        const node = {
          id: this.node.data.id,
          label: value,
          parentId: parentData.id,
          level: parentData.level + 1,
          type: this.node.data.type
        }
        this.$emit('complete-input', node, this.isEdit, this.handleEditValue);
      }
    },

    handleEditValue: function (label) {
      this.node.label = label
      this.isEdit = false
    },

    handleInputCompleteInput: function (node, isEdit, handleEditValue) {
      this.$emit('complete-input', node, isEdit, handleEditValue);
    },

    getNodeKey(node, index) {
      const nodeKey = this.tree.nodeKey;
      if (nodeKey && node) {
        return node.data[nodeKey];
      }
      return index;
    },

    handleSelectChange(checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate);
      }
      this.oldChecked = checked;
      this.indeterminate = indeterminate;
    },

    handleClick() {
      const store = this.tree.store;
      store.setCurrentNode(this.node);
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
      this.tree.currentNode = this;
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick();
      }
      this.tree.$emit('node-click', this.node.data, this.node, this);
    },

    handleExpandIconClick() {
      if (this.node.isLeaf) return;
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this);
        this.node.collapse();
      } else {
        this.node.expand();
        this.$emit('node-expand', this.node.data, this.node, this);
      }
    },

    handleCheckChange(value, ev) {
      this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
    },

    handleChildNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node);
      this.tree.$emit('node-expand', nodeData, node, instance);
    }
  },

  created() {
    const parent = this.$parent;

    if (parent.isTree) {
      this.tree = parent;
    } else {
      this.tree = parent.tree;
    }

    const tree = this.tree;
    if (!tree) {
      console.warn('Can not find node\'s tree.');
    }

    const props = tree.props || {};
    const childrenKey = props['children'] || 'children';

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren();
    });

    this.showCheckbox = tree.showCheckbox;

    if (this.node.expanded) {
      this.expanded = true;
      this.childNodeRendered = true;
    }

    if (this.tree.accordion) {
      this.$on('tree-node-expand', node => {
        if (this.node !== node) {
          this.node.collapse();
        }
      });
    }

    // 默认选中
    if (this.node.data.id === this.defaultSelect) {
      this.handleLeftClick()
    }

  },

  mounted() {

    if (this.$parent.renderContent || this.node.label !== null) {

    } else {
      setTimeout(() => {
        this.$nextTick(() => this.$refs.input.focus());
      }, 1)
    }
  }
};
</script>
<style>
.select_bgc {
  background-color: #ffffff !important;
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: bold;
  color: rgba(24, 144, 255, 1);
}
.select_bgc:hover {
  background-color: #c2c2c2;
  color: rgba(24, 144, 255, 1);
}
.el-tree-node__expand-icon {
  color: #606266;
}
.display_none {
  display: none;
}
.color_active {
  color: rgba(0, 0, 0, 0.65);
}
.color_active:hover {
  color: rgba(24, 144, 255, 1);
}

.el-icon- * {
}
</style>
