<template>
  <div>
    <skeleton-main>
      <manage-table
        :columns-definition="def"
        :data-src-url="'/ads'"
      />
    </skeleton-main>
  </div>
</template>

<script>

import ManageTable from "./base-lib/components/ManageTable"
import SkeletonMain from "./base-lib/components/skeleton/SkeletonMain"
export default {
  name: 'App',
  components: {
    SkeletonMain,
    ManageTable
  },
  data() {
    return {
      def: [
        {
          prop: 'adminName',
          label: '标签'
        },
        {
          prop: 'adminPass',
          label: '类型'
        }
      ]
    }
  }
}
</script>

<style>
#app {
}
</style>
