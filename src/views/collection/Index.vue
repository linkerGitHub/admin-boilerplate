<template>
  <div>
    <manage-table
      :columns-definition="def"
      :data-src-url="'/collection'"
      :axios-requester="$genAxiosInstanceFn()"
      :edit-deal="editDeal"
      :new-one-deal="editDeal"
      :data-shaper="dataShaper"
      :before-edit-dialog-open="beforeEditOpenHandle"
    >
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
        </el-form>
      </template>
    </manage-table>
  </div>
</template>

<script>
import ManageTable from '@/base-lib/components/ManageTable/Index.vue'
import SelectWithRemoteSearch from '@/base-lib/components/selectWithRemoteSearch/selectWithRemoteSearch'
import {getCollectionById} from '@/api'
export default {
  name: 'Index',
  components: {SelectWithRemoteSearch, ManageTable},
  data() {
    return {
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
