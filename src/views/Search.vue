<template>
  <div class="search">
    <van-nav-bar left-text="返回" left-arrow fixed @click-left="back">
      <template #right>
        <div class="home-search">
          <van-search
            v-model="name"
            ref="search"
            show-action
            @search="search"
            placeholder="输入商品名称"
          >
      <template #action>
    <div @click="onSearch">搜索</div>
  </template>
          
          </van-search>
        </div>

      </template>
    </van-nav-bar>

     <BgBox>
      <div class="clearfix">
        <div class="fl like-item" v-for="(item, index) in products" :key="index" @click="goDetail(item.pid)">
          <ProductItem :item="item"></ProductItem>
        </div>
      </div>
    </BgBox>

  </div>
</template>

<script>
import BgBox from "../components/BgBox.vue";
import ProductItem from "../components/ProductItem.vue";
export default {
  name: "Search",

  components: {
    BgBox,
    ProductItem,
  },

  data() {
    return {
      name: "",

      products: [],
    };
  },

  created() {
    this.$nextTick(() => {
      
      let searchIpt = this.$refs.search.querySelector('[type="search"]');
      
      searchIpt.focus();
    });
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //搜索
    search() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      })
        .then((result) => {
          this.$toast.clear();
          

          if (result.data.code == "Q001") {
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    onSearch(){
      this.search()
      
    },

     //查看商品详情
    goDetail(pid) {
      
      this.$router.push({name: 'Detail', params: {pid}});
    },
  },
};
</script>

<style lang="less" scoped>
.search {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
  padding-top: 46px;
  background-color: #fff;


  /deep/ .van-nav-bar .van-icon {
    color: #323233;
  }

  /deep/ .van-nav-bar__text {
    color: #323233;
  }

  /deep/ .van-nav-bar__right {
    width: calc(~"100% - 110px");
  }

  /deep/ .home-search {
    width: 100%;
  }
  /deep/ .home-search .van-search {
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
  }

  /deep/ .home-search .van-icon {
    color: #077655;
  }

  .like-item{
    width: calc(~"100% / 3 - 10px + 10px / 3");
    margin-right: 10px;
    margin-bottom: 10px;
    &:nth-child(3n){
      margin-right: 0;
    }
  }
}
</style>