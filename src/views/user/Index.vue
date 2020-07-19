<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/user'"
      :axios-requester="$genAxiosInstanceFn()"
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
          prop: 'user_name',
          label: '用户名',
          editable: true
        },
        {
          prop: 'user_pass',
          label: '密码',
          editable: true,
          visible: false
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
