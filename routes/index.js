var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 


/* GET home page. */
router.get('/', function(req, res, next) {
	Page.find({}, 'title urlTitle', function (err, results){
		console.log(results);
		res.render("index", {pageArray: results});
	});
	// console.log(allPages);
	//var allPages = Page.find().exists("content").exec();
	//console.log(JSON.stringify(allPages));
  	//res.render('index', allPages);
});

module.exports = router;
