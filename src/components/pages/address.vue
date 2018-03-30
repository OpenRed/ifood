<template>
  <div container>
    <h4>当前位置：Address</h4>
    <div class="progress">
      <div class="progress-bar" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%;">
        <span class="sr-only">25% Complete</span>
      </div>
    </div>

    <h4>配送地址：</h4>
    <div class="row">
      <div class="col-md-3" v-for="(item, index) in addressListFilter">
        <div class="thumbnail" :class="{'check':checkIndex==index}" @click="checkIndex=index;selectAddId=item.addressId">
          <div class="caption address">
            <h3>{{item.userName}}</h3>
            <h4>{{item.addressName}}</h4>
            <p>{{item.tel}}</p>
            <p class="clearfix">
              <span class="pull-left baseaddress" v-if="item.isDefault">默认地址</span>
              <span class="pull-left setbaseaddress" v-if="!item.isDefault" @click="setDefaultAdd(item.addressId)">设置默认地址</span>
              <span class="pull-right addressplus" @click="deleteAddConfirm(item.addressId)">
                <img src="./../../assets/images/delete.png" width="100%" height="100%" alt="">
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="thumbnail address">
          <div class="caption text-center" @click="addAddressConfirm">
            <img src="./../../assets/images/plus2.png" alt="">
            <h3 style="margin-top:17.6px;">添加新地址</h3>
            <div style="clear: both;"></div>
          </div>
        </div>
      </div>
      <div class="col-md-12 text-center moreaddress">
        <h4 @click="expand">
          <span :class="this.limit==3?'moreaddress-up':'moreaddress-down'">more</span>
        </h4>
      </div>
    </div>

    <h4>配送方式</h4>
    <div class="row">
      <div class="col-md-3">
        <div class="thumbnail check">
          <div class="caption address">
            <h3>标准配送</h3>
            <h4>免费</h4>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <span class="pull-left next">
          <router-link :to="{path:'cart'}">上一步</router-link>
        </span>
        <span class="pull-right next">
          <router-link :to="{path:'orderConfirm', query:{'addressId':this.selectAddId}}">确认订单</router-link>
        </span>
      </div>
    </div>

    <modal :isShowModal="isShowModal" @close="closeModal">
      <div slot="content">
        <p class="text-center">你确定要删除此地址吗？</p>
        <br>
        <a @click="deleteAdd" class="btn btn-default pull-left" href="javascript:;" style="width:100px;">
          删除
        </a>
        <a @click="isShowModal=false" class="btn btn-default pull-right" href="javascript:;" style="width:100px;">
          取消
        </a>
      </div>
    </modal>

    <modal :isShowModal="isShowModalAdd" @close="closeModalAdd">
      <div slot="content">
        <p class="text-center">添加新地址</p>
        <div class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label">姓名</label>
            <div class="col-sm-10">
              <input type="text" v-model="userNameModel" class="form-control" placeholder="Name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">电话</label>
            <div class="col-sm-10">
              <input type="text" v-model="telModel" class="form-control" placeholder="Tel">
              <span class="form-error">{{telErrors.errorText}}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">地址</label>
            <div class="col-sm-10">
              <input type="text" v-model="addressNameModel" class="form-control" placeholder="Address">
            </div>
          </div>
          <div class="form-group margin-bottom-0">
            <label class="col-sm-2 control-label">邮编</label>
            <div class="col-sm-10">
              <input type="text" v-model="postCodeModel" class="form-control" placeholder="PostCode">
              <span class="form-error">{{postCodeErrors.errorText}}</span>
            </div>
          </div>
          <div class="form-group margin-bottom-0">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label>
                  <input type="checkbox" v-model="isDefaultModel"> 设为默认地址
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <span class="form-error">{{addAddressErrors}}</span>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <button @click="addAddress" class="btn btn-default pull-left" href="javascript:;" style="width:100px;">
                添加
              </button>
              <button @click="isShowModalAdd=false" class="btn btn-default pull-right" href="javascript:;" style="width:100px;">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import Modal from './../base/Modal'

  export default {
    name: "addresspage",
    components: {Modal},
    data(){
      return{
        limit: 3,
        checkIndex: 0,
        addressList:[],
        selectAddId: '',
        addressId: '',
        isShowModal: false,
        isShowModalAdd: false,
        addressId: '',
        userNameModel: '',
        addressNameModel: '',
        telModel: '',
        postCodeModel: '',
        isDefaultModel: '',
        errorText: '',
        addAddressErrors: '',
        addAddressFlag: true
      }
    },
    mounted(){
      this.getAddList();
    },
    computed:{
      telErrors(){
        let errorText, status
        if(/[^\d]/g.test(this.telModel)){
          status = false;
          errorText = '请输入数字0-9';
          this.addAddressFlag = false;
        }
        else{
          status = true;
          errorText = '';
          this.addAddressFlag = true;
        }
        if(!this.userFlag){
          errorText = ''
          this.userFlag = true
        }
        return {status, errorText}
      },
      postCodeErrors(){
        let errorText, status
        if(/[^\d]/g.test(this.telModel)){
          status = false;
          errorText = '请输入数字0-9';
          this.addAddressFlag = false;
        }
        else{
          status = true;
          errorText = '';
          this.addAddressFlag = true;
        }
        if(!this.userFlag){
          errorText = ''
          this.userFlag = true
        }
        return {status, errorText}
      },
      addressListFilter(){
        return this.addressList.slice(0, this.limit);
      }
    },
    methods:{
      getAddList(){
        axios.get('/users/checkLogin').then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            axios.get('/users/getAddList',{}).then((response)=>{
              let res = response.data;
              if(res.status=='0'){
                this.addressList = res.result;
                console.log('suc');
                this.addressList.forEach((item)=>{
                  if(item.isDefault){
                    this.selectAddId = item.addressId;
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
      expand(){
        if(this.limit==3){
          this.limit = this.addressList.length;
        }
        else{
          this.limit=3
        }
      },
      setDefaultAdd(id){
        axios.post('/users/setDefaultAdd', {
          addressId: id
        }).then((response)=>{
          if(response.data.status=='0'){
            console.log("set suc");
            this.getAddList();
          }
        });
      },
      closeModal(){ this.isShowModal = false; },
      closeModalAdd(){ this.isShowModalAdd = false; },
      addAddressConfirm(){
        this.isShowModalAdd = true;
      },
      addAddress(){
        // this.isShowModalAdd = false;
        if(this.addAddressFlag){
          if(this.userNameModel=='' ||
            this.addressNameModel=='' ||
            this.telModel=='' ||
            this.postCodeModel==''){
            this.addAddressFlag = false;
            return this.addAddressErrors = "请输入完整的地址信息！";
          }
          axios.post('/users/addressAdd', {
            userName: this.userNameModel,
            postCode: this.postCodeModel,
            addressName: this.addressNameModel,
            tel: this.telModel,
            isDefault: this.isDefaultModel?'1':'0'
          }).then((res)=>{
            if(res.data.status=='0'){
              console.log('add address suc');
              this.getAddList();
              this.isShowModalAdd = false;
              this.addressId = '';
              this.userNameModel = '';
              this.addressNameModel = '';
              this.telModel = '';
              this.postCodeModel = '';
              this.isDefaultModel = false;
            }
          });
        }
      },
      deleteAddConfirm(id){
        this.isShowModal = true;
        this.addressId = id;
      },
      deleteAdd(){
        axios.post('/users/addressDel', {
          addressId: this.addressId
        }).then((res)=>{
          if(res.data.status=='0'){
            console.log("delete suc");
            this.isShowModal = false;
            this.getAddList();
          }
        });
      }
    }
  }
</script>

<style scoped>
  a:hover { text-decoration:none; }
  .margin-bottom-0 { margin-bottom:0 !important; }
  .check { border:#ff5856 1px solid; }
  .address { min-height: 200px; }
  .baseaddress { height:32px; line-height:32px; color:#ff5856; cursor:pointer; }
  .setbaseaddress { height:32px; line-height:32px; color:#000000; cursor:pointer; }
  .setbaseaddress:hover { color:#ff5856; }
  .addressplus img {width: 100%;height: 100%; cursor:pointer; }
  .moreaddress-up { width:100px; height: 16px; line-height: 16px; display:inline-block; background:url("./../../assets/images/down.png") no-repeat scroll 72px 0; }
  .moreaddress-down { width:100px; height: 16px; line-height: 16px; display:inline-block; background:url("./../../assets/images/up.png") no-repeat scroll 72px 0; }
  .moreaddress h4 { color:#ff5856;  }
  .next { width:100px; height: 30px; line-height: 30px; background:#ff5856; text-align:center; cursor:pointer; }
  .next a { color:#000; width:100%; display:block; }
  .next:hover a { color:#fff; }
  .form-error { color:#ff5856; }
</style>
