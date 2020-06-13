<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/place'"
      :axios-requester="$genAxiosInstanceFn()"
      :edit-deal="editDeal"
      :new-one-deal="editDeal"
      :data-shaper="dataShaper"
      :edit-success="() => {$store.dispatch('reloadPlace')}"
      :save-success="() => {$store.dispatch('reloadPlace')}"
      edit-dialog-width="90%"
      new-one-dialog-width="90%"
    >
      <template v-slot:newOneForm="{ formData }">
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
            label="街道"
            prop="street"
          >
            <el-select
              v-model="formData.street"
              multiple
              value-key="id"
            >
              <el-option
                v-for="st in dataSrc.street"
                :key="st.id"
                :label="st.street_name"
                :value="st"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <map-boundary-draw
              ref="border-draw-map"
              @save-call="boundarySave(formData, ...arguments)"
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
            label="街道"
            prop="street"
          >
            <el-select
              v-model="formData.street"
              multiple
              value-key="id"
            >
              <el-option
                v-for="st in dataSrc.street"
                :key="st.id"
                :label="st.street_name"
                :value="st"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="地理坐标"
            prop="lat_lng"
          >
            <map-boundary-draw
              ref="border-draw-map"
              :initial-boundary="convertBorder(formData.border)"
              @save-call="boundarySave(formData, ...arguments)"
            />
          </el-form-item>
        </el-form>
      </template>
    </manage-table>
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/Index.vue'
import {getStreet} from '@/api'
import MapBoundaryDraw from '@/base-lib/components/GeoMap/MapBoundaryDraw'
import {convertBorder} from '@/base-lib/components/GeoMap/js/ConvertBorder2Arr'

export default {
  name: 'Index',
  components: {MapBoundaryDraw, ManageTable},
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
    convertBorder,
    boundarySave(formdata, data) {
      console.log(data)
      formdata.border = data.boundaryLatlng.map(p => {
        return p.join(',')
      }).join(';')
      formdata.lat_lng = JSON.stringify([data.boundaryCenter.x, data.boundaryCenter.y])
    },
    dataShaper() {
      return {
        street: [],
        place_id: '',
        place_name: '',
        lat_lng: [],
        border: ''
      }
    },
    editDeal(data) {
      const tmp = data
      tmp.street = tmp.street.map(item => {
        return item.id
      })
      if(tmp.lat_lng.constructor === Array) {
        tmp.lat_lng = JSON.stringify(tmp.lat_lng)
      }
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
