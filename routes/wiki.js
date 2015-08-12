var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send("got get for wiki route");
});

router.post('/', function(req, res, next) {
	res.send(req.body);
});

router.get('/add', function(req, res, next) {
	res.render("addpage");
});

module.exports = router;
