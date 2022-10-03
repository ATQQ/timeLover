import { createStore } from 'vuex'
import weight from './modules/weight'
// Create a new store instance.
const store = createStore({
  modules: {
    weight
  }
})

export default store
