<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/collection'"
      :axios-requester="$genAxiosInstanceFn()"
      :edit-deal="editDeal"
      :new-one-deal="editDeal"
      :data-shaper="dataShaper"
      :extra-params="filter"
      :before-edit-dialog-open="beforeEditOpenHandle"
    >
      <template v-slot:searchBar>
        <el-row
          style="text-align: right;">
          <el-form inline>
            <el-select
              v-model="filter.item_usage_mark"
              size="small"
            >
              <el-option
                :value="undefined"
                label="所有"
              />
              <el-option
                :value="'index'"
                label="首页显示"
              />
            </el-select>
          </el-form>
        </el-row>
      </template>
      <template v-slot:newOneForm="{ formData }">
        <el-form
          :model="formData"
          label-width="130px"
        >
          <el-form-item
            label="图集名称"
            prop="collection_name"
          >
            <el-input v-model="formData.collection_name" />
          </el-form-item>
          <el-form-item
            label="图集描述"
            prop="collection_description"
          >
            <el-input v-model="formData.collection_description" />
          </el-form-item>
          <el-form-item
            label="所属用户"
            prop="user"
          >
            <select-with-remote-search
              v-model="formData.user"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/user"
              label-key="user_name"
            />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tag"
          >
            <select-with-remote-search
              v-model="formData.tag"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/tag"
              label-key="tag_name"
            />
          </el-form-item>
          <el-form-item
            label="是否首页显示："
            prop="item_usage_mark"
          >
            <el-select
              v-model="formData.item_usage_mark"
            >
              <el-option
                label="是"
                value="index"
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
          label-width="130px"
        >
          <el-form-item
            label="图集名称"
            prop="collection_name"
          >
            <el-input v-model="formData.collection_name" />
          </el-form-item>
          <el-form-item
            label="图集描述"
            prop="collection_description"
          >
            <el-input v-model="formData.collection_description" />
          </el-form-item>
          <el-form-item
            label="所属用户"
            prop="user"
          >
            <select-with-remote-search
              v-model="formData.user"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/user"
              label-key="user_name"
            />
          </el-form-item>
          <el-form-item
            label="标签"
            prop="tag"
          >
            <select-with-remote-search
              v-model="formData.tag"
              :axios-requester="$genAxiosInstanceFn()"
              data-src-url="/tag"
              label-key="tag_name"
            />
          </el-form-item>
          <el-form-item
            label="是否首页显示："
            prop="item_usage_mark"
          >
            <el-select
              v-model="formData.item_usage_mark"
            >
              <el-option
                label="是"
                value="index"
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
import ManageTable from '@/base-lib/components/ManageTable/ManageTable.vue'
import SelectWithRemoteSearch from '@/base-lib/components/selectWithRemoteSearch/selectWithRemoteSearch'
import {getCollectionById} from '@/api'
export default {
  name: 'Index',
  components: {SelectWithRemoteSearch, ManageTable},
  data() {
    return {
      filter: {
        item_usage_mark: undefined
      },
      def: [
        {
          prop: 'collection_name',
          label: '图集名称',
          editable: true
        },
        {
          prop: 'collection_description',
          label: '图集描述',
          editable: true
        },
        {
          prop: 'pic_count',
          label: '图片数量'
        },
        {
          prop: 'item_status',
          label: '是否系统数据',
          textContent: function (val) {
            return val === 1 ? '否' : '是'
          }
        },
        {
          prop: 'item_usage_mark',
          label: '是否首页显示',
          textContent: function (val) {
            return val === 'index' ? '是' : '否'
          }
        }
      ],
      tmp: {
        editData: {}
      }
    }
  },
  methods: {
    dataShaper() {
      return {
        collection_name: '',
        collection_description: '',
        tag: [],
        user: []
      }
    },
    editDeal(data) {
      const tmp = data
      tmp.user = tmp.user.map(item => {
        return item.id
      })
      tmp.tag = tmp.tag.map(item => {
        return item.id
      })
      return new Promise(resolve => {
        resolve(tmp)
      })
    },
    beforeEditOpenHandle(data) {
      const loading = this.$loading()
      return new Promise((resolve) => {
        getCollectionById(data.id).then(res => {
          resolve(res.data.data.rows[0])
        }).finally(() => {
          loading.close()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
