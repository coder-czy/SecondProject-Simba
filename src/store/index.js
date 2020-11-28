import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        deliveryType: 'eatIn'
    },
    mutations: {
        SET_DELIVERY_TYPE(state, deliveryType) {
            state.deliveryType = deliveryType
        }
    }
})