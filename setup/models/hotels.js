const mongoose = require('mongoose');
const HotelSchema  = new mongoose.Schema({
  hotel :{
      type  : String,
      required : true
  } ,
  address :{
      type : String,
      required : true,
  } ,
  city :{
    type : String,
    required : true
} ,
country :{
    type : String,
    required : true
} ,
paymentPlan :{
    type : String,
},
butlerbird : {
    content : {
      categorys : [{
        category: {
          catid: String,
          name : String,
          content : [{
            name : String,
            preview : {
              text : String,
              img: { data : Buffer, type : String},
              cta: {
                text : String,
                color : String,
                action : String
              }
            },
            full: {
              text : String,
              img: { data : Buffer, type : String}
            }
          }]
        }
      }]
    },
    style : {

    }
},

}, {timestamps: true});
const Hotel = mongoose.model('hotel',HotelSchema);

module.exports = {
  Hotel
}
