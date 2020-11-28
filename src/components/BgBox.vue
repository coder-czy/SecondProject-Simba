<template>
  <div class="bg-box">
      <div class="bg"></div>
      <div class="bg-content">
        <slot></slot>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'BgBox'
  }
</script>

<style lang="less" scoped>
 @baseColor:#077655;

  .bg-box{

    .bg{
      height: 100px;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      background-color: @baseColor;
    }

    .bg-content{
      margin: 0 10px;
      position: relative;
      top: -20px;
      background-color: #fff;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      padding: 10px;
      overflow: hidden;
    }
  }
</style>