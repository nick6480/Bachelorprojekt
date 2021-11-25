var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const {Hotel} = require("../models/hotels");



router.get('/', function(req, res, next) {

  console.log(req.user);
  Hotel.findOne({_id: req.user.company}, function (err, hotel) {
    if(err) console.log(err);
    if(hotel) {
      res.render('content', { title: 'Content',  company : hotel});
    }
  })
});



router.get('/company', function(req, res, next) {

    Hotel.findOne({_id: req.user.company}, function (err, hotel) {
      if(err) console.log(err);
      if(hotel) {
        res.json({ company: hotel })
      }
    })
});



// Create new category
router.post('/createcat', function(req, res, next) {
  let id = new mongoose.Types.ObjectId()
  Hotel.findOneAndUpdate({ _id:req.user.company}, {$push: {"butlerbird.content.categorys": {"category": {catid: id, name: req.body.data}}}},{new: true, upsert: true }).exec();
})


// Create new box
router.post('/createbox', function(req, res, next) {

  console.log(req.body.data.value);

  let content = {
    name : req.body.data.value
  }


  Hotel.findOne({_id: req.user.company}, function (err, hotel) {
    if(err) console.log(err);
    if(hotel) {

      for (var i = 0; i < hotel.butlerbird.content.categorys.length; i++) {
        if (hotel.butlerbird.content.categorys[i].category.catid === req.body.data.id) {
          hotel.butlerbird.content.categorys[i].category.content.push(content)
          hotel.save()
        }
      }

    }
  })

})




//Update the category position
router.post('/updatecatpos', function(req, res, next) {
  let newArr = [];

  Hotel.findOne({ _id:req.user.company}, function(err,hotel) {
    //Finds the matching id and push it to an array
    for (var i = 0; i < req.body.data.length; i++) {
      for (var o = 0; o < hotel.butlerbird.content.categorys.length; o++) {
        if (req.body.data[i] === hotel.butlerbird.content.categorys[o].category.catid) {
          console.log('match: ' + req.body.data[i] + " : " + hotel.butlerbird.content.categorys[o].category.catid);
          newArr.push(hotel.butlerbird.content.categorys[o])
        }
      }
    }

    Hotel.findOneAndUpdate({ _id:req.user.company}, {"butlerbird.content.categorys": newArr},{new: true, upsert: true }).exec();
    console.log(newArr);
  });
})





router.post('/', function(req, res, next) {
  //console.log(req.body);



  res.status(200)
});

module.exports = router;
