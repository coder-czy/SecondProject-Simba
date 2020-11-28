<template>
    <div class="my">
    <div class="my-bg" :style="{backgroundImage: `url('${userInfo.userBg}')`}">
      <van-uploader class="upload-box" :after-read="uploadBg" />
    </div>

    <div class="my-info">
      <div class="clearfix"  @click="goPage('Account')">
        <div class="fl my-img">
          <img class="auto-img" :src="userInfo.userImg" alt="" />
        </div>
        <div class="fl my-info-box">
          <div class="user-name">{{userInfo.nickName}}</div>
          <div class="user-desc">{{userInfo.desc == '' ? '介绍一下自己' : userInfo.desc}}</div>
        </div>
      </div>

      <div class="list-box">
        <van-cell v-for="(item, index) in listData" :key="index" :title="item.title" is-link @click="goPage(item.name)" />
      </div>

    </div>
  </div>
</template>

<script>
     export default {
    name: 'My',
    data() {
      return {
        listData: [
          {
            title: '个人资料',
            name: 'Account'
          },
          {
            title: '我的订单',
            name: 'Order'
          },
          {
            title: '我的收藏',
            name: 'Like'
          },
          {
            title: '地址管理',
            name: 'Address'
          },
          {
            title: '安全中心',
            name: 'Secure'
          },
          {
            title:'更多信息',
            name:'Footmark'

          }
        ],

        //用户信息
        userInfo: {}
      };
    },

    created() {
      //获取用户信息
      this.getUserInfo();
    },

    methods: {
      //获取用户信息
      getUserInfo() {
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
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 'A001') {
            this.userInfo = result.data.result[0];
          }

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
      },

      //上传背景
      uploadBg(file) {
        // 
        //允许文件类型
        let type = ['gif', 'png', 'jpg', 'jpeg'];

        //允许最大文件大小 1MB
        let size = 1;

        //判断文件类型
        let fileType = file.file.type.split('/')[1];
        if (type.indexOf(fileType) === -1) {
          this.$toast(`文件类型只支持${type.join(',')}`);
          return;
        }

        //判断文件大小 B, 1024B = 1KB, 1024KB = 1MB
        let fileSize = file.file.size / 1024 / 1024;
        
        if (fileSize > size) {
          this.$toast(`文件允许最大不能超过${size}MB`);
          return;
        }

        //处理base64的标记data:image/jpeg;base64,
        let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');
        // 

        //发起请求
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
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 'I001') {
            this.userInfo.userBg = result.data.userBg;
          }

          this.$toast(result.data.msg);

        })
        .catch((err) => {
          this.$toast.clear();
          
        });

      },

      goPage(name) {
        this.$router.push({name});
      }
    }
  }
</script>

<style lang="less" scoped>
 @baseColor:#077655;

.my{
  
  .my-bg{
    height: 180px;
    background-color: #fff;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }
  .upload-box{
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    /deep/.van-uploader__wrapper{
      width: 100%;
      height: 100%;
    }
    /deep/.van-uploader__upload{
      width: 100%;
      height: 100%;
      margin: 0;
    }
    .van-uploader__input{
       width: 100%;
      height: 100%;
    }
  }
  .my-info{
    margin: 0 10px;
    position: relative;
    top: -40px;
    padding: 10px 10px 10px 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, .65) 0, rgba(255, 255, 255, 1) 90px, #fff 90px, #fff 100%);
  }
  .my-img{
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #ddd;
    margin-right: 20px;
  }

  .my-info-box{
    width: calc(~"100% - 90px");
    height: 70px;
  }

  .user-name{
    color:#323233;
    height: 30px;
    font-weight: bold;
    
  }

  .user-desc{
    font-size: 14px;
    color: #999;
    height: 40px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .list-box{
    margin-top: 30px;
  }

  /deep/ .van-cell{
    border-bottom: 1px solid #F5F6F7;
    padding: 15px 0;
    &:last-child{
      border-bottom: none;
    }
    &:active{
      background-color: transparent;
    }

    span{
      color: #646566;
    }
  }
}
</style>