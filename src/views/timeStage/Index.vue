<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/time-stage'"
      :edit-success="() => {$store.dispatch('reloadTimeStage')}"
      :save-success="() => {$store.dispatch('reloadTimeStage')}"
      :axios-requester="$genAxiosInstanceFn()"
    >
      <template v-slot:editForm="{ formData }">
        <el-form label-width="140px">
          <el-form-item label="时间阶段">
            <el-input
              v-model="formData.stage_name"
              type="text"
            />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="formData.start_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="formData.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:newOneForm="{ formData }">
        <el-form label-width="140px">
          <el-form-item label="时间阶段">
            <el-input
              v-model="formData.stage_name"
              type="text"
            />
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="formData.start_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="formData.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            />
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
