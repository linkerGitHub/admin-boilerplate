<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/street'"
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
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'street_name',
          label: '街道名称',
          editable: true,
        },
        {
          prop: 'street_id',
          label: '街道代码',
          editable: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
