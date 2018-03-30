<template>
  <div>
    <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
      <!-- Indicators -->
      <ol class="carousel-indicators">
        <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
        <li data-target="#carousel-example-generic" data-slide-to="1"></li>
        <li data-target="#carousel-example-generic" data-slide-to="2"></li>
      </ol>

      <!-- Wrapper for slides -->
      <div class="carousel-inner" role="listbox">
        <div class="item active">
          <img src="./../../assets/images/banner.jpg" alt="...">
          <div class="carousel-caption">
            ...
          </div>
        </div>
        <div class="item">
          <img src="./../../assets/images/banner.jpg" alt="...">
          <div class="carousel-caption">
            ...
          </div>
        </div>
        <div class="item">
          <img src="./../../assets/images/banner.jpg" alt="...">
          <div class="carousel-caption">
            ...
          </div>
        </div>
      </div>

      <!-- Controls -->
      <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>

    <div class="itemList">
      <h4 class="text-center content">
        <p class="content-title">今日推荐</p>
      </h4>
      <div class="media" v-for="item in productsRecommend">
        <div class="row">
          <div class="media-left media-top text-center col-md-4 col-xs-12">
            <a @click="getDetail(item.productId)">
              <img v-lazy="'/static/images/'+item.productImage" class="img-thumbnail" alt="...">
            </a>
            </div>
          <div class="col-md-8 col-xs-12">
            <p class="media-heading margin-10-0">
              <a @click="getDetail(item.productId)">
                {{item.productName}}
              </a>
              <span>￥{{item.salePrice}}</span>
            </p>
            <p>{{item.productDes}}</p>
          </div>
        </div>
      </div>
    </div><!--/.itemList-->

    <div class="itemList">
      <h4 class="text-center content">
        <p class="content-title">精选菜单</p>
      </h4>
      <h5 class="price-filter">
        价格筛选：
        <span><a href="javascript:void(0);" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></span>
        <span v-for="(price,index) in priceFilter">
            <a href="javascript:void(0);" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{price.start}} - {{price.end}}</a>
          </span>
        <span class="pull-right sort">
          Sort By:
          <a @click="sortGoods" v-if="sortFlag" class="priceup" href="javascript:;">Price</a>
          <a @click="sortGoods" v-if="!sortFlag" class="pricedown" href="javascript:;">Price</a>
        </span>
      </h5>
      <div class="row">
        <div class="col-xs-6 col-md-4" v-for="item in products">
          <div class="thumbnail">
            <a @click="getDetail(item.productId)">
              <img v-lazy="'/static/images/'+item.productImage" alt="...">
            </a>
            <div class="caption">
              <p>
                <a @click="getDetail(item.productId)">
                  {{item.productName}}
                </a>
                <span class="pull-right">￥{{item.salePrice}}</span>
              </p>
              <button class="add-cart" @click="addCart(item.productId)" style="font-size:16px;">加入购物车</button>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
        <img class="load-more" src="@/assets/loading-svg/loading-spinning-bubbles.svg" v-if="loading" alt="">
      </div>
    </div><!--/.itemList-->

    <div class="itemList">
      <h4 class="text-center content">
        <p class="content-title">活动专区</p>
      </h4>
      <div class="row activity">
        <div class="col-md-4 col-sm-6 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/dessertcontest.jpg" alt="..." class="img-rounded"></a>
            <div class="caption activity-up">
              <h5>甜品创意大赛</h5>
              <p class="touchme"><a href="">点击进入</a></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-6 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/noodles.jpg" alt="..." class="img-rounded"></a>
            <div class="caption activity activity-up">
              <h5>泡面吃法研究所</h5>
              <p class="touchme"><a href="">点击进入</a></p>
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-6 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/hotpot.jpg" alt="..." class="img-rounded"></a>
            <div class="caption activity activity-up">
              <h5>冬日火锅烹饪赛</h5>
              <p class="touchme"><a href="">点击进入</a></p>
            </div>
          </div>
        </div>
      </div>
    </div><!--/.itemList-->
    <div class="itemList">
      <h4 class="text-center content">
        <p class="content-title">美食达人</p>
      </h4>
      <div class="row">
        <div class="col-xs-6 col-md-3 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/foodenthusiasts-01.jpg" alt="..." class="img-rounded"></a>
          </div>
        </div>
        <div class="col-xs-6 col-md-3 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/foodenthusiasts-02.jpg" alt="..." class="img-rounded"></a>
          </div>
        </div>
        <div class="col-xs-6 col-md-3 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/foodenthusiasts-03.jpg" alt="..." class="img-rounded"></a>
          </div>
        </div>
        <div class="col-xs-6 col-md-3 margin-10-0">
          <div class="thumbnail">
            <a href=""><img src="@/assets/images/foodenthusiasts-04.jpg" alt="..." class="img-rounded"></a>
          </div>
        </div>
      </div>
    </div><!--/.itemList-->

    <!--未登录-->
    <modal :isShowModal="isShowModal" @close="closeModalAddcart">
      <div slot="content" class="log-form">
        <p class="text-center">
          当前状态未登录，请先登录再加入购物车！
        </p>
        <br>
        <button @click="isShowModal=false" class="btn btn-default" style="width:100%;">退出</button>
      </div>
    </modal>

    <!--已登录-->
    <modal :isShowModal="isShowModalCart" @close="closeModalAddcart">
      <div slot="content" class="log-form">
        <p class="text-center cur">
          加入购物车成功！
        </p>
        <br>
        <a @click="isShowModalCart=false" class="btn btn-default pull-left" href="javascript:;" style="width:100px;">
          继续购物
        </a>
        <router-link to="/cart" class="btn btn-default pull-right" href="javascript:;" style="width:100px;">
          查看购物车
        </router-link>
      </div>
    </modal>
  </div>
