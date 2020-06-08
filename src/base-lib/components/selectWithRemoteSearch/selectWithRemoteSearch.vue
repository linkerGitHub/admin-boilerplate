<template>
  <el-select
    v-model="selectedVal"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    @change="$emit('change', selectedVal)"
  >
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item[labelKey]"
      :value="item[valueKey]"
    />
  </el-select>
</template>

<script>
import Axios from 'axios'

export default {
  name: 'SelectWithRemoteSearch',
  model: {
    event: 'change'
  },
  props: {
    valueKey: {
      type: String,
      default() {
        return 'id'
      }
    },
    labelKey: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    dataSrcUrl: {
      type: String,
      required: true
    },
    /**
     * 构建网络请求器
     */
    axiosRequester: {
      validator: function(val) {
        return val.constructor === Function
      },
      default() {
        return Axios.create({
          url: this.dataSrcUrl
        })
      }
    }
  },
  data() {
    return {
      options: [],
      selectedVal: [],
      list: [],
      loading: false
    }
  },
  watch: {
    value: function(val) {
      this.selectedVal = val
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const params = {}
        params[this.labelKey] = query
        this.axiosRequester.request({
          url: this.dataSrcUrl,
          params
        }).then(res => {
          this.options = res.data.data.rows
          this.loading = false
        })
      } else {
        this.options = [];
      }
    }
  }
}
</script>
