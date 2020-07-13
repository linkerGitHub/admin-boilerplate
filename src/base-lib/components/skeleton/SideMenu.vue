<template>
  <div>
    <el-submenu
      v-if="menus.constructor === Object && menus.children !== undefined && menus.children.length > 0 && menus.meta && menus.meta.hidden !== true"
      :index="parentPath + menus.path"
    >
      <template v-slot:title>
        {{ menus.meta.title }}
      </template>
      <side-menu
        v-for="menu in menus.children"
        :key="menu.path"
        :parent-path="parentPath + '/' + menus.path"
        :menus="menu"
      />
    </el-submenu>
    <el-menu-item
      v-else-if="menus.constructor === Object && menuItemRequiredCondition(menus)"
      :index="parentPath + menus.path"
    >
      {{ menus.meta.title }}
    </el-menu-item>
    <el-menu-item
      v-else-if="menus.constructor === Object"
      @click="menus.action"
    >
      {{ menus.title }}
    </el-menu-item>
    <div v-else-if="menus.constructor === Array">
      <side-menu
        v-for="menu in menus"
        :key="menu.path"
        :parent-path="parentPath"
        :menus="menu"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideMenu',
  props: {
    parentPath: {
      type: String,
      default() {
        return '/'
      }
    },
    menus: {
      type: [Object, Array],
      required: true
    }
  },
  methods: {
    menuItemRequiredCondition(item) {
      return item.meta !== undefined && item.meta.hidden !== true
    }
  }
}
</script>

<style scoped>

</style>
