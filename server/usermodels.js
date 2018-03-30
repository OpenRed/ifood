var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId" : String,
  "userName" : String,
  "userPwd" : String,
  "orderList" : Array,
  "cartList" : [
    {
      "productId": String,
      "productName": String,
      "salePrice": String,
      "productImage": String,
      "productNum": Number,
      "checked": Number
    }
  ],
  "addressList" : [
    {
      "addressId" : String,
      "userName" : String,
      "addressName" : String,
      "postCode" : String,
      "tel" : String,
      "isDefault" : Boolean
    }
  ]
});

module.exports = mongoose.model('Users', userSchema);
