<template>
  <div>
    <skeleton-main>
      <manage-table :columns-definition="def" />
    </skeleton-main>
  </div>
</template>

<script>

import ManageTable from "./base-lib/components/ManageTable"
import SkeletonMain from "./base-lib/components/skeleton/SkeletonMain"
export default {
  name: 'App',
  components: {
    SkeletonMain,
    ManageTable
  },
  data() {
    return {
      def: [
        {
          prop: 'input_label',
          label: '标签'
        },
        {
          prop: 'input_type',
          label: '类型'
        },
        {
          prop: 'input_require',
          label: '是否必填',
          contentExpress: function (val) {
            return val === '1' ? '是' : '否'
          }
        },
        {
          prop: 'input_valid_regexr',
          label: '验证正则表达式'
        },
        {
          prop: 'input_tip',
          label: '填写提示'
        },
        {
          prop: 'input_err_notice',
          label: '验证错误提示'
        }
      ]
    }
  }
}
</script>

<style>
#app {
}
</style>
