<template>
  <div class="container">
    <h4>当前位置：支付确认</h4>
    <div class="progress">
      <div class="progress-bar" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">
        <span class="sr-only">50% Complete</span>
      </div>
    </div>

    <div class="row cart-header">
      <div class="col-xs-5 col-sm-5">美食</div>
      <div class="col-xs-2 col-sm-2 border-left">单价</div>
      <div class="col-xs-2 col-sm-2 border-left">数量</div>
      <div class="col-xs-3 col-sm-3 border-left">总价</div>
    </div>
    <div class="row cart-content" v-for="item in orderList">
      <div class="col-xs-5 col-sm-5 cart-item padding-0">
        <div class="cart-item-tab">
          <img :src="'/static/images/'+item.productImage" alt="...">
        </div>
        <div class="cart-item-tab">
          <p>{{item.productName}}</p>
        </div>
      </div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">{{item.salePrice|currency('￥')}}</div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">{{item.productNum}}</div>
      <div class="col-xs-3 col-sm-3 border-left padding-0">
        {{parseFloat(item.salePrice)*parseInt(item.productNum)|currency('￥')}}
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="pull-right text-right total">
          <p>订单金额：<span>{{totalPrice|currency('￥')}}</span></p>
          <p>运费：<span>{{shipping|currency('￥')}}</span></p>
          <p>折扣：<span>{{discount*10}}折</span></p>
          <p>实际支付：<span>{{orderTotal|currency('￥')}}</span></p>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <span class="pull-left next">
          <router-link :to="{path:'address'}">上一步</router-link>
        </span>
        <span class="pull-right next">
          <a @click="payMent">支付确认</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "orderconfirm",
    data(){
      return{
        msg: 'order',
        totalPrice: 0,
        shipping: 0,
        discount: 0.99,
        orderList: []
      }
    },
    mounted(){
      this.getOrderList();
    },
    computed:{
      orderTotal(){
        return (this.totalPrice+this.shipping)*this.discount;
      }
    },
    methods:{
      getOrderList(){
        axios.get('/users/checkLogin').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            axios.get('/users/cartList').then((res)=>{
              console.log(res.data.result);
              if(res.data.status=='1'){
                res.data.result.forEach((item)=>{
                  if(item.checked=='1'){
                    this.orderList.push(item);
                    this.totalPrice += parseFloat(item.salePrice)*parseInt(item.productNum);
                  }
                });
              }
            });
          }
          else{
            alert("当前状态未登录，请先登录在进行操作！");
            this.$router.push({path:'/'});
          }
        });
      },
      payMent(){
        axios.post('/users/payMent', {
          orderTotal: this.orderTotal,
          addressId: this.$route.query.addressId
        }).then((res)=>{
          if(res.data.status=='0'){
            console.log("order suc");
            this.$router.push({path:'/orderSuccess?orderId='+res.data.result.orderId});
          }
        });
      }
    }
  }
</script>

<style scoped>
  a:hover { text-decoration:none; }
  .cart-header { margin:0; background:#ff5856; padding:10px 0; text-align: center; }
  .border-left { border-left:#FFFFFF 1px solid; }
  .cart-content { margin:10px 0; padding:10px 0; min-height: 60px; line-height: 60px; text-align:center; border-bottom:#ff5856 1px solid;  }
  .cart-item-tab { float:left; }
  .cart-item-tab:nth-child(1) { width:40%; }
  .cart-item-tab:nth-child(2) { width:60%; }
  .cart-item-tab img { width:80%; }
  .total span { width:100px; height:15px; line-height:15px; display:inline-block; }
  .next { width:100px; height: 30px; line-height: 30px; background:#ff5856; text-align:center; cursor:pointer; }
  .next a { color:#000; width:100%; display:block; }
  .next:hover a { color:#fff; }
</style>
