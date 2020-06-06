<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/cfg'"
    />
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/Index.vue'
export default {
  name: 'Index',
  components: {ManageTable},
  data() {
    return {
      def: [
        {
          prop: 'cfgKey',
          label: '用户名'
        },
        {
          prop: 'cfgVal',
          label: '密码'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
