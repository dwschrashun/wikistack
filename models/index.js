var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: ["open", "closed"]},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

pageSchema.pre("validate", function (next){
	this.urlTitle = createUrlTitle(this.title);
	next();
});

pageSchema.virtual("route").get(function() {
	return "/wiki/" + this.urlTitle;
});


function createUrlTitle (title) {
	var re1 = /\s/g;
	var re2 = /[^A-Za-z0-9_]/g;
	title = title.trim();
	var urlTitle = title.replace(re1, "_");
	//console.log(urlTitle);
	urlTitle = urlTitle.replace(re2, "");	
	//console.log(urlTitle);
	return urlTitle;
}


var userSchema = new mongoose.Schema({
  name: {first: {type: String, required: true}, last: {type: String, required: true}},
  email: {type: String, required: true, unique: true}
});

userSchema.statics.findOrCreate = function (userObject) {
	var self = this;
	this.find({email: userObject.email}).
		then(function (result) {
			console.log("user search result: ", result);
			if (result.length < 1) {
				return this.create({name: {first: userObject.name.first, last: userObject.name.last},  email: userObject.email});
				// console.log("in if ", result);
				// var newUser = new User({name: {first: userObject.name.first, last: userObject.name.last},  email: userObject.email});
				// return newUser.save();
				// .then(function (results){
				// 	console.log("new user save results: ", results);
				// 	return results;
				// }, function(err) {
				// 	console.error(err);
				// 	return err;
				// });
			}
			else {
				return result;
			}
		});
};

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

// userSchema.post("save", function (doc){
// 	return doc;
// });

module.exports = {
  Page: Page,
  User: User
};