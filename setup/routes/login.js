var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const {Hotel} = require("../models/hotels");
const {User} = require("../models/users");






/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express'});
});


router.post('/', passport.authenticate('local', {successRedirect: '/',failureRedirect: '/login',failureFlash: true}));



module.exports = router;
