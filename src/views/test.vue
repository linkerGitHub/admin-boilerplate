<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/ads'"
    />
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable'
export default {
  name: 'Test',
  components: {ManageTable},
  data() {
    return {
      def: [
        {
          prop: 'adminName',
          label: '用户名'
        },
        {
          prop: 'adminPass',
          label: '密码'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
