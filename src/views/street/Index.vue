<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/street'"
      :axios-requester="$genAxiosInstanceFn()"
      :edit-deal="editDeal"
      :new-one-deal="editDeal"
      :data-shaper="dataShaper"
      :edit-success="() => {$store.dispatch('reloadStreet')}"
      :save-success="() => {$store.dispatch('reloadStreet')}"
    >
      <template v-slot:newOneForm="{ formData }">
        <el-form
          :model="formData"
          label-width="120px"
        >
          <el-form-item
            label="位置名称"
            prop="street_name"
          >
            <el-input v-model="formData.street_name" />
          </el-form-item>
          <el-form-item
            label="关联时间阶段"
            prop="time_stage"
          >
            <el-select
              v-model="formData.time_stage"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.timeStage"
                :key="op.id"
                :label="op.stage_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="位置代码"
            prop="street_id"
          >
            <el-input v-model="formData.street_id" />
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <get-position-from-map
              v-model="formData.lat_lng"
              style="width: 100%; height: 400px;"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:editForm="{ formData }">
        <el-form
          :model="formData"
          label-width="120px"
        >
          <el-form-item
            label="位置名称"
            prop="street_name"
          >
            <el-input v-model="formData.street_name" />
          </el-form-item>
          <el-form-item
            label="关联时间阶段"
            prop="time_stage"
          >
            <el-select
              v-model="formData.time_stage"
              value-key="id"
              multiple
            >
              <el-option
                v-for="op in $store.state.dataSrc.timeStage"
                :key="op.id"
                :label="op.stage_name"
                :value="op"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="位置代码"
            prop="street_id"
          >
            <el-input v-model="formData.street_id" />
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <get-position-from-map
              v-model="formData.lat_lng"
              style="width: 100%; height: 400px;"
            />
          </el-form-item>
        </el-form>
      </template>
    </manage-table>
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/Index.vue'
import GetPositionFromMap from '@/base-lib/components/GeoMap/GetPositionFromMap'
export default {
  name: 'Index',
  components: {GetPositionFromMap, ManageTable},
  data() {
    return {
      def: [
        {
          prop: 'id',
          label: 'id'
        },
        {
          prop: 'street_name',
          label: '位置名称',
          editable: true,
        },
        {
          prop: 'time_stage',
          label: '关联时间阶段',
          textContent(val) {
            return val.map(item => {
              return item.stage_name
            }).join(',')
          }
        },
        {
          prop: 'street_id',
          label: '位置代码',
          editable: true
        }
      ]
    }
  },
  mounted() {
  },
  methods: {
    dataShaper() {
      return {
        'street_name':'',
        'street_id':'',
        'lat_lng': []
      }
    },
    editDeal(data) {
      const tmp = data
      if(tmp.lat_lng.constructor === Array) {
        tmp.lat_lng = JSON.stringify(tmp.lat_lng)
      }
      tmp.time_stage = tmp.time_stage.map(item => {
        return item.id
      })
      return new Promise(resolve => {
        resolve(tmp)
      })
    }
  }
}
</script>

<style scoped>

</style>
