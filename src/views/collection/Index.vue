<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/collection'"
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
          prop: 'collection_name',
          label: '图集名称',
          editable: true
        },
        {
          prop: 'collection_description',
          label: '图集描述',
          editable: true
        },
        {
          prop: 'pic_count',
          label: '图片数量'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
