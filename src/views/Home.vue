<template>
  <div class="home clearBar">
    <van-nav-bar :fixed="true">
      <template #left>
        <div class="home-nav" >
          <div class="t1">{{getTimeText}},</div>
          <div class="t2">{{userInfo.nickName || '游客'}}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search">
          <van-search placeholder="输入商品名称"   @focus="searchFocus"/>
        </div>
      </template>
    </van-nav-bar>
    
    <div class="home-content">
      <!-- 轮播图 -->
      <div class="banner-box">
        <van-swipe @change="changeCurrentIndex" :autoplay="5000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index" >
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              @click="goDetail(item.pid)"
            />
          </van-swipe-item>
          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
      </div>
          <div class="eat-type">
        <div class="eat-in"  @click="goMenu('eatIn')">
          <div><img class="auto-img" src="../assets/images/eatin.png" alt=""></div>
          <p>自提</p> 
          </div>
        <div class="eat-out"  @click="goMenu('eatOut')">
          <div><img class="auto-img" src="../assets/images/eatout.png" alt=""></div>
          <p>外卖</p> 
          </div>
      </div>
      <!-- 商品 -->
      <div class="product-box">
        <div>
          <div class="clearfix pro-title-box">
            <span class="pro-title">热卖推荐</span>
          </div>
          <div class="products clearfix">
            <div class="pro-item fl" v-for="(item, index) in hotProduct" :key="index" @click="goDetail(item.pid)">
            <van-icon name="hot-sale" class="hot"/>
              <div class="pro-img">
                <img
                  class="auto-img"
                  :src="item.smallImg"
                />
              </div>
              <div class="pro-info">
                <div class="pro-name one-text">{{item.name}}</div>
                <div class="pro-enname one-text">{{item.enname}}</div>
                <div class="pro-price">￥<span class="price">{{item.price}}</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: "Home",
  data() {
    return {
      //当前轮播图片索引
      currentIndex: 0,

      //轮播数据
      bannerData: [],

      //热卖商品数据
      hotProduct: [],
      userInfo:{},
      text:''
    };
  },

  created() {
    //获取轮播图数据
    this.getBannerData();

    //获取热卖推荐商品
    this.getHotProduct();

     this.getUserInfo();
  },
  computed:{
    getTimeText(){
      let time = new Date().getHours()
      switch (true) {
        case time<12:
          return '早上好'
          break;
        case time<14:
          return '中午好'
          break;
        case time<18:
          return '下午好'
          break;
        case time<24:
          return '晚上好'
          break;

      }

    }

  },

  methods: {
    ...mapMutations(['SET_DELIVERY_TYPE']),
      getUserInfo() {
        let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 'A001') {
            this.userInfo = result.data.result[0];
          }

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
      },

      goMenu(type){
        this.SET_DELIVERY_TYPE(type)
        this.$router.push({name:'Menu'})
      },
    //修改轮播图片索引
    changeCurrentIndex(index) {
      // 
      this.currentIndex = index;
    },

    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },
      // 搜索商品页面
     searchFocus() {
       this.$router.push({name: 'Search'});
     } ,

    //获取热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        method: "GET",
        url: "/typeProducts",

        params: {
          appkey: this.appkey,
          key: 'isHot',
          value: 1
        },
      })
        .then((result) => {
          this.$toast.clear();

          

          if (result.data.code == 500) {
            this.hotProduct = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          
        });
    },

    //查看商品详情页面
    goDetail(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    }
  },
};
</script>
<style lang="less" scoped>
.home{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
  
  padding-top: 46px;

  .eat-type{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(255, 255, 255, .8);
    margin: 10px 15px;
    border-radius: 8px;
    padding: 15px 10px;
    // transform: translateY(-30px);
    // box-shadow: 0 1px 5px 1px #ddd;

    .eat-in,.eat-out{
      width: 45px;
     img{
       height: 100%;
     }
     p{
       text-align: center;
       color:#323233;
       font-size: 16px;
       font-weight: bold;
     }

    }
  }
  .home-nav{
    display: flex;
    line-height: 46px;
  }
  .t1{
    font-weight: bold;
  }

  .t2{
    color: #077655;
    font-weight: bold;
    margin-left: 10px;
  }

  /deep/ .home-search .van-search{
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
  }

  /deep/ .home-search .van-icon{
    color: #077655;
  }

  .home-content{
    padding: 10px 10px 0 10px;
  }

  .banner-box{
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  .index-box{
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: flex;

    >div{
      width: 12px;
      height: 2px;
      background-color: rgba(255, 255, 255, .5);
      margin-right: 5px;
      border-radius: 1px;
      &.active{
        background-color: #fff;
      }
    }
  }

  .product-box{
    // margin-top: -28px;
  }

  .pro-title-box{
    background-color: #fff;
    padding: 10px 0;
    border-radius: 4px;
  }

  .pro-title{
    float: left;
    padding: 0 15px;
    height: 32px;
    background-color: #077655;
    color: #fff;
    line-height: 32px;
    font-size: 14px;
    border-top-right-radius: 16px;
  }

  .products{
    margin-top: 10px;
    margin-bottom: 50px;
  }

  .pro-item{
    position: relative;
    width: calc(~"50% - 25px");
    margin-right: 10px;
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    &:nth-child(2n){
      margin-right: 0;
    }
    .hot{
      position: absolute;
      top: 20px;
      left: 15px;
      font-size: 25px;
      color:#077655;
    }

    .pro-img{
      border-radius: 4px;
      overflow: hidden;
    }
    
  }

  .pro-info{
    margin-top: 10px;
  }

  .pro-name{
    margin-bottom: 5px;
  }

  .pro-price{
    color: #323233;
    font-weight: bold;
    font-size: 16px;

    .price{
      font-size: 20px;
    }
  }

  .pro-enname{
    color: #999;
    font-size: 12px;
    margin-bottom: 8px;
  }
  
}
</style>