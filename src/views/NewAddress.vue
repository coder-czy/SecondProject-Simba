<template>
  <div class="new-address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <van-address-edit
      show-postal
      show-set-default
      :show-delete="!!aid"
      :area-columns-placeholder="['选择省', '选择市', '选择区']"
      :area-list="areaList"
      save-button-text="保存地址"
      :address-info="addressInfo"
      @save="save"
      @delete="removeAddress"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";

export default {
  name: "NewAddress",

  data() {
    return {
      areaList,

      addressInfo: {},

      aid: ''
    };
  },

  created() {
    this.aid = this.$route.query.aid;

    

    if (this.aid) {
      //根据地址aid查询地址数据
      this.getAddressDataByAid();
    }
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //保存地址
    save(content) {
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      
      let addressInfo = Object.assign({}, content);

      delete addressInfo.country;

      addressInfo.tokenString = tokenString;
      addressInfo.appkey = this.appkey;
      addressInfo.isDefault = Number(addressInfo.isDefault);

      

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      if (!this.aid) {
        //新增地址
        this.address(addressInfo, '/addAddress');
      } else {
  
        let isModify = false;
        for (let key in this.addressInfo) {
          if (content[key] != this.addressInfo[key]) {
            
            isModify = true;
          }
        }

        if (isModify) {
          this.address(addressInfo, '/editAddress');
        } else {
          return this.$toast('请修改地址信息');
        }

        
      }
    },

    //新增地址 或者 编辑地址
    address(addressInfo, url) {
      
      this.axios({
        method: "POST",
        url,
        data: addressInfo,
      })
        .then((res) => {
          this.$toast.clear();
          
         
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 9000 || res.data.code == 30000) {

            setTimeout(() => {
              this.$router.push({name: 'Address'});
            }, 800)
            
          }

           this.$toast(res.data.msg);

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },


    //根据地址aid查询地址数据
    getAddressDataByAid() {
      let tokenString = localStorage.getItem("__tk");
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
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then((res) => {
          this.$toast.clear();
          
          if (res.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 40000) {
            let data = res.data.result[0];
            data.isDefault = Boolean(data.isDefault);
            this.addressInfo = data;
          }

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //删除地址
    removeAddress() {
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
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then((res) => {
          this.$toast.clear();
          
          if (res.data.code == 700) {
            this.$router.push({ name: "Login" });
          } else if (res.data.code == 10000) {
            setTimeout(() => {
              this.$router.push({name: 'Address'});
            }, 800)
          }

          this.$toast(res.data.msg);

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    }
  },
};
</script>

<style lang="less" scoped>
@baseColor: #077655;

.new-address {
  padding-top: 46px;
  /deep/ .van-button--danger {
    background-color: @baseColor;
    border-color: @baseColor;
  }
  /deep/ .van-nav-bar__text {
    color: #323233;
  }
  /deep/ .van-nav-bar__arrow {
    color: #323233;
  }

  /deep/ .van-button--default {
    background-color: #ee0a24;
    color: #fff;
    margin-top: 20px;
  }

  /deep/ .van-switch--on {
    background-color: @baseColor;
  }
}
</style>