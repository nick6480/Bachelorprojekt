var express = require('express');
const mongoose = require('mongoose');
var router = express.Router();

const multer = require('multer');
const path = require('path');

const fs = require('fs');
const formidable = require('formidable');


const {Hotel} = require("../models/hotels");

const {authUser, authUserBool} = require("../private/auth");

router.get('/', authUser, function(req, res, next) {

  console.log(req.user);
  Hotel.findOne({_id: req.user.company}, function (err, hotel) {
    if(err) console.log(err);
    if(hotel) {
      res.locals.isAuthenticated = authUserBool(req, res);
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
  let catArr = [];

  console.log(req.body.data);


  Hotel.findOne({ _id:req.user.company}, function(err,hotel) {
    //Finds the matching id and push it to an array
    for (var i = 0; i < req.body.data.length; i++) {
      for (var o = 0; o < hotel.butlerbird.content.categorys.length; o++) {
        if (req.body.data[i].id === hotel.butlerbird.content.categorys[o].category.catid) {
          console.log('match: ' + req.body.data[i].id + " : " + hotel.butlerbird.content.categorys[o].category.catid);
          catArr.push(hotel.butlerbird.content.categorys[o])
        }

      /*  for (var a = 0; a < req.body.data[i].boxes.length; a++) {
          for (var u = 0; u < hotel.butlerbird.content.categorys[o].category.content.length; u++) {
            if (req.body.data[i].data[a] === hotel.butlerbird.content.categorys[o].category.content[u]) {
              //boxArr.push(hotel.butlerbird.content.categorys[o].content[u])
              catArr[o].category.content.push(hotel.butlerbird.content.categorys[o].content[u])

            }
          //let q = `butlerbird.content.categorys${[o]}.category.content`
          //Hotel.findOneAndUpdate({ _id:req.user.company}, {`butlerbird.content.categorys${[o]}.category.content`: boxArr},{new: true, upsert: true }).exec();
          }
        }*/
      }
    }

    Hotel.findOneAndUpdate({ _id:req.user.company}, {"butlerbird.content.categorys": catArr},{new: true, upsert: true }).exec();
    console.log(catArr);
  });

})


// Update Content


router.post('/update/content', async function(req, res, next) {

    let form = new formidable.IncomingForm();


   form.parse(req, async function(err, fields, files) {
      if (err) { console.error(err); }


     Hotel.findOne({ _id:req.user.company}, async function(err,hotel) {

        for (var i = 0; i < hotel.butlerbird.content.categorys.length; i++) {


          if (hotel.butlerbird.content.categorys[i].category.catid == fields.catId) {
            console.log(hotel.butlerbird.content.categorys[i]);
            for (var o = 0; o < hotel.butlerbird.content.categorys[i].category.content.length; o++) {
              console.log(hotel.butlerbird.content.categorys[i].category.catid == fields.catId);
              if (hotel.butlerbird.content.categorys[i].category.content[o]._id == fields.boxId) {


                // Preview
                hotel.butlerbird.content.categorys[i].category.content[o].preview.text = fields.previewtext
                hotel.butlerbird.content.categorys[i].category.content[o].preview.action = fields.action

                hotel.butlerbird.content.categorys[i].category.content[o].preview.img.data = await fs.readFileSync(files.previewimg.filepath);
                hotel.butlerbird.content.categorys[i].category.content[o].preview.img.contentType = files.previewimg.mimetype;

                // Page
                hotel.butlerbird.content.categorys[i].category.content[o].page.text = fields.pagetext

                hotel.butlerbird.content.categorys[i].category.content[o].page.img.data = await fs.readFileSync(files.previewimg.filepath);
                hotel.butlerbird.content.categorys[i].category.content[o].page.img.contentType = files.previewimg.mimetype;


                await hotel.save();
              }
            }
          }
        }

      })
    })

    res.status(200)
});



router.post('/', function(req, res, next) {
  //console.log(req.body);



  res.status(200)
});








router.get('/get', function(req, res, next) {
  console.log(req.hostname);



  Hotel.findOne({'butlerbird.url' : req.hostname}, function (err, hotel) {
    if(err) console.log(err);
    if(hotel) {
      console.log(hotel);

      res.json(hotel);
    }
  })


  res.status(200)
});









/*

router.get('/find/:hotelId', function(req, res, next) {

  console.log(req.hostname );
  console.log(req.params.hotelId);

  Hotel.findOne({_id: req.params.hotelId}, function (err, hotel) {
    if(err) console.log(err);
    if(hotel) {

      res.json(hotel);
    }
  })


  res.status(200)
});




*/
















module.exports = router;
