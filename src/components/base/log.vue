<template>
  <div>
    <div class="dialog-wrap" v-if="isShow">
      <div class="dialog-cover" @click="closeMyself"></div>
      <transition name="drop">
        <div class="dialog-content">
          <p class="dialog-close" @click="closeMyself">x</p>
          <div class="log-form">
            <div class="form-group">
              <label for="exampleInputEmail1">用户名</label>
              <input type="text" v-model="usernameModel"  class="form-control" id="exampleInputEmail1" placeholder="Username">
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">密码</label>
              <input type="password" v-model="passwordModel"  class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
            <div class="form-group">
              {{errorText}}
              <p>usernameLogin:{{usernameLogin}}</p>
              <li @click="add">++</li>
            </div>
            <button @click="login" class="btn btn-default pull-left" style="width:100px;">登录</button>
            <button @click="closeMyself" class="btn btn-default pull-right" style="width:100px;">退出</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "log",
    data(){
      return{
        u: '',
        usernameModel: '',
        passwordModel: '',
        errorText: ''
      }
    },
    props:['is-show', 'usernameLogin'],
    // props:{
    //   'is-show': {
    //     type: Boolean,
    //     default: false
    //   },
    //   'usernameLogin':{
    //     type: String
    //   }
    // },
    methods:{
      login(){
        if(!this.usernameModel && !this.passwordModel) {
          this.errorTip = true;
          this.errorText = '233';
        }
        else{
          axios.post('/users/login', {
            userName: this.usernameModel,
            userPwd: this.passwordModel
          }).then((response) => {
            let res = response.data;
            console.log(res);
            if (res.status == '0') {
              this.errorTip = true;
            }
            else {
              this.errorTip = false;
              this.usernameLogin = res.result.userName;
            }
          });
        }
      },
      closeMyself(){
        this.$emit('on-close')
      },
      add(){
        this.usernameLogin++;
      }
    }
  }
</script>

<style scoped>
  .dialog-wrap { position: fixed; width:100%; height:100%; z-index: 999; }
  .dialog-cover { background:#000; opacity:0.3; position:fixed; z-index:5; top:0; left:0; width:100%; height:100%; }
  .dialog-content {
    width: 50%; max-height: 50%; line-height: 1.6;
    position: fixed; top: 20%; left: 50%; margin-left: -25%; padding: 2%;
    z-index: 10; overflow: auto; border: 2px solid #464068; background: #fff;
  }
  .dialog-close { position: absolute; right: 5px; top: 5px; width: 20px; height: 20px; text-align: center; cursor: pointer; }
  .dialog-close:hover { color: #4fc08d; }

  /* 超大屏幕（大桌面显示器，大于等于 768px） */
  @media (max-width: 1000px) { .dialog-content { width: 80%; left: 35%; } }
</style>
