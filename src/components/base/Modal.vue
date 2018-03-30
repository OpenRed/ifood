<template>
  <div class="dialog-wrap" v-if="isShowModal">
    <div class="dialog-cover" @click="closeModal"></div>
    <transition name="drop">
      <div class="dialog-content">
        <p class="dialog-close" @click="closeModal">x</p>
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
    export default {
      props:[
        "isShowModal",
        'isShowModalAddcart'
      ],
      data(){
        return{
          msg: 'Hello modal'
        }
      },
      methods:{
        closeModal(){
          this.$emit("close");
        }
      }
    }
</script>

<style scoped>
  /*dialog*/
  .dialog-wrap { position: fixed; width:100%; height:100%; z-index: 999; }
  .dialog-cover { background:#000; opacity:0.3; position:fixed; z-index:5; top:0; left:0; width:100%; height:100%; }
  .dialog-content {
    width: 50%; max-height: 60%; line-height: 1.6;
    position: fixed; top: 20%; left: 50%; margin-left: -25%; padding: 2%;
    z-index: 10; overflow: auto; border: 2px solid #464068; background: #fff;
  }
  /* 超大屏幕（大桌面显示器，大于等于 768px） */
  @media (max-width: 1000px) { .dialog-content { width: 70%; left: 40%; padding:50px 15px 20px; } }
  .dialog-close { position: absolute; right: 5px; top: 5px; width: 20px; height: 20px; text-align: center; cursor: pointer; }
  .dialog-close:hover { color: #4fc08d; }
</style>
