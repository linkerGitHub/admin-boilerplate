<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/time-stage'"
      :edit-success="() => {$store.dispatch('reloadTimeStage')}"
      :save-success="() => {$store.dispatch('reloadTimeStage')}"
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
          prop: 'stage_name',
          label: '时间阶段',
          editable: true
        },
        {
          prop: 'start_time',
          label: '开始时间',
          editable: true
        },
        {
          prop: 'end_time',
          label: '结束时间',
          editable: true
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
