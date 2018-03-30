<template>
  <div container>
    <h4>当前位置：购物车</h4>
    <div class="row cart-header">
      <div class="col-xs-3 col-sm-3">美食</div>
      <div class="col-xs-2 col-sm-2 border-left">单价</div>
      <div class="col-xs-2 col-sm-2 border-left">数量</div>
      <div class="col-xs-3 col-sm-3 border-left">总价</div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">操作</div>
    </div>
    <div class="row cart-content" v-for="item in cartList">
      <div class="col-xs-3 col-sm-3 cart-item padding-0">
        <div class="cart-item-tab">
          <input type="radio" @click="editItem('checked', item)" :checked="item.checked=='1'">
        </div>
        <div class="cart-item-tab">
          <img :src="'static/images/'+item.productImage" alt="...">
        </div>
        <div class="cart-item-tab">
          <p>{{item.productName}}</p>
        </div>
      </div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">{{item.salePrice|currency('￥')}}</div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">
        <a class="input-sub" @click="editItem('minus', item)">-</a>
        <span class="select-ipt">{{item.productNum}}</span>
        <a class="input-add" @click="editItem('add', item)">+</a>
      </div>
      <div class="col-xs-3 col-sm-3 border-left padding-0">
        {{parseFloat(item.salePrice)*parseInt(item.productNum)|currency('￥')}}
      </div>
      <div class="col-xs-2 col-sm-2 border-left padding-0">
        <a @click="deleteConfirm(item)" href="javascript:;"><img src="./../../assets/images/delete.png" alt=""></a>
      </div>
    </div>
    <div class="row cart-footer">
      <div class="col-xs-5 col-sm-5 cart-footer-item padding-0">
        <span @click="toggleCheckAll">
          <input type="radio" :checked="checkAllFlag"> 选择所有
        </span>
        <span>删除所有</span>
      </div>
      <div class="col-xs-5 col-sm-5 cart-footer-item text-center padding-0">
        <span>总价：</span>
        {{totalPrice|currency('￥')}}
      </div>
      <div class="col-xs-2 col-sm-2 cart-footer-item text-center padding-0 checkout">
        <p :class="{'checkout-unable': checkedCount==0}" @click="checkout">结算</p>
      </div>
    </div>

    <modal :isShowModal="isShowModal" @close="closeModal">
      <div slot="content">
        <p class="text-center">你确定要删除此数据吗？</p>
        <br>
        <a @click="deleteGoods" class="btn btn-default pull-left" href="javascript:;" style="width:100px;">
          删除
        </a>
        <a @click="isShowModal=false" class="btn btn-default pull-right" href="javascript:;" style="width:100px;">
          取消
        </a>
      </div>
    </modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import Modal from './../base/Modal'

  export default {
    name: "cart",
    components:{Modal},
    data(){
      return {
        cartList: [],
        isShowModal: false,
        productId: '',
        delItem: []
      }
    },
    mounted(){
      this.getCartlist();
    },
    computed:{
      checkAllFlag(){
        return this.checkedCount == this.cartList.length;
      },
      checkedCount(){
        var i = 0;
        this.cartList.forEach((item)=>{
          if(item.checked=='1') i++;
        });
        return i;
      },
      totalPrice(){
        var money = 0;
        this.cartList.forEach((item)=>{
          if(item.checked=='1'){
            money += parseFloat(item.salePrice)*parseInt(item.productNum);
          };
        });
        return money;
      }
    },
    methods:{
      getCartlist(){
        axios.get('/users/checkLogin').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            axios.get('/users/cartList').then((res)=>{
              if(res.data.status=='1'){
                this.cartList = res.data.result;
              }
            });
          }
          else{
            alert("当前状态未登录，请先登录在进行操作！");
            this.$router.push({path:'/'});
          }
        });
      },
      deleteConfirm(item){
        this.delItem = item;
        this.isShowModal=true;
      },
      deleteGoods(){
        axios.post('/users/cartDel', {
          productId: this.delItem.productId
        }).then((response)=>{
            let res = response.data;
            if(res.status=='0'){
              this.isShowModal = false;
              this.getCartlist();
              this.$store.commit("updateCartCount", -this.delItem.productNum);
            }
        });
      },
      closeModal(){
        this.isShowModal=false;
      },
      editItem(flag, item){
        if(flag=='add'){
          item.productNum++;
        }
        else if(flag=='minus'){
          if(item.productNum>1){
            item.productNum--;
          }
        }
        else{
          item.checked = item.checked=='1'?'0':'1';
        }
        axios.post('/users/cartEdit', {
          productId: item.productId,
          productNum: item.productNum,
          checked: item.checked
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("edit goods suc");
            if(flag=='add'){
              this.$store.commit("updateCartCount", 1);
            }
            else if(flag=='minus'){
              this.$store.commit("updateCartCount", -1);
            }
          }
        });
      },
      toggleCheckAll(){
        var flag = !this.checkAllFlag;
        this.cartList.forEach((item)=>{
          item.checked = flag?'1':'0';
        });
        axios.post('/users/checkAll', {
          checkAll: flag
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("suc");
          }
        });
      },
      checkout(){
        if(this.checkedCount>0){
          this.$router.push({path:'/address'});
        }
      }
    }
  }
</script>

<style scoped>
  .margin-0 { margin:0 !important; }
  .padding-0 { padding:0 !important; }
  .cart-header { margin:0; background:#ff5856; padding:10px 0; text-align: center; }
  .border-left { border-left:#FFFFFF 1px solid; }
  .cart-content { margin:10px 0; padding:10px 0; min-height: 80px; line-height: 80px; text-align:center; border-bottom:#ff5856 1px solid;  }
  /*.cart-item-tab { float:left; }*/
  .cart-item-tab { float:left; }
  .cart-item-tab:nth-child(1) { width:3%; margin-right:5%; }
  .cart-item-tab:nth-child(2) { width:30%; }
  .cart-item-tab:nth-child(3) { width:62%; }
  .cart-item-tab img { width:100%; }
  /* 屏幕（大于等于 768px） */
  @media (max-width: 768px) {
    .cart-item-tab:nth-child(1) { width:15%; margin-right:0;}
    .cart-item-tab:nth-child(2) { width:85%; }
    .cart-item-tab:nth-child(3) { width:100%; height:30px; line-height:30px; }
    .cart-item-tab img { width:80%; }
  }
  .input-sub,.input-add{
    width: 30px; max-height: 20px; border: 0; cursor:pointer;
    color: #605F5F; text-align: center; font-size: 16px;
    overflow: hidden; background: #f0f0f0; padding: 6px; text-decoration:none;
  }
  /* 屏幕（大于等于 768px） */
  @media (max-width: 768px) {
    .input-sub,.input-add{ padding:0; }
  }
  .select-ipt { min-width: 30px; text-align: center; }
  .cart-footer { margin:10px 0; padding:10px 0; min-height: 50px; line-height: 50px; }
  .cart-footer-item:nth-child(1) span { cursor:pointer; margin-right:10px; }
  .cart-footer-item:nth-child(1) { padding-right:0; }
  .cart-footer-item:nth-child(3) { background:#ff5856; }
  .checkout { cursor:pointer; }
  .checkout-unable { background:#eeeeee !important; cursor: auto; }
  .cart-footer-item:nth-child(3) p { margin:0; }
</style>
