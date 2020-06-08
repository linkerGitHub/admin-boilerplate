<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/user'"
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
          label: '时间阶段',
          editable: true
        },
        {
          prop: 'user_pass',
          label: '开始时间',
          editable: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
