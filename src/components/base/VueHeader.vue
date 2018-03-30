<template>
  <nav class="navbar navbar-default nav navbar-fixed-top">
    <div class="container padding-0">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand logo" href="/"><img src="@/assets/images/logo.png"></a>
      </div>

      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav">
          <li>
            <router-link :to="{ name: 'index'}">首页</router-link>
          </li>
          <li><a href="/">商场</a></li>
          <li><a href="/">菜谱</a></li>
          <li><a href="/">社区</a></li>
          <li><a href="/">下载App</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right nav-login">
          <li v-if="nickName"><a href="javascript:;">{{nickName}}</a></li>
          <li v-else @click="showModal"><a>登陆</a></li>
          <li v-if="nickName" @click="logout"><a>退出</a></li>
          <li v-if="!nickName" @click="showModalReg"><a>注册</a></li>
          <li>
            <a @click="gotoCart" href="javascript:;">
              <img src="./../../assets/images/cart.png">
              <span class="badge" v-if="cartCount>0">{{cartCount}}</span>
            </a>
          </li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->

    <!--login-->
    <modal :isShowModal="isShowModal" @close="closeModalLog">
      <div slot="content" class="log-form">
        <a class="pull-right color-black" href="javascript:;" @click="isShowModal=false;isShowModalReg=true">没有账号？去注册</a>
        <div class="clearfix"></div>
        <div class="form-group">
          <label for="exampleInputEmail1">用户名</label>
          <input type="text" v-model="usernameModel"  class="form-control" id="exampleInputEmail1" placeholder="aaa">
          <span class="form-error">{{userErrors.errorText}}</span>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">密码</label>
          <input type="password" v-model="userpwdModel"  class="form-control" id="exampleInputPassword1" placeholder="aaa" @keyup.enter="login">
          <span class="form-error">{{passwordErrors.errorText}}</span>
        </div>
        <div class="form-group form-error">
          {{errors}}
        </div>
        <button @click="login" class="btn btn-default pull-left" style="width:100px;">登录</button>
        <button @click="isShowModal=false" class="btn btn-default pull-right" style="width:100px;">退出</button>
      </div>
    </modal>

    <!--register-->
    <modal :isShowModal="isShowModalReg" @close="closeModalReg">
      <div slot="content" class="log-form">
        <a class="pull-right color-black" href="javascript:;" @click="isShowModal=true;isShowModalReg=false">已有账号？去登录</a></h3>
        <div class="clearfix"></div>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="usernameModel"  class="form-control" placeholder="aaa">
          <span class="form-error">{{userErrors.errorText}}</span>
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="userpwdModel"  class="form-control" placeholder="aaa" @keyup.enter="login">
          <span class="form-error">{{passwordErrors.errorText}}</span>
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input type="password" v-model="userpwdModel2"  class="form-control" placeholder="aaa" @keyup.enter="login">
          <span class="form-error">{{passwordErrors2.errorText}}</span>
        </div>
        <div class="form-group form-error" v-if="errors!=''">
          {{errors}}
        </div>
        <button @click="register" class="btn btn-default pull-left" style="width:100px;">注册</button>
        <button @click="isShowModalReg=false" class="btn btn-default pull-right" style="width:100px;">退出</button>
      </div>
    </modal>
  </nav>

</template>

