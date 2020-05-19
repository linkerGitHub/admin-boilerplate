export default {
  New() {
    return {
      params: [],
      beforeSyncPromiseFunc: null,
      beforeAsyncHook: ()=>{},
      afterAsyncHook:  ()=>{},
      mainFunc: null,
      setBeforeSyncPromise(hookPromiseFunc) {
        this.beforeSyncPromiseFunc = hookPromiseFunc
        return this
      },
      setBeforeASyncHook(hookFunc) {
        this.beforeAsyncHook = hookFunc
        return this
      },
      /*setAfterSyncHook(hookPromise) {
                if (hookPromise.constructor.name !== 'Promise') {
                    throw new Error('sync hook must be a promise')
                }
                this.afterSyncPromise = hookPromise
                return this
            },*/
      setAfterASyncHook(hookFunc) {
        this.afterAsyncHook = hookFunc
        return this
      },
      setMainFunc(func) {
        this.mainFunc = func
        return this
      },
      buildFunc() {
        return function (...args) {
          if (this.constructor.name !== 'Function') {
            throw new Error('mainFunc must be a function')
          }
          const emptyPromiseFunc = (...args) => {
            return new Promise((resolve) => {resolve(args)})
          }
          if (this.beforeSyncPromiseFunc === null || this.beforeSyncPromiseFunc === undefined) {
            this.beforeSyncPromiseFunc = emptyPromiseFunc
          }

          const mixFuncWithMain = () => {
            this.beforeAsyncHook(args)
            this.mainFunc(args)
            this.afterAsyncHook(args)
          }

          const beforeDonePromise = this.beforeSyncPromiseFunc(args)
          if (beforeDonePromise.constructor.name !== 'Promise') {
            throw new Error('beforeSyncPromiseFunc must return a promise')
          }

          beforeDonePromise.then(mixFuncWithMain)
        }
      }
    }
  }
}
