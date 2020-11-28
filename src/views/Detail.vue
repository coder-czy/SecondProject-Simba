<template>
    <div class="detail">
       <van-nav-bar
        title="商品详情"
        left-text="返回"
       
        left-arrow
        @click-left="back"
        />
    <div class="detail-content  fixed clearBar">
      <div>
        <img class="auto-img" :src="productDetail.large_img" alt="">
      </div>
      <div class="pro-info-box">
        <div class="pro-info">
          <div class="clearfix pro-box">
            <div class="fl">
              <div class="pro-name">{{productDetail.name}}</div>
              <div class="pro-enname">{{productDetail.enname}}</div>
            </div>
            <div class="fr pro-price">￥<span class="price">{{productDetail.price}}</span></div>
          </div>

          <div>
            <!-- 商品规格 -->
            <div class="rule-box">


              <div class="rule-items clearfix" v-for="(item, index) in productDetail.rules" :key="index">
                <div class="fl rule-title">{{item.title}}</div>
                <div class="fl">
                  <div class="fl r-item" :class="{active: item.ruleIndex == i, 'large-text': v.title.length >= 4}" v-for="(v, i) in item.rule" :key="i" @click="toggleRule(item, i)">{{v.title}}</div>
                </div>
              </div>

            </div>

            <!-- 修改商品数量 -->
            <div class="clearfix c-box">
              <div class="fl select-count">选择数量</div>
              <div class="fr count-box">
                <van-stepper v-model="product.count" theme="round" button-size="22" disable-input />
              </div>
            </div>

            <!-- 商品描述 -->
            <div class="desc-box">
              <div class="pro-desc">商品描述</div>
              <div class="desc-text">
                <div class="text-item" v-for="(item, index) in productDetail.desc" :key="index">{{index + 1}}、{{item}}</div>
              </div>
            </div>

            

          </div>

        </div>
      </div>
      
    </div>
        <van-goods-action>
            <van-goods-action-icon :to="{name: 'Shopbag'}" icon="bag"  
           :badge="bagCount == 0 ? '' : bagCount" 
            text="购物袋" 
            :color="bagCount > 0 ? '#077655' : '#646566'"/>
            <van-goods-action-icon icon="like" 
            :color="isLike ? '#e4393c':'#646566'" 
            :text="isLike ? '已收藏' : '未收藏'"
             @click="toggleLikeProduct"/>
            <van-goods-action-button color="#8dc63f" text="加入购物车" @click="addShopbag()" />
            <van-goods-action-button color="#077655"  text="立即购买" @click="buy(true)"/>
        </van-goods-action>
    </div>
</template>

