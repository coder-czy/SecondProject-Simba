<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>

<style lang="less">

.fixed{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
}
.clearBar{
   &::-webkit-scrollbar {
     width: 0 !important;
   }
   &::-webkit-scrollbar {
     width: 0 !important;
     height: 0;
   }
}
.clearfix::after{
  content: '';
  display: block;
  clear: both;
}
  body{
    background-color: #f7f7f7;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    color: #646566;
  }
  .auto-img{
    width: 100%;
    display: block;
  }
  
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }

  .one-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
