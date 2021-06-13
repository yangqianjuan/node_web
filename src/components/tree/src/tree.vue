<template>
  <div role="tree">
    <el-tree-node
      ref="tn"
      v-for="child in root.childNodes"
      :node="child"
      :defaultSelect="defaultSelect"
      :props="props"
      :key="getNodeKey(child)"
      :render-content="renderContent"
      @node-expand="handleNodeExpand"
      @right-click="handleRightClick"
      @right-click-node="handleRightClickNode"
      @left-click-node="handleLeftClickNode"
      @complete-input="handleInputCompleteInput"
      @handleEditNode="handleSelectOptions"
    >
    </el-tree-node>
    <div
      class="el-tree__empty-block"
      v-if="!root.childNodes || root.childNodes.length === 0"
    >
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
    <right-menu
      ref="rm"
      :pop-items="menu"
      :mouse="mousePosition"
      @handleSelectOptions="handleSelectOptions"
      @menuStatus="handleMenuStatus"
    ></right-menu>
  </div>
</template>

<script>
import TreeStore from './model/tree-store'
import ElTreeNode from './tree-node.vue'
// import t from 'element-ui/src/locale'
import emitter from 'element-ui/src/mixins/emitter'
import RightMenu from './RightMenu.vue'

export default {
  name: 'EditableTree',

  mixins: [emitter],

  components: {
    RightMenu,
    ElTreeNode
  },

  data() {
    return {
      rightTargetNode: null,
      leftTargetNode: null,
      targetNode: null,
      menuStatus: false,
      mousePosition: [],
      store: null,
      root: null,
      currentNode: null,
      treeItems: null,
      checkboxItems: []
    }
  },

  props: {
    data: {
      type: Array
    },
    menu: {
      type: Array
    },
    emptyText: {
      type: String,
      default() {
        // return t('el.tree.emptyText')
        return 'none'
      }
    },
    nodeKey: String,
    checkStrictly: Boolean,
    defaultExpandAll: Boolean,
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkDescendants: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    defaultSelect: {
      type: Number
    },
    defaultCheckedKeys: Array,
    defaultExpandedKeys: Array,
    renderContent: Function,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    props: {
      default() {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon',
          disabled: 'disabled'
        }
      }
    },
    lazy: {
      type: Boolean,
      default: false
    },
    highlightCurrent: Boolean,
    load: Function,
    filterNodeMethod: Function,
    accordion: Boolean,
    indent: {
      type: Number,
      default: 18
    }
  },

  computed: {
    children: {
      set(value) {
        this.data = value
      },
      get() {
        return this.data
      }
    },
    treeItemArray() {
      return Array.prototype.slice.call(this.treeItems)
    }
  },

  watch: {
    defaultCheckedKeys(newVal) {
      this.store.defaultCheckedKeys = newVal
      this.store.setDefaultCheckedKey(newVal)
    },
    defaultExpandedKeys(newVal) {
      this.store.defaultExpandedKeys = newVal
      this.store.setDefaultExpandedKeys(newVal)
    },
    data(newVal) {
      this.store.setData(newVal)
    },
    checkboxItems(val) {
      Array.prototype.forEach.call(val, (checkbox) => {
        checkbox.setAttribute('tabindex', -1)
      })
    }
  },

  methods: {
    handleRightClick(x, y, target) {
      if (this.menu !== undefined && this.menu.length > 0) {
        this.mousePosition = [x, y]
      }
    },
    handleRightClickNode(target) {
      this.toggleNodeSelect(target)
      this.rightTargetNode = target
      this.$emit('right-click-node')
    },
    handleLeftClickNode(target) {
      this.toggleNodeSelect(target)
      this.leftTargetNode = target
      this.$emit('click-node', target)
    },
    toggleNodeSelect(target) {
      target.toggleSelect()
      if (this.targetNode !== null) {
        this.targetNode.toggleSelect()
      }
      this.targetNode = target
    },
    handleMenuStatus(menuStatus) {
      this.menuStatus = menuStatus
      this.$emit('menuStatus', menuStatus)
    },
    closeRightMenu() {
      if (this.menuStatus) {
        this.handleRightClick('close')
      }
    },
    handleSelectOptions(key, targetNode) {
      if (targetNode !== undefined) {
        this.rightTargetNode = targetNode
      }
      this.$emit('handleSelectOptions', key, this.rightTargetNode)
    },
    handleInputCompleteInput: function (node, isEdit, handleEditValue) {
      this.$emit('complete-input', node, this.rightTargetNode, isEdit, handleEditValue)
    },
    filter(value) {
      if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter')
      this.store.filter(value)
    },
    getNodeKey(node, index) {
      const nodeKey = this.nodeKey
      if (nodeKey && node) {
        return node.data[nodeKey]
      }
      return index
    },
    getCheckedNodes(leafOnly) {
      return this.store.getCheckedNodes(leafOnly)
    },
    getCheckedKeys(leafOnly) {
      return this.store.getCheckedKeys(leafOnly)
    },
    getCurrentNode() {
      const currentNode = this.store.getCurrentNode()
      return currentNode ? currentNode.data : null
    },
    getCurrentKey() {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey')
      const currentNode = this.getCurrentNode()
      return currentNode ? currentNode[this.nodeKey] : null
    },
    setCheckedNodes(nodes, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes')
      this.store.setCheckedNodes(nodes, leafOnly)
    },
    setCheckedKeys(keys, leafOnly) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys')
      this.store.setCheckedKeys(keys, leafOnly)
    },
    setChecked(data, checked, deep) {
      this.store.setChecked(data, checked, deep)
    },
    setCurrentNode(node) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode')
      this.store.setUserCurrentNode(node)
    },
    setCurrentKey(key) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey')
      this.store.setCurrentNodeKey(key)
    },
    handleNodeExpand(nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node)
      this.$emit('node-expand', nodeData, node, instance)
    },
    updateKeyChildren(key, data) {
      if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild')
      this.store.updateChildren(key, data)
    },
    initTabindex() {
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]')
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
      const checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]')
      if (checkedItem.length) {
        checkedItem[0].setAttribute('tabindex', 0)
        return
      }
      this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0)
    },
    handelKeydown(ev) {
      const currentItem = ev.target
      if (currentItem.className.indexOf('el-tree-node') === -1) return
      ev.preventDefault()
      const keyCode = ev.keyCode
      this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]')
      const currentIndex = this.treeItemArray.indexOf(currentItem)
      let nextIndex
      if ([38, 40].indexOf(keyCode) > -1) { // up、down
        if (keyCode === 38) { // up
          nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0
        } else {
          nextIndex = (currentIndex < this.treeItemArray.length - 1) ? currentIndex + 1 : 0
        }
        this.treeItemArray[nextIndex].focus() // 选中
      }
      const hasInput = currentItem.querySelector('[type="checkbox"]')
      if ([37, 39].indexOf(keyCode) > -1) { // left、right 展开
        currentItem.click() // 选中
      }
      if ([13, 32].indexOf(keyCode) > -1) { // space enter选中checkbox
        if (hasInput) {
          hasInput.click()
        }
      }
    }
  },

  created() {
    this.isTree = true

    this.store = new TreeStore({
      key: this.nodeKey,
      data: this.data,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    })

    this.root = this.store.root
  },
  mounted() {
    this.initTabindex()
    this.$el.addEventListener('keydown', this.handelKeydown)
  },
  updated() {
    this.treeItems = this.$el.querySelectorAll('[role=treeitem]')
    this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]')
  }
}
</script>
