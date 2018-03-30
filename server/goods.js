var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// 连接MongoDB数据库
// mongoose.connect('mongodb://admin:admin@127.0.0.1:27017/iFood');
// mongoose.connect('mongodb://127.0.0.1:27017/iFood');
mongoose.connect('mongodb://119.28.7.185:27017/iFood');

mongoose.connection.on("connected", function () {
  console.log("MongoDB connected success.");
});
mongoose.connection.on("error", function () {
  console.log("MongoDB connected fail.");
});
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB disconnected.");
});

// 创建productSchema模型
var productSchema = new mongoose.Schema({
  "productId": String,
  "productName": String,
  "productDes": String,
  "salePrice": String,
  "productImage": String,
  "productNum": Number,
  "checked": String
});
var Goods = mongoose.model('Goods',productSchema);

// 获取userSchema模型
var User = require('./usermodels');

// 查询商品列表数据
router.get("/list", function (req,res,next) {
  // res.send("Hello, goods list.");
  // Goods.find({}, function (err, doc) {
  let params = {};

  let goodsModel;
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let level = req.param("priceLevel");
  let sort = req.param("sort");
  let skip = (page - 1) * pageSize;

  if(req.param("page")==undefined&&req.param("pageSize")==undefined&&req.param("sort")==undefined&&req.param("level")==undefined&&req.param("id")!=undefined){
    // 查询单个商品详情
    goodsModel = Goods.find({"productId":req.param("id")});
  }
  else{
    // 按条件查询商品详情
    if (level != 'all') {
      switch (level) {
        case '0': params = {"$and": [{"$where": "this.salePrice>0"}, {"$where": "this.salePrice<=20"}]};break;
        case '1': params = {"$and": [{"$where": "this.salePrice>20"}, {"$where": "this.salePrice<=50"}]};break;
        case '2': params = {"$and": [{"$where": "this.salePrice>50"}, {"$where": "this.salePrice<=100"}]};break;
        case '3': params = {"$and": [{"$where": "this.salePrice>100"}, {"$where": "this.salePrice<=9999"}]};break;
      }
    }
    if(pageSize!='all'){
      goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    }
    else {
      goodsModel = Goods.find(params).skip(skip);
    }
    goodsModel.sort({'salePrice':sort});
  }

  // console.log(params);
  goodsModel.exec(function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
      console.log(err);
    }else{
      res.json({
        status:'0',
        msg:'req success',
        result:{
          count:doc.length,
          list:doc
        }
      });
    }
  });
});

// 加入购物车
router.post('/addCart', function (req, res, next) {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.findOne({userId:userId}, function (err, userDoc) {
    if(err){
      res.json({
          status:'1',
          msg: err.message
      });
    }
    else{
      let goodsItem = '';
      userDoc.cartList.forEach(function (item) {
        if(item.productId == productId){
          goodsItem = item;
          item.productNum++;
        }
      });
      if(goodsItem){
        userDoc.save(function (err2, doc2) {
          if(err2){
            res.json({
              status:'1',
              msg: err2.message
            });
          }
          else{
            res.json({
              status:'0',
              msg: 'success addcart',
              result: ''
            });
          }
        });
      }
      else{
        if(userDoc){
          Goods.findOne({productId:productId}, function (err1, doc1) {
            console.log("doc1: "+doc1);
            if(err1){
              res.json({
                status:'1',
                msg: err1.message
              });
            }
            else{
              if(doc1){
                console.log("doc1: "+doc1);
                doc1.productNum = 1;
                doc1.checked = 1;
                console.log("doc1: "+doc1);
                userDoc.cartList.push(doc1);
                userDoc.save(function (err2, doc2) {
                  if(err2){
                    res.json({
                      status:'1',
                      msg: err2.message
                    });
                  }
                  else{
                    res.json({
                      status:'0',
                      msg: 'success addcart',
                      result: ''
                    });
                  }
                });
              }
            }
          })
        }
      }
    }
  });
});

module.exports = router;

