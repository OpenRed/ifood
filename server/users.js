var express = require('express');
var router = express.Router();
require('./extenddate')

// 获取userSchema模型
var User = require('./usermodels');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录
router.post('/login', function (req, res, next) {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  console.log(params);
  User.findOne(params, function (err, doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.msg,
        result: ''
      });
    }
    else{
      if(doc){
        console.log(doc);
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000*60*60*24
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000*60*60*24
        });
        // req.session.user = doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        });
      }
      else{
        res.json({
          status: '1',
          msg: '',
          result: "请输入正确的用户名和密码"
        });
      }
    }
  });
});

// 注册
router.post('/register', function (req, res, next) {
  var userName = req.body.userName,
    userPwd = req.body.userPwd;
  console.log(userName);
  console.log(userPwd);
  console.log(111);
  User.find({}, function (err1,doc1) {
    if(err1){
      res.json({
        status: '1',
        msg: err1.msg,
        result: ''
      });
    }
    else{
      console.log(doc1);
      console.log(doc1.length);
      var user = {};
      if(doc1.length>0){
        id = (parseInt(doc1[doc1.length-1].userId)+1).toString();
        user = {
          userId: id,
          userName: userName,
          userPwd: userPwd,
          orderList: [],
          cartList: [],
          addressList: []
        };
      }
      else{
        user = {
          userId: '100001',
          userName: userName,
          userPwd: userPwd,
          orderList: [],
          cartList: [],
          addressList: []
        }
      }
      var newUser = User(user);
      newUser.save(function (err,doc) {
        console.log(222);
        if(err){
          res.json({
            status: '1',
            msg: err.msg,
            result: ''
          });
        }
        else{
          console.log(333);
          res.json({
            status: '0',
            msg: '',
            result: 'insert suc'
          });
        }
      });
    }
  });
});

// 退出
router.post('/logout', function (req, res, next) {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.cookie("userName", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  });
});

// 检查是否登录
router.get('/checkLogin', function (req, res, next) {
  if(req.cookies.userId){
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName||''
    });
  }
  else{
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

// 获取商品数量
router.get('/getCartList', function (req, res, next) {
  if(req.cookies && req.cookies.userId){
    var userId = req.cookies.userId;
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      }
      else{
        var cartList = doc.cartList;
        var cartCount = 0;
        cartList.map(function(item){
          cartCount += parseInt(item.productNum);
        });
        res.json({
          status: '0',
          msg: '',
          result: cartCount
        });
      }
    });
  }
  else{
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    });
  }
});

// 获取购物车列表
router.get('/cartList', function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId} ,function (err, doc) {
    if(err){
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      });
    }
    else{
      if(doc){
        res.json({
          status: '1',
          msg: '',
          result: doc.cartList
        });
      }
    }
  });
});

// 删除购物车数据
router.post('/cartDel', function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId;
  User.update(
    {userId: userId},
    {$pull: { cartList:{productId: productId}}},
    function (err, doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      }
      else{
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        });
      }
    });
});

// 更新购物车数据
router.post('/cartEdit', function (req, res, next) {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update(
    {"userId": userId, "cartList.productId": productId},
    {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    },
    function (err, doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      }
      else{
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        });
      }
    });
});

// 选择所有商品
router.post('/checkAll', function (req, res, next) {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId: userId}, function (err, doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }
    else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked = checkAll;
        });
        doc.save(function (err2, doc2) {
          if(err2){
            res.json({
              status: '1',
              msg: err2.message,
              result: ''
            });
          }
          else{
            res.json({
              status: '0',
              msg: '',
              result: 'success'
            });
          }
        });
      }
    }
  });
});

// 获取地址信息
router.get('/getAddList', function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err, doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }
    else{
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      });
    }
  });
});

// 设置默认地址
router.post('/setDefaultAdd', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status: '1',
      msg: 'addressId is null',
      result: ''
    });
  }
  else{
    User.findOne({userId:userId}, function (err,doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      }
      else{
        var addressList = doc.addressList;
        addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault = true;
          }
          else{
            item.isDefault = false;
          }
        });
        doc.save(function (err1, doc1) {
          if(err1){
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            });
          }
          else{
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            });
          }
        });
      }
    });
  }
});

// 添加地址
router.post('/addressAdd', function (req, res, next) {
  var userId = req.cookies.userId,
    userName = req.body.userName,
    postCode = req.body.postCode,
    addressName = req.body.addressName,
    tel = req.body.tel,
    isDefault = req.body.isDefault;
  User.findOne({userId:userId}, function (err1, doc1) {
    if(err1){
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      });
    }
    else{
      var address = {};
      if(doc1.addressList.length==0){
        address = {
          "addressId" : "20001",
          "userName" : userName,
          "addressName" : addressName,
          "postCode" : postCode,
          "tel" : tel,
          "isDefault" : isDefault=='1'?true:false
        };
      }
      else{
        var id = (parseInt(doc1.addressList[doc1.addressList.length-1].addressId)+1).toString();
        address = {
          "addressId" : id,
          "userName" : userName,
          "addressName" : addressName,
          "postCode" : postCode,
          "tel" : tel,
          "isDefault" : isDefault
        };
      }
      if(isDefault=='1'){
        doc1.addressList.forEach((item)=>{
          item.isDefault = false;
        });
      }
      doc1.addressList.push(address);
      doc1.save(function (err2,doc2) {
        if(err2){
          res.json({
            status: '1',
            msg: err2.message,
            result: ''
          });
        }
        else{
          res.json({
            status: '0',
            msg: '',
            result: 'add address suc'
          });
        }
      });
    }
  });
});

// 删除地址
router.post('/addressDel', function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update(
    {userId: userId},
    {$pull: { addressList:{addressId: addressId}}},
    function (err, doc) {
      if(err){
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        });
      }
      else{
        res.json({
          status: '0',
          msg: '',
          result: 'success'
        });
      }
    });
});

// 生成支付订单
router.post('/payMent', function (req,res,next) {
  var userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId;
  User.findOne({userId:userId}, function (err1, doc1) {
    if(err1){
      res.json({
        status: '1',
        msg: err1.message,
        result: ''
      });
    }
    else{
      var address = '', goodsList = [];
      // 获取当前用户的地址信息
      doc1.addressList.forEach((item)=>{
        if(addressId==item.addressId){
          address = item;
        }
      });
      // 获取当前用户购物车的商品
      doc1.cartList.filter((item)=>{
        if(item.checked=='1'){
          goodsList.push(item);
        }
      });

      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform+r1+sysDate+r2;
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        orderDate: createDate,
      };
      doc1.orderList.push(order);
      doc1.save(function (err2,doc2) {
        if(err2){
          res.json({
            status: '1',
            msg: err2.message,
            result: ''
          });
        }
        else{
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  });
});

// 根据 orderId 查询订单金额
router.get('/orderDeatil', function (req,res,next) {
  var userId = req.cookies.userId, orderId = req.param("orderId");
  User.findOne({userId:userId}, function (err, doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    }
    else{
      var orderList = doc.orderList;
      if(orderList.length>0){
        var orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId==orderId){
            orderTotal = item.orderTotal
          }
        });

        if(orderTotal>0){
          res.json({
            status: '0',
            msg: '',
            result: {
              orderId: orderId,
              orderTotal: orderTotal
            }
          });
        }
        else{
          res.json({
            status: '200002',
            msg: '无此订单信息！',
            result: ''
          });
        }
      }
      else{
        res.json({
          status: '200001',
          msg: '当前用户未创建订单信息！',
          result: ''
        });
      }
    }
  });
});
module.exports = router;
