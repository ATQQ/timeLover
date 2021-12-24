import { Module } from 'vuex'
import { familyApi, recordApi } from '@/apis'

const store: Module<WeightState, unknown> = {
  namespaced: true,
  state() {
    return {
      weights: [],
      peopleOption: [{ text: '默认', value: 'default' }],
    }
  },
  mutations: {
    updateWeights(state, payload) {
      state.weights.splice(0, state.weights.length, ...payload.weights)
    },
    updatePeopleOptions(state, { families }) {
      state.peopleOption.splice(1, state.peopleOption.length - 1, ...families)
    },
    addPeopleOption(state, option) {
      state.peopleOption.push(option)
    },
  },
  actions: {
    /**
     * 获取记录的数据
     */
    getRecords(context, payload) {
      const { familyId } = payload
      // 取缓存数据
      let weights: any = localStorage.getItem(familyId)
      try {
        weights = weights ? JSON.parse(weights) : []
      } catch {
        weights = []
        localStorage.removeItem(familyId)
      }
      context.commit('updateWeights', {
        weights,
      })

      // 获取实际数据
      recordApi.getList(familyId).then((res) => {
        const { records } = res.data
        records.forEach((r: any) => {
          r.date = +new Date(r.date)
        })
        // 刷新业务缓存
        localStorage.setItem(familyId, JSON.stringify(records))
        context.commit('updateWeights', {
          weights: [...records],
        })
      })
    },
    getFamilyList(context) {
      // 取缓存
      let data: any = localStorage.getItem('families')
      try {
        data = data ? JSON.parse(data) : []
      } catch {
        data = []
      }
      context.commit('updatePeopleOptions', { families: data })

      familyApi.getList().then((res) => {
        const { families } = res.data
        for (const f of families) {
          f.text = f.name
          f.value = f.familyId
        }
        context.commit('updatePeopleOptions', { families })
        localStorage.setItem('families', JSON.stringify(families))
      })
    },
  },
}

export default store
