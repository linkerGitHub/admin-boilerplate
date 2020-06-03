<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/pic'"
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
          prop: 'picKey',
          label: '图片键值',
          editable: false
        },
        {
          prop: 'picSize',
          label: '图片尺寸',
          editable: true
        },
        {
          prop: 'picShotTime',
          label: '拍摄时间',
          editable: true
        },
        {
          prop: 'copyrightDescription',
          label: '版权说明',
          editable: true
        },
        {
          prop: 'latLng',
          label: '地理位置坐标'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
