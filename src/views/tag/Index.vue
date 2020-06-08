<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/tag'"
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
          prop: 'tag_name',
          label: '标签',
          editable: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
