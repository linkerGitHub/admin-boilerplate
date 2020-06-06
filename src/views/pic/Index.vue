<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/pic'"
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
          prop: 'pic_key',
          label: '图片键值',
          editable: false
        },
        {
          prop: 'pic_size',
          label: '图片尺寸',
          editable: true
        },
        {
          prop: 'pic_shot_time',
          label: '拍摄时间',
          editable: true
        },
        {
          prop: 'copyright_description',
          label: '版权说明',
          editable: true
        },
        {
          prop: 'lat_lng',
          label: '地理位置坐标'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
