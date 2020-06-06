<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/place'"
      :axios-requester="$genAxiosInstanceFn()"
      :edit-deal="editDeal"
    >
      <template v-slot:editForm="{ formData }">
        <el-form
          :model="formData"
          label-width="120px"
        >
          <el-form-item
            label="位置名称"
            prop="place_name"
          >
            <el-input v-model="formData.place_name" />
          </el-form-item>
          <el-form-item
            label="位置代码"
            prop="place_id"
          >
            <el-input v-model="formData.place_id" />
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
          <el-form-item
            label="街道"
            prop="street"
          >
            <el-select
              multiple
              value-key="id"
              v-model="formData.street"
            >
              <el-option
                v-for="st in dataSrc.street"
                :key="st.id"
                :label="st.street_name"
                :value="st"
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
import GetPositionFromMap from '@/base-lib/components/GeoMap/GetPositionFromMap'
import {getStreet} from '@/api'
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
          prop: 'place_name',
          label: '位置名称',
          editable: true,
        },
        {
          prop: 'place_id',
          label: '位置代码',
          editable: true
        },
        {
          prop: 'street',
          label: '所属街道',
          textContent: function(val) {
            return val.map(item => {
              return item.street_name
            }).join(',')
          },
          editable: true
        }
      ],
      dataSrc: {
        street: []
      }
    }
  },
  mounted() {
    this.getStreetDataSrc()
  },
  methods: {
    editDeal(data) {
      const tmp = data
      tmp.street = tmp.street.map(item => {
        return item.id
      })
      return new Promise(resolve => {
        resolve(tmp)
      })
    },
    getStreetDataSrc() {
      getStreet({
        skip: 0,
        take: 1000
      }).then(res => {
        this.dataSrc.street = res.data.data.rows
      })
    }
  }
}
</script>

<style scoped>

</style>
