<template>
  <div id="RuleSetting">
    <div class="setting-container">
      <div class="title-text">
        <span>无效规则设置</span>
      </div>
      <el-row class="rule-container">
        <el-row style="padding-bottom: 16px; color:rgba(0,0,0,0.65)">
          <span> 将满足以下条件人脸设置为无效人员：</span>
        </el-row>

        <el-form
          ref="dataForm"
          :model="form"
          label-position="left"
          label-width="42px"
          class="form-container"
          size="mini"
        >
          <el-form-item
            label="性别："
            prop="type"
          >
            <el-switch
              v-model="form.genderSwitch"
              active-color="#1989FA"
              active-text="开"
              inactive-text="关"
              active-value='1'
              inactive-value='0'
            >
            </el-switch>

            <el-button
              style="margin: 0 5px;"
              v-bind:class="{active:(form.genderSwitch==='1' && form.gender==='1')}"
              :disabled="form.genderSwitch === '0'"
              @click="saveMan"
            >
              男
            </el-button>
            <el-button
              style="margin: 0 5px;"
              v-bind:class="{active:(form.genderSwitch==='1' && form.gender==='0')}"
              :disabled="form.genderSwitch === '0'"
              @click="saveWoman"
            >
              女
            </el-button>
          </el-form-item>
          <el-form-item
            label="年龄："
            prop="type"
          >
            <el-switch
              v-model="form.ageLessThanSwitch"
              active-color="#1989FA"
              active-value='1'
              inactive-value='0'
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span style="padding: 0 67px 0 5px;">&le;</span>
            <el-select
              v-model="form.ageLessThan"
              :disabled="form.ageLessThanSwitch === '0'"
              placeholder=""
            >
              <el-option
                v-for="item in ageLessOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="type"
          >
            <el-switch
              v-model="form.ageRangeSwitch"
              active-color="#1989FA"
              active-value='1'
              inactive-value='0'
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span style="padding: 0 50px 0 5px;">
              介于
            </span>
            <el-select
              v-model="form.ageStart"
              :disabled="form.ageRangeSwitch === '0'"
              placeholder=""
              @change="selectAgeRange"
            >
              <el-option
                v-for="item in ageStartOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <span style="padding: 0 10px;">到</span>
            <el-select
              v-model="form.ageEnd"
              :disabled="form.ageRangeSwitch === '0'"
              placeholder=""
              @change="selectAgeRange"
            >
              <el-option
                v-for="item in ageEndOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="type"
          >
            <el-switch
              v-model="form.ageGreaterThanSwitch"
              active-color="#1989FA"
              active-value='1'
              inactive-value='0'
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span style="padding: 0 67px 0 5px;">
              &ge;
            </span>
            <el-select
              v-model="form.ageGreaterThan"
              :disabled="form.ageGreaterThanSwitch === '0' "
              placeholder=""
            >
              <el-option
                v-for="item in ageGreaterOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row class="text-container">
          <span class="text-content">(无效人员将直接过滤，不计入客流统计)</span>
        </el-row>
      </el-row>
    </div>
    <div class="setting-container">
      <div
        class="title-text"
        style="padding-top:58px;"
      >
        <span>自动加入白名单</span>
      </div>
      <el-row class="rule2-container">

        <el-form
          ref="dataForm"
          :model="form"
          label-position="left"
          label-width="42px"
          size="mini"
        >
          <el-form-item
            label=""
            prop="type"
          >
            <el-switch
              v-model="form.addWhiteSwitch"
              active-color="#1989FA"
              active-value='1'
              inactive-value='0'
              active-text="开"
              inactive-text="关"
            ></el-switch>
            <span class="text-desc">一周之内</span>
            <el-input-number
              v-model="form.timesInWeek"
              controls-position="right"
              :min=1
              :max=7
              :disabled="form.addWhiteSwitch == '0'"
              :step=1
            ></el-input-number>
            <span>天到店</span>
            <span
              class="text-desc"
              style="padding-left:20px;"
            >且</span>
            <el-time-select
              class="time-select-style"
              style="width: 80px;"
              v-model="form.timeLine"
              placeholder=""
              :clearable="false"
              size="mini"
              :picker-options="{
                start: '09:00',
                step: '00:30',
                end: '12:00' }"
              :disabled="form.addWhiteSwitch == '0'"
            >
            </el-time-select>
            <span style="margin: 0 6px;">前到店</span>
            <el-input-number
              v-model="form.timesBeforeTimeLine"
              controls-position="right"
              :min=1
              :max="form.timesInWeek"
              :disabled="form.addWhiteSwitch == '0'"
              :step=1
            ></el-input-number>
            <span>次</span>
            <div style="padding:16px 0 0 120px;">
              <span class="text-desc">连续</span>
              <el-input-number
                v-model="form.weeksOfSatisf"
                controls-position="right"
                :min=1
                :disabled="form.addWhiteSwitch == '0'"
                :step=1
              ></el-input-number>
              <span>周</span>
            </div>
          </el-form-item>
        </el-form>
        <el-row class="text2-container">
          <span class="text2-content">将满足以上条件的顾客直接标记为员工</span>
        </el-row>
        <el-row style="padding-top: 40px;">
          <el-col align="center">
            <el-button
              type="primary"
              @click="saveSettings"
            >保存</el-button>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getSettings, saveSettings } from '@/api/system'
