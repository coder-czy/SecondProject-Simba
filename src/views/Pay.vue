<template>
    <div class="pay">
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
      >
       <template #right>
             <div class="switch" @click="changeType" >
              <span class="zq" :class="{active:deliveryType==='eatIn'}">自取</span>
              <span class="wm" :class="{active:deliveryType==='eatOut'}">外卖</span>
              <span class="bg" :class="{active:deliveryType==='eatOut'}"></span>
            </div>
           </template>
    </van-nav-bar>
    <div class="pay-box">
      <div class="select-address" v-show="deliveryType=='eatOut'">
        <div>
          <span @click="showSelectAddressList">选择地址</span>
          <van-icon class="arrow" name="arrow" />
        </div>
        <div class="user-box">
          <div class="user-info">
            <div class="user-name">{{currentAddress.name}}</div>
            <div class="user-phone">{{currentAddress.tel}}</div>
            <div class="default-address" v-if="currentAddress.isDefault">默认</div>
          </div>
          <div class="detail-address">{{currentAddress.address}}</div>
        </div>
      </div>
      <!-- 订单信息 -->
      <div class="order-info">
        <OrderList info-title-left="订单信息" :date="date" :count="productInfo.count" :total="productInfo.total">
          <OrderItem v-for="(item, index) in products" :key="index" :item="item"></OrderItem>
        </OrderList>
      </div>
    </div>

    <div class="btn-box">
      <van-button type="primary" block round color="#077655" @click="payBox">立即结算</van-button
      >
    </div>

    <van-popup is-link position="bottom" closeable v-model="isOpen">
      <div class="address-title">选择地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="newAddress"
        @select="selectAddress"
      />
    </van-popup>
  </div>
</template>

<script>
    import OrderList from '../components/OrderList'
    import OrderItem from '../components/OrderItem'
    import {mapMutations,mapState} from 'vuex'
    export default {
        name:'Pay',
        components:{
            OrderList,
            OrderItem
        },
        data() {
            return {
                isOpen:false,
                chosenAddressId:'',
                list:[],
                currentAddress:{},
                sids:[],
                products:[],
                productInfo:{
                    count:0,
                    total:0
                },
                date:''
            }
        },

        created() {
          
            this.sids = this.$route.query.sids.split('-')
            
            this.date = new Date().getTime()
            this.getShopbagBySids()
            this.getAddressData()


        },
        computed: {
          ...mapState(['deliveryType'])
        },

        methods: {
          
          ...mapMutations(['SET_DELIVERY_TYPE']),
            back(){
                this.$router.go(-1)

            },
             changeType(){
           
              
              if(this.deliveryType==='eatIn'){
  
                this.SET_DELIVERY_TYPE('eatOut')
                
              }else{
                this.SET_DELIVERY_TYPE('eatIn')
  
              }
            
       
          },

            newAddress(){
                this.$router.push({name:"NewAddress"})

            },

            selectAddress(item,index){
                this.isOpen = false
                this.currentAddress  =item

              },

              showSelectAddressList(){
                  this.isOpen = true
                  
              },

              getAddressData(){
                  let tokenString = localStorage.getItem("__tk")

                  if(!tokenString){
                      this.$toast('请先登录')
                      return this.$router.push({name:"Login"})
                  }

                  this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                  })

                  this.axios({
                    method:'GET',
                    url:'/findAddress',
                    params:{
                      appkey:this.appkey,
                      tokenString,
                    }
                  }).then(res=>{
                    this.$toast.clear()
                    if(res.data.code ==700){
                      this.$router.push({name:'Login'})

                    }else if(res.data.code===20000){
                      res.data.result.map(v=>{
                        v.isDefault = Boolean(v.isDefault)
                        v.id = v.aid
                        v.address =`${v.province}${v.city}${v.county}${v.addressDetail}`

                        if(v.isDefault){
                          this.chosenAddressId  =v.aid
                          this.currentAddress = v

                        }
                      })

                    this.list = res.data.result


                    }
                  }).catch(err=>{
                    this.$toast.clear()
                    


                  })
              },

              // 根据sids 获取购物袋数据

              getShopbagBySids(){
                 let tokenString = localStorage.getItem("__tk")

                  if(!tokenString){
                      this.$toast('请先登录')
                      return this.$router.push({name:"Login"})
                  }

                  this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                  })

                  this.axios({
                    method:'GET',
                    url:'/commitShopcart',
                    params:{
                      appkey:this.appkey,
                      tokenString,
                      sids:JSON.stringify(this.sids)
                    }
                  }).then(res=>{
                    this.$toast.clear()
                    if(res.data.code ==700){
                      this.$router.push({name:'Login'})

                    
                    }else if(res.data.code===50000){
                      if(res.data.result.length==0){
                        return this.$router.push({name:'Home'})

                      }

                      res.data.result.map(v=>{
                        this.productInfo.count +=v.count
                        this.productInfo.total+=v.count*v.price
                      })

                      this.products =res.data.result
                      // 

                    }else{
                      this.$toast(res.data.msg)

                    }
                   
                  }).catch(err=>{
                    this.$toast.clear()
                    


                  })
              },


              // 结算订单
              pay(){
                let tokenString = localStorage.getItem("__tk")

                  if(!tokenString){
                      this.$toast('请先登录')
                      return this.$router.push({name:"Login"})
                  }
                

                  this.$toast.loading({
                    message:'加载中...',
                    forbidClick:true,
                    duration:0
                  })

                  this.axios({
                    method:'POST',
                    url:'/pay',
                    data:{
                      appkey:this.appkey,
                      tokenString,
                      sids:JSON.stringify(this.sids),
                      phone:this.currentAddress.tel,
                      address:this.currentAddress.address,
                      receiver:this.currentAddress.name

                    }
                  }).then(res=>{
                    this.$toast.clear()
                    if(res.data.code ==700){
                      this.$router.push({name:'Login'})


                    }else{
                      this.$toast(res.data.msg)
                      setTimeout(() => {
                        this.$router.push({name:'Order'})
                      });

                    }
                   
                  }).catch(err=>{
                    this.$toast.clear()
                    


                  })
              },

              payBox(){
                  if(!Object.keys(this.currentAddress).length>0&&this.deliveryType=='eatOut'){
                    return this.$toast('请先选择地址')
                  }
                this.$dialog.confirm({
                  title:"确认订单",
                  message:"是否立即结算？",
                  confirmButtonColor:'#077655'
                }).then(res=>{
                  this.pay()

                }).catch(err=>{
                  
                })
              }

    }

    }
