<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        :router="true"
        :default-active="activeTab"
      >
        <div
          v-for="menu in menuRoutes"
          :key="menu.path"
        >
          <side-menu
            v-if="menu.children && menu.children.length > 0"
            :menus="menu"
          />
          <el-menu-item
            v-else
            :index="menu.path"
          >
            {{ menu.title }}
          </el-menu-item>
        </div>
      </el-menu>
    </el-aside>
    <el-container>
      <!--      <el-header>Header</el-header>-->
      <el-main>
        <el-tabs
          v-model="activeTab"
          type="card"
          closable
          @tab-click="tabClickHandle"
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="(item) in existTabs"
            :key="item.name"
            :label="item.title"
            :name="item.name"
          />
        </el-tabs>

        <div style="position: relative">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </el-container>
</template>

<script>
import menuRoutes from '../../../route/menu-routes'
import SideMenu from './SideMenu'
export default {
  name: 'SkeletonMain',
  components: {SideMenu},

  data() {
    return {
      menuRoutes,
      existTabs: [],
      existTabsMap: {},
      activeTab: ''
    }
  },
  watch: {
    $route: function (newVal) {  //注意两个参数的位置
      const tab = this.buildTabFromRoute(newVal)
      this.addTab(tab)
    }
  },
  beforeMount() {
    const tab = this.buildTabFromRoute(this.$route)
    this.addTab(tab)
  },
  methods: {
    buildTabFromRoute(route) {
      return {
        name: route.path,
        title: route.meta.title,
        meta: route.meta
      }
    },
    addTab(tab) {
      if(this.existTabsMap[tab.name] === undefined) {
        this.existTabs.push(tab)
        this.$set(this.existTabsMap, tab.name, tab)
      }
      this.activeTab = tab.name
    },
    removeTab(name) {
      this.$delete(this.existTabsMap, name)
      this.existTabs = this.existTabs.filter(item => {
        return item.name !== name
      })
      const nextTab = this.existTabs[this.existTabs.length - 1]
      if(this.activeTab === name) {
        this.jumpToTab(nextTab)
      }
    },
    jumpToTab(tab) {
      this.$router.push({
        path: tab.name
      })
    },
    tabClickHandle(tab) {
      if(tab.name !== this.$route.path) {
        this.jumpToTab(tab)
      }
    }
  }
}
</script>

<style scoped>

</style>
