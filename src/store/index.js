import Vue from 'vue'
import Vuex from 'vuex'
import {getPlace, getStreet, getTimeStage} from '@/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    dataSrc: {
      street: [],
      place: [],
      timeStage: []
    }
  },
  mutations: {
    setStreet(state, payload) {
      state.dataSrc.street = payload
    },
    setPlace(state, payload) {
      state.dataSrc.place = payload
    },
    setTimeStage(state, payload) {
      state.dataSrc.timeStage = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    }
  },
  actions: {
    reloadStreet(ctx) {
      getStreet({
        skip: 0,
        take: 1000
      }).then(res => {
        ctx.commit('setStreet', res.data.data.rows)
      })
    },
    reloadPlace(ctx) {
      getPlace({
        skip: 0,
        take: 1000
      }).then(res => {
        ctx.commit('setPlace', res.data.data.rows)
      })
    },
    reloadTimeStage(ctx) {
      getTimeStage({
        skip: 0,
        take: 1000
      }).then(res => {
        ctx.commit('setTimeStage', res.data.data.rows)
      })
    }
  }
})

export default store
