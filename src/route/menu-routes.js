import { routes } from './index'

const indexRoute = routes[1]
const fromRouter = indexRoute.children.map(item => {
  return {
    path: indexRoute.path + '/' + item.path,
    title: item.meta.title
  }
})

// path、component、name、title是必须的
export default fromRouter
