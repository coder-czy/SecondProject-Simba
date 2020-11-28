<template>
    <div class="main-box">
        <div>
            <keep-alive exclude="Shopbag,My,pay">
            
            <router-view></router-view>
            </keep-alive>
        </div>
        <van-tabbar v-model="activeName" inactive-color="#646566" active-color="#077655" route>
        <van-tabbar-item :name="item.name"  replace :to="item.path" 
        v-for="(item,index) in tabData" :key="index">{{item.title}}
         <template #icon="props">
             <img :src="props.active ? item.activeImg : item.inactiveImg" />
            </template>
        </van-tabbar-item>
        </van-tabbar>

    </div>
</template>

<script>
    export default {

         data() {
    return {
         activeName: 'Home',
         tabData:[
             {
                 title:'首页',
                 icon:'',
                 name:'Home',
                 path:'/main/home',
                inactiveImg: require('../assets/images/home.jpg'),
                activeImg: require('../assets/images/home_active.jpg')
             },
             {
                 title:'菜单',
                 icon:'',
                 name:'Menu',
                 path:'/main/menu',
                inactiveImg: require('../assets/images/menu.png'),
                activeImg: require('../assets/images/menu_active.png')
             },
             {
                 title:'购物袋',
                 icon:'',
                 name:'Shopbag',
                 path:'/main/shopbag',
                 inactiveImg: require('../assets/images/shopbag.png'),
                 activeImg: require('../assets/images/shopbag_active.jpg')
             },
             {
                 title:'我的',
                 icon:'',
                 name:'My',
                 path:'/main/my',
                inactiveImg: require('../assets/images/my.png'),
                activeImg: require('../assets/images/my_active.jpg')
             },
         ]
    };
  },
        methods: {
            
        },
    }
</script>

<style lang="less" scoped>
.main{
    padding-bottom: 50px;
  }
</style>