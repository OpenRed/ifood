<template>
  <div class="container">
    <div class="row content">
      <div class="col-xs-12 col-md-3">
        <div class="sidebar">
          <h4>今日推荐</h4>
          <ul>
            <li v-for="item in product"><a href="">{{item.productName}}</a></li>
          </ul>
        </div>
      </div>

      <div class="col-xs-12 col-md-9">
        <div class="detail" v-for="item in product">
          <div class="detail-img text-center">
            <img v-lazy="'/static/images/'+item.productImage">
          </div>
          <p>{{item.productName}} <span>￥{{item.salePrice}}</span></p>
          <div class="detail-description">
            <p><strong>详情： </strong>{{item.productDes}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'detail',
    data(){
      return {
        product:[]
      }
    },
    created(){
      this.getProduct();
    },
    methods:{
      getProduct(){
        console.log(this.$route.query.id);
        axios.get('/goods/list',{
          params:{id:this.$route.query.id}
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            this.product = res.result.list;
          }
        });
      }
    }
  }
</script>

<style scoped>
  .content { margin: 10px 0; }
  .detail { background:#fcf8e3; padding:10px; box-shadow: #fcf8e3 5px 5px 20px }
  .sidebar { background:#fcf8e3; padding:10px; margin-bottom:15px; box-shadow: #fcf8e3 5px 5px 20px }
  .sidebar h4 { color:#ff5856; }
  .sidebar ul { padding:0; }
  .sidebar ul li { list-style: none; height: 20px; line-height:20px; }
  .sidebar ul li a { text-decoration:none; color:#000; }
  .sidebar ul li a:hover { color:#ff5856; }
  .detail-img { margin:0 auto 10px; }
  /* 屏幕（大于等于 768px） */
  @media (max-width: 768px) { .detail-img img { width: 100%; } }
</style>
