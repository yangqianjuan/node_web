
const currpage = {
  state: {
    currpage: [],
    // currpage: null,
    clicked: false
  },
  mutations: {
    // setPage: (state, { name, pageNum, tab }) => {
    //   if (tab) {
    //     state.currpage = { name, pageNum, tab }
    //   } else {
    //     state.currpage = { name, pageNum }
    //   }
    // },
    // deletePage: (state, name) => {
    //   state.currpage = null
    // },
    setPage: (state, { name, pageNum, tab }) => {
      var index = 0
      for (let i = 0; i < state.currpage.length; i++) {
        const p = state.currpage[i]
        if (p.name === name) {
          index = 1
          if (tab) {
            state.currpage[i] = { name, pageNum, tab }
          } else {
            state.currpage[i] = { name, pageNum }
          }
        }
      }
      if (index < 1) {
        if (tab) {
          state.currpage.push({
            name, pageNum, tab
          })
        } else {
          state.currpage.push({
            name, pageNum
          })
        }
      }
    },
    deletePage: (state, name) => {
      for (let i = 0; i < state.currpage.length; i++) {
        const p = state.currpage[i]
        if (p.name === name) {
          state.currpage.splice(i, 1)
        }
      }
    },
    clearPage: (state) => {
      state.currpage = []
    },
    setClicked: (state) => {
      state.clicked = true
    },
    cancelClicked: (state) => {
      state.clicked = false
    }
  },
  actions: {}
}

export default currpage

