<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/place'"
    />
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable'
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
          prop: 'placeName',
          label: '街道名称',
          editable: true,
        },
        {
          prop: 'placeId',
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
