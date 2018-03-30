<template>
  <div class="footer">
    <div class="container">
      <p>2018 &copy; Openred&SnowFlaker</p>
      <div class="row">
        <div class="col-xs-6 col-md-3">
          <ul>
            <li class="ul-header">美食攻略</li>
            <li>千道家常菜</li>
            <li>儿童菜</li>
            <li>自制菜谱</li>
            <li>所有菜谱</li>
          </ul>
        </div>
        <div class="col-xs-6 col-md-3">
          <ul>
            <li class="ul-header">美食助手</li>
            <li>美食速递</li>
            <li>预先排号</li>
            <li>饭店订座</li>
            <li>饭友拼桌</li>
          </ul>
        </div>
        <!-- Optional: clear the XS cols if their content doesn't match in height -->
        <div class="clearfix visible-xs-block"></div>
        <div class="col-xs-6 col-md-3">
          <ul>
            <li class="ul-header">关于我们</li>
            <li>最新活动</li>
            <li>儿童菜</li>
            <li>加入我们</li>
            <li>意见反馈</li>
          </ul>
        </div>
        <div class="col-xs-6 col-md-3">
          <ul>
            <li class="ul-header">App二维码</li>
            <img src="@/assets/images/app.png" width="90" height="90">
          </ul>
        </div>
      </div>
    </div>
  </div><!--/.footer-->
</template>

<script>
  export default {
      name: "vue-footer"
  }
</script>

<style scoped>
  .footer { margin-top: 15px; background:#ff5856; }
  .footer p { margin:10px auto; text-align: center; font-size: 18px; }
  .footer ul li { height:25px; line-height:25px; list-style:none; color:#FFF; }
  .ul-header { font-size: 20px; margin-bottom:5px; font-weight:normal; }
</style>
