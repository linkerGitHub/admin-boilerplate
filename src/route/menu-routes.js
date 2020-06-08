import { routes } from './index'

const indexRoute = routes[1]
const fromRouter = indexRoute.children.map(item => {
  return {
    name: indexRoute.path + '/' + item.path,
    title: item.meta.title
  }
})

// path、component、name、title是必须的
export default [
  {
    title: '首页',
    name: '/index',
    children: fromRouter
  }
]
