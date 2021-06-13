<template>
  <div
    class="visitCount"
    ref="visitCountBox"
  >
    <simple-flowchart
      :scene.sync="data"
      @nodeClick='nodeClick'
      @canvasClick='canvasClick'
    ></simple-flowchart>
  </div>
</template>

<script>
/* eslint-disable */
import SimpleFlowchart from '@/components/simpleChart'
import '@/components/simpleChart/components/vue-flowchart.css'

export default {
  name: 'VisitCount',
  components: {
    SimpleFlowchart
  },
  data() {
    return {
      data: {
        centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes: [
          {
            id: 2,
            x: -700,
            y: -69,
            type: 'Action',
            label: 'test1',
          },
          {
            id: 4,
            x: -357,
            y: 80,
            type: 'Script',
            label: 'test2',
          },
          {
            id: 6,
            x: -557,
            y: 80,
            type: 'Rule',
            label: 'test3',
          }
        ],
        links: [
          {
            id: 3,
            from: 2, // node id the link start
            to: 4,  // node id the link end
          }
        ]
      },
    };
  },
  methods: {
    nodeClick(id) {
      console.log(id)
    },
    canvasClick(id) {
      console.log(id)
    }
  }
}
</script>
<style>
.visitCount {
  height: 100%;
  overflow: auto;
}
.el-table__body {
  width: 100% !important;
}
.visitCount .el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}

.row-expand-cover .el-table__expand-column .el-icon {
  visibility: hidden;
}

.el-table th.is-leaf {
  border-bottom: 1px solid #ebeef5;
}

.table-box .el-table--mini td,
.el-table--mini th {
  border-bottom-color: white;
  border-right-color: white;
  padding: 2px 0;
  /* font-size: 10px; */
}

.table-box .el-table--mini .el-table__empty-block {
  position: relative;
  min-height: 35.4px;
  text-align: center;
  width: 100%;
  height: 35.4px;
}
.table-box .el-table::before {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0px;
}

.el-table__expanded-cell[class*="cell"] {
  padding: 0px;
}

.visit-count .table-box th:first-child {
  height: 50px;
  padding: 0px;
  font-size: 12px;
  background-color: #f5f6fa;
  font-weight: bolder;
}
</style>
