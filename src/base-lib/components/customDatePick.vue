<template>
  <div>
    <el-date-picker
      :value="tmpDateSelected.year"
      type="year"
      style="width: 150px"
      placeholder="选择年"
      @input="dateUpdated('year', $event)"
    />
    <el-select
      v-if="tmpDateSelected.year"
      v-model="tmpDateSelected.month"
      clearable
      style="width: 180px"
      placeholder="月份或已选年前后"
      @change="dateUpdated('month', $event)"
    >
      <el-option
        v-for="(monVal, mon) in 14"
        :key="mon"
        :label="mon === 0 || mon === 13 ? (mon === 0 ? '之前' : '之后') : `${mon.toString().padStart(2, '0')}月`"
        :value="mon.toString().padStart(2, '0')"
      />
    </el-select>
    <el-select
      v-if="tmpDateSelected.year && tmpDateSelected.month"
      :value="tmpDateSelected.day"
      clearable
      style="width: 180px"
      placeholder="日期或已选月前后"
      @change="dateUpdated('day', $event)"
    >
      <el-option
        v-for="(dayVal, day) in daysInMonth + 1"
        :key="day"
        :label="day === 0 || day === daysInMonth ? (day === 0 ? '之前' : '之后') : `${day.toString().padStart(2, '0')}日`"
        :value="day.toString().padStart(2, '0')"
      />
    </el-select>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'CustomDatePick',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tmpDateSelected: {
        year: null,
        month: null,
        day: null
      },
    }
  },
  computed: {
    daysInMonth() {
      if(this.tmpDateSelected.year && this.tmpDateSelected.month) {
        const dateStr = `${this.tmpDateSelected.year.getFullYear()}-${this.tmpDateSelected.month}-01`
        return dayjs(dateStr).daysInMonth()
      }
      return 1
    }
  },
  watch: {
    value: {
      handler(val) {
        if(val && val.length > 0) {
          const t = /(\d{4})年((\d{2})月|)((\d{2})日|)/
          if(t.test(val)) {
            const ymd = val.match(t)
            this.tmpDateSelected.year = dayjs(ymd[1]).toDate()
            this.tmpDateSelected.month = ymd[3] || null
            this.tmpDateSelected.day = ymd[5] || null
          } else {
            this.tmpDateSelected.year = null
            this.tmpDateSelected.month = null
            this.tmpDateSelected.day = null
          }
        } else {
          this.tmpDateSelected.year = null
          this.tmpDateSelected.month = null
          this.tmpDateSelected.day = null
        }
      },
      immediate: true
    }
  },
  methods: {
    dateUpdated(prop, value) {
      this.tmpDateSelected[prop] = value
      const val = this.tmpDateSelected
      const dateVal = `${val.year ? val.year.getFullYear() + '年' : ''}${val.month ? val.month + '月' : ''}${val.day ? val.day + '日' : ''}`
      console.log(dateVal)
      this.$emit('input', dateVal)
    }
  }
}
</script>

<style scoped>

</style>
