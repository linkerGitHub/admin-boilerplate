<template>
  <el-submenu :index="menus.path" >
    <template v-slot:title>
      {{ menus.title }}
    </template>
    <div
      v-for="menu in menus.children"
      :key="menu.path"
    >
      <el-menu-item
        v-if="menu.children === undefined || menu.children.length === 0"
        :index="menu.path"
      >
        {{ menu.title }}
      </el-menu-item>
      <side-menu
        v-if="menu.children !== undefined && menu.children.length > 0"
        :menus="menu"
      />
    </div>
  </el-submenu>
</template>

<script>
export default {
  name: 'SideMenu',
  props: {
    menus: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