<script>
import {formatDateTime} from '../assets/js/util'
  export default {
    name: 'Detail',
    data() {
      return {
        //商品pid
        pid: '',

        //商品信息
        product: {
          count: 1
        },

        //购物袋的数量
        bagCount: 0,

        //商品详情数据
        productDetail: {},

        //是否已经收藏商品
        isLike: false

      };
    },

    created() {
      //截取pid
      this.pid = this.$route.params.pid;
      

      //获取商品详情数据
      this.getProductDetail();

      //查询用户是否已经收藏该商品
      this.findLike();

      //查询用户的购物袋记录数
      this.shopBagCount();
    },
     watch: {
        productDetail(newval,oldval){
          if(newval!=oldval){
           this.setFootmark()
          }
        }
      },

    methods: {
      //获取商品详情数据
      getProductDetail() {
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
        url: "/productDetail",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          pid: this.pid
        },
      })
        .then((result) => {
          this.$toast.clear();

          
          if (result.data.code == 600) {

            let data = result.data.result[0];

            data.desc = data.desc.split(/\n/);

            let rules = [];

            let ruleData = ['tem', 'sugar', 'milk', 'cream'];
            ruleData.map(v => {
              let r = {};
              r.title = data[v + '_desc'];

              //激活下标
              r.ruleIndex = 0;

              //每项规格
              r.rule = [];

              //获取规格字符串
              let ruleString = data[v].split('/');
              ruleString.map(value => {
                if (value != "") {
                  r.rule.push({title: value});
                }
                
              })

              if (r.rule.length > 0) {
                rules.push(r);
              }

            })

            data.rules = rules;

            this.productDetail = data;

            
          }

        })
        .catch((err) => {
          this.$toast.clear();

          
        });
      },

      //返回上一级
      back() {
        this.$router.go(-1);
      },

      //切换规格
      toggleRule(item, i) {
        // 
        // 
        if (item.ruleIndex == i) {
          return;
        }

        item.ruleIndex = i;
      },

      //查询用户是否收藏该商品
      findLike() {
        //获取token
        let tokenString = localStorage.getItem('__tk');
        // 
        if (!tokenString) {
          return;
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        //发起查询收藏商品请求
        this.axios({
          method: 'GET',
          url: '/findlike',
          params: {
            appkey: this.appkey,
            pid: this.pid,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              //收藏商品成功
              this.isLike = true;
            }
            
          }

        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //收藏商品
      toggleLikeProduct() {
        //获取token
        let tokenString = localStorage.getItem('__tk');
        // 
        if (!tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }

        let url = this.isLike ? '/notlike' : '/like';

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        //发起收藏商品请求
        this.axios({
          method: 'POST',
          url,
          data: {
            appkey: this.appkey,
            pid: this.pid,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({name: 'Login'});
          } else if (result.data.code == 800) {
            //收藏商品成功
            this.isLike = true;
          } else if (result.data.code == 900) {
            //取消收藏商品
            this.isLike = false;
          }

          this.$toast(result.data.msg);
        }).catch(err => {
          this.$toast.clear();
          
        })
        
      },

      //查询用户的购物袋数量
      shopBagCount(){
        let tokenString = localStorage.getItem('__tk');
        // 
        if (!tokenString) {
          return;
        }

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });

        this.axios({
          method: 'GET',
          url: '/shopcartRows',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 8000) {
            this.bagCount = result.data.result;
          }

        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //加入购物袋
      addShopbag(isBuy) {
        //获取tokenString
        //获取商品pid
        //获取商品规格rule
        //获取商品数量count
        //获取appkey

        let tokenString = localStorage.getItem('__tk');
        // 
        if (!tokenString) {
          //跳回登录页面
          this.$toast('请先登录');
          return this.$router.push({name: 'Login'});
        }

        //请求参数
        let data = {
          tokenString,
          appkey: this.appkey,
          count: this.product.count,
          pid: this.pid
        };

        let rs = [];
        //遍历productDetail.rules数组获取选择的商品规格
        this.productDetail.rules.map(v => {
          rs.push(v.rule[v.ruleIndex].title);
        })

        data.rule = rs.join('/');

        // 
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0
        });
        this.axios({
          method: 'POST',
          url: '/addShopcart',
          data
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({name: 'Login'});
          } else if (result.data.code == 3000) {
            
            if (!isBuy) {
              //加入购物袋
              if (result.data.status == 1) {
                this.bagCount++;
              }
            } else {
              //立即购买
              this.$router.push({name: 'Pay', query: {sids: result.data.sid}});
            }
            
            
          }

          this.$toast(result.data.msg);

        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //立即购买(后台判断购物袋如果存在该商品，则累加数量，然后跳转到订单结算页面，否则先将该商品加入购物袋，再跳转到订单结算页面)
      buy(isBuy) {
        this.addShopbag(isBuy);
      },
        setFootmark(){
      
          
          let item = localStorage.getItem('footmark')
          if(!item){
            
            localStorage.setItem('footmark',JSON.stringify([{time:formatDateTime(new Date()),food:this.productDetail}]))
  
          }else{
           let data=JSON.parse(item)
           let flag = true
           for(let i=0;i<data.length;i++){
             if(data[i].food.pid==this.productDetail.pid){
               data.splice(i,1)
               data.unshift({time:formatDateTime(new Date()),food:this.productDetail})
               flag = false
               break
             }
           }
           if(flag){
  
             data.unshift({time:formatDateTime(new Date()),food:this.productDetail})
           }
              localStorage.setItem('footmark',JSON.stringify(data))
  
           
          }
        

      }
    }
  }
</script>

<style lang="less" scoped>
    @baseColor:#077655;
    .detail{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background-color: #fff;

        /deep/.van-nav-bar__arrow{
            color:#323233;
        }
        /deep/.van-nav-bar__text{
            color: #323232;
        }
        /deep/.van-goods-action-icon__icon{
            color: #646566;
        }
         .pro-info-box{
    padding: 0 10px;
    // background-color: #fff;
  }
  .detail-content{
    margin: 46px 0 50px 0;
  }
  .pro-info{
    padding: 20px;
    position: relative;
    top: -20px;
    background-color: #fff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .pro-box{
    margin-bottom: 20px;
  }

  .pro-name{
    font-weight: bold;
  }

  .pro-enname{
    font-size: 10px;
    color: #999;
    margin-top: 5px;
  }

  .pro-price{
    color: #323233;
    font-weight: bold;
    margin-top: 9px;
    .price{
      font-size: 20px;
    }
  }

  .rule-title{
    width: 60px;
    height: 26px;
    line-height: 26px;
    font-size: 14px;
  }

  .r-item{
    width: 60px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    background-color: #e8e8e8;
    font-size: 12px;
    margin-right: 10px;
    border-radius: 15px;
    &.active{
      background-color: @baseColor;
      color: #fff;
    }
  }

  .rule-items{
    margin-bottom: 10px;
    .r-item{
      &:last-child{
        margin-right: 0;
      }
    }
  }

  .large-text{
    font-size: 10px;
  }

  .rule-box{
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }

  .desc-box{
    margin-top: 20px;

  }

  .pro-desc{
    margin-bottom: 10px;
    font-size: 14px;
  }

  .desc-text{
    color: #999;
    font-size: 12px;
  }

  .text-item{
    margin-bottom: 10px;
  }

  /deep/ .van-stepper--round .van-stepper__minus{
    color: @baseColor;
    border-color: @baseColor;
  }

  /deep/ .van-stepper--round .van-stepper__plus{
    background-color: @baseColor;
  }

  /deep/ .van-info{
    background-color: @baseColor;
  }

  .c-box{
    border-bottom: 1px solid #e8e8e8;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .select-count{
    font-size: 14px;
    line-height: 22px;
  }
    }
</style>