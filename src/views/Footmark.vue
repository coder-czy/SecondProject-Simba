<template>
  <div class="footmark fixed clearBar">
    <van-nav-bar
      title="更多信息"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <BgBox>
      <van-tabs
        v-model="tabIndex"
        color="#077655"
        title-active-color="#077655"
        line-height="2"
      >
        <van-tab title="我的足迹">
          <div class="mark-content" v-if="footmarkData&&footmarkData.length > 0">
            <div
              class="mark-item"
              v-for="(item, index) in footmarkData"
              :key="index"
            >
              <p class="mark-time">{{ item.time }}</p>
              <div
                class="food-item clearfix"
                v-for="(f, i) in item.foods"
                :key="i"
                @click="goDetail(f.pid)"
              >
                <div class="mark-img fl"><img :src="f.small_img" alt="" /></div>
                <div class="food-name fl">
                  <p>{{ f.name }}</p>
                  <p>{{ f.enname }}</p>
                </div>
                <div class="fr delete" @click.stop="deleteMark(f.pid)"> 

               <van-icon size="25" name="delete" />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <van-empty description="没有浏览记录" />
          </div>
        </van-tab>
        <van-tab title="消费图表">
            <p  class="title">消费数量(杯)</p>

          <div class="small" v-if="coffee || latte || rena_ice">
            <pie-chart :chart-data="datacollection"></pie-chart>
            <br>
            <bar-chart :chart-data="datacollect"></bar-chart>
          </div>
          
          <div v-else>
            <van-empty description="没有消费记录" />
          </div>
        </van-tab>
      </van-tabs>
    </BgBox>
  </div>
</template>

<script>
import BgBox from "../components/BgBox";
import { dateUtils } from "../assets/js/util";
import PieChart from "../assets/js/pieChart";
import BarChart from "../assets/js/barChart";

export default {
  name: "Footmark",

  data() {
    return {
      tabIndex: 0,
      footmarkData: [],
      datacollection: null,
      datacollect: null,
      coffee: {
        count:0,
        price:0
      },
      latte:  {
        count:0,
        price:0
      },
      rena_ice: {
        count:0,
        price:0
      },
      // totalCount: 0,
    };
  },
  components: {
    BgBox,
    PieChart,
    BarChart
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取足迹数据
    getFootmark() {
      let data = JSON.parse(localStorage.getItem("footmark"));
      if(!data){
        return
      }
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        // 
        if (arr.length < 1) {
          // 

          arr.push({
            time: dateUtils.format(data[i].time),
            foods: [data[i].food],
          });
          continue;
        } else {
         let flag = true

          for (let j = 0; j < arr.length; j++) {
            if (arr[j].time == dateUtils.format(data[i].time)) {
              flag = false
              arr[j].foods.push(data[i].food);
              break;
            } 

            }
            if(flag){

              arr.push({
                  time: dateUtils.format(data[i].time),
                  foods: [data[i].food],})
            }
     
        }
      }
      this.footmarkData = arr;
      
    },

      // 画图数据
    fillData(latte, coffee, rena_ice) {
      this.datacollection = {
        labels: ["拿铁", "咖啡", "瑞纳冰"],
        datasets: [
          {
            label: "Data One",
            backgroundColor: [
              this.getRandomColor(),
              this.getRandomColor(),
              this.getRandomColor()
            ],

            borderWidth: 0,
            data: [latte.count, coffee.count, rena_ice.count],
          },
        ],
      };
      this.datacollect = {
        labels: ["拿铁", "咖啡", "瑞纳冰"],
         
        datasets: [
          {
            label: "消费金额(元)",
           
            backgroundColor: [
               this.getRandomColor(),
              this.getRandomColor(),
              this.getRandomColor()
            ],

            borderWidth: 0,
            data: [latte.price, coffee.price, rena_ice.price],
            
          },
        ],
      };
      // 
    },
    getRandomColor(){
      return `rgba(${this.getRandom()},${this.getRandom()},${this.getRandom()},0.2)`
      },
      getRandom(){
    return Math.floor(Math.random()*255)+1

      },
  
  
    // 获取订单数据

    getOrderData() {
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
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: 2,
        },
      }).then((result) => {
        this.$toast.clear();

        if (result.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (result.data.code == 70000) {
          let data = result.data.result;
          
          for (let i = 0; i < data.length; i++) {
            // this.totalCount += data[i].count;
            switch (true) {
              case data[i].pid.indexOf("coffee") > -1:
                this.coffee.count += data[i].count;
                this.coffee.price += data[i].price*data[i].count;
                break;
              case data[i].pid.indexOf("latte") > -1:
                this.latte.count += data[i].count;
                this.latte.price +=  data[i].price*data[i].count;
                break;
              case data[i].pid.indexOf("rena_ice") > -1:
                this.rena_ice.count += data[i].count;
                this.rena_ice.price +=  data[i].price*data[i].count;
                break;
            }
          }
          this.fillData(this.latte, this.coffee, this.rena_ice);
        }
      });
    },
    // 删除足迹
    deleteMark(pid){
      let data = JSON.parse(localStorage.getItem('footmark'))
    let food= data.filter(v=>{
        return v.food.pid!=pid
      })
      localStorage.setItem('footmark',JSON.stringify(food))
      this.$toast({
        message:"删除成功",
        duration:1
      })
      this.getFootmark()
    },
    // 查看详情
     goDetail(pid) {
      this.$router.push({name: 'Detail', params: {pid}});
    }
  },

  created() {
    this.getFootmark();
    this.getOrderData();
  },
};
</script>

<style lang="less" scoped>
.footmark {
  padding-top: 46px;
  /deep/ .van-nav-bar .van-icon {
    color: #323233;
  }

  /deep/ .van-nav-bar__text {
    color: #323233;
  }
  .title{
    text-align: center;
    font-size: 12px;
    color: #323233;
  }
  .mark-content {
    padding-top: 10px;
    

    .mark-item {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
      .mark-time {
        font-size: 16px;
        color: #323233;
        font-weight: bold;
        margin: 5px 0;
      }
      .food-item {
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }

        .delete{
          width: 25px;
          height: 25px;
          margin-top: 12px;
        }

        .food-name {
          font-size: 14px;
          padding: 5px 0;
          width: 60vw;
        }
      }
      p {
        margin: 0;
      }
   
      .mark-img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>