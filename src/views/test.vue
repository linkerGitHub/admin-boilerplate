<template>
  <div>
    <manage-table
      :get-table-data-from-response="resDeal.getTableDataFromResponse"
      :get-total-page-from-response="resDeal.getTotalPageFromResponse"
      :columns-definition="def"
      :data-src-url="'/article'"
    />
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable'
import * as resDeal from '@/views/utils'

export default {
  name: 'Test',
  components: {ManageTable},
  data() {
    return {
      resDeal,
      def: [
        {
          prop: 'title',
          label: '标题',
          editable: true
        },
        {
          prop: 'categories',
          label: '类别',
          editable: true,
          nodeExpress: function (h, val) {
            return h(
              'div',
              val.map((item, idx) => {return h('el-tag', {
                props: {
                  key: idx,
                  effect: 'plain',
                  size: 'small'
                }
              },item.name)})
            )
          }
        },
        {
          prop: 'content',
          label: '内容',
          editable: true,
          textContent: function (val) {
            return val.substring(0, 30) + '...'
          }
        },
        {
          prop: 'item_status',
          label: '状态',
          editable: true,
          textContent: function (val) {
            const statusMapText = {
              0: '禁用',
              1: '启用'
            }
            return statusMapText[val]
          }
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
