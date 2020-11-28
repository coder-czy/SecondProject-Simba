<template>
  <div class="order-list">
    <div class="pro-box">
      <div class="clearfix info-boxs">
        <div class="info-title fl">{{infoTitleLeft}}</div>
     <div class="clearfix ">
            <div class="fr re-info" v-if="isRight">
          <div class="order-btn" v-if="!isReceive" @click="confirmReceive">确认收货</div>
          <div class="clearfix" v-else>
            <div class="fl ">已完成</div>
            <div class="fl delete" @click="remove">
              <van-icon size="19" name="delete" />
            </div>
          </div>
            </div>
          
          </div>
      </div>
      
      <div>
        <div class="cell-list">
          <!-- 商品信息 -->
          <slot></slot>
        </div>

        <div class="bottom-into">
          <div class="circle">
            <div class="fl circle-box circle-left"></div>
            <div class="fr circle-box circle-right"></div>
          </div>
          
          <div class="date" v-if="date != ''">{{date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
          <div class="clearfix">
            <div class="fl">共计 {{count}} 件</div>
            <div class="fr total">合计 ￥{{total}}</div>
          </div>
                <div class="order-btn fr"  v-if="isRight" @click="buyAgain"> 再来一单</div>
        
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "OrderList",
  props: {

    //左边的标题
    infoTitleLeft: {
      type: String,
      default: '左边标题'
    },

    //是否显示右边信息
    isRight: {
      type: Boolean,
      default: false
    },

    //时间
    date: {
      type: [String,Number],
      default: '1970-01-01 00:00:00'
    },

    // 商品数量
    count: {
      type: Number,
      default: 0
    },

    //订单总金额
    total: {
      type: [Number, String],
      default: 0
    },

    //确认收货
    isReceive: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    //确认收货
    confirmReceive() {
      this.$emit('confirm-receive');
    },

    //删除
    remove() {
      this.$emit('remove');
    },
    buyAgain(){
      this.$emit('buy-again')
    }
  }
};
</script>

<style lang="less" scoped>
@baseColor: #077655;
.order-list {
  .pro-box {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #fff;
    padding: 10px;
    margin-bottom: 50px;
  }
  .info-title {
    font-size: 14px;
    
  }

  .info-boxs{
    margin-bottom: 10px;
  }

  .cell-list {
    padding-bottom: 20px;
    border-bottom: 1px dashed #e8e8e8;
  }

  .bottom-into {
    padding-top: 20px;
    font-size: 14px;
    position: relative;

  .order-btn{
  padding: 5px 10px ;
  background-color: @baseColor;
  color: #fff;
  border-radius: 4px;
  margin-top: 10px;
}
  }

  .total {
    font-size: 16px;
    color: #323233;
    font-weight: bold;
  }

  .circle {
    position: absolute;
    left: 0;
    top: -10px;
    width: 100%;
    height: 20px;
  }

  .circle-box {
    width: 20px;
    height: 20px;
    background-color: #f7f7f7;
    border-radius: 50%;
  }

  .circle-left {
    position: relative;
    left: -20px;
  }
  .circle-right {
    position: relative;
    right: -20px;
  }
  .re-info{
    font-size: 14px;
  }

  .delete{
    width: 19px;
    height: 19px;
    margin-left: 10px;
  }

  .date{
    margin-bottom: 10px;
    font-size: 12px;
  }
}
</style>