<template>
  <div class="shopbag fixed clearBar">
    <van-nav-bar
      title="购物袋"
      fixed
      
      @click-right="isEdit = !isEdit"
    >
      <template #left>
        <div class="back" @click="back" v-if="isShow"><van-icon name="arrow-left" />返回</div>
      </template>
      <template #right>
        <div v-if="shopbagData.length > 0">{{ isEdit ? "完成" : "编辑" }}</div>
      </template>
    </van-nav-bar>
    <div v-if="shopbagData.length == 0">
      <van-empty description="购物袋空空如也，去逛一逛!">
        <van-button round color="#077655" class="bottom-button" @click="goMenu">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopbag-box" v-else>
      <div class="shopbag-bg"></div>

      <!-- 懒加载组件 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="20"
        @load="loadData"
      >
        <div class="shopbag-product">
          <div
            class="shopbag-item"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
          >
            <div class="cell-item">
              <van-swipe-cell :disabled="!isEdit">
                <div class="clearfix cell-item-box">
                  <div class="fl check-box">
                    <van-checkbox
                      @change="simpleSelect"
                      v-model="item.isChecked"
                      checked-color="#077655"
                    />
                  </div>
                  <div class="fl pro-info-box">
                    <div class="fl pro-img">
                      <img class="auto-img" :src="item.small_img" alt="" />
                    </div>
                    <div class="fl pro-info">
                      <div class="pro-info-text">
                        <div class="clearfix names">
                          <div class="fl pro-name">{{ item.name }}</div>
                          <div class="fl pro-rule">{{ item.rule }}</div>
                        </div>
                        <div class="pro-enname">{{ item.enname }}</div>
                      </div>
                      <div class="pro-count-box">
                        <div class="fl pro-price">
                          ￥<span class="price">{{ item.price }}</span>
                        </div>
                        <div class="fr step-box">
                          <van-stepper
                            v-model="item.count"
                            theme="round"
                            button-size="20"
                            disable-input
                            @change="changeCount(item)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template #right>
                  <van-button
                    square
                    type="danger"
                    text="删除"
                    @click="removeOne(index, item.sid)"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </div>
      </van-list>

      <van-submit-bar
        v-if="!isEdit"
        :price="totalPrice"
        button-text="提交订单"
        button-color="#077655"
        @submit="commit"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>

      <van-submit-bar
        v-else
        button-text="删除选择"
        button-color="#EE0A24"
        @submit="removeSelected"
      >
        <van-checkbox v-model="isAllChecked" @click="allSelect"
          >全选</van-checkbox
        >
      </van-submit-bar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Shopbag",
  data() {
    return {
      isCheck: false,
      count: 2,
      isAllChecked: false,
      loading: true,
      finished: false,
      isEdit: false,
      allShopbagData: [],
      dataCount: 8,
      startIndex: 0,
      shopbagData: [],
      tatal: 0,
      isShow:false

    };
  },
  created() {
    this.getShopbagData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    goMenu(){
      this.$router.push({name:'Menu'})
    },


    getShopbagData() {
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: { appkey: this.appkey, tokenString },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 5000) {
            res.data.result.map((v) => {
              v.isChecked = false;
            });
            this.allShopbagData = res.data.result;
            this.shopbagData = this.allShopbagData.slice(
              this.startIndex,
              this.startIndex + this.dataCount
            );

            this.startIndex += this.dataCount;

            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    changeCount(item) {
      //获取token
      let tokenString = localStorage.getItem("__tk");
      // 
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid: item.sid,
          count: item.count,
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    commit() {
      let isHas = this.isSelectProduct();
      if (!isHas) {
        this.$toast("请选择购买的商品");
        return;
      }

      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },

    // 懒加载购物车数据
    loadData() {
      setTimeout(() => {
        let data = this.allShopbagData.slice(
          this.startIndex,
          this.startIndex + this.dataCount
        );

        this.startIndex += this.dataCount;
        this.shopbagData.push(...data);

        this.isAllChecked = false;

        if (data.length < this.dataCount) {
          this.finished = true;
        } else {
          this.loading = false;
        }
      }, 1000);
    },
    removeOne(index, sid) {
      //index: shopbagData数组元素下标
      //sid: 购物袋sid

      //获取token
      let tokenString = localStorage.getItem("__tk");
      //
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify([sid]),
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 7000) {
            //如果删除成功, 则移除页面的商品，重新计算订单总金额
            this.shopbagData.splice(index, 1);
            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 全选
    allSelect() {
      this.shopbagData.map((v) => (v.isChecked = this.isAllChecked));
      //   s
    },

    // 单选
    simpleSelect() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.isAllChecked = false;
          return;
        }
      }
      this.isAllChecked = true;
    },

    // 删除选择
    removeSelected() {
      let isHas = this.isSelectProduct();

      if (!isHas) {
        this.$toast("请选择删除的商品");
        return
      }

      let sids = [];
      this.shopbagData.map((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      this.$toast.loading({
        message: "加载中...",
        duration: 0,
        forbidClick: true,
      });

      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((res) => {
          this.$toast.clear();
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code === 7000) {
             //移除页面的数据
            for (let i = 0; i < this.shopbagData.length; i++) {
              if (this.shopbagData[i].isChecked) {
                this.shopbagData.splice(i, 1);
                i--;
              }
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    isSelectProduct() {
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (this.shopbagData[i].isChecked) {
          return true;
        }
      }
      return false;
    },
  },
  computed: {
    totalPrice() {
      return this.shopbagData
        .filter((v) => v.isChecked === true)
        .reduce((oldval, newval) => {
          return (oldval += parseInt(newval.price) * newval.count * 100);
        }, 0);
    },
  },
  beforeRouteEnter (to, from, next) {
    if(from.fullPath.indexOf('detail')>0){
      next((vm)=>{
            vm.isShow =true
          })
    }else{
      next()
    }
    
    
  }
};
</script>

<style lang="less" scoped>
@baseColor: #077655;

.shopbag {
  padding-top: 46px;
.back{
   /deep/ .van-icon {
    color: #322332;
    vertical-align: middle;
  }
}
 

  /deep/ .van-nav-bar__text {
    color: #323233;
  }

  .bottom-button {
    width: 100px;
    height: 30px;
  }

  .shopbag-bg {
    height: 50px;
    background: url("../assets/images/shopbag_bg.png") no-repeat center center;
    background-size: cover;
  }

  .shopbag-product {
    padding: 10px;
  }

  .shopbag-item {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .cell-item {
    /deep/ .van-button {
      height: 100%;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }
  }

  .cell-item-box {
    padding: 10px;
    // margin-right: 10px;
    background-color: #fff;
    border-radius: 8px;
  }

  .check-box {
    width: 20px;
    height: 20px;
    margin-top: 30px;
  }

  .pro-info-box {
    height: 80px;
    width: calc(~"100% - 34px");
    margin-left: 10px;
  }

  .pro-img {
    width: 80px;
    height: 80px;
  }

  .pro-info {
    width: calc(~"100% - 90px");
    margin-left: 10px;
  }

  .pro-info-text {
    height: 50px;
  }

  .pro-count-box {
    height: 30px;
  }

  .pro-enname {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
  }

  .pro-name {
    font-size: 14px;
    margin-right: 15px;
  }

  .pro-rule {
    font-size: 12px;
    color: #999;
  }

  .pro-price {
    font-size: 14px;
    color: #323233;
    font-weight: bold;
    line-height: 30px;
    .price {
      font-size: 18px;
    }
  }

  /deep/ .van-stepper--round .van-stepper__minus {
    color: @baseColor;
    border-color: @baseColor;
  }

  /deep/ .van-stepper--round .van-stepper__plus {
    background-color: @baseColor;
  }

  .step-box {
    margin-top: 5px;
  }

  .a {
    display: flex;
    > div {
      width: 120px;
      height: 40px;
      &.active {
        background-color: #e4393c;
      }
    }
  }

  .shopbag-box {
    padding-bottom: 50px;
    /deep/ .van-submit-bar {
      bottom: 50px;
    }
    /deep/ .van-submit-bar__price {
      color: #323233;
    }

    /deep/ .van-checkbox__icon--checked .van-icon {
      background-color: @baseColor;
      border-color: @baseColor;
    }

    .van-submit-bar__bar {
      .van-button {
        margin-left: auto;
      }
    }
  }

  .names {
    line-height: 19px;
  }
}
</style>