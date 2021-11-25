var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')


const {Hotel} = require("../models/hotels");
const {User} = require("../models/users");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/', async function (req, res, next) {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 15)

    //Register hotel
    const hotel = new Hotel({
      hotel: req.body.hotelname,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
    });



    hotel.save(function(err, hotel) {


      // Register user
      const user = new User({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email,
        tlf: req.body.tlf,
        company: hotel._id,
        role : 'admin',
      });

      console.log(user);

      user.save()

    });








    res.redirect('/login');
  } catch {
    res.redirect('/register');
  };


});


module.exports = router;
