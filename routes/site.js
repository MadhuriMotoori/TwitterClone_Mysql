var ejs = require("ejs");

function sitePage(req,res) {

	ejs.renderFile('./views/loginSignupPage.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

function signupPage(req,res) {
	console.log("entered");
	ejs.renderFile('./views/signupPage.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
}

function loginPage(req,res) {

	console.log("loginpage");
	ejs.renderFile('./views/loginPage.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}

exports.sitePage=sitePage;
exports.signupPage=signupPage;
exports.loginPage=loginPage;