// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import vueInfiniteScroll from 'vue-infinite-scroll'
import {currency} from './utils/currency.js'

import App from './App'
import BasePage from './components/base/BasePage'

Vue.use(Vuex);
Vue.config.productionTip = false;
Vue.use(VueLazyLoad, {loading:"./assets/loading-svg/loading-spinning-bubbles.svg"});
Vue.use(vueInfiniteScroll);
Vue.filter("currency", currency);

const store = new Vuex.Store({
  state:{
    nickName: '',
    cartCount: 0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    },
    initCartCount(state,cartCount){
      state.cartCount = cartCount;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { BasePage },
  template: '<BasePage/>'
})
