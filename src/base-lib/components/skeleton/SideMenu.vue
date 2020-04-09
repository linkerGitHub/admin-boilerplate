<template>
  <el-submenu :index="menus.name">
    <template v-slot:title>
      {{ menus.title }}
    </template>
    <div
      v-for="menu in menus.children"
      :key="menu.name"
    >
      <el-menu-item
        :index="menu.name"
        v-if="menu.children === undefined || menu.children.length === 0"
      >
        {{ menu.title }}
      </el-menu-item>
      <side-menu
        :menus="menu"
        v-if="menu.children !== undefined && menu.children.length > 0"
      />
    </div>
  </el-submenu>
</template>

<script>
export default {
  name: "SideMenu",
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