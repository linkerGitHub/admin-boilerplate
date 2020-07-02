<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/tag'"
      :axios-requester="$genAxiosInstanceFn()"
    >
      <template v-slot:newOneForm="{ formData }">
        <el-form
          :model="formData"
          label-width="110px"
        >
          <el-form-item
            label="标签："
          >
            <el-input v-model="formData.tag_name" />
          </el-form-item>
          <el-form-item
            label="是否类型标签："
          >
            <el-select
              v-model="formData.item_usage_mark"
            >
              <el-option
                label="是"
                value="menu"
              />
              <el-option
                label="否"
                value=""
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:editForm="{ formData }">
        <el-form
          :model="formData"
          label-width="110px"
        >
          <el-form-item
            label="标签："
          >
            <el-input v-model="formData.tag_name" />
          </el-form-item>
          <el-form-item
            label="是否搜素选项："
          >
            <el-select
              v-model="formData.item_usage_mark"
            >
              <el-option
                label="是"
                value="menu"
              />
              <el-option
                label="否"
                value=""
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
    </manage-table>
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
