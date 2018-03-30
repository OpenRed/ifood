<template>
  <div class="container">
    <h4>当前位置：支付成功</h4>
    <div class="progress">
      <div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%;">
        <span class="sr-only">100% Complete</span>
      </div>
    </div>

    <div class="row order-success text-center">
      <div class="col-xs-12 col-sm-12">
        <img src="./../../assets/images/smile.png" alt="">
        <p class="text-left"><span class="paysuccess">支付成功！</span>你的订单正在飞速向你靠近！</p>
        <p class="text-left">订单号码：{{orderId}}</p>
        <p class="text-left">订单金额：{{orderTotal|currency('￥')}}</p>
        <div class="clearfix"></div>
        <div class="text-center">
          <router-link to="/cart"class="btn btn-default pull-left" href="javascript:;" style="width:100px;">查看购物车</router-link>
          <router-link to="/"class="btn btn-default pull-right" href="javascript:;" style="width:100px;">继续购物</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "order-success",
    data(){
      return {
        orderId: '',
        orderTotal: 0
      }
    },
    mounted(){
      var orderId = this.$route.query.orderId;
      if(!orderId){
        return;
      }

      axios.get('/users/checkLogin').then((response)=>{
        let res = response.data;
        if(res.status=='0'){
          axios.get('/users/orderDeatil', {
            params:{orderId: orderId}
          }).then((res)=>{
            if(res.data.status=='0'){
              this.orderId = orderId;
              this.orderTotal = res.data.result.orderTotal;
            }
          });
        }
        else{
          alert("当前状态未登录，请先登录在进行操作！");
          this.$router.push({path:'/'});
        }
      });
    }
  }
</script>

<style scoped>
  .order-success { width: 100%; height: 300px; margin:40px auto; border:#ff5856 2px dotted; }
  .order-success p { margin:10px; }
  .paysuccess { color:#ff5856; }

  /* 屏幕（大于等于 1000） */
  @media (min-width: 1000px) {
    .order-success {
      width: 50%;
      position: relative; left:50%;
      margin-left: -200px;}
  }
</style>
