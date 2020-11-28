import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'lib-flexible/flexible'
import vants from './vant.config'

Vue.use(vants)

Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'
axios.interceptors.request.use(config => {
    if (config.method == 'post') {
        let paramsData = ''
        for (let key in config.data) {
            paramsData += `${key}=${config.data[key]}&`
        }
        config.data = paramsData.slice(0, -1)
    }
    return config
})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

Vue.filter('decimal', (v, n = 2) => {
    return v.toFixed(n);
})

//格式化日期
Vue.filter('formatDate', (v, format) => {

    // 
    // 

    //创建日期对象
    let date = new Date(v);

    //格式化年份
    let year = date.getFullYear().toString();
    // 
    if (/(y+)/.test(format)) {
        //获取匹配组的内容
        var content = RegExp.$1;
        // 
        format = format.replace(content, year.slice(year.length - content.length));
    }

    // 

    //格式化月份、日份、时、分、秒
    let o = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
    };

    // 

    for (let key in o) {
        //创建动态正则表达式
        let reg = new RegExp(`(${key}+)`);
        // 

        if (reg.test(format)) {
            //获取组匹配的内容
            let groupContent = RegExp.$1;
            // 

            format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
            // 
        }

    }

    return format;
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')