<script>
  import axios from 'axios'
  import Modal from './Modal'

  export default {
    name: "vue-header",
    components:{
      Modal
    },
    data(){
      return{
        // username: '',
        usernameModel: '',
        userpwdModel: '',
        userpwdModel2: '',
        errorTip:false,
        isShowModal: false,
        isShowModalReg: false,
        errorText: '',
        errors: '',
        hasLogin: false
      }
    },
    mounted(){
      this.checkLogin();
    },
    computed: {
      nickName(){
        return this.$store.state.nickName;
      },
      cartCount(){
        return this.$store.state.cartCount;
      },
      userErrors(){
        let errorText, status
        if(/@/g.test(this.usernameModel)){
          status = false
          errorText = '用户名不能含有@'
        }
        else{
          status = true
          errorText = ''
        }
        if(!this.userFlag){
          errorText = ''
          this.userFlag = true
        }
        return {status, errorText}
      },
      passwordErrors(){
        let errorText, status
        if(!/^\w{1,6}$/g.test(this.userpwdModel)){
          status = false
          errorText = '请输入1-6位密码'
        }
        else{
          status = true
          errorText = ''
        }
        if(!this.passwordFlag){
          errorText = ''
          this.passwordFlag = true
        }
        return {status, errorText}
      },
      passwordErrors2(){
        let errorText, status
        if(!/^\w{1,6}$/g.test(this.userpwdModel2)){
          status = false
          errorText = '请输入1-6位密码'
        }
        else{
          if(this.userpwdModel!=this.userpwdModel2){
            status = false
            errorText = '两次密码不一致，请重新输入'
          }
          else{
            status = true
            errorText = ''
          }
        }
        if(!this.passwordFlag2){
          errorText = ''
          this.passwordFlag2 = true
        }
        return {status, errorText}
      }
    },
    methods: {
      checkLogin(){
        axios.get('/users/checkLogin').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            // this.username = res.result;
            this.$store.commit("updateUserInfo", res.result);
            this.hasLogin = true;
            this.getCartCount();
          }
        });
      },
      gotoCart(){
        console.log(this.hasLogin);
        if(this.hasLogin){
          this.$router.push({path:'/cart'});
        }
        else{
          alert("当前状态未登录，请先登录在进行操作！");
        }
      },
      register(){
        if(this.userErrors.status && this.passwordErrors.status) {
          if(this.userpwdModel==this.userpwdModel2){
            axios.post('/users/register', {
              userName: this.usernameModel,
              userPwd: this.userpwdModel
            }).then((response) => {
              if(response.data.status=='0'){
                console.log('register suc');
                this.usernameModel = '';
                this.userpwdModel = '';
                this.userpwdModel2 = '';
                this.closeModalReg();
                this.showModal();
              }
            });
          }
          else{
            alert("请输入两次相同的密码！");
            this.errors = "两次输入的密码不一致！";
          }
        }
      },
      login(){
        if(this.userErrors.status && this.passwordErrors.status) {
          axios.post('/users/login', {
            userName: this.usernameModel,
            userPwd: this.userpwdModel
          }).then((response) => {
            let res = response.data;
            if(res.status == '0') {
              this.errorTip = false;
              this.closeModalLog();
              this.usernameModel = '';
              this.userpwdModel = '';
              this.userpwdModel2 = '';
              // this.username = res.result.userName;
              this.$store.commit("updateUserInfo", res.result.userName);
              this.getCartCount();
            }
            else {
              this.errorTip = true;
              this.errors = "请输入正确的用户名和密码";
              console.log(this.errors);
            }
          });
        }
      },
      logout(){
        axios.post('/users/logout').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            // this.username = '';
            this.$store.commit("updateUserInfo", '');
            this.hasLogin = false;
            if(this.$route.path=='/'){
              this.$router.go(0);
            }
            else{
              this.$router.push({path:'/'});
            }
          }
        });
      },
      getCartCount(){
        axios.get('/users/getCartList').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            this.$store.commit("initCartCount", res.result);
          }
        });
      },
      showModal() { this.isShowModal = true; },
      closeModalLog(){ this.isShowModal = false; },
      showModalReg() { this.isShowModalReg = true; },
      closeModalReg(){ this.isShowModalReg = false; }
    }
  }
</script>

<style scoped>
  a, a:hover { text-decoration:none; }
  .nav-login a { padding:15px 0 15px 15px !important; }
  .nav { background:#ff5856; }
  .nav a { color:#FFF; }
  .navbar { margin-bottom:10px !important; }
  .logo { margin:0 !important; padding:3px 5px; }
  .form-error { color:#ff5856; }
  .color-black { color:#000 !important; }
  .color-black:hover { color:#ff5856 !important; }
</style>