</template>

<script>
  import Modal from '../base/Modal'
  import axios from 'axios'

  export default {
    name: "index",
    components:{ Modal },
    mounted(){
      this.getGoodsList();
      this.getGoodsRecommend();
    },
    data(){
      return {
        msg: 'Hello, index page.',
        priceChecked: 'all',
        sortFlag: true,
        page: 1,
        pageSize: 4,
        busy: true,
        loading: false,
        priceChecked: 'all',
        isShowModal: false,
        isShowModalCart: false,
        priceFilter: [
          {start: '0.00',end: '20.00'},
          {start: '20.00',end: '50.00'},
          {start: '50.00',end: '100.00'},
          {start: '100.00',end: '9999.00'}
        ],
        products: [],
        productsRecommend: [],
        todayRecomend: [
          {
            "productName": "韩式辣炒年糕",
            "productImage": "recommend-01.jpg",
            "salePrice": "16.00"
          },
          {
            "productName": "海鲜沙橙",
            "productImage": "recommend-05.jpg",
            "salePrice": "25.00"
          },
          {
            "productName": "五味烤肉",
            "productImage": "recommend-06.jpg",
            "salePrice": "39.00"
          }
        ]
      }
    },
    methods:{
      getGoodsList(flag){
        var parma = {
          page: this.page,
          pageSize: this.pageSize,
          sort: this.sortFlag?1:-1,
          priceLevel: this.priceChecked
        };
        this.loading = true;
        axios.get('/goods/list', {
          params:parma
        }).then((res)=>{
          console.log(res.data.result.list);
          this.loading = false;
          if(flag){
            if(res.data.result.count==0){
              this.busy = true;
            }
            else {
              this.products = this.products.concat(res.data.result.list);
              this.busy = false;
            }
          }
          else {
            this.products = res.data.result.list;
            this.busy = false;
          }
        });
      },
      getGoodsRecommend(){
        var parma = {
          page: 1,
          pageSize: 'all',
          sort: this.sortFlag?1:-1,
          priceLevel: 'all'
        };
        axios.get('/goods/list', {
          params:parma
        }).then((res) => {
          let arr = res.data.result.list;
          let index = Math.floor((Math.random()*arr.length));
          this.productsRecommend = this.productsRecommend.concat(arr[index]);
        });
      },
      getDetail(productId){
        this.$router.push({path:'/detail?id='+productId});
      },
      sortGoods(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
      },
      setPriceFilter(index){
        this.priceChecked = index;
        this.page = 1;
        this.getGoodsList();
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true);
        }, 500);
      },
      addCart(id){
        axios.post('/goods/addCart', {
          productId: id
        }).then((response) => {
          let res = response.data;
          if(res.status=='0'){
            console.log("加入购物车成功！"+res.status);
            this.isShowModalCart = true;
            this.$store.commit("updateCartCount",1);
          }
          else{
            alert("msg:"+res.msg+res.status);
          }
        });
      },
      showModalAddcart() { this.isShowModal = true; },
      closeModalAddcart(){ this.isShowModalCart = false; }
    }
  }
</script>

<style scoped>
  .margin-10-0 { margin:10px 0; }
  .itemList a { color:#ff5856; text-decoration:none; }
  .itemList a:hover { color:#000; }
  .itemList h4 { color: red; font-size:25px; }
  .content{ width: 50%; margin: 30px auto; border-top: 1.5px solid #ff5856; position: relative; }
  .content-title{
    width: 50%; height: 50px; line-height: 50px; background: #FFFFFF;
    text-align: center; font-size: 20px; position: absolute; top: -25px; left: 25%;
  }
  .price-filter span { margin-right:10px; }
  .price-filter span a { color:#000; }
  .price-filter span a:hover { color:#ff5856; }
  .cur { color:#ff5856 !important; }
  .sort a { margin-left:5px; }
  .priceup { padding:0 11px 0 0; background:url("../../assets/images/priceup.png") no-repeat scroll 30px 0; }
  .pricedown { padding:0 11px 0 0; background:url("../../assets/images/pricedown.png") no-repeat scroll 30px 0; }
  .thumbnail { padding: 7px !important; }
  .caption { padding: 9px 0 !important; }
  .add-cart {
    margin:0 auto; display:block; width:100%; height:30px; line-height:30px;
    border:red 1px solid; text-align:center; border-radius:5px; background:#fff;
  }
  .add-cart:hover { background:#ff5856; transition:all 0.3s ease-out; }
  .touchme { margin:5px auto; display:block; width:120px; height:20px; line-height:20px; }
  .activity-up h5 { margin:30px auto; font-size:20px; text-align:center; }
  .activity-down h5 { font-size:20px; text-align:center; }
  .activity-up  p { margin:20px auto; }
  .activity-down  p { margin:30px auto; }
  .activity p a { color: #fff; text-align: center; display: inline-block; background:#ff5856; padding:8px 20px; border-radius:20px; }
  .load-more { height:80px; line-height:80px; color:#ff5856; text-align:center; }
</style>
