import EditableTree from './src/tree.vue'

/* istanbul ignore next */
EditableTree.install = function(Vue) {
  Vue.component(EditableTree.name, EditableTree)
}

export default EditableTree
