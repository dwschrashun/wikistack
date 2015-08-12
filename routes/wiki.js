var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect("/");
});

router.post('/', function(req, res, next) {
	var page = new Page({
    	title: req.body.title,
    	content: req.body.content,
  	});

  	var userProps = { name: {first: req.body.name.split(" ")[0], last: req.body.name.split(" ")[1] || "no last"},
  		email: req.body.email
  	};

  	User.findOrCreate(userProps).then(function (user) {
  		console.log("USER \n", user);
  		page.author = user._id;
  		console.log("PAGE \n", page);
  		return page;
  	}).
  	then(function (page) {
  		console.log("PAGE2 \n", page);
		return page.save();}).
	then(function (result) {
		console.log("redirecting", result);
		res.redirect("/wiki/" + result.urlTitle);}).
	then(null, function(err) {
		return err;});
});

router.get('/add', function(req, res, next) {
	res.render("addpage");
});

router.get('/:urlTitle', function(req, res, next) {
	//console.log("here");
	Page.findOne({"urlTitle": req.params.urlTitle}, function (err, result) {
		if (err) {return next(err);}
		var renderObj = {
	    	title: result.title,
	  		urlTitle: result.urlTitle,
	 		content: result.content,
	  		status: result.status || null,
	  		date: result.date || null,
	  		author: result.author || null,
		};
		res.render("wikipage", renderObj);
	});
});

router.use(function(err, req, res, next) {
	res.render("error", err);
});

module.exports = router;