</script>

<style lang="less" scoped>
@baseColor: #077655;

.pay{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  overflow: scroll;
  background-color: #f7f7f7;
  padding-top: 46px;
  padding-bottom: 74px;

  /deep/ .van-nav-bar .van-icon{
    color: #323233;
  }

  /deep/ .van-nav-bar__text{
    color: #323233;
  }

  .pay-box{
    padding: 10px;
  }
   .switch{
          position: relative;
          width: 112px;
          height: 30px;
          line-height: 30px;
          color: #919193;
          font-size: 12px;
          border-radius: 30px;
          background: #f5f5f5;
          font-weight: 200;

          span{
            position: relative;
            display: inline-block;
            z-index: 10;
            
          }
          .zq{
            margin: 0 25px 0 0;

            &.active{
              color: #fff;
            }
          }
          .wm{

             &.active{
              color: #fff;
            }
          }
          .bg{
            position: absolute;
            top: 0;
            left: 0;
            width: 60px;
            height: 30px;
            border-radius: 30px;
            background: @baseColor;
            z-index: 1;
            transition: all .1s linear;

             &.active{
              top: 0;
              left: 52px;
            }
          }

        }
  .select-address{
    background-color: #fff;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 10px;
    font-size: 14px;
  }

  .user-info{
    display: flex;
    line-height: 19px;
  }

  .user-box{
    margin-top: 20px;
  }

  .user-name{
    color: #323233;
    margin-right: 20px;
    font-weight: bold;
  }

  .detail-address{
    margin-top: 10px;
    color: #999;
  }

  .arrow{
    position: relative;
    top: 2px;
    margin-left: 5px;
  }

  .order-info{
    margin-top: 10px;
  }

   /deep/ .van-button--danger{
    background-color: @baseColor;
    border-color: @baseColor;
  }

  
/deep/ .van-address-item{
  border-bottom: 1px solid #e8e8e8;
  &:last-child{
    border-bottom: none;
  }
}

/deep/ .van-address-item .van-radio__icon--checked .van-icon{
  background-color: @baseColor;
  border-color: @baseColor;
}
/deep/ .van-tag--danger{
  background-color: @baseColor;
}

/deep/ .van-icon-edit{
  display: none;
}

.address-title{
  padding-left: 20px;
  padding-top: 20px;
}

.btn-box{
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px;
  width: calc(~"100% - 20px");
}

.default-address{
  font-size: 12px;
  background-color: @baseColor;
  color: #fff;
  width: 40px;
  text-align: center;
  height: 20px;
  line-height: 21px;
  border-radius: 10px;
  margin-left: 20px;
}

}
</style>