export default {
  data() {
    return {
      form: {
        gender: '', // 性别 1 = 男 0 = 女
        ageLessThan: '', // 年龄小于等于
        ageGreaterThan: '', // 年龄大于等于
        ageStart: '', // 年龄介于的开始值
        ageEnd: '',	// 年龄介于的结束值
        genderSwitch: '0', // 性别规则开关			0 = 关  1 = 开
        ageLessThanSwitch: '0',	// 年龄小于等于开关
        ageRangeSwitch: '0', // 年龄介于的开关
        ageGreaterThanSwitch: '0', // 年龄大于等于开关

        addWhiteSwitch: '0', // 自动加入白名单开关
        timesInWeek: 3, // 一周内到店天数
        timeLine: '10:00',
        timesBeforeTimeLine: 1, // 时间界限前到店次数
        weeksOfSatisf: 2 // 连续满足上述条件的周数
      },
      cacheAgeStart: '',
      cacheAgeEnd: '',
      ageLessOptions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      ageEndOptions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
      ageStartOptions: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56],
      ageGreaterOptions: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61]
    }
  },
  mounted() {
    this.getSettings()
  },
  methods: {
    selectAgeRange(value) {
      if (this.form.ageStart > this.form.ageEnd) {
        this.form.ageStart = this.cacheAgeStart
        this.form.ageEnd = this.cacheAgeEnd
        this.$message({
          message: '年龄段选择有误,请重新选择',
          type: 'error'
        })
        return
      }
      this.cacheAgeStart = this.form.ageStart
      this.cacheAgeEnd = this.form.ageEnd
    },
    saveMan() {
      this.form.gender = '1'
    },
    saveWoman() {
      this.form.gender = '0'
    },
    getSettings() {
      getSettings().then(res => {
        this.form = res
        this.cacheAgeStart = this.form.ageStart
        this.cacheAgeEnd = this.form.ageEnd
      })
    },
    saveSettings() {
      saveSettings(this.form).then(res => {
        const result = res
        if (result) {
          this.$message({
            message: '规则设置成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '规则设置失败，请重新设置',
            type: 'error'
          })
        }
        this.getSettings()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container {
  background-color: #ffffff;
  font-size: 14px;
  font-family: PingFangSC, Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 12px;
}
.rule-container {
  padding: 18px 115px;
  width: 680px;
  .form-container {
    padding: 20px;
    color: rgba(0, 0, 0, 0.65);
    border: 1px solid rgba(0, 0, 0, 0.09);
    vertical-align: middle;
    align-items: center;
  }
  .rule-line {
    padding: 20px 0;
  }
  .orange-items {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 80px;
  }
  .active {
    background: rgba(230, 241, 252, 1);
    border-radius: 4px;
    border: 1px solid rgba(163, 208, 253, 1);
    color: rgba(24, 144, 255, 1);
  }
}

.btn-rule {
  width: 110px;
  height: 32px;
  background: #1989fa;
}

.text-container {
  padding: 16px 0;
  .text-title {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 12px;
  }
  .text-content {
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 12px;
  }
}

.title-text {
  padding: 18px 19px;
  font-size: 16px;
  font-family: PingFangSC-Regular, Microsoft YaHei;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  line-height: 16px;
}
.text-desc {
  padding-right: 20px;
}
.rule2-container {
  padding: 18px 52px;
  width: 760px;
  .text2-container {
    padding: 16px 67px;
    .tex2-title {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 12px;
    }
    .text2-content {
      font-size: 12px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 12px;
    }
  }
}
</style>
