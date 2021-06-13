<template>
  <el-row
    :gutter="16"
    class="panel-group"
  >
    <el-col
      :xs="12"
      :sm="12"
      :lg="6"
      v-for="(item, index) in total"
      v-bind:key="index"
      class="card-panel-col"
    >
      <el-row class="card-first-content">
        <el-col
          :span="24"
          class="card-panel-description"
        >
          <svg-icon
            v-if="index===0"
            icon-class="today"
            class-name="card-panel-icon"
          />
          <svg-icon
            v-if="index===1"
            icon-class="yesterday"
            class-name="card-panel-icon"
          />
          <svg-icon
            v-if="index===2"
            icon-class="week"
            class-name="card-panel-icon"
          />
          <svg-icon
            v-if="index===3"
            icon-class="month"
            class-name="card-panel-icon"
          />
          <span
            v-if="index===0"
            class="card-panel-text"
          >
            今日客流
          </span>
          <span
            v-if="index===1"
            class="card-panel-text"
          >
            昨日客流
          </span>
          <span
            v-if="index===2"
            class="card-panel-text"
          >
            本周客流
          </span>
          <span
            v-if="index===3"
            class="card-panel-text"
          >
            本月客流
          </span>
          <br />
          <span class="card-panel-num">
            {{ item.currentData }}
          </span>
          <span class="card-panel-unit">人</span>
        </el-col>
      </el-row>
      <el-row class="rank-content">
        <el-col :span="18">
          <span
            v-if="index===0"
            class="card-second-title"
          >昨日同期</span>
          <span
            v-if="index===1"
            class="card-second-title"
          >前日同期</span>
          <span
            v-if="index===2"
            class="card-second-title"
          >上周同期</span>
          <span
            v-if="index===3"
            class="card-second-title"
          >上月同期</span>
          &nbsp;&nbsp;<span class="card-second-title">{{ item.beforeData}}人</span>
        </el-col>
        <el-col
          :span="6"
          align="right"
          class="card-panel-trend"
        >
          <svg-icon
            v-if="item.currentData >= item.beforeData"
            icon-class="asc-row"
            class-name="card-second-icon"
          />
          <svg-icon
            v-else
            icon-class="desc-row"
            class-name="card-second-icon"
          />
          <span
            v-if="item.currentData >= item.beforeData"
            class="asc-red"
          >{{ item.proportion }}%</span>
          <span
            v-else
            class="desc-green"
          >{{ item.proportion }}%</span>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>

export default {
  components: {
  },
  // 接受父组件的值
  props: ['total']
}
</script>

<style lang="scss" scoped>
.panel-group {
  .card-first-content {
    background: #fff;
    height: 75px;
    padding: 15px 20px;

    .card-panel-description {
      .card-panel-icon {
        float: left;
        margin-right: 15px;
        width: 54px;
        height: 54px;
      }

      .card-panel-text {
        margin-bottom: 5px;
        font-family: PingFangSC-Regular, Microsoft YaHei;
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 14px;
      }

      .card-panel-num {
        color: rgba(0, 0, 0, 0.85);
        font-size: 30px;
      }
      .card-panel-unit {
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
      }
    }
  }
  .rank-content {
    background: #fff;
    padding: 10px 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    font-size: 12px;

    .card-second-title {
      color: rgba(0, 0, 0, 0.65);
    }

    .card-panel-trend {
      line-height: 14px;

      .card-second-icon {
        width: 13px;
        height: 13px;
      }
      .asc-red {
        align-items: right;
        color: #e04845;
      }

      .desc-green {
        align-items: right;
        color: #2bd365;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
