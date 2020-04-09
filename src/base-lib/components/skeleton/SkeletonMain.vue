<template>
  <el-container>
    <el-aside width="200px">
      <el-menu>
        <side-menu
          v-for="menu in menuRoutes"
          :key="menu.name"
          :menus="menu"
        />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <slot />
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import menuRoutes from '../../../route/menu-routes'
import SideMenu from "./SideMenu"
export default {
  name: "SkeletonMain",
  components: {SideMenu},
  data() {
    return {
      menuRoutes
    }
  }
}
</script>

<style scoped>

</